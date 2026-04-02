import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createAccountsStyles } from '../styles/accounts.styles';
import { isHovered } from '../../../utils/pressable';
import type { Account } from '../../../types/account';
import { getAccountTypeLabel, getAccountTypeIcon } from '../utils/accountHelpers';

interface Props {
  account: Account;
  onClose: () => void;
}

function DialogContent({ account, onClose }: Props) {
  const colors = useColors();
  const styles = useThemeStyles(createAccountsStyles);
  const iconName = getAccountTypeIcon(account.account_type) as keyof typeof Ionicons.glyphMap;
  const displayName = account.institution_name ?? account.account_name ?? 'Unknown Account';

  return (
    <View style={styles.dialogBackdrop}>
      <View style={styles.dialogCard}>
        {/* Header */}
        <View style={styles.dialogHeader}>
          <Text style={styles.dialogTitle}>Remove Account</Text>
          <Pressable
            style={(state) => [
              styles.dialogCloseButton,
              isHovered(state) && styles.dialogCloseButtonHovered,
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close dialog"
          >
            <Ionicons name="close" size={18} color={colors.text.tertiary} />
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.dialogBody}>
          <View style={styles.dialogAccountRow}>
            <View style={styles.dialogAccountIcon}>
              <Ionicons name={iconName} size={20} color={colors.text.secondary} />
            </View>
            <View>
              <Text style={styles.dialogAccountName}>{displayName}</Text>
              <Text style={styles.dialogAccountMeta}>
                {getAccountTypeLabel(account.account_type)}
              </Text>
            </View>
          </View>

          <View style={styles.dialogInfoBox}>
            <Text style={styles.dialogInfoText}>
              This will disconnect{' '}
              <Text style={styles.dialogInfoBold}>{displayName}</Text>
              {' '}from LedgerWise.
            </Text>
          </View>

          <View style={styles.dialogSafeBox}>
            <View style={styles.dialogSafeIcon}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.isDark ? colors.purple[400] : colors.purple[600]}
              />
            </View>
            <View style={styles.dialogSafeContent}>
              <Text style={styles.dialogSafeTitle}>Your transaction history is safe</Text>
              <Text style={styles.dialogSafeText}>
                All transactions from this account will remain in LedgerWise. Only future syncing will stop.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.dialogFooter}>
          <Pressable
            style={(state) => [
              styles.dialogCancelButton,
              isHovered(state) && styles.dialogCancelButtonHovered,
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.dialogCancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={(state) => [
              styles.dialogRemoveButton,
              styles.dialogRemoveButtonDisabled,
              isHovered(state) && styles.dialogRemoveButtonHovered,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Remove account (coming soon)"
          >
            <Text style={styles.dialogRemoveText}>Remove Account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function RemoveAccountDialog(props: Props) {
  if (Platform.OS === 'web') {
    return <DialogContent {...props} />;
  }

  return (
    <Modal transparent animationType="fade" visible onRequestClose={props.onClose}>
      <SafeAreaProvider>
        <DialogContent {...props} />
      </SafeAreaProvider>
    </Modal>
  );
}
