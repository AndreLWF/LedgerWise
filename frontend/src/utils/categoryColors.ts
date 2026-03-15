const CATEGORY_COLORS = [
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#84cc16', // lime
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#8b5cf6', // violet
];

const UNCATEGORIZED_COLOR = '#f87171';

export function getCategoryColor(name: string, index: number): string {
  if (name === 'General') return UNCATEGORIZED_COLOR;
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
