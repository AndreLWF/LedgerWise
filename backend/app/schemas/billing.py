from pydantic import BaseModel, Field


class CheckoutRequest(BaseModel):
    price_id: str = Field(..., min_length=1, max_length=255)


class CheckoutResponse(BaseModel):
    checkout_url: str


class WebhookResponse(BaseModel):
    status: str


class ReconcileCorrection(BaseModel):
    user_id: str
    action: str
    reason: str


class ReconcileResponse(BaseModel):
    pro_users_checked: int
    corrections: list[ReconcileCorrection]
