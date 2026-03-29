import { isNarrow } from '../utils/responsive';
import { typography } from '../theme';
import type { StyleDeps } from '../hooks/useThemeStyles';

// Raw style definitions — spread into StyleSheet.create() calls
export const pageHeaderDefs = (deps: StyleDeps) => ({
  pageHeader: {
    marginBottom: isNarrow ? 36 : 44,
  },
  pageTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: isNarrow ? 22 : 32,
    fontWeight: '700' as const,
    color: deps.colors.text.primary,
    letterSpacing: -0.96,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: isNarrow ? 13 : 15,
    color: deps.colors.text.secondary,
  },
});

// Placeholder card — used by stub pages (Analytics, Settings, Overview empty state)
export const placeholderDefs = (deps: StyleDeps) => ({
  placeholderCard: {
    backgroundColor: deps.colors.surface.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: deps.colors.border.default,
    padding: isNarrow ? 28 : 48,
    alignItems: 'center' as const,
    ...deps.shadows.md,
  },
  placeholderIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '60' : deps.colors.purple[100],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    ...deps.shadows.purple,
  },
  placeholderTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    fontWeight: '700' as const,
    color: deps.colors.text.primary,
    marginBottom: 8,
  },
  placeholderText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: deps.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
});
