import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useColors, type ThemeColors } from '../contexts/ThemeContext';
import { shadows, darkShadows } from '../theme';

export type { ThemeColors } from '../contexts/ThemeContext';

export interface StyleDeps {
  colors: ThemeColors;
  shadows: typeof shadows;
}

export function useStyleDeps(): StyleDeps {
  const colors = useColors();
  return useMemo(
    () => ({ colors, shadows: colors.isDark ? darkShadows : shadows }),
    [colors],
  );
}

export function useThemeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (deps: StyleDeps) => T,
): T {
  const deps = useStyleDeps();
  return useMemo(() => factory(deps), [deps]);
}
