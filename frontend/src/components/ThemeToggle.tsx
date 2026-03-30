import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { createDashboardLayoutStyles } from '../styles/dashboardLayout.styles';
import { isHovered } from '../utils/pressable';

export default function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();
  const styles = useThemeStyles(createDashboardLayoutStyles);
  const rotation = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [isDark]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Pressable
      style={(state) => [
        styles.themeToggle,
        isHovered(state) && styles.themeToggleHovered,
      ]}
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={20}
          color={isDark ? colors.gold[400] : colors.purple[600]}
        />
      </Animated.View>
    </Pressable>
  );
}
