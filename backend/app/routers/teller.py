import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import teller as teller_service

router = APIRouter(prefix="/teller", tags=["teller"])

ROBINHOOD_DATA_PATH = Path(__file__).resolve().parents[2] / "robinhood_data.json"


class TokenRequest(BaseModel):
    access_token: str


def _load_robinhood_transactions() -> list[dict]:
    """Load mock Robinhood transactions from local JSON file."""
    if not ROBINHOOD_DATA_PATH.exists():
        return []
    with open(ROBINHOOD_DATA_PATH) as f:
        data = json.load(f)
    account_name = data.get("account", {}).get("name", "Robinhood")
    txns = data.get("transactions", [])
    for txn in txns:
        txn["account_name"] = account_name
    return txns


@router.post("/transactions")
def fetch_transactions(body: TokenRequest) -> list[dict]:
    # TODO: re-enable Teller data when ready
    # try:
    #     teller_txns = teller_service.get_all_transactions(body.access_token)
    # except Exception as exc:
    #     raise HTTPException(status_code=502, detail=str(exc)) from exc
    txns = _load_robinhood_transactions()
    txns.reverse()
    return txns
