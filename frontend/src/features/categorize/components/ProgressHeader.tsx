import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../../contexts/ThemeContext';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createCategorizeStyles } from '../styles/categorize.styles';

interface Props {
  categorizedCount: number;
  totalCount: number;
}

export default function ProgressHeader({ categorizedCount, totalCount }: Props) {
  const colors = useColors();
  const styles = useThemeStyles(createCategorizeStyles);
  const percentage = totalCount > 0 ? Math.round((categorizedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabelRow}>
        <View style={styles.progressLabelLeft}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={colors.isDark ? colors.purple[400] : colors.purple[600]}
          />
          <Text style={styles.progressLabelText}>
            {categorizedCount} of {totalCount} categorized
          </Text>
        </View>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={[colors.purple[600], colors.purple[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${percentage}%` }]}
        />
      </View>
    </View>
  );
}
