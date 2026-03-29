import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface AccordionRevealProps {
  index: number;
  total?: number;
  delay?: number;
  duration?: number;
  trigger?: string | number;
  visible: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Accordion item reveal animation. Each item fades in and slides down
 * with a short staggered delay. On close, resets immediately with no
 * reverse stagger — the parent container's height animation handles
 * the visual collapse.
 */
export default function AccordionReveal({
  index,
  total = 0,
  delay = 15,
  duration = 200,
  trigger,
  visible,
  children,
  style,
}: AccordionRevealProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);
      translateY.setValue(-6);
      const t = total > 1 ? index / (total - 1) : 0;
      const easedT = t * t;
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
    } else {
      opacity.setValue(0);
      translateY.setValue(-6);
    }
  }, [visible, index, total, delay, duration, trigger, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
