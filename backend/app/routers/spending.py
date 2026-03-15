"""Spending summary endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas import SpendingSummaryResponse
from app.services import spending as spending_service

router = APIRouter(prefix="/spending", tags=["spending"])


@router.get("/summary", response_model=SpendingSummaryResponse)
async def spending_summary(
    db: AsyncSession = Depends(get_db),
) -> SpendingSummaryResponse:
    return await spending_service.get_spending_summary(db)
