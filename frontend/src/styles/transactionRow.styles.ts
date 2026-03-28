import { StyleSheet } from 'react-native';
import { surface, text, border, semantic, shadows, radius } from '../theme';

export const transactionRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: surface.card,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: border.default,
    ...shadows.sm,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: text.primary,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    color: text.tertiary,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  debit: {
    color: semantic.error,
  },
  credit: {
    color: semantic.success,
  },
});
