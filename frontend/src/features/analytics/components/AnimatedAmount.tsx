import { useEffect, useRef, useState } from 'react';
import { Text, type TextStyle } from 'react-native';

interface Props {
  value: number;
  prefix?: string;
  style?: TextStyle;
}

function formatCurrency(n: number, prefix: string): string {
  const rounded = Math.round(n);
  const abs = Math.abs(rounded);
  const str = abs.toString();
  let formatted = '';
  for (let i = str.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) formatted = ',' + formatted;
    formatted = str[i] + formatted;
  }
  return `${prefix}${rounded < 0 ? '-' : ''}${formatted}`;
}

/**
 * Animated count-up number display.
 * Uses requestAnimationFrame for a smooth JS-thread counting animation.
 */
export default function AnimatedAmount({ value, prefix = '$', style }: Props) {
  const [display, setDisplay] = useState(() => formatCurrency(value, prefix));
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
      setDisplay(formatCurrency(current, prefix));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, prefix]);

  return (
    <Text style={style} numberOfLines={1} adjustsFontSizeToFit>
      {display}
    </Text>
  );
}
