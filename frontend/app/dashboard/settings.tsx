import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/contexts/ThemeContext';
import { useThemeStyles } from '../../src/hooks/useThemeStyles';
import { createPlaceholderStyles } from '../../src/styles/placeholder.styles';
import StaggeredView from '../../src/components/StaggeredView';

export default function SettingsScreen() {
  const colors = useColors();
  const styles = useThemeStyles(createPlaceholderStyles);

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

      <StaggeredView index={1}>
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
