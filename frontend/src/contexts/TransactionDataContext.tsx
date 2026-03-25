import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  clearApiCache,
  fetchAccounts,
  fetchTransactions,
  fetchSpendingSummary,
  UnauthorizedError,
} from '../api/client';
import { supabase } from '../api/supabase';
import type { Account } from '../types/account';
import type { SpendingSummaryData } from '../types/spending';
import type { Transaction } from '../types/transaction';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface DataSlice {
  transactions: Transaction[];
  summaryData: SpendingSummaryData | null;
}

interface TransactionDataContextValue {
  accounts: Account[];
  hasAccounts: boolean;
  accountsLoading: boolean;
  error: string | null;
  sliceCache: Record<string, DataSlice>;
  loadingSlices: Set<string>;
  requestSlice: (dateRange?: DateRange) => void;
  refresh: () => void;
}

const TransactionDataContext = createContext<TransactionDataContextValue | null>(null);

function dateRangeKey(dr?: DateRange): string {
  return `${dr?.startDate ?? ''}_${dr?.endDate ?? ''}`;
}

interface ProviderProps {
  token: string | null;
  children: ReactNode;
}

export function TransactionDataProvider({ token, children }: ProviderProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [hasAccounts, setHasAccounts] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [sliceCache, setSliceCache] = useState<Record<string, DataSlice>>({});
  const [loadingSlices, setLoadingSlices] = useState<Set<string>>(new Set());

  // Track in-flight requests to avoid duplicates
  const inFlightRef = useRef<Set<string>>(new Set());
  // Ref mirror of sliceCache so requestSlice doesn't depend on sliceCache state
  const sliceCacheRef = useRef(sliceCache);
  sliceCacheRef.current = sliceCache;

  const refresh = useCallback(() => {
    clearApiCache();
    setSliceCache({});
    setLoadingSlices(new Set());
    inFlightRef.current.clear();
    setRefreshKey((k) => k + 1);
  }, []);

  // Fetch accounts once
  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setAccountsLoading(true);
    setError(null);

    async function loadAccounts() {
      try {
        const accts = await fetchAccounts(token!);
        if (cancelled) return;
        setAccounts(accts);
        setHasAccounts(accts.length > 0);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          await supabase.auth.signOut();
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load accounts');
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    }

    void loadAccounts();
    return () => { cancelled = true; };
  }, [token, refreshKey]);

  // Request a data slice — safe to call from useEffect
  const requestSlice = useCallback(
    (dateRange?: DateRange) => {
      if (!token || !hasAccounts) return;
      const key = dateRangeKey(dateRange);

      // Already cached or in-flight
      if (sliceCacheRef.current[key] || inFlightRef.current.has(key)) return;

      inFlightRef.current.add(key);
      setLoadingSlices((prev) => new Set(prev).add(key));

      (async () => {
        try {
          const [txns, summary] = await Promise.allSettled([
            fetchTransactions(token, dateRange?.startDate, dateRange?.endDate),
            fetchSpendingSummary(token, dateRange?.startDate, dateRange?.endDate),
          ]);

          const slice: DataSlice = {
            transactions: txns.status === 'fulfilled' ? txns.value : [],
            summaryData: summary.status === 'fulfilled' ? summary.value : null,
          };

          if (txns.status === 'rejected') {
            setError(
              txns.reason instanceof Error
                ? txns.reason.message
                : 'Failed to load transactions',
            );
          }

          setSliceCache((prev) => ({ ...prev, [key]: slice }));
        } catch (err) {
          if (err instanceof UnauthorizedError) {
            await supabase.auth.signOut();
            return;
          }
          setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
          inFlightRef.current.delete(key);
          setLoadingSlices((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }
      })();
    },
    [token, hasAccounts],
  );

  const value = useMemo(
    () => ({
      accounts,
      hasAccounts,
      accountsLoading,
      error,
      sliceCache,
      loadingSlices,
      requestSlice,
      refresh,
    }),
    [accounts, hasAccounts, accountsLoading, error, sliceCache, loadingSlices, requestSlice, refresh],
  );

  return (
    <TransactionDataContext.Provider value={value}>
      {children}
    </TransactionDataContext.Provider>
  );
}

export function useTransactionData() {
  const ctx = useContext(TransactionDataContext);
  if (!ctx) {
    throw new Error('useTransactionData must be used within TransactionDataProvider');
  }
  return ctx;
}

/** Hook to get a data slice for a specific date range. Triggers fetch if not cached. */
export function useDataSlice(dateRange?: DateRange) {
  const { sliceCache, loadingSlices, requestSlice, hasAccounts } = useTransactionData();
  const key = dateRangeKey(dateRange);

  useEffect(() => {
    if (hasAccounts) {
      requestSlice(dateRange);
    }
  // key is derived from dateRange — no need to include dateRange as a dep
  }, [hasAccounts, key, requestSlice]);

  const cached = sliceCache[key];
  return {
    transactions: cached?.transactions ?? [],
    summaryData: cached?.summaryData ?? null,
    loading: loadingSlices.has(key),
  };
}
