import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useColors } from '../../src/contexts/ThemeContext';
import { useUpgrade } from '../../src/contexts/UpgradeContext';
import { useThemeStyles } from '../../src/hooks/useThemeStyles';
import { createPlaceholderStyles } from '../../src/styles/placeholder.styles';
import { isHovered } from '../../src/utils/pressable';
import StaggeredView from '../../src/components/StaggeredView';

export default function SettingsScreen() {
  const { isPro } = useAuth();
  const colors = useColors();
  const styles = useThemeStyles(createPlaceholderStyles);
  const openUpgrade = useUpgrade();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StaggeredView index={0}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Settings</Text>
          <Text style={styles.pageSubtitle}>Manage your account and preferences</Text>
        </View>
      </StaggeredView>

      {!isPro && (
        <StaggeredView index={1}>
          <Pressable
            style={(state) => [
              styles.placeholderCard,
              styles.upgradeCardBorder,
              isHovered(state) && styles.upgradeCardBorderHovered,
            ]}
            onPress={openUpgrade}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to Pro"
          >
            <View style={styles.placeholderIconContainer}>
              <Ionicons name="diamond-outline" size={32} color={colors.gold[500]} />
            </View>
            <Text style={styles.placeholderTitle}>Upgrade to Pro</Text>
            <Text style={styles.placeholderText}>
              Unlock unlimited bank accounts, advanced analytics, and more.
            </Text>
          </Pressable>
        </StaggeredView>
      )}

      <StaggeredView index={isPro ? 1 : 2}>
        <View style={styles.placeholderCard}>
          <View style={styles.placeholderIconContainer}>
            <Ionicons name="settings-outline" size={32} color={colors.purple[700]} />
          </View>
          <Text style={styles.placeholderTitle}>Settings</Text>
          <Text style={styles.placeholderText}>
            Account management, notifications, and preferences will be available here.
          </Text>
        </View>
      </StaggeredView>
    </ScrollView>
  );
}
