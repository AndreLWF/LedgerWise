import { useCallback, useMemo, useState } from 'react';
import { useTransactionData } from '../../contexts/TransactionDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { updateTransactionCategory } from '../../api/client';
import { isSpending } from '../spending/utils/spendingSummary';
import { getCategoryColor } from '../../utils/categoryColors';
import type { Transaction } from '../../types/transaction';
import type { CategoryInfo } from '../../types/categorize';

function normalizeCategory(category: string | null | undefined): string {
  if (!category || category.trim() === '') return 'General';
  return category
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export default function useCategorizeData() {
  const { allTransactions, transactionsLoading, refresh } = useTransactionData();
  const { session } = useAuth();
  const token = session?.access_token ?? null;

  // Track locally reassigned transaction IDs for optimistic UI
  const [reassigned, setReassigned] = useState<Map<string, string>>(new Map());

  const spendingTransactions = useMemo(
    () => allTransactions.filter(isSpending),
    [allTransactions],
  );

  const uncategorized = useMemo(
    () =>
      spendingTransactions.filter(
        (tx) => normalizeCategory(tx.category) === 'General' && !reassigned.has(tx.id),
      ),
    [spendingTransactions, reassigned],
  );

  const categories = useMemo(() => {
    const catMap = new Map<string, number>();

    for (const tx of spendingTransactions) {
      const name = reassigned.has(tx.id)
        ? reassigned.get(tx.id)!
        : normalizeCategory(tx.category);

      if (name === 'General') continue;
      catMap.set(name, (catMap.get(name) ?? 0) + 1);
    }

    const sorted = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

    return sorted.map(([name, count], rank): CategoryInfo => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      color: getCategoryColor(name, rank),
      transactionCount: count,
    }));
  }, [spendingTransactions, reassigned]);

  const totalSpending = spendingTransactions.length;
  const categorizedCount = totalSpending - uncategorized.length;

  const assignToCategory = useCallback(
    (transactionId: string, categoryName: string) => {
      // Optimistic update — move transaction out of uncategorized immediately
      setReassigned((prev) => {
        const next = new Map(prev);
        next.set(transactionId, categoryName);
        return next;
      });

      // Persist to backend
      if (token) {
        updateTransactionCategory(token, transactionId, categoryName)
          .then(() => {
            refresh();
          })
          .catch(() => {
            // Revert optimistic update on failure
            setReassigned((prev) => {
              const next = new Map(prev);
              next.delete(transactionId);
              return next;
            });
          });
      }
    },
    [token, refresh],
  );

  // Search/filter
  const [transactionSearch, setTransactionSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const filteredTransactions = useMemo(() => {
    if (!transactionSearch) return uncategorized;
    const search = transactionSearch.toLowerCase();
    return uncategorized.filter(
      (t: Transaction) =>
        t.description.toLowerCase().includes(search) ||
        t.amount.includes(search),
    );
  }, [uncategorized, transactionSearch]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;
    const search = categorySearch.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(search));
  }, [categories, categorySearch]);

  return {
    transactions: filteredTransactions,
    categories: filteredCategories,
    categorizedCount,
    totalTransactions: totalSpending,
    loading: transactionsLoading,
    transactionSearch,
    categorySearch,
    setTransactionSearch,
    setCategorySearch,
    assignToCategory,
  };
}
