import { Platform, StyleSheet } from 'react-native';
import { isNarrow } from '../utils/responsive';
import { pageHeaderDefs } from './shared.styles';

export const overviewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: isNarrow ? 16 : 24,
    paddingTop: isNarrow ? 16 : 24,
    paddingBottom: 40,
  },
  ...pageHeaderDefs,

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isNarrow ? 8 : 12,
    marginBottom: isNarrow ? 16 : 24,
  },

  // Alert card
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      },
    }),
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },

  // Placeholder
  placeholderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: isNarrow ? 28 : 48,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      },
    }),
  },
  placeholderIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#0A0A0A',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 15,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 22,
  },
});
