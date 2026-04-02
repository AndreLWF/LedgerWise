import { useCallback, useRef } from 'react';
import { Animated, Platform, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createAccountsStyles } from '../styles/accounts.styles';
import { isHovered } from '../../../utils/pressable';

interface Props {
  onPress: () => void;
}

const isWeb = Platform.OS === 'web';

export default function AddAccountCard({ onPress }: Props) {
  const colors = useColors();
  const styles = useThemeStyles(createAccountsStyles);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const scaleUp = useCallback(() => {
    Animated.timing(scaleAnim, { toValue: 1.08, duration: 180, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const scaleDown = useCallback(() => {
    Animated.timing(scaleAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const scaleStyle = { transform: [{ scale: scaleAnim }] };

  return (
    <Pressable
      style={(state) => [
        styles.addCard,
        (isHovered(state) || state.pressed) && styles.addCardHovered,
      ]}
      onPress={onPress}
      onHoverIn={isWeb ? scaleUp : undefined}
      onHoverOut={isWeb ? scaleDown : undefined}
      onPressIn={isWeb ? undefined : scaleUp}
      onPressOut={isWeb ? undefined : scaleDown}
      accessibilityRole="button"
      accessibilityLabel="Add new bank account"
    >
      <Animated.View style={scaleStyle}>
        <LinearGradient
          colors={[colors.purple[600], colors.purple[500]]}
          style={styles.addIconBadge}
        >
          <Ionicons name="add" size={28} color={colors.text.inverse} />
        </LinearGradient>
      </Animated.View>
      <Text style={styles.addTitle}>Add New Account</Text>
      <Text style={styles.addSubtitle}>
        Connect your bank or credit card to automatically track transactions
      </Text>
    </Pressable>
  );
}
