import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createSpendingStyles } from '../styles/spending.styles';
import type { CategoryData } from '../../../types/spending';
import { getCategoryColor } from '../../../utils/categoryColors';
import { buildCategoryRankMap } from '../utils/categoryRanking';
import { isNarrow } from '../../../utils/responsive';

interface ProportionBarProps {
  categories: CategoryData[];
  accountCount?: number;
}

export default function ProportionBar({ categories, accountCount = 0 }: ProportionBarProps) {
  const styles = useThemeStyles(createSpendingStyles);
  const router = useRouter();
  const sorted = useMemo(
    () => [...categories].sort((a, b) => b.total - a.total),
    [categories],
  );

  const rankMap = useMemo(() => buildCategoryRankMap(sorted), [sorted]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const midpoint = Math.ceil(sorted.length / 2);
  const leftColumn = sorted.slice(0, midpoint);
  const rightColumn = sorted.slice(midpoint);

  const renderLegendItem = useCallback((cat: CategoryData, i: number) => (
    <View
      key={cat.name}
      style={styles.legendItem}
      accessibilityLabel={`${cat.name === 'General' ? 'General / Uncategorized' : cat.name}, ${Math.round(cat.percentage)}%`}
    >
      <Pressable
        onHoverIn={() => setHoveredIndex(i)}
        onHoverOut={() => setHoveredIndex(null)}
        style={styles.legendHitArea}
      >
        <View
          style={[
            styles.legendDot,
            { backgroundColor: getCategoryColor(cat.name, rankMap.get(cat.name) ?? 0) },
          ]}
        />
        <Text style={styles.legendText} numberOfLines={1}>
          {cat.name === 'General' ? 'General / Uncategorized' : cat.name}
        </Text>
      </Pressable>
      <Text style={styles.legendPercentage}>
        {Math.round(cat.percentage)}%
      </Text>
    </View>
  ), [styles, rankMap]);

  return (
    <View style={styles.proportionBarContainer}>
      <View style={styles.proportionBarHeader}>
        <Text style={styles.proportionBarTitle}>Spending by Category</Text>
        {isNarrow && (
          <Pressable
            style={styles.mobileAccountsBadge}
            onPress={() => router.push('/dashboard/accounts')}
            accessibilityRole="button"
            accessibilityLabel={`${accountCount} connected accounts. Navigate to accounts page.`}
          >
            <View style={styles.accountsDot} />
            <Text style={styles.mobileAccountsBadgeText}>
              {accountCount} {accountCount === 1 ? 'account' : 'accounts'}
            </Text>
            <Text style={styles.mobileAccountsPlus}>+</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.proportionBar}>
        {sorted.map((cat, i) => {
          const color = getCategoryColor(cat.name, rankMap.get(cat.name) ?? 0);
          const isHovered = hoveredIndex === i;
          const pct = Math.round(cat.percentage);

          return (
            <Pressable
              key={cat.name}
              onHoverIn={() => setHoveredIndex(i)}
              onHoverOut={() => setHoveredIndex(null)}
              onLongPress={() => setHoveredIndex(i)}
              onPressOut={() => setHoveredIndex(null)}
              delayLongPress={200}
              style={[
                styles.proportionSegment,
                {
                  flex: cat.percentage,
                  backgroundColor: color,
                },
                i === 0 && styles.proportionSegmentFirst,
                i === sorted.length - 1 && styles.proportionSegmentLast,
              ]}
              accessibilityLabel={`${cat.name}, $${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}, ${cat.percentage.toFixed(1)}%`}
            >
              {/* Brighten overlay on hovered segment */}
              {isHovered && (
                <View style={styles.proportionBrightenOverlay} />
              )}

              {/* Percentage label visible on hover (only if segment is wide enough) */}
              {isHovered && cat.percentage > 5 && (
                <View style={styles.proportionLabel}>
                  <Text style={styles.proportionLabelText}>{pct}%</Text>
                </View>
              )}

              {/* Tooltip with full details */}
              {isHovered && (
                <View style={styles.proportionTooltip}>
                  <Text style={styles.proportionTooltipText}>
                    {cat.name === 'General' ? 'General / Uncategorized' : cat.name}:{' '}
                    ${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}{' '}
                    ({cat.percentage.toFixed(1)}%)
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendColumn}>
          {leftColumn.map((cat) => renderLegendItem(cat, sorted.indexOf(cat)))}
        </View>
        <View style={styles.legendColumn}>
          {rightColumn.map((cat) => renderLegendItem(cat, sorted.indexOf(cat)))}
        </View>
      </View>
    </View>
  );
}
