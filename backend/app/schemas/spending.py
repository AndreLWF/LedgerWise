from pydantic import BaseModel


class CategoryResponse(BaseModel):
    name: str
    total: float
    count: int
    percentage: float


class SpendingSummaryResponse(BaseModel):
    total_spent: float
    transaction_count: int
    category_count: int
    categories: list[CategoryResponse]
    uncategorized_count: int
    uncategorized_percentage: float
    refund_total: float
    refund_count: int
