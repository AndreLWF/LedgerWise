from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import teller as teller_service

router = APIRouter(prefix="/teller", tags=["teller"])


class TokenRequest(BaseModel):
    access_token: str


@router.post("/transactions")
def fetch_transactions(body: TokenRequest) -> list[dict]:
    try:
        return teller_service.get_all_transactions(body.access_token)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
