export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  transactionCount: number;
  totalAmount: number;
  lastAssignedMerchant?: string;
  lastAssignedDate?: string;
}

/** Filter mode for the categorize transaction list. */
export type TransactionFilter = 'uncategorized' | 'all' | string;
