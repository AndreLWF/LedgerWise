import { isNarrow } from '../utils/responsive';

// Raw style definitions — spread into StyleSheet.create() calls
export const pageHeaderDefs = {
  pageHeader: {
    marginBottom: isNarrow ? 16 : 24,
  },
  pageTitle: {
    fontSize: isNarrow ? 22 : 28,
    fontWeight: '600' as const,
    color: '#0A0A0A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: isNarrow ? 13 : 15,
    color: '#737373',
  },
};
