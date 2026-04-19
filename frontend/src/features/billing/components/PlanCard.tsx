import { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { isHovered } from '../../../utils/pressable';
import { NARROW_BREAKPOINT } from '../../../utils/responsive';
import { createBillingStyles } from '../styles/billing.styles';

const FEATURES = [
  'Unlimited bank accounts',
  'Advanced analytics',
  'Custom categories',
  'Priority support',
];

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  savings?: string;
  highlighted?: boolean;
  priceId: string;
  loading: boolean;
  onSubscribe: (priceId: string) => void;
}

export default function PlanCard({
  name,
  price,
  period,
  savings,
  highlighted,
  priceId,
  loading,
  onSubscribe,
}: PlanCardProps) {
  const colors = useColors();
  const styles = useThemeStyles(createBillingStyles);
  const { width } = useWindowDimensions();
  const isMobile = width < NARROW_BREAKPOINT;

  const handlePress = useCallback(() => onSubscribe(priceId), [onSubscribe, priceId]);

  return (
    <View style={[styles.planCard, highlighted && styles.planCardHighlighted]}>
      {/* Fixed-height badge zone so both cards align */}
      <View style={styles.badgeZone}>
        {highlighted && (
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueText}>Best Value</Text>
          </View>
        )}
      </View>

      <Text style={styles.planName}>{name}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      <Text style={styles.planPeriod}>{period}</Text>

      {/* Fixed-height savings zone */}
      <View style={styles.savingsZone}>
        {savings && <Text style={styles.planSavings}>{savings}</Text>}
      </View>

      <View style={styles.planDivider} />

      {FEATURES.map((feature) => (
        <View key={feature} style={styles.planFeature}>
          <Ionicons
            name="checkmark-circle"
            size={isMobile ? 14 : 18}
            color={highlighted ? colors.gold[500] : colors.brand.primary}
          />
          <Text style={styles.planFeatureText}>{feature}</Text>
        </View>
      ))}

      <View style={styles.buttonSpacer} />

      <Pressable
        style={(state) => [
          styles.subscribeButton,
          highlighted && styles.subscribeButtonHighlighted,
          !loading && isHovered(state) && (highlighted
            ? styles.subscribeButtonHighlightedHovered
            : styles.subscribeButtonHovered),
          loading && styles.subscribeButtonDisabled,
        ]}
        onPress={handlePress}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={`Subscribe to ${name} plan`}
      >
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colors.text.inverse} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <Text style={styles.subscribeButtonText}>Subscribe</Text>
        )}
      </Pressable>
    </View>
  );
}
