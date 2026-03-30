import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createCategorizeStyles } from '../styles/categorize.styles';
import useDropTarget from '../useDropTarget';
import type { CategoryInfo } from '../../../types/categorize';

interface Props {
  category: CategoryInfo;
  onDrop: (transactionId: string, categoryName: string) => void;
}

export default function CategoryTarget({ category, onDrop }: Props) {
  const styles = useThemeStyles(createCategorizeStyles);

  const handleDrop = useCallback(
    (transactionId: string) => onDrop(transactionId, category.name),
    [onDrop, category.name],
  );

  const { ref, isOver } = useDropTarget(handleDrop);

  return (
    <View
      ref={ref}
      style={[styles.categoryRow, isOver && styles.categoryRowHighlighted]}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${category.transactionCount} transactions. Drop here to assign.`}
    >
      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
      <Text style={styles.categoryName} numberOfLines={1}>
        {category.name}
      </Text>
      <Text style={styles.categoryCount}>{category.transactionCount}</Text>
    </View>
  );
}
