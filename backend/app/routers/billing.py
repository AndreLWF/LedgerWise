import logging

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.middleware.auth import get_current_user_id
from app.schemas.billing import CheckoutRequest, CheckoutResponse, WebhookResponse
from app.services.billing import (
    ALLOWED_PRICE_IDS,
    create_checkout_session,
    handle_subscription_created,
    handle_subscription_deleted,
    verify_webhook_signature,
)
from app.utils.logging import log_data_access, log_security_event

logger = logging.getLogger("ledgerwise.audit")

router = APIRouter(prefix="/billing", tags=["billing"])


@router.post("/create-checkout-session", response_model=CheckoutResponse)
async def create_checkout_session_endpoint(
    body: CheckoutRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> CheckoutResponse:
    """Create a Stripe Checkout session for a subscription."""
    if body.price_id not in ALLOWED_PRICE_IDS:
        raise HTTPException(status_code=400, detail="Invalid price selected.")

    log_data_access(user_id, "billing_checkout_create")

    try:
        checkout_url = await create_checkout_session(user_id, body.price_id, db)
    except LookupError:
        raise HTTPException(status_code=404, detail="User not found.")
    except stripe.StripeError:
        logger.error(
            "Stripe checkout session creation failed for user=%s",
            user_id,
            exc_info=True,
        )
        raise HTTPException(
            status_code=502,
            detail="Failed to create checkout session. Please try again later.",
        )

    return CheckoutResponse(checkout_url=checkout_url)


@router.post("/webhook", response_model=WebhookResponse)
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> WebhookResponse:
    """Handle Stripe webhook events. No auth — verified via webhook signature."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = verify_webhook_signature(payload, sig_header)
    except ValueError:
        logger.warning("STRIPE_WEBHOOK invalid payload")
        raise HTTPException(status_code=400, detail="Invalid payload.")
    except stripe.SignatureVerificationError:
        logger.warning("STRIPE_WEBHOOK invalid signature")
        raise HTTPException(status_code=400, detail="Invalid signature.")

    event_type = event["type"]
    log_security_event("stripe_webhook", {"type": event_type, "id": event["id"]})

    if event_type == "customer.subscription.created":
        await handle_subscription_created(db, event["data"]["object"])
    elif event_type == "customer.subscription.deleted":
        await handle_subscription_deleted(db, event["data"]["object"])

    return WebhookResponse(status="ok")
