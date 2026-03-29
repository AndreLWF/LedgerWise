import { StyleSheet } from 'react-native';
import { radius, typography } from '../theme';
import type { StyleDeps } from '../hooks/useThemeStyles';

export const createTimePeriodStyles = (deps: StyleDeps) => StyleSheet.create({
  // Trigger button
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: deps.colors.surface.card,
    borderWidth: 2,
    borderColor: deps.colors.border.default,
    borderRadius: radius.md,
    ...deps.shadows.sm,
  },
  triggerHovered: {
    borderColor: deps.colors.purple[400],
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '60' : deps.colors.purple[50],
    ...deps.shadows.purple,
  },
  triggerPressed: {
    borderColor: deps.colors.brand.primary,
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '80' : deps.colors.purple[100],
  },
  triggerText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    fontWeight: '500',
    color: deps.colors.text.primary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: deps.colors.overlay.backdrop,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: deps.colors.surface.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...deps.shadows.lg,
  },

  // Segmented control
  segmentedControlWrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: deps.colors.border.default,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: deps.colors.surface.bg,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: deps.colors.brand.secondary,
    ...deps.shadows.gold,
  },
  segmentButtonHovered: {
    backgroundColor: deps.colors.isDark ? deps.colors.gold[900] + '40' : deps.colors.gold[100],
  },
  segmentButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: deps.colors.text.tertiary,
  },
  segmentButtonTextActive: {
    color: deps.colors.text.inverse,
  },
  segmentButtonTextHovered: {
    color: deps.colors.text.primary,
  },

  // All time mode
  allTimeContainer: {
    padding: 24,
    alignItems: 'center',
  },
  allTimeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '60' : deps.colors.purple[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...deps.shadows.purple,
  },
  allTimeTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    fontWeight: '700',
    color: deps.colors.text.primary,
    marginBottom: 8,
  },
  allTimeSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: deps.colors.text.secondary,
    marginBottom: 24,
  },
  applyButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: deps.colors.brand.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    ...deps.shadows.purple,
  },
  applyButtonPressed: {
    backgroundColor: deps.colors.isDark ? deps.colors.purple[400] : deps.colors.purple[700],
  },
  applyButtonText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: deps.colors.text.inverse,
  },

  // Grid container (year + month modes)
  gridContainer: {
    padding: 20,
  },

  // Year navigation (month mode)
  yearNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  yearNavButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearNavButtonHovered: {
    backgroundColor: deps.colors.surface.bg,
  },
  yearNavButtonDisabled: {
    opacity: 0.3,
  },
  yearNavText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    fontWeight: '700',
    color: deps.colors.text.primary,
  },

  // Grids (year and month share the same layout)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Grid items
  gridItem: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: 16,
    borderRadius: radius.md,
    backgroundColor: deps.colors.surface.bg,
    alignItems: 'center',
  },
  gridItemHovered: {
    backgroundColor: deps.colors.isDark ? deps.colors.purple[900] + '60' : deps.colors.purple[100],
  },
  gridItemActive: {
    backgroundColor: deps.colors.brand.primary,
    ...deps.shadows.purple,
  },
  gridItemDisabled: {
    backgroundColor: deps.colors.surface.bg,
    opacity: 0.4,
  },
  gridItemText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: deps.colors.text.primary,
  },
  gridItemTextHovered: {
    color: deps.colors.isDark ? deps.colors.purple[300] : deps.colors.purple[700],
  },
  gridItemTextActive: {
    color: deps.colors.text.inverse,
  },
  gridItemTextDisabled: {
    color: deps.colors.text.tertiary,
  },
});
