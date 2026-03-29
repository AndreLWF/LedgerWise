import { StyleSheet } from 'react-native';
import { isNarrow } from '../utils/responsive';
import { pageHeaderDefs, placeholderDefs } from './shared.styles';
import { radius, typography } from '../theme';
import type { StyleDeps } from '../hooks/useThemeStyles';

export const createOverviewStyles = (deps: StyleDeps) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: isNarrow ? 16 : 24,
    paddingTop: isNarrow ? 16 : 24,
    paddingBottom: 40,
  },
  ...pageHeaderDefs(deps),

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isNarrow ? 8 : 12,
    marginBottom: isNarrow ? 16 : 24,
  },

  // Alert card
  alertCard: {
    flexDirection: 'row',
    backgroundColor: deps.colors.isDark ? deps.colors.gold[900] + '30' : deps.colors.gold[50],
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: deps.colors.isDark ? deps.colors.gold[700] + '50' : deps.colors.gold[300],
    padding: 20,
    gap: 16,
    marginBottom: 24,
    ...deps.shadows.gold,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: deps.colors.isDark ? deps.colors.surface.elevated + 'CC' : deps.colors.surface.card + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
    ...deps.shadows.sm,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    fontWeight: '700',
    color: deps.colors.isDark ? deps.colors.gold[300] : deps.colors.gold[900],
    marginBottom: 4,
  },
  alertText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: deps.colors.isDark ? deps.colors.gold[400] : deps.colors.gold[800],
    lineHeight: 22,
  },

  // Placeholder (shared with Analytics, Settings)
  ...placeholderDefs(deps),
});
