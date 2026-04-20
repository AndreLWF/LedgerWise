import logging
from collections.abc import Awaitable, Callable

from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.config import settings
from app.middleware.auth import get_current_user_id
from app.middleware.rate_limit import rate_limit_middleware
from app.routers import banking, billing, category, merchant_rule, plaid, spending
from app.utils.logging import audit_logging_middleware

logger = logging.getLogger("ledgerwise.audit")

app = FastAPI(title="LedgerWise API", version="0.1.0")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler — log full details, return generic message to client."""
    logger.error(
        "UNHANDLED_ERROR method=%s path=%s",
        request.method,
        request.url.path,
        exc_info=exc,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )

# --- Middleware (order matters: last added = first executed) ---

# 1. CORS — restrict to known frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# 2. Lightweight JWT pre-check — sets request.state.user_id for rate limiter
# (full JWT verification happens again in the route dependency)
from app.middleware.auth import pre_extract_user_id
app.middleware("http")(pre_extract_user_id)

# 3. Rate limiting (per-IP + per-user on sensitive endpoints)
app.middleware("http")(rate_limit_middleware)

# 4. Audit logging (method, path, status, duration, user)
app.middleware("http")(audit_logging_middleware)


# 5. Origin validation for CSRF protection on mutating requests
@app.middleware("http")
async def csrf_origin_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    if request.method in ("POST", "PATCH", "DELETE", "PUT"):
        origin = request.headers.get("origin")
        # Allow requests with no Origin (e.g. server-to-server, Stripe webhooks)
        if origin and origin not in settings.cors_origins:
            return JSONResponse(
                status_code=403,
                content={"detail": "Origin not allowed."},
            )
    return await call_next(request)


# 6. Security headers
@app.middleware("http")
async def security_headers_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "frame-src https://checkout.stripe.com https://js.stripe.com; "
        "script-src 'self' https://js.stripe.com; "
        "connect-src 'self' https://api.stripe.com"
    )
    return response

app.include_router(banking.router, prefix="/api/v1")
app.include_router(plaid.router, prefix="/api/v1")
app.include_router(spending.router, prefix="/api/v1")
app.include_router(category.router, prefix="/api/v1")
app.include_router(merchant_rule.router, prefix="/api/v1")
app.include_router(billing.router, prefix="/api/v1")


class HealthResponse(BaseModel):
    status: str


class MeResponse(BaseModel):
    user_id: str


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/api/v1/me", response_model=MeResponse)
async def me(user_id: str = Depends(get_current_user_id)) -> MeResponse:
    return MeResponse(user_id=user_id)
