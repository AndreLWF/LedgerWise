import { StyleSheet } from 'react-native';
import { isNarrow } from '../../../utils/responsive';
import { radius, typography } from '../../../theme';
import type { StyleDeps } from '../../../hooks/useThemeStyles';

export const createBillingStyles = (deps: StyleDeps) => StyleSheet.create({
  pageTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 22,
    fontWeight: '700',
    color: deps.colors.text.primary,
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: deps.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },

  // --- Modal ---
  backdrop: {
    flex: 1,
    backgroundColor: deps.colors.overlay.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isNarrow ? 16 : 24,
  },
  modalContainer: {
    backgroundColor: deps.colors.surface.card,
    borderRadius: radius.xl,
    padding: isNarrow ? 20 : 32,
    maxWidth: 660,
    width: '100%',
    maxHeight: '90%',
    ...deps.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalHeaderSpacer: {
    width: 36,
  },
  modalTitleRow: {
    flex: 1,
    alignItems: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonHovered: {
    backgroundColor: deps.colors.isDark
      ? deps.colors.surface.elevated + '80'
      : deps.colors.purple[50],
  },
  modalScrollArea: {
    marginTop: 16,
  },
  modalScrollContent: {
    paddingBottom: 8,
  },

  // --- Error banner ---
  errorBanner: {
    backgroundColor: deps.colors.isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    maxWidth: 600,
    width: '100%',
  },
  errorText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500',
    color: deps.colors.isDark ? '#FCA5A5' : '#DC2626',
    textAlign: 'center',
  },

  // --- Plan cards container ---
  cardsRow: {
    flexDirection: 'row',
    gap: isNarrow ? 10 : 16,
    maxWidth: 600,
    width: '100%',
    alignItems: 'stretch',
  },

  // --- Plan card ---
  planCard: {
    flex: 1,
    backgroundColor: deps.colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: deps.colors.border.default,
    padding: isNarrow ? 12 : 24,
    alignItems: 'center',
    ...deps.shadows.md,
  },
  planCardHighlighted: {
    borderColor: deps.colors.gold[400],
    borderWidth: 2,
    ...deps.shadows.gold,
  },
  badgeZone: {
    height: isNarrow ? 26 : 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bestValueBadge: {
    backgroundColor: deps.colors.isDark ? deps.colors.gold[900] + '50' : deps.colors.gold[50],
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bestValueText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: isNarrow ? 10 : 12,
    fontWeight: '600',
    color: deps.colors.isDark ? deps.colors.gold[300] : deps.colors.gold[700],
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  planName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: isNarrow ? 16 : 20,
    fontWeight: '700',
    color: deps.colors.text.primary,
    marginBottom: isNarrow ? 4 : 8,
  },
  planPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: isNarrow ? 30 : 36,
    fontWeight: '700',
    color: deps.colors.text.primary,
    letterSpacing: -1,
  },
  planPeriod: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: deps.colors.text.tertiary,
    marginBottom: 4,
  },
  savingsZone: {
    height: 20,
    justifyContent: 'center',
    marginTop: 4,
  },
  planSavings: {
    fontFamily: typography.fontFamily.medium,
    fontSize: isNarrow ? 11 : 13,
    fontWeight: '500',
    color: deps.colors.isDark ? deps.colors.gold[300] : deps.colors.gold[600],
  },
  planDivider: {
    width: '100%',
    height: 1,
    backgroundColor: deps.colors.border.subtle,
    marginVertical: isNarrow ? 12 : 16,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: isNarrow ? 5 : 8,
    alignSelf: 'flex-start',
  },
  planFeatureText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: isNarrow ? 12 : 14,
    color: deps.colors.text.secondary,
  },

  // --- Subscribe button ---
  buttonSpacer: {
    flex: 1,
  },
  subscribeButton: {
    marginTop: isNarrow ? 14 : 20,
    width: '100%',
    paddingVertical: isNarrow ? 12 : 14,
    borderRadius: radius.md,
    backgroundColor: deps.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...deps.shadows.purple,
  },
  subscribeButtonHighlighted: {
    backgroundColor: deps.colors.isDark ? deps.colors.gold[600] : deps.colors.gold[500],
    ...deps.shadows.gold,
  },
  subscribeButtonHovered: {
    backgroundColor: deps.colors.brand.primaryHover,
  },
  subscribeButtonHighlightedHovered: {
    backgroundColor: deps.colors.isDark ? deps.colors.gold[700] : deps.colors.gold[600],
  },
  subscribeButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    fontWeight: '600',
    color: deps.colors.text.inverse,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },

  // --- Loading ---
  loadingOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500',
    color: deps.colors.text.inverse,
  },
});
