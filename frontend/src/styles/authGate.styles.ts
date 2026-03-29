import { StyleSheet } from 'react-native';
import type { StyleDeps } from '../hooks/useThemeStyles';

export const createAuthGateStyles = (deps: StyleDeps) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: deps.colors.surface.bg,
  },
});
