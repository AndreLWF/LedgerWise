import { ActivityIndicator, ScrollView, Text } from 'react-native';
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SummaryChip data={data} />
      <ProportionBar categories={data.categories} />
      <CategoryAccordion data={data} transactions={transactions} />
    </ScrollView>
  );
}
