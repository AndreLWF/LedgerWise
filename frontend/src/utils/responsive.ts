import { Dimensions, Platform } from 'react-native';

const NARROW_BREAKPOINT = 600;

// On web SSR, Dimensions returns a default width. Use window.innerWidth for accuracy.
export const windowWidth = Platform.OS === 'web'
  ? (typeof window !== 'undefined' ? window.innerWidth : 0)
  : Dimensions.get('window').width;

export const isNarrow = windowWidth < NARROW_BREAKPOINT;
