"""Spending summary aggregation service."""

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Transaction
from app.schemas import CategoryResponse, SpendingSummaryResponse


def _title_case(s: str) -> str:
    """Title-case a category name."""
    return " ".join(w.capitalize() for w in s.split())


def _build_category_label():
    """SQL expression that normalizes null/empty categories to 'General'."""
    return case(
        (Transaction.category.is_(None), "General"),
        (Transaction.category == "", "General"),
        else_=Transaction.category,
    )


def _spending_filter():
    """SQL filter that excludes payments and refunds from spending totals."""
    excluded = ["payment", "refund"]
    return func.lower(func.coalesce(Transaction.category, "")).notin_(excluded)


async def _query_category_totals(db: AsyncSession, category_label, spending_filter):
    """Query spending totals grouped by category. Tries debits first, falls back to all."""
    stmt = (
        select(
            category_label.label("category"),
            func.sum(func.abs(Transaction.amount)).label("total"),
            func.count().label("count"),
        )
        .where(Transaction.amount < 0, spending_filter)
        .group_by(category_label)
        .order_by(func.sum(func.abs(Transaction.amount)).desc())
    )
    result = await db.execute(stmt)
    rows = result.all()

    # Fallback: if no negative amounts, use all transactions
    if not rows:
        stmt = (
            select(
                category_label.label("category"),
                func.sum(func.abs(Transaction.amount)).label("total"),
                func.count().label("count"),
            )
            .where(spending_filter)
            .group_by(category_label)
            .order_by(func.sum(func.abs(Transaction.amount)).desc())
        )
        result = await db.execute(stmt)
        rows = result.all()

    return rows


async def _query_refund_totals(db: AsyncSession) -> tuple[float, int]:
    """Query aggregate refund total and count."""
    refund_filter = func.lower(func.coalesce(Transaction.category, "")) == "refund"
    stmt = select(
        func.sum(func.abs(Transaction.amount)).label("total"),
        func.count().label("count"),
    ).where(refund_filter)
    result = await db.execute(stmt)
    row = result.one()
    return round(float(row.total or 0), 2), row.count or 0


def _build_categories(
    rows, total_spent: float
) -> tuple[list[CategoryResponse], int, float]:
    """Build category list and extract uncategorized stats."""
    categories: list[CategoryResponse] = []
    uncategorized_count = 0
    uncategorized_pct = 0.0

    for row in rows:
        pct = (float(row.total) / total_spent * 100) if total_spent else 0
        name = _title_case(row.category)
        categories.append(CategoryResponse(
            name=name,
            total=round(float(row.total), 2),
            count=row.count,
            percentage=round(pct, 1),
        ))
        if name == "General":
            uncategorized_count = row.count
            uncategorized_pct = (
                round(float(row.total) / total_spent * 100, 1) if total_spent else 0
            )

    return categories, uncategorized_count, uncategorized_pct


async def get_spending_summary(db: AsyncSession) -> SpendingSummaryResponse:
    """Aggregate spending data by category across all transactions."""
    category_label = _build_category_label()
    rows = await _query_category_totals(db, category_label, _spending_filter())

    total_spent = sum(float(r.total) for r in rows)
    transaction_count = sum(r.count for r in rows)

    categories, uncategorized_count, uncategorized_pct = _build_categories(
        rows, total_spent
    )
    refund_total, refund_count = await _query_refund_totals(db)

    return SpendingSummaryResponse(
        total_spent=round(total_spent, 2),
        transaction_count=transaction_count,
        category_count=len(categories),
        categories=categories,
        uncategorized_count=uncategorized_count,
        uncategorized_percentage=uncategorized_pct,
        refund_total=refund_total,
        refund_count=refund_count,
    )
