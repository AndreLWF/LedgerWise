import { StyleSheet } from 'react-native';
import { isNarrow } from '../utils/responsive';
import { radius, typography } from '../theme';
import type { StyleDeps } from '../hooks/useThemeStyles';

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
  addAccountButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: deps.colors.isDark ? deps.colors.purple[700] : deps.colors.purple[200],
    backgroundColor: deps.colors.surface.card,
    ...deps.shadows.sm,
  },
  addAccountButtonHovered: {
    borderColor: deps.colors.purple[400],
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '60' : deps.colors.purple[50],
    ...deps.shadows.purple,
  },
  addAccountButtonPressed: {
    borderColor: deps.colors.brand.primary,
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '80' : deps.colors.purple[100],
  },
  addAccountText: {
    fontFamily: typography.fontFamily.semiBold,
    color: deps.colors.brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
