import { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from 'react-native';
import { spendingStyles as styles } from '../../styles/spending.styles';
import type { SpendingSummaryData } from '../../types/spending';
import type { Transaction } from '../../types/transaction';
import { getCategoryColor } from '../../utils/categoryColors';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const isRefund = variant === 'refund';

  function toggleCategory(name: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategory((prev) => (prev === name ? null : name));
  }

  function getTransactionsForCategory(categoryName: string): Transaction[] {
    return transactions.filter((t) => {
      const txnCategory = t.category || 'General';
      return txnCategory === categoryName;
    });
  }

  const content = (
    <View style={styles.categoriesContainer}>
      {data.categories.map((cat, i) => {
        const isExpanded = expandedCategory === cat.name;
        const isUncategorized = !isRefund && cat.name === 'General';
        const color = isRefund ? '#22c55e' : getCategoryColor(cat.name, i);
        const categoryTransactions = isExpanded
          ? getTransactionsForCategory(cat.name)
          : [];

        return (
          <View key={cat.name}>
            <Pressable
              style={[
                styles.categoryRow,
                isUncategorized && styles.uncategorizedRow,
                isRefund && styles.refundRow,
              ]}
              onPress={() => toggleCategory(cat.name)}
            >
              <View style={styles.categoryLeft}>
                <View
                  style={[styles.categoryDot, { backgroundColor: color }]}
                />
                <Text style={styles.categoryName}>{cat.name}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {cat.count} txns
                  </Text>
                </View>
              </View>
              <View style={styles.categoryRight}>
                <Text style={[styles.categoryTotal, isRefund && styles.refundTotal]}>
                  {isRefund ? '+' : ''}${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
                <Text style={styles.expandArrow}>
                  {isExpanded ? '\u25B2' : '\u25BC'}
                </Text>
              </View>
            </Pressable>

            {isExpanded &&
              categoryTransactions.map((txn) => {
                const amt = parseFloat(txn.amount);
                const isPositive = amt > 0;
                return (
                  <View key={txn.id} style={styles.expandedTxn}>
                    <View style={styles.expandedTxnLeft}>
                      <Text style={styles.expandedTxnDesc} numberOfLines={1}>
                        {txn.description}
                      </Text>
                      <Text style={styles.expandedTxnMeta}>
                        {txn.date} · {txn.account_name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.expandedTxnAmount,
                        (isPositive || isRefund) && styles.expandedTxnRefund,
                      ]}
                    >
                      {isPositive || isRefund ? '+' : ''}${Math.abs(amt).toFixed(2)}
                    </Text>
                  </View>
                );
              })}
          </View>
        );
      })}
    </View>
  );

  if (isRefund) {
    return (
      <View style={styles.refundSection}>
        <Text style={styles.refundSectionLabel}>Refunds</Text>
        {content}
      </View>
    );
  }

  return content;
}
