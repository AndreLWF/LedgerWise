import { StyleSheet } from 'react-native';
import { isNarrow } from '../../../utils/responsive';
import { radius, typography } from '../../../theme';
import type { StyleDeps } from '../../../hooks/useThemeStyles';

export const createSpendingScreenStyles = (deps: StyleDeps) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isNarrow ? 16 : 24,
    paddingTop: isNarrow ? 16 : 24,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: deps.colors.text.secondary,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: deps.colors.brand.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.md,
    ...deps.shadows.purple,
  },
  connectButtonPressed: {
    backgroundColor: deps.colors.isDark ? deps.colors.purple[400] : deps.colors.purple[700],
  },
  connectButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    color: deps.colors.text.inverse,
    fontSize: 15,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 40,
  },
  errorText: {
    color: deps.colors.semantic.error,
    marginTop: 16,
    textAlign: 'center',
  },
});
