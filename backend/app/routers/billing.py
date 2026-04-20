import logging

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.middleware.auth import get_current_user_id, require_admin_user
from app.schemas.billing import (
    CheckoutRequest,
    CheckoutResponse,
    ReconcileResponse,
    WebhookResponse,
)
from app.services.billing import (
    ALLOWED_PRICE_IDS,
    check_and_record_webhook_event,
    create_checkout_session,
    handle_charge_refunded,
    handle_dispute_created,
    handle_invoice_payment_failed,
    handle_subscription_created,
    handle_subscription_deleted,
    handle_subscription_updated,
    maybe_cleanup_old_events,
    reconcile_subscriptions,
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
    except Exception:
        logger.error(
            "Unexpected error creating checkout session for user=%s",
            user_id,
            exc_info=True,
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to create checkout session. Please try again later.",
        )

    return CheckoutResponse(checkout_url=checkout_url)


# Event types we handle — ignore anything else
_HANDLED_EVENTS = {
    "customer.subscription.created",
    "customer.subscription.deleted",
    "customer.subscription.updated",
    "charge.dispute.created",
    "charge.refunded",
    "invoice.payment_failed",
}


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

    event_id = event["id"]
    event_type = event["type"]
    log_security_event("stripe_webhook", {"type": event_type, "id": event_id})

    if event_type not in _HANDLED_EVENTS:
        return WebhookResponse(status="ok")

    is_new = await check_and_record_webhook_event(db, event_id, event_type)
    if not is_new:
        logger.info("STRIPE_WEBHOOK skipping duplicate event_id=%s", event_id)
        return WebhookResponse(status="ok")

    # Dedup record + handler writes are committed atomically: if the handler
    # fails, rollback removes the dedup record so Stripe can retry.
    data_object = event["data"]["object"]

    try:
        if event_type == "customer.subscription.created":
            await handle_subscription_created(db, data_object)
        elif event_type == "customer.subscription.deleted":
            await handle_subscription_deleted(db, data_object)
        elif event_type == "customer.subscription.updated":
            await handle_subscription_updated(db, data_object)
        elif event_type == "charge.dispute.created":
            await handle_dispute_created(db, data_object)
        elif event_type == "charge.refunded":
            await handle_charge_refunded(db, data_object)
        elif event_type == "invoice.payment_failed":
            await handle_invoice_payment_failed(db, data_object)

        await maybe_cleanup_old_events(db)
        await db.commit()
    except Exception:
        await db.rollback()
        raise

    return WebhookResponse(status="ok")


@router.post("/reconcile", response_model=ReconcileResponse)
async def reconcile_endpoint(
    user_id: str = Depends(require_admin_user),
    db: AsyncSession = Depends(get_db),
) -> ReconcileResponse:
    """Admin endpoint: reconcile local is_pro flags against Stripe subscriptions."""
    log_security_event("stripe_reconciliation_triggered", {"triggered_by": user_id})

    try:
        result = await reconcile_subscriptions(db)
    except Exception:
        logger.error("Subscription reconciliation failed", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Reconciliation failed. Check server logs.",
        )

    return ReconcileResponse(**result)
