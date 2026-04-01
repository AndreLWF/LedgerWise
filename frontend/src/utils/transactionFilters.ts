/**
 * Shared transaction classification helpers.
 * Used by spending, analytics, and categorize features.
 */

import type { Transaction } from '../types/transaction';

export function isPayment(description: string): boolean {
  const lower = (description ?? '').toLowerCase();
  return lower.includes('pymt') || lower.includes('payment');
}

export function isSpending(tx: Transaction): boolean {
  const amount = parseFloat(tx.amount);
  if (amount <= 0) return false;

  const category = (tx.category ?? '').toLowerCase();
  if (category === 'payment' || category === 'refund') return false;
  if (isPayment(tx.description)) return false;

  return true;
}

export function isRefund(tx: Transaction): boolean {
  const category = (tx.category ?? '').toLowerCase();
  if (category === 'refund') return true;

  const amount = parseFloat(tx.amount);
  return amount < 0 && !isPayment(tx.description);
}
