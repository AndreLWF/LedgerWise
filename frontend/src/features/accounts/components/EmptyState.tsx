import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createAccountsStyles } from '../styles/accounts.styles';
import { isHovered } from '../../../utils/pressable';

interface Props {
  onConnect: () => void;
}

export default function EmptyState({ onConnect }: Props) {
  const colors = useColors();
  const styles = useThemeStyles(createAccountsStyles);

  return (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[colors.purple[600], colors.purple[500]]}
        style={styles.emptyIconBadge}
      >
        <Ionicons name="link" size={40} color={colors.text.inverse} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Accounts Connected</Text>
      <Text style={styles.emptySubtitle}>
        Connect your bank accounts and credit cards to automatically import and
        track your transactions in one place.
      </Text>
      <Pressable
        style={(state) => [
          isHovered(state) && styles.emptyButtonHovered,
        ]}
        onPress={onConnect}
        accessibilityRole="button"
        accessibilityLabel="Connect your first account"
      >
        <LinearGradient
          colors={[colors.purple[600], colors.purple[500]]}
          style={styles.emptyButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add" size={18} color={colors.text.inverse} />
          <Text style={styles.emptyButtonText}>Connect Your First Account</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
