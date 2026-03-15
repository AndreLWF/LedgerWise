from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas import TokenRequest, TransactionResponse
from app.services import teller as teller_service

router = APIRouter(prefix="/teller", tags=["teller"])


@router.post("/transactions", response_model=list[TransactionResponse])
async def fetch_transactions(
    body: TokenRequest, db: AsyncSession = Depends(get_db)
) -> list[TransactionResponse]:
    # TODO: re-enable live Teller data when ready
    # try:
    #     return teller_service.get_all_transactions(body.access_token)
    # except Exception as exc:
    #     raise HTTPException(status_code=502, detail=str(exc)) from exc

    return await teller_service.get_transactions_from_db(db)
