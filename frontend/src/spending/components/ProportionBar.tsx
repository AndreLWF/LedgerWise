import { Text, View } from 'react-native';
import { spendingStyles as styles } from '../../styles/spending.styles';
import type { CategoryData } from '../../types/spending';
import { getCategoryColor } from '../../utils/categoryColors';

interface ProportionBarProps {
  categories: CategoryData[];
}

export default function ProportionBar({ categories }: ProportionBarProps) {
  return (
    <View style={styles.proportionBarContainer}>
      <View style={styles.proportionBar}>
        {categories.map((cat, i) => (
          <View
            key={cat.name}
            style={[
              styles.proportionSegment,
              {
                flex: cat.percentage,
                backgroundColor: getCategoryColor(cat.name, i),
              },
              i === 0 && styles.proportionSegmentFirst,
              i === categories.length - 1 && styles.proportionSegmentLast,
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {categories.map((cat, i) => (
          <View key={cat.name} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: getCategoryColor(cat.name, i) },
              ]}
            />
            <Text style={styles.legendText}>{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
