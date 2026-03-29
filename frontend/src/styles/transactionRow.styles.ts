import { StyleSheet } from 'react-native';
import { radius, typography } from '../theme';
import type { StyleDeps } from '../hooks/useThemeStyles';

export const createTransactionRowStyles = (deps: StyleDeps) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: deps.colors.surface.card,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: deps.colors.border.default,
    ...deps.shadows.sm,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    fontWeight: '500',
    color: deps.colors.text.primary,
  },
  meta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    fontWeight: '400',
    color: deps.colors.text.tertiary,
    marginTop: 2,
  },
  amount: {
    ...typography.amount,
    fontSize: 15,
  },
  debit: {
    color: deps.colors.semantic.error,
  },
  credit: {
    color: deps.colors.semantic.success,
  },
});
