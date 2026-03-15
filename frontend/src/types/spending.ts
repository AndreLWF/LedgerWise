export interface CategoryData {
  name: string;
  total: number;
  count: number;
  percentage: number;
}

export interface SpendingSummaryData {
  total_spent: number;
  transaction_count: number;
  category_count: number;
  categories: CategoryData[];
  uncategorized_count: number;
  uncategorized_percentage: number;
  refund_total: number;
  refund_count: number;
}
