import { Dimensions, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spendingStyles as styles } from '../../styles/spending.styles';

const isNarrow = Dimensions.get('window').width < 600;

interface SummaryChipProps {
  value: string;
  subtitle: string;
  variant?: 'default' | 'warning';
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  smallValue?: boolean;
}

export default function SummaryChip({
  value,
  subtitle,
  variant = 'default',
  icon,
  iconColor,
  iconBgColor,
  smallValue = false,
}: SummaryChipProps) {
  const isWarning = variant === 'warning';

  return (
    <View style={[styles.summaryCard, isWarning && styles.uncategorizedCard]}>
      <View style={[styles.cardIconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={isNarrow ? 16 : 20} color={iconColor} />
      </View>
      <Text
        style={[
          styles.cardValue,
          smallValue && styles.cardValueSmall,
          isWarning && styles.uncategorizedValue,
        ]}
      >
        {value}
      </Text>
      <Text style={[styles.cardSub, isWarning && styles.uncategorizedSub]}>
        {subtitle}
      </Text>
    </View>
  );
}
