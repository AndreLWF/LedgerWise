import { Text, View } from 'react-native';
import { spendingStyles as styles } from '../../styles/spending.styles';
import type { SpendingSummaryData } from '../../types/spending';

interface SummaryChipProps {
  data: SpendingSummaryData;
}

export default function SummaryChip({ data }: SummaryChipProps) {
  const topCategory = data.categories[0];

  return (
    <View style={styles.summaryStrip}>
      <View style={styles.summaryCard}>
        <Text style={styles.cardLabel}>Total spent</Text>
        <Text style={styles.cardValue}>
          ${data.total_spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </Text>
        <Text style={styles.cardSub}>All time</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.cardLabel}>Transactions</Text>
        <Text style={styles.cardValue}>{data.transaction_count}</Text>
        <Text style={styles.cardSub}>
          across {data.category_count} categories
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.cardLabel}>Top category</Text>
        <Text style={styles.cardValue}>{topCategory.name}</Text>
        <Text style={styles.cardSub}>
          ${topCategory.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} · {topCategory.percentage}%
        </Text>
      </View>

      <View style={[styles.summaryCard, styles.uncategorizedCard]}>
        <Text style={styles.cardLabel}>Uncategorized</Text>
        <Text style={[styles.cardValue, styles.uncategorizedValue]}>
          {data.uncategorized_percentage}%
        </Text>
        <Text style={styles.cardSub}>
          {data.uncategorized_count} transactions
        </Text>
      </View>
    </View>
  );
}
