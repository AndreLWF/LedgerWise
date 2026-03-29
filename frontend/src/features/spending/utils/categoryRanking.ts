import type { CategoryData } from '../../../types/spending';

/**
 * Build a rank map for non-General categories, sorted by spend (highest = 0).
 * Used by ProportionBar and CategoryAccordion for consistent color assignment.
 */
export function buildCategoryRankMap(
  sortedCategories: CategoryData[],
): Map<string, number> {
  const map = new Map<string, number>();
  let rank = 0;
  for (const cat of sortedCategories) {
    if (cat.name !== 'General') {
      map.set(cat.name, rank++);
    }
  }
  return map;
}
