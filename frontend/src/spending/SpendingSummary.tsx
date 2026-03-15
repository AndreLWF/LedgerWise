import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { spendingStyles as styles } from '../styles/spending.styles';
import type { SpendingSummaryData } from '../types/spending';
import type { Transaction } from '../types/transaction';
import CategoryAccordion from './components/CategoryAccordion';
import ProportionBar from './components/ProportionBar';
import SummaryChip from './components/SummaryChip';

interface Props {
  data: SpendingSummaryData | null;
  transactions: Transaction[];
  loading: boolean;
}

export default function SpendingSummary({ data, transactions, loading }: Props) {
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#6366f1"
        style={styles.spinner}
      />
    );
  }

  if (!data || data.categories.length === 0) {
    return <Text style={styles.emptyText}>No spending data available.</Text>;
  }

  const topCategory = data.categories[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.summaryStrip}>
        <SummaryChip
          label="Total spent"
          value={`$${data.total_spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle="All time"
        />
        <SummaryChip
          label="Transactions"
          value={`${data.transaction_count}`}
          subtitle={`across ${data.category_count} categories`}
        />
        <SummaryChip
          label="Top category"
          value={topCategory.name}
          subtitle={`$${topCategory.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} · ${topCategory.percentage}%`}
        />
        <SummaryChip
          label="Uncategorized"
          value={`${data.uncategorized_percentage}%`}
          subtitle={`${data.uncategorized_count} transactions`}
          variant="warning"
        />
      </View>

      <ProportionBar categories={data.categories} />

      <CategoryAccordion data={data} transactions={transactions} />

      {data.refund_count > 0 && (
        <CategoryAccordion
          variant="refund"
          data={{
            ...data,
            categories: [{
              name: 'Refund',
              total: data.refund_total,
              count: data.refund_count,
              percentage: 0,
            }],
          }}
          transactions={transactions}
        />
      )}
    </ScrollView>
  );
}
