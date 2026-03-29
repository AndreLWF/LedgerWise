import { StyleSheet } from 'react-native';
import { isNarrow } from '../utils/responsive';
import { pageHeaderDefs, placeholderDefs } from './shared.styles';
import type { StyleDeps } from '../hooks/useThemeStyles';

export const createPlaceholderStyles = (deps: StyleDeps) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: isNarrow ? 16 : 24,
    paddingTop: isNarrow ? 16 : 24,
    paddingBottom: 40,
  },
  ...pageHeaderDefs(deps),
  ...placeholderDefs(deps),
});
