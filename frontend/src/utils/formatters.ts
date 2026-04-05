const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a number as USD currency string (e.g. "$1,234.56", "-$45.00"). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Parse a "YYYY-MM-DD" string as local time and format it.
 * The `T00:00:00` suffix prevents timezone-shift issues with Date.parse.
 */
export function formatLocalDate(
  iso: string,
  options?: { includeYear?: boolean },
): string {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(options?.includeYear ? { year: 'numeric' } : {}),
  });
}
