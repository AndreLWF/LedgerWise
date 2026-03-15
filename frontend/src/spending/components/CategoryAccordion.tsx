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

interface RefundSectionProps {
  data: SpendingSummaryData;
  isExpanded: boolean;
  transactions: Transaction[];
  onToggle: () => void;
}

function RefundSection({ data, isExpanded, transactions, onToggle }: RefundSectionProps) {
  return (
    <View style={styles.refundSection}>
      <Text style={styles.refundSectionLabel}>Refunds</Text>
      <Pressable
        style={[styles.categoryRow, styles.refundRow]}
        onPress={onToggle}
      >
        <View style={styles.categoryLeft}>
          <View
            style={[styles.categoryDot, { backgroundColor: '#22c55e' }]}
          />
          <Text style={styles.categoryName}>Refund</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {data.refund_count} txns
            </Text>
          </View>
        </View>
        <View style={styles.categoryRight}>
          <Text style={[styles.categoryTotal, styles.refundTotal]}>
            +${data.refund_total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.expandArrow}>
            {isExpanded ? '\u25B2' : '\u25BC'}
          </Text>
        </View>
      </Pressable>

      {isExpanded &&
        transactions.map((txn) => (
          <View key={txn.id} style={styles.expandedTxn}>
            <View style={styles.expandedTxnLeft}>
              <Text style={styles.expandedTxnDesc} numberOfLines={1}>
                {txn.description}
              </Text>
              <Text style={styles.expandedTxnMeta}>
                {txn.date} · {txn.account_name}
              </Text>
            </View>
            <Text style={[styles.expandedTxnAmount, styles.expandedTxnRefund]}>
              +${Math.abs(parseFloat(txn.amount)).toFixed(2)}
            </Text>
          </View>
        ))}
    </View>
  );
}

interface CategoryAccordionProps {
  data: SpendingSummaryData;
  transactions: Transaction[];
}

export default function CategoryAccordion({ data, transactions }: CategoryAccordionProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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

  return (
    <>
      <View style={styles.categoriesContainer}>
        {data.categories.map((cat, i) => {
          const isExpanded = expandedCategory === cat.name;
          const isUncategorized = cat.name === 'General';
          const color = getCategoryColor(cat.name, i);
          const categoryTransactions = isExpanded
            ? getTransactionsForCategory(cat.name)
            : [];

          return (
            <View key={cat.name}>
              <Pressable
                style={[
                  styles.categoryRow,
                  isUncategorized && styles.uncategorizedRow,
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
                  <Text style={styles.categoryTotal}>
                    ${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                          isPositive && styles.expandedTxnRefund,
                        ]}
                      >
                        {isPositive ? '+' : ''}${Math.abs(amt).toFixed(2)}
                      </Text>
                    </View>
                  );
                })}
            </View>
          );
        })}
      </View>

      {data.refund_count > 0 && (
        <RefundSection
          data={data}
          isExpanded={expandedCategory === 'Refund'}
          transactions={expandedCategory === 'Refund' ? getTransactionsForCategory('Refund') : []}
          onToggle={() => toggleCategory('Refund')}
        />
      )}
    </>
  );
}
