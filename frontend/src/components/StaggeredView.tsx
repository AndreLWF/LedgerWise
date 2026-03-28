import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface StaggeredViewProps {
  index: number;
  delay?: number;
  duration?: number;
  trigger?: string | number;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function StaggeredView({
  index,
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
    const staggerDelay = index * delay;
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
  }, [index, delay, duration, trigger, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
