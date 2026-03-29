import { Platform, ViewStyle } from 'react-native';
import { purple, gold } from './colors';

type ShadowStyle = ViewStyle;

const webShadow = (boxShadow: string): ShadowStyle =>
  Platform.select({
    web: { boxShadow } as unknown as ViewStyle,
    default: {},
  }) ?? {};

const nativeShadow = (
  color: string,
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
): ShadowStyle =>
  Platform.select({
    web: {},
    default: {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
      elevation,
    },
  }) ?? {};

export const shadows = {
  sm: {
    ...webShadow('0 1px 2px 0 rgba(0, 0, 0, 0.03)'),
    ...nativeShadow('#000', 0.03, 2, 1, 1),
  },
  md: {
    ...webShadow('0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)'),
    ...nativeShadow('#000', 0.06, 6, 4, 2),
  },
  lg: {
    ...webShadow('0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'),
    ...nativeShadow('#000', 0.08, 15, 10, 4),
  },
  purple: {
    ...webShadow('0 4px 12px -2px rgba(147, 51, 234, 0.15)'),
    ...nativeShadow(purple[600], 0.15, 12, 4, 3),
  },
  gold: {
    ...webShadow('0 4px 12px -2px rgba(245, 158, 11, 0.12)'),
    ...nativeShadow(gold[500], 0.12, 12, 4, 3),
  },
} as const;

export const darkShadows = {
  sm: {
    ...webShadow('0 1px 2px 0 rgba(0, 0, 0, 0.2)'),
    ...nativeShadow('#000', 0.2, 2, 1, 1),
  },
  md: {
    ...webShadow('0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)'),
    ...nativeShadow('#000', 0.3, 6, 4, 2),
  },
  lg: {
    ...webShadow('0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.25)'),
    ...nativeShadow('#000', 0.4, 15, 10, 4),
  },
  purple: {
    ...webShadow('0 4px 14px -2px rgba(168, 85, 247, 0.3)'),
    ...nativeShadow(purple[500], 0.3, 14, 4, 3),
  },
  gold: {
    ...webShadow('0 4px 14px -2px rgba(245, 158, 11, 0.25)'),
    ...nativeShadow(gold[500], 0.25, 14, 4, 3),
  },
} as const;
