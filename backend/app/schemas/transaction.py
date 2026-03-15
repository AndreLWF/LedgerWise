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
