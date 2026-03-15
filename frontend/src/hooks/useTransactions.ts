import { useCallback, useState } from 'react';
import { fetchTransactions as apiFetchTransactions, fetchSpendingSummary } from '../api/client';
import type { SpendingSummaryData } from '../types/spending';
import type { Transaction } from '../types/transaction';

interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  summaryData: SpendingSummaryData | null;
  summaryLoading: boolean;
  loadData: (accessToken: string) => Promise<void>;
}

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [summaryData, setSummaryData] = useState<SpendingSummaryData | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadData = useCallback(async (accessToken: string) => {
    setLoading(true);
    setSummaryLoading(true);
    setError(null);

    try {
      const [txns, summary] = await Promise.allSettled([
        apiFetchTransactions(accessToken),
        fetchSpendingSummary(),
      ]);

      if (txns.status === 'fulfilled') {
        setTransactions(txns.value);
        setConnected(true);
      } else {
        setError(txns.reason instanceof Error ? txns.reason.message : 'Failed to load transactions');
      }

      if (summary.status === 'fulfilled') {
        setSummaryData(summary.value);
      } else {
        console.warn('Failed to load spending summary:', summary.reason);
      }
    } finally {
      setLoading(false);
      setSummaryLoading(false);
    }
  }, []);

  return { transactions, loading, error, connected, summaryData, summaryLoading, loadData };
}
