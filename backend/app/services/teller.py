import base64
from typing import Any

import httpx

from app.config import settings

TELLER_BASE_URL = "https://api.teller.io"


def _auth_header(access_token: str) -> str:
    """Teller uses HTTP Basic auth: access_token as username, empty password."""
    encoded = base64.b64encode(f"{access_token}:".encode()).decode()
    return f"Basic {encoded}"


def _client() -> httpx.Client:
    return httpx.Client(
        cert=(settings.teller_cert_path, settings.teller_key_path),
        timeout=30.0,
    )


def get_accounts(access_token: str) -> list[dict[str, Any]]:
    with _client() as client:
        response = client.get(
            f"{TELLER_BASE_URL}/accounts",
            headers={"Authorization": _auth_header(access_token)},
        )
        response.raise_for_status()
        return response.json()


def get_transactions(access_token: str, account_id: str) -> list[dict[str, Any]]:
    with _client() as client:
        response = client.get(
            f"{TELLER_BASE_URL}/accounts/{account_id}/transactions",
            headers={"Authorization": _auth_header(access_token)},
        )
        response.raise_for_status()
        return response.json()


def get_all_transactions(access_token: str) -> list[dict[str, Any]]:
    accounts = get_accounts(access_token)
    all_transactions: list[dict[str, Any]] = []
    for account in accounts:
        txns = get_transactions(access_token, account["id"])
        for txn in txns:
            txn["account_name"] = account.get("name", "Unknown")
        all_transactions.extend(txns)
    all_transactions.sort(key=lambda t: t.get("date", ""), reverse=True)
    return all_transactions
