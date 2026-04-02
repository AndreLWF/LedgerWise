import { Platform, StyleSheet } from 'react-native';
import { radius, typography } from '../theme';
import type { StyleDeps } from '../hooks/useThemeStyles';

export const createBrandedToastStyles = (deps: StyleDeps) => StyleSheet.create({
  // --- Outer positioning container ---
  positioner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
  },

  // --- Gradient wrapper (applied via LinearGradient) ---
  gradient: {
    width: 360,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    ...deps.shadows.lg,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
    } as Record<string, unknown> : {}),
  },

  // --- Top row: checkmark + text ---
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // --- Checkmark badge ---
  checkBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    } as Record<string, unknown> : {}),
  },

  // --- Heading text block ---
  textBlock: {
    flex: 1,
    gap: 2,
  },
  heading: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subheading: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // --- Transaction detail card ---
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    } as Record<string, unknown> : {}),
  },
  merchantName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  amount: {
    ...typography.amount,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
