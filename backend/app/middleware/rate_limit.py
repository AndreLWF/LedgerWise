"""Sliding-window rate limiter with optional Redis backend.

Applies per-IP limits globally and stricter per-user limits on sensitive
endpoints. Uses Redis (Upstash or any Redis) when REDIS_URL is configured,
falling back to in-memory storage for single-instance deployments.
"""

import logging
import time
from collections import defaultdict
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse

from app.config import settings

logger = logging.getLogger("ledgerwise.audit")

# window_seconds: length of sliding window, max_requests: allowed per window
GLOBAL_RATE_LIMIT = {"window_seconds": 60, "max_requests": 60}
SENSITIVE_RATE_LIMIT = {"window_seconds": 60, "max_requests": 5}
DATA_RATE_LIMIT = {"window_seconds": 60, "max_requests": 30}

SENSITIVE_PATHS = {
    "/api/v1/plaid/exchange-token",
    "/api/v1/plaid/sync",
    "/api/v1/plaid/backfill",
    "/api/v1/merchant-rules/",
    "/api/v1/billing/create-checkout-session",
    # /billing/webhook intentionally excluded — Stripe signature verification
    # is sufficient, and rate limiting can drop legitimate webhook retries.
}
DATA_PATHS = {
    "/api/v1/banking/accounts",
    "/api/v1/banking/transactions",
    "/api/v1/spending/summary",
    "/api/v1/plaid/items",
    "/api/v1/plaid/create-link-token",
    "/api/v1/categories",
    "/api/v1/categories/",
}
# Paths where rate limiting applies to any sub-path (e.g. /categories/{id})
DATA_PATH_PREFIXES = (
    "/api/v1/banking/transactions/",
    "/api/v1/categories/",
    "/api/v1/merchant-rules/preview/",
)


# ---------------------------------------------------------------------------
# Redis backend (used when REDIS_URL is configured)
# ---------------------------------------------------------------------------
_redis_client = None
_use_redis = False


def _init_redis() -> None:
    """Lazily initialize Redis connection if configured."""
    global _redis_client, _use_redis
    if _redis_client is not None or _use_redis:
        return
    if not settings.redis_url:
        return
    try:
        import redis

        _redis_client = redis.from_url(
            settings.redis_url, decode_responses=True, socket_connect_timeout=2
        )
        _redis_client.ping()
        _use_redis = True
        logger.info("Rate limiter using Redis backend")
    except Exception:
        logger.warning(
            "Redis unavailable — falling back to in-memory rate limiter",
            exc_info=True,
        )
        _redis_client = None
        _use_redis = False


def _redis_check(key: str, window: int, max_requests: int) -> bool:
    """Check rate limit via Redis sorted set. Returns True if over limit."""
    assert _redis_client is not None
    now = time.time()
    pipe = _redis_client.pipeline()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zcard(key)
    pipe.zadd(key, {str(now): now})
    pipe.expire(key, window)
    results = pipe.execute()
    current_count = results[1]
    return current_count >= max_requests


# ---------------------------------------------------------------------------
# In-memory backend (single-instance fallback)
# ---------------------------------------------------------------------------
# Max unique keys per store before forced eviction (prevents unbounded growth)
_MAX_KEYS = 10_000
# Cleanup stale entries every N requests
_CLEANUP_INTERVAL = 500
_request_counter = 0

# In-memory stores — keyed by (ip,) or (ip, path)
_global_hits: dict[str, list[float]] = defaultdict(list)
_sensitive_hits: dict[str, list[float]] = defaultdict(list)
_data_hits: dict[str, list[float]] = defaultdict(list)


def _prune(hits: list[float], window: float, now: float) -> list[float]:
    cutoff = now - window
    return [t for t in hits if t > cutoff]


def _cleanup_stale_entries(now: float) -> None:
    """Remove keys with no recent hits to prevent unbounded memory growth."""
    max_window = max(
        GLOBAL_RATE_LIMIT["window_seconds"],
        SENSITIVE_RATE_LIMIT["window_seconds"],
        DATA_RATE_LIMIT["window_seconds"],
    )
    for store in (_global_hits, _sensitive_hits, _data_hits):
        stale_keys = [k for k, v in store.items() if not v or v[-1] < now - max_window]
        for k in stale_keys:
            del store[k]
        # Hard cap: if store still exceeds max keys, evict oldest entries
        if len(store) > _MAX_KEYS:
            sorted_keys = sorted(store, key=lambda k: store[k][-1] if store[k] else 0)
            for k in sorted_keys[: len(store) - _MAX_KEYS]:
                del store[k]


def _memory_check(
    store: dict[str, list[float]], key: str, window: int, max_requests: int
) -> bool:
    """Check rate limit in-memory. Returns True if over limit."""
    now = time.time()
    store[key] = _prune(store[key], window, now)
    if len(store[key]) >= max_requests:
        return True
    store[key].append(now)
    return False


# ---------------------------------------------------------------------------
# Unified check — delegates to Redis or in-memory
# ---------------------------------------------------------------------------
def _is_rate_limited(
    store: dict[str, list[float]], key: str, window: int, max_requests: int
) -> bool:
    """Returns True if the request should be rejected."""
    if _use_redis and _redis_client is not None:
        try:
            return _redis_check(f"rl:{key}", window, max_requests)
        except Exception:
            logger.warning("Redis rate limit check failed, falling back to memory")
    return _memory_check(store, key, window, max_requests)


# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
async def rate_limit_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    global _request_counter

    # Lazy Redis init on first request
    _init_redis()

    client_ip = request.client.host if request.client else "unknown"

    # Periodic cleanup of in-memory stale entries
    if not _use_redis:
        _request_counter += 1
        if _request_counter >= _CLEANUP_INTERVAL:
            _request_counter = 0
            _cleanup_stale_entries(time.time())

    # --- global per-IP check ---
    gw = GLOBAL_RATE_LIMIT["window_seconds"]
    gmax = GLOBAL_RATE_LIMIT["max_requests"]
    if _is_rate_limited(_global_hits, client_ip, gw, gmax):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again later."},
        )

    # --- extract user_id for per-user limiting (from verified auth state) ---
    # Use request.state.user_id set by auth middleware after JWT verification.
    # Falls back to IP-only limiting if auth hasn't run yet.
    user_id: str | None = getattr(request.state, "user_id", None)

    # --- per-endpoint rate checks ---
    path = request.url.path
    is_data_path = path in DATA_PATHS or path.startswith(DATA_PATH_PREFIXES)
    if path in SENSITIVE_PATHS:
        sw = SENSITIVE_RATE_LIMIT["window_seconds"]
        smax = SENSITIVE_RATE_LIMIT["max_requests"]
        key = f"{client_ip}:{path}"
        if _is_rate_limited(_sensitive_hits, key, sw, smax):
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded for this action. Please wait."},
            )
        # Per-user limit on sensitive paths
        if user_id:
            user_key = f"user:{user_id}:{path}"
            if _is_rate_limited(_sensitive_hits, user_key, sw, smax):
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded for this action. Please wait."},
                )
    elif is_data_path:
        dw = DATA_RATE_LIMIT["window_seconds"]
        dmax = DATA_RATE_LIMIT["max_requests"]
        key = f"{client_ip}:{path}"
        if _is_rate_limited(_data_hits, key, dw, dmax):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please try again later."},
            )
        # Per-user limit on data paths
        if user_id:
            user_key = f"user:{user_id}:{path}"
            if _is_rate_limited(_data_hits, user_key, dw, dmax):
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please try again later."},
                )

    return await call_next(request)
