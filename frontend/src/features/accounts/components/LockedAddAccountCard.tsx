import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createAccountsStyles } from '../styles/accounts.styles';
import { isHovered } from '../../../utils/pressable';

interface Props {
  onPress: () => void;
}

export default function LockedAddAccountCard({ onPress }: Props) {
  const colors = useColors();
  const styles = useThemeStyles(createAccountsStyles);

  return (
    <Pressable
      style={(state) => [
        styles.addCard,
        styles.addCardLocked,
        isHovered(state) && styles.addCardLockedHovered,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Upgrade to Pro to add more accounts"
    >
      <View style={styles.addLockIconCircle}>
        <Ionicons name="lock-closed" size={24} color={colors.gold[500]} />
      </View>
      <Text style={styles.addTitle}>Add New Account</Text>
      <Text style={styles.addSubtitle}>
        Upgrade to Pro to connect additional bank accounts
      </Text>
    </Pressable>
  );
}
