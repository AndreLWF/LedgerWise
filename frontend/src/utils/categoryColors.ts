// Category color palette — ordered by assignment priority.
// Gold is always uncategorized. Purple is always the top real category.
// A-tier (primary 12) first, then B-tier (extended 12) for overflow.

// A-TIER — primary 12
const A_TIER = [
  '#9333EA', // 1. Purple (brand primary)
  '#0D9488', // 2. Teal
  '#EF4444', // 3. Red
  '#2563EB', // 4. Blue
  '#A855F7', // 5. Violet (brand secondary purple)
  '#16A34A', // 6. Green
  '#EC4899', // 7. Pink
  '#0284C7', // 8. Sky
  '#EA580C', // 9. Orange
  '#7C3AED', // 10. Indigo
  '#059669', // 11. Emerald
  '#64748B', // 12. Slate
] as const;

// B-TIER — extended 12
const B_TIER = [
  '#DB2777', // 13. Fuchsia
  '#4F46E5', // 14. Iris
  '#0891B2', // 15. Cyan
  '#B45309', // 16. Amber
  '#6D28D9', // 17. Grape
  '#047857', // 18. Forest
  '#DC2626', // 19. Crimson
  '#1D4ED8', // 20. Navy
  '#C026D3', // 21. Magenta
  '#65A30D', // 22. Lime
  '#BE185D', // 23. Berry
  '#64748B', // 24. Slate
] as const;

const CATEGORY_COLORS = [...A_TIER, ...B_TIER];

const UNCATEGORIZED_COLOR = '#F59E0B'; // Brand gold — always uncategorized

/**
 * Returns a color for a spending category.
 * @param name     Category name ("General" always gets gold)
 * @param rank     Position among non-General categories, sorted by spending (0 = highest)
 */
export function getCategoryColor(name: string, rank: number): string {
  if (name === 'General') return UNCATEGORIZED_COLOR;
  return CATEGORY_COLORS[rank % CATEGORY_COLORS.length];
}
