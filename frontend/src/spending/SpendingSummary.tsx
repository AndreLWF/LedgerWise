import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spendingStyles as styles } from '../styles/spending.styles';
import { purple, gold, brand, surface } from '../theme';
import type { SpendingSummaryData } from '../types/spending';
import type { Transaction } from '../types/transaction';
import TimePeriodSelector, {
  type TimePeriod,
  getDisplayText,
} from '../components/TimePeriodSelector';
import StaggeredView from '../components/StaggeredView';
import CategoryAccordion from './components/CategoryAccordion';
import ProportionBar from './components/ProportionBar';
import SummaryChip from './components/SummaryChip';

interface Props {
  data: SpendingSummaryData | null;
  transactions: Transaction[];
  loading: boolean;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  availableYears?: number[];
}

export default function SpendingSummary({
  data,
  transactions,
  loading,
  selectedPeriod,
  onPeriodChange,
  availableYears,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const hasData = data && data.categories.length > 0;
  const topCategory = hasData ? data.categories[0] : null;
  const periodKey = useMemo(
    () => `${selectedPeriod.type}-${selectedPeriod.year}-${selectedPeriod.month ?? ''}`,
    [selectedPeriod],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, [periodKey]);

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <StaggeredView index={0}>
          <View style={styles.pageHeaderRow}>
            <View style={styles.pageHeaderLeft}>
              <Text style={styles.pageTitle}>Spending Summary</Text>
              <Text style={styles.pageSubtitle}>Track and categorize your expenses</Text>
            </View>
            <TimePeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
              availableYears={availableYears}
            />
          </View>
        </StaggeredView>
      </View>
      <LinearGradient
        colors={[surface.bg, surface.bg + '00']}
        style={styles.headerGradient}
        pointerEvents="none"
      />

      <ScrollView ref={scrollRef} style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading && (
          <ActivityIndicator
            size="large"
            color={brand.primary}
            style={styles.spinner}
          />
        )}

        {!loading && !hasData && (
          <Text style={styles.emptyText}>No spending data for this period.</Text>
        )}

        {hasData && topCategory && (
          <>
            <StaggeredView index={1} trigger={periodKey}>
              <View style={styles.summaryStrip}>
                <SummaryChip
                  value={`$${data.total_spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  subtitle={getDisplayText(selectedPeriod)}
                  icon="trending-up"
                  iconColor={purple[700]}
                  iconBgColor={purple[100]}
                />
                <SummaryChip
                  value={`${data.transaction_count}`}
                  subtitle={`across ${data.category_count} categories`}
                  icon="receipt-outline"
                  iconColor={purple[700]}
                  iconBgColor={purple[100]}
                />
                <SummaryChip
                  value={topCategory.name}
                  subtitle={`$${topCategory.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} \u00B7 ${topCategory.percentage}% of total`}
                  icon="pie-chart-outline"
                  iconColor={purple[700]}
                  iconBgColor={purple[100]}
                />
                <SummaryChip
                  value={`${data.uncategorized_percentage}%`}
                  subtitle="Uncategorized spending"
                  variant="warning"
                  icon="alert-circle-outline"
                  iconColor={gold[700]}
                  iconBgColor={gold[100]}
                />
              </View>
            </StaggeredView>

            <StaggeredView index={2} trigger={periodKey}>
              <ProportionBar categories={data.categories} />
            </StaggeredView>

            <StaggeredView index={3} trigger={periodKey}>
              <CategoryAccordion data={data} transactions={transactions} />
            </StaggeredView>

            {data.refund_count > 0 && (
              <StaggeredView index={4} trigger={periodKey}>
                <CategoryAccordion
                  variant="refund"
                  data={{
                    ...data,
                    categories: [{
                      name: 'Refunds',
                      total: data.refund_total,
                      count: data.refund_count,
                      percentage: 0,
                    }],
                  }}
                  transactions={transactions}
                />
              </StaggeredView>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
