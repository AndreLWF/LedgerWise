from pydantic import BaseModel


class TokenRequest(BaseModel):
    access_token: str


class TransactionResponse(BaseModel):
    id: str
    date: str
    description: str
    amount: str
    account_name: str
    category: str


class AccountResponse(BaseModel):
    id: str
    teller_account_id: str
    institution_name: str | None
    account_name: str | None
    account_type: str | None
    account_subtype: str | None
