import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface StaggeredViewProps {
  index: number;
  total?: number;
  delay?: number;
  duration?: number;
  trigger?: string | number;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Page-level entrance animation. Each child fades in and slides up
 * with a staggered delay based on its index. Used for tab/page transitions.
 */
export default function StaggeredView({
  index,
  total = 0,
  delay = 80,
  duration = 400,
  trigger,
  children,
  style,
}: StaggeredViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    // Ease-in stagger: slow start, items appear faster toward the end
    const t = total > 1 ? index / (total - 1) : 0;
    const easedT = t * t; // quadratic ease-in
    const maxDelay = (total - 1) * delay;
    const staggerDelay = Math.round(easedT * maxDelay);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay: staggerDelay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay: staggerDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, total, delay, duration, trigger, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
