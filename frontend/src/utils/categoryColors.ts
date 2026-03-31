// Category color palette — ordered for max adjacent contrast in charts.
// Purple (#1) is the top category. Gold is reserved for uncategorized.
// Slots 3–24 alternate warm/cool for visual separation.

const CATEGORY_COLORS = [
  '#9333EA', // 1.  Purple (brand primary)
  '#10B981', // 2.  Emerald
  '#F43F5E', // 3.  Rose
  '#0EA5E9', // 4.  Sky
  '#F97316', // 5.  Coral
  '#14B8A6', // 6.  Teal
  '#D946EF', // 7.  Fuchsia
  '#84CC16', // 8.  Lime
  '#3B82F6', // 9.  Blue
  '#DC2626', // 10. Crimson
  '#06B6D4', // 11. Cyan
  '#E67E22', // 12. Amber
  '#6366F1', // 13. Indigo
  '#22C55E', // 14. Green
  '#EC4899', // 15. Pink
  '#65A30D', // 16. Olive
  '#818CF8', // 17. Slate Blue
  '#EF4444', // 18. Red
  '#16A34A', // 19. Warm Green
  '#7C3AED', // 20. Violet
  '#B45309', // 21. Bronze
  '#64748B', // 22. Steel
  '#475569', // 23. Graphite
] as const;

const UNCATEGORIZED_COLOR = '#F59E0B'; // Brand gold — exclusive to uncategorized

/**
 * Returns a color for a spending category.
 * @param name     Category name ("General" gets brand gold)
 * @param rank     Position among non-General categories, sorted by spending (0 = highest)
 */
export function getCategoryColor(name: string, rank: number): string {
  if (name === 'General') return UNCATEGORIZED_COLOR;
  return CATEGORY_COLORS[rank % CATEGORY_COLORS.length];
}
