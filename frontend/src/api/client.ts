import { Platform } from 'react-native';
import type { Account } from '../types/account';
import type { SpendingSummaryData } from '../types/spending';
import type { Transaction } from '../types/transaction';

const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8000'
    : (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000');

function authHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAccounts(token: string): Promise<Account[]> {
  const res = await fetch(`${API_URL}/api/v1/teller/accounts`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<Account[]>;
}

export async function fetchTransactions(token: string): Promise<Transaction[]> {
  const res = await fetch(`${API_URL}/api/v1/teller/transactions`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<Transaction[]>;
}

export async function fetchSpendingSummary(token: string): Promise<SpendingSummaryData> {
  const res = await fetch(`${API_URL}/api/v1/spending/summary`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<SpendingSummaryData>;
}

export async function enrollAccount(
  token: string,
  tellerAccessToken: string,
): Promise<Account[]> {
  const res = await fetch(`${API_URL}/api/v1/teller/enroll`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ access_token: tellerAccessToken }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json() as Promise<Account[]>;
}
