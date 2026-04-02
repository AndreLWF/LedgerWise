import { Text, View } from 'react-native';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createAccountsStyles } from '../styles/accounts.styles';

interface Props {
  count: number;
}

export default function StatsSummary({ count }: Props) {
  const styles = useThemeStyles(createAccountsStyles);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Accounts</Text>
        <Text style={styles.statValue}>{count}</Text>
      </View>
    </View>
  );
}
