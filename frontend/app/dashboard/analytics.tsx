import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../src/contexts/ThemeContext';
import { useThemeStyles } from '../../src/hooks/useThemeStyles';
import { createPlaceholderStyles } from '../../src/styles/placeholder.styles';
import StaggeredView from '../../src/components/StaggeredView';

export default function AnalyticsScreen() {
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
          <Text style={styles.pageTitle}>Analytics</Text>
          <Text style={styles.pageSubtitle}>Deep dive into your spending patterns</Text>
        </View>
      </StaggeredView>

      <StaggeredView index={1}>
        <View style={styles.placeholderCard}>
          <View style={styles.placeholderIconContainer}>
            <Ionicons name="bar-chart-outline" size={32} color={colors.purple[700]} />
          </View>
          <Text style={styles.placeholderTitle}>Advanced Analytics</Text>
          <Text style={styles.placeholderText}>
            Detailed trends, comparisons, and forecasting tools will be available here.
          </Text>
        </View>
      </StaggeredView>
    </ScrollView>
  );
}
