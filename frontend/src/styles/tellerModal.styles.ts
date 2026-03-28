import { StyleSheet } from 'react-native';
import { surface, brand, text } from '../theme';

export const tellerModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surface.card,
  },
  closeButton: {
    padding: 16,
    alignItems: 'flex-end',
  },
  closeButtonText: {
    color: brand.primary,
    fontSize: 16,
  },
  webView: {
    flex: 1,
  },
});
