import { StyleSheet } from 'react-native';
import { isNarrow } from '../utils/responsive';
import { text, brand, purple, border, surface, semantic, shadows, radius } from '../theme';

export const spendingScreenStyles = StyleSheet.create({
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
    fontSize: 16,
    color: text.secondary,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: brand.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.md,
    ...shadows.purple,
  },
  connectButtonPressed: {
    backgroundColor: purple[700],
  },
  connectButtonText: {
    color: text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginTop: 40,
  },
  errorText: {
    color: semantic.error,
    marginTop: 16,
    textAlign: 'center',
  },
  addAccountButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: purple[200],
    backgroundColor: surface.card,
    ...shadows.sm,
  },
  addAccountButtonHovered: {
    borderColor: purple[400],
    backgroundColor: purple[50],
    ...shadows.purple,
  },
  addAccountButtonPressed: {
    borderColor: brand.primary,
    backgroundColor: purple[100],
  },
  addAccountText: {
    color: brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
