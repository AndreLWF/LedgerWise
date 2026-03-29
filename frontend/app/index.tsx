import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';
import { useColors } from '../src/contexts/ThemeContext';
import { useThemeStyles } from '../src/hooks/useThemeStyles';
import { createAuthGateStyles } from '../src/styles/authGate.styles';

export default function Index() {
  const { session, loading } = useAuth();
  const colors = useColors();
  const styles = useThemeStyles(createAuthGateStyles);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/dashboard/spending" />;
}
