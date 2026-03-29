import { useCallback, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export interface AccordionItemState {
  isExpanded: boolean;
  isClosing: boolean;
  isSettled: boolean;
  showContent: boolean;
  animValue: Animated.Value | undefined;
}

/**
 * Manages accordion expand/collapse height animations for keyed sections.
 *
 * Opening: spring (tension 100, friction 12) — slight overshoot that settles.
 * Closing: timing (350ms, cubic ease-out) — fast start, smooth deceleration.
 *
 * Uses a hidden measurer pattern: the caller renders an off-screen copy to
 * measure content height, then this hook animates a container to that height.
 * After the open spring settles, the height constraint is released so iOS
 * can't flex-compress the content.
 */
export default function useAccordionHeight() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [closing, setClosing] = useState<Set<string>>(new Set());
  const [settled, setSettled] = useState<Set<string>>(new Set());
  const contentHeights = useRef<Map<string, number>>(new Map());
  const animValues = useRef<Map<string, Animated.Value>>(new Map());

  const cleanup = useCallback((name: string) => {
    animValues.current.delete(name);
    contentHeights.current.delete(name);
    setClosing((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
    setSettled((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const handleMeasure = useCallback((name: string, height: number) => {
    if (height <= 0) return;
    const isNew = !contentHeights.current.has(name);
    contentHeights.current.set(name, height);
    if (isNew) {
      const anim = animValues.current.get(name);
      if (anim) {
        Animated.spring(anim, {
          toValue: height,
          tension: 100,
          friction: 12,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) {
            setSettled((prev) => new Set(prev).add(name));
          }
        });
      }
    }
  }, []);

  const toggle = useCallback((name: string) => {
    const isOpen = expanded.has(name) && !closing.has(name);

    if (isOpen) {
      setSettled((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
      setClosing((prev) => new Set(prev).add(name));
      const measuredHeight = contentHeights.current.get(name) ?? 0;
      const anim = animValues.current.get(name);
      if (anim) {
        anim.setValue(measuredHeight);
        Animated.timing(anim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished) cleanup(name);
        });
      }
    } else if (!closing.has(name)) {
      const anim = new Animated.Value(0);
      animValues.current.set(name, anim);
      setExpanded((prev) => new Set(prev).add(name));
    }
  }, [expanded, closing, cleanup]);

  const getState = useCallback(
    (name: string): AccordionItemState => {
      const isExpanded = expanded.has(name);
      const isClosing = closing.has(name);
      const isSettled = settled.has(name) && !isClosing;
      return {
        isExpanded,
        isClosing,
        isSettled,
        showContent: isExpanded || isClosing,
        animValue: animValues.current.get(name),
      };
    },
    [expanded, closing, settled],
  );

  return { toggle, getState, handleMeasure };
}
