import { PressableStateCallbackType } from 'react-native';

/**
 * Extract the web-only `hovered` flag from a Pressable render callback state.
 * React Native Web extends PressableStateCallbackType with { hovered: boolean }
 * but the core RN types don't include it — this avoids the verbose cast everywhere.
 */
export function isHovered(state: PressableStateCallbackType): boolean {
  return (state as unknown as { hovered: boolean }).hovered ?? false;
}
