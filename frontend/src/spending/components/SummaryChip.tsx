import { Text, View } from 'react-native';
import { spendingStyles as styles } from '../../styles/spending.styles';

interface SummaryChipProps {
  label: string;
  value: string;
  subtitle: string;
  variant?: 'default' | 'warning';
}

export default function SummaryChip({ label, value, subtitle, variant = 'default' }: SummaryChipProps) {
  return (
    <View style={[styles.summaryCard, variant === 'warning' && styles.uncategorizedCard]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, variant === 'warning' && styles.uncategorizedValue]}>
        {value}
      </Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
    </View>
  );
}
