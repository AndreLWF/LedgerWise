import { Platform } from 'react-native';
import type { SpendingSummaryData } from '../types/spending';
import type { Transaction } from '../types/transaction';

const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8000'
    : (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000');

export async function fetchTransactions(accessToken: string): Promise<Transaction[]> {
  const res = await fetch(`${API_URL}/api/v1/teller/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<Transaction[]>;
}

export async function fetchSpendingSummary(): Promise<SpendingSummaryData> {
  const res = await fetch(`${API_URL}/api/v1/spending/summary`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<SpendingSummaryData>;
}
