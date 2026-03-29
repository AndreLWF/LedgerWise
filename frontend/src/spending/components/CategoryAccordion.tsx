import { useMemo } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spendingStyles as styles } from '../../styles/spending.styles';
import type { SpendingSummaryData } from '../../types/spending';
import type { Transaction } from '../../types/transaction';
import { getCategoryColor } from '../../utils/categoryColors';
import { buildCategoryRankMap } from '../../utils/categoryRanking';
import { text, semantic } from '../../theme';
import { isHovered } from '../../utils/pressable';
import AccordionReveal from '../../components/AccordionReveal';
import useAccordionHeight from '../../hooks/useAccordionHeight';

const PAYMENT_PATTERN = /pymt|payment/i;

/** Parse "YYYY-MM-DD" as local time (not UTC) and format for display. */
function formatLocalDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface CategoryAccordionProps {
  data: SpendingSummaryData;
  transactions: Transaction[];
  variant?: 'default' | 'refund';
}

export default function CategoryAccordion({
  data,
  transactions,
  variant = 'default',
}: CategoryAccordionProps) {
  const { toggle, getState, handleMeasure } = useAccordionHeight();
  const isRefund = variant === 'refund';

  function getTransactionsForCategory(categoryName: string): Transaction[] {
    if (isRefund) {
      return transactions.filter((t) => {
        const amt = parseFloat(t.amount);
        const isCategoryRefund = t.category?.toLowerCase() === 'refund';
        const isNegativeNonPayment = amt < 0 && !PAYMENT_PATTERN.test(t.description);
        return isCategoryRefund || isNegativeNonPayment;
      });
    }
    return transactions.filter((t) => {
      const txnCategory = t.category || 'General';
      if (txnCategory !== categoryName) return false;
      if (PAYMENT_PATTERN.test(t.description)) return false;
      const amt = parseFloat(t.amount);
      if (amt < 0) return false;
      return true;
    });
  }

  const sorted = useMemo(
    () => [...data.categories].sort((a, b) => b.total - a.total),
    [data.categories],
  );

  const rankMap = useMemo(() => buildCategoryRankMap(sorted), [sorted]);

  const content = (
    <View style={styles.categoriesContainer}>
      {sorted.map((cat, i) => {
        const { isExpanded, isClosing, isSettled, showContent, animValue } =
          getState(cat.name);
        const isUncategorized = !isRefund && cat.name === 'General';
        const color = isRefund ? semantic.success : getCategoryColor(cat.name, rankMap.get(cat.name) ?? 0);
        const categoryTransactions = showContent
          ? getTransactionsForCategory(cat.name)
          : [];

        return (
          <View key={cat.name}>
            <Pressable
              style={(state) => [
                styles.categoryRow,
                isUncategorized && styles.uncategorizedRow,
                i === sorted.length - 1 && !isExpanded && { borderBottomWidth: 0 },
                ((isExpanded && !isClosing) || isHovered(state)) && {
                  backgroundColor: color + '14',
                },
              ]}
              onPress={() => toggle(cat.name)}
            >
              <View style={styles.categoryLeft}>
                <View
                  style={[styles.categoryDot, { backgroundColor: color }]}
                />
                <Text
                  style={[
                    styles.categoryName,
                    isUncategorized && styles.uncategorizedName,
                  ]}
                >
                  {cat.name === 'General' ? 'General / Uncategorized' : cat.name}
                </Text>
                {isUncategorized && (
                  <View style={styles.reviewBadge}>
                    <Text style={styles.reviewBadgeText}>Review</Text>
                  </View>
                )}
              </View>
              <View style={styles.categoryRight}>
                <View style={[styles.countBadge, isRefund && styles.countBadgeRefund]}>
                  <Text style={[styles.countBadgeText, isRefund && styles.countBadgeTextRefund]}>{cat.count}</Text>
                </View>
                <Text
                  style={[
                    styles.categoryTotal,
                    isUncategorized && styles.uncategorizedTotal,
                    isRefund && styles.refundTotal,
                  ]}
                >
                  {isRefund ? '+' : ''}${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
                <Ionicons
                  name={isExpanded && !isClosing ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color={text.tertiary}
                />
              </View>
            </Pressable>

            {showContent && (
              <>
                {/* Hidden measurer — off-screen so onLayout fires even at height 0 on iOS */}
                <View
                  style={styles.hiddenMeasurer}
                  pointerEvents="none"
                  onLayout={(e) => handleMeasure(cat.name, e.nativeEvent.layout.height)}
                >
                  <View style={styles.expandedContainer}>
                    {categoryTransactions.map((txn) => (
                      <View key={txn.id} style={styles.expandedTxn}>
                        <View style={styles.expandedTxnLeft}>
                          <Text style={styles.expandedTxnDesc} numberOfLines={1}>
                            {txn.description}
                          </Text>
                          <Text style={styles.expandedTxnMeta}>
                            {formatLocalDate(txn.date)}
                          </Text>
                        </View>
                        <Text style={styles.expandedTxnAmount}>
                          {isRefund ? '+' : ''}${Math.abs(parseFloat(txn.amount)).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Animated container — drops height constraint once spring settles */}
                <Animated.View
                  style={isSettled ? undefined : {
                    height: animValue,
                    overflow: 'hidden' as const,
                  }}
                >
                  <View style={[styles.expandedContainer, !isSettled && styles.expandedContainerAnimating]}>
                    {categoryTransactions.map((txn, txnIndex) => {
                      const amt = parseFloat(txn.amount);
                      return (
                        <AccordionReveal
                          key={txn.id}
                          index={txnIndex}
                          total={categoryTransactions.length}
                          trigger={cat.name}
                          visible={!isClosing}
                        >
                          <View style={styles.expandedTxn}>
                            <View style={styles.expandedTxnLeft}>
                              <Text style={styles.expandedTxnDesc} numberOfLines={1}>
                                {txn.description}
                              </Text>
                              <Text style={styles.expandedTxnMeta}>
                                {formatLocalDate(txn.date)}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.expandedTxnAmount,
                                isRefund && styles.expandedTxnRefund,
                              ]}
                            >
                              {isRefund ? '+' : ''}${Math.abs(amt).toFixed(2)}
                            </Text>
                          </View>
                        </AccordionReveal>
                      );
                    })}
                  </View>
                </Animated.View>
              </>
            )}
          </View>
        );
      })}
    </View>
  );

  if (isRefund) {
    return (
      <View style={styles.refundSection}>
        <Text style={styles.refundSectionLabel}>Refunds</Text>
        <View style={[styles.categoriesSection, styles.refundSectionCard]}>
          {content}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.categoriesSectionHeader}>
        <Text style={styles.categoriesSectionTitle}>All Categories</Text>
      </View>
      {content}
    </View>
  );
}
