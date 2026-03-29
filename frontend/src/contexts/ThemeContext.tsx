import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { purple, gold, surface, text, border, brand, semantic, overlay } from '../theme/colors';
import { darkSurface, darkText, darkBorder, darkBrand, darkSemantic, darkOverlay } from '../theme/darkColors';

type ThemeMode = 'light' | 'dark' | 'system';

// Widen `as const` literal types to plain string records
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export interface ThemeColors {
  purple: Widen<typeof purple>;
  gold: Widen<typeof gold>;
  surface: Widen<typeof surface>;
  text: Widen<typeof text>;
  border: Widen<typeof border>;
  brand: Widen<typeof brand>;
  semantic: Widen<typeof semantic>;
  overlay: Widen<typeof overlay>;
  isDark: boolean;
}

const lightColors: ThemeColors = {
  purple,
  gold,
  surface,
  text,
  border,
  brand,
  semantic,
  overlay,
  isDark: false,
};

const darkColors: ThemeColors = {
  purple,
  gold,
  surface: darkSurface,
  text: darkText,
  border: darkBorder,
  brand: darkBrand,
  semantic: darkSemantic,
  overlay: darkOverlay,
  isDark: true,
};

interface ThemeContextValue {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'ledgerwise-theme-mode';

function loadSavedMode(): ThemeMode {
  if (Platform.OS !== 'web') return 'system';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {}
  return 'system';
}

function saveMode(mode: ThemeMode): void {
  if (Platform.OS !== 'web') return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(loadSavedMode);

  const isDark = mode === 'system'
    ? systemColorScheme === 'dark'
    : mode === 'dark';

  const colors = isDark ? darkColors : lightColors;

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    saveMode(newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, mode, isDark, toggleTheme, setMode }),
    [colors, mode, isDark, toggleTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useColors(): ThemeColors {
  return useTheme().colors;
}
