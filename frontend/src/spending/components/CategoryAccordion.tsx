import { useCallback, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { spendingStyles as styles } from '../../styles/spending.styles';
import type { SpendingSummaryData } from '../../types/spending';
import type { Transaction } from '../../types/transaction';
import { getCategoryColor } from '../../utils/categoryColors';

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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const fadeAnims = useRef<Record<string, Animated.Value>>({});
  const isRefund = variant === 'refund';

  function getFadeAnim(name: string): Animated.Value {
    if (!fadeAnims.current[name]) {
      fadeAnims.current[name] = new Animated.Value(0);
    }
    return fadeAnims.current[name];
  }

  const toggleCategory = useCallback((name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      const anim = getFadeAnim(name);
      if (next.has(name)) {
        Animated.timing(anim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setExpandedCategories((curr) => {
            const updated = new Set(curr);
            updated.delete(name);
            return updated;
          });
        });
        return prev; // don't remove yet — wait for animation
      } else {
        next.add(name);
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
        return next;
      }
    });
  }, []);

  function getTransactionsForCategory(categoryName: string): Transaction[] {
    if (isRefund) {
      const paymentPattern = /pymt|payment/i;
      return transactions.filter((t) => {
        const amt = parseFloat(t.amount);
        const isCategoryRefund = t.category?.toLowerCase() === 'refund';
        const isNegativeNonPayment = amt < 0 && !paymentPattern.test(t.description);
        return isCategoryRefund || isNegativeNonPayment;
      });
    }
    return transactions.filter((t) => {
      const txnCategory = t.category || 'General';
      return txnCategory === categoryName;
    });
  }

  const content = (
    <View style={styles.categoriesContainer}>
      {data.categories.map((cat, i) => {
        const isExpanded = expandedCategories.has(cat.name);
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

            {isExpanded && (
              <Animated.View style={{ opacity: getFadeAnim(cat.name) }}>
                {categoryTransactions.map((txn) => {
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
              </Animated.View>
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
        {content}
      </View>
    );
  }

  return content;
}
