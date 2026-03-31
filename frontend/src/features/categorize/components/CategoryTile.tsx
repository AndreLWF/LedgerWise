import { useCallback, useEffect, useRef } from 'react';
import { Animated, LayoutChangeEvent, Text, View } from 'react-native';
import RNAnimated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useThemeStyles } from '../../../hooks/useThemeStyles';
import { createMobileCategorizeStyles } from '../styles/mobileCategorize.styles';
import type { CategoryInfo } from '../../../types/categorize';

const STAGGER_DELAY_MS = 15;
const STAGGER_DURATION_MS = 200;
const STAGGER_INITIAL_OPACITY = 0.5;

interface Props {
  category: CategoryInfo;
  index: number;
  isActive: boolean;
  onLayout: (index: number, pageX: number, pageY: number, width: number, height: number) => void;
}

export default function CategoryTile({ category, index, isActive, onLayout }: Props) {
  const styles = useThemeStyles(createMobileCategorizeStyles);
  const wrapperRef = useRef<View>(null);
  const scale = useRef(new Animated.Value(1)).current;

  // Staggered entrance: fade in with per-tile delay
  const staggerOpacity = useSharedValue(STAGGER_INITIAL_OPACITY);
  useEffect(() => {
    staggerOpacity.value = STAGGER_INITIAL_OPACITY;
    staggerOpacity.value = withDelay(
      index * STAGGER_DELAY_MS,
      withTiming(1, { duration: STAGGER_DURATION_MS }),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const staggerStyle = useAnimatedStyle(() => ({
    opacity: staggerOpacity.value,
  }));

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1.05 : 1,
      friction: 7,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [isActive, scale]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    wrapperRef.current?.measureInWindow((pageX, pageY) => {
      onLayout(index, pageX, pageY, width, height);
    });
  }, [index, onLayout]);

  return (
    <RNAnimated.View
      ref={wrapperRef}
      style={[styles.tileWrapper, staggerStyle]}
      onLayout={handleLayout}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}, ${category.transactionCount} transactions`}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View
        style={[
          styles.tile,
          isActive && styles.tileActive,
          styles.tileInner,
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.tileDot, { backgroundColor: category.color }]} />
        <Text
          style={[styles.tileName, isActive && styles.tileNameActive]}
          numberOfLines={2}
        >
          {category.name}
        </Text>
        <Text style={[styles.tileCount, isActive && styles.tileCountActive]}>
          {category.transactionCount}
        </Text>
      </Animated.View>
    </RNAnimated.View>
  );
}
