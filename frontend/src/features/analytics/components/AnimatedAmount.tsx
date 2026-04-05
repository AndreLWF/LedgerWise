import { useEffect, useRef, useState } from 'react';
import { Text, type TextStyle } from 'react-native';

interface Props {
  value: number;
  style?: TextStyle;
}

const wholeNumberFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatWholeAmount(n: number): string {
  return wholeNumberFormatter.format(Math.round(n));
}

/**
 * Animated count-up number display.
 * Uses requestAnimationFrame for a smooth JS-thread counting animation.
 */
export default function AnimatedAmount({ value, style }: Props) {
  const [display, setDisplay] = useState(() => formatWholeAmount(value));
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = currentRef.current;
    const end = value;
    const duration = 700;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + (end - start) * eased;
      currentRef.current = current;
      setDisplay(formatWholeAmount(current));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <Text style={style} numberOfLines={1} adjustsFontSizeToFit>
      {display}
    </Text>
  );
}
