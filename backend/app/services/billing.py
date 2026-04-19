"""Billing service — Stripe checkout and subscription management."""

import logging
from typing import Any

import stripe
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.user import User
from app.utils.logging import log_security_event

logger = logging.getLogger("ledgerwise.audit")

_stripe_client: stripe.StripeClient | None = None


def _get_stripe_client() -> stripe.StripeClient:
    """Return a lazily-initialized Stripe client. Fails fast if unconfigured."""
    global _stripe_client
    if _stripe_client is None:
        if not settings.stripe_secret_key:
            raise RuntimeError("Stripe is not configured — STRIPE_SECRET_KEY is missing")
        _stripe_client = stripe.StripeClient(settings.stripe_secret_key)
    return _stripe_client


ALLOWED_PRICE_IDS = {
    pid
    for pid in (settings.stripe_price_id_monthly, settings.stripe_price_id_yearly)
    if pid
}


async def create_checkout_session(
    user_id: str, price_id: str, db: AsyncSession
) -> str:
    """Create a Stripe Checkout session and return the checkout URL."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise LookupError("User not found")

    checkout_params: dict[str, Any] = {
        "mode": "subscription",
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": f"{settings.cors_origins[0]}/dashboard/settings?billing=success",
        "cancel_url": f"{settings.cors_origins[0]}/dashboard/settings?billing=cancel",
        "subscription_data": {"metadata": {"user_id": user_id}},
        "metadata": {"user_id": user_id},
    }

    if user.stripe_customer_id:
        checkout_params["customer"] = user.stripe_customer_id
    else:
        checkout_params["customer_email"] = user.email

    client = _get_stripe_client()
    session = await client.checkout.sessions.create_async(
        params=checkout_params
    )
    if not session.url:
        raise RuntimeError("Stripe returned a checkout session without a URL")
    return session.url


def verify_webhook_signature(payload: bytes, sig_header: str) -> stripe.Event:
    """Verify Stripe webhook signature and return the parsed event."""
    return stripe.Webhook.construct_event(
        payload, sig_header, settings.stripe_webhook_secret
    )


async def handle_subscription_created(
    db: AsyncSession, subscription: dict[str, Any]
) -> None:
    """Set is_pro=True and persist stripe_customer_id."""
    user_id = subscription.get("metadata", {}).get("user_id")
    if not user_id:
        logger.warning("STRIPE_WEBHOOK subscription.created missing user_id in metadata")
        return

    customer_id = subscription.get("customer", "")
    log_security_event(
        "stripe_subscription_created",
        {"user_id": user_id, "subscription_id": subscription.get("id")},
    )

    try:
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                is_pro=True,
                stripe_customer_id=customer_id,
                updated_at=func.now(),
            )
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise


async def handle_subscription_deleted(
    db: AsyncSession, subscription: dict[str, Any]
) -> None:
    """Set is_pro=False when a subscription is canceled/expired."""
    user_id = subscription.get("metadata", {}).get("user_id")
    if not user_id:
        logger.warning("STRIPE_WEBHOOK subscription.deleted missing user_id in metadata")
        return

    log_security_event(
        "stripe_subscription_deleted",
        {"user_id": user_id, "subscription_id": subscription.get("id")},
    )

    try:
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(is_pro=False, updated_at=func.now())
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise
