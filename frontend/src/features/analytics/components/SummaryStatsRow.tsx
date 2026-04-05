import { memo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createAnalyticsStyles } from '../styles/analytics.styles';
import { createStatCardStyles } from '../../../styles/statCard.styles';
import { isNarrow } from '../../../utils/responsive';
import AnimatedAmount from './AnimatedAmount';
import { formatCurrency } from '../../../utils/formatters';
import type { AnalyticsSummary, AnalyticsTimePeriod } from '../../../types/analytics';

const PERIOD_LABELS: Record<AnalyticsTimePeriod, string> = {
  '6m': '6-month total',
  '12m': '12-month total',
  'ytd': 'Year to date',
  'all': 'All-time total',
};

interface Props {
  summary: AnalyticsSummary;
  timePeriod: AnalyticsTimePeriod;
}

function SummaryStatsRow({ summary, timePeriod }: Props) {
  const colors = useColors();
  const styles = useThemeStyles(createAnalyticsStyles);
  const cardStyles = useThemeStyles(createStatCardStyles);

  const iconBg = colors.isDark ? colors.purple[900] + '60' : colors.purple[100];
  const iconColor = colors.isDark ? colors.purple[400] : colors.purple[700];

  return (
    <View style={styles.statsRow}>
      {/* Period Total Card */}
      <View
        style={cardStyles.card}
        accessibilityRole="summary"
        accessibilityLabel={`${PERIOD_LABELS[timePeriod]}: ${formatCurrency(summary.periodTotal)}`}
      >
        <View style={[cardStyles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name="trending-up" size={isNarrow ? 16 : 20} color={iconColor} />
        </View>
        <AnimatedAmount
          value={summary.periodTotal}
          style={cardStyles.value}
        />
        <Text style={cardStyles.subtitle}>{PERIOD_LABELS[timePeriod]}</Text>
      </View>

      {/* Monthly Average Card */}
      <View
        style={cardStyles.card}
        accessibilityRole="summary"
        accessibilityLabel={`Monthly average: ${formatCurrency(summary.monthlyAverage)}`}
      >
        <View style={[cardStyles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name="calendar-outline" size={isNarrow ? 16 : 20} color={iconColor} />
        </View>
        <AnimatedAmount
          value={summary.monthlyAverage}
          style={cardStyles.value}
        />
        <Text style={cardStyles.subtitle}>Monthly avg</Text>
      </View>
    </View>
  );
}

export default memo(SummaryStatsRow);
