import { useCallback, useEffect, useRef, useState } from 'react';
import { Redirect, Slot, usePathname, useRouter } from 'expo-router';
import { Animated, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useColors } from '../../src/contexts/ThemeContext';
import { TransactionDataProvider } from '../../src/contexts/TransactionDataContext';
import { useThemeStyles } from '../../src/hooks/useThemeStyles';
import { createDashboardLayoutStyles, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../../src/styles/dashboardLayout.styles';
import LedgerWiseLogo from '../../src/components/icons/LedgerWiseLogo';
import ThemeToggle from '../../src/components/ThemeToggle';
import { isHovered } from '../../src/utils/pressable';
import { SIDEBAR_BREAKPOINT } from '../../src/utils/responsive';

interface NavItem {
  name: string;
  path: '/dashboard/spending' | '/dashboard/analytics' | '/dashboard/categorize' | '/dashboard/accounts' | '/dashboard/settings';
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { name: 'Spending', path: '/dashboard/spending', icon: 'pie-chart-outline', activeIcon: 'pie-chart' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'Categorize', path: '/dashboard/categorize', icon: 'pricetags-outline', activeIcon: 'pricetags' },
  { name: 'Accounts', path: '/dashboard/accounts', icon: 'wallet-outline', activeIcon: 'wallet' },
  { name: 'Settings', path: '/dashboard/settings', icon: 'settings-outline', activeIcon: 'settings' },
];

const getInitialCollapsed = () => {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  }
  return false;
};

export default function DashboardLayout() {
  const { session, signOut } = useAuth();
  const colors = useColors();
  const styles = useThemeStyles(createDashboardLayoutStyles);
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // On web, useWindowDimensions can return a stale/default width during SSR.
  // Default to mobile layout until the client has mounted and measured.
  const [mounted, setMounted] = useState(Platform.OS !== 'web');
  useEffect(() => { setMounted(true); }, []);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialCollapsed);

  const sidebarAnim = useRef(
    new Animated.Value(getInitialCollapsed() ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH)
  ).current;

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem('sidebarCollapsed', String(next));
      }
      Animated.timing(sidebarAnim, {
        toValue: next ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return next;
    });
  }, [sidebarAnim]);

  if (!session) {
    return <Redirect href="/login" />;
  }

  const showSidebar = mounted && width >= SIDEBAR_BREAKPOINT;
  const collapsedSidebar = showSidebar && sidebarCollapsed;
  const token = session.access_token ?? null;

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  return (
    <TransactionDataProvider token={token}>
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (showSidebar ? 20 : 12) }]}>
        <View style={styles.headerLeft}>
          <LedgerWiseLogo size={showSidebar ? 38 : 34} />
          <Text style={[styles.headerTitle, !showSidebar && styles.headerTitleMobile]}>LedgerWise</Text>
        </View>
        <View style={styles.headerRight}>
          <ThemeToggle />
          <Pressable
            style={(state) => [
              styles.signOutButton,
              isHovered(state) && styles.signOutButtonHovered,
            ]}
            onPress={signOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        {/* Sidebar (wide screens only) */}
        {showSidebar && (
          <Animated.View style={[styles.sidebar, collapsedSidebar && styles.sidebarCollapsed, { width: sidebarAnim }]}>
            <ScrollView style={styles.sidebarNav} showsVerticalScrollIndicator={false}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Pressable
                    key={item.path}
                    style={(state) => [
                      styles.navItem,
                      collapsedSidebar && styles.navItemCollapsed,
                      active && styles.navItemActive,
                      isHovered(state) && !active && styles.navItemHovered,
                    ]}
                    onPress={() => router.push(item.path)}
                    accessibilityRole="tab"
                    accessibilityLabel={item.name}
                    accessibilityState={{ selected: active }}
                  >
                    {active && <View style={styles.navActiveIndicator} />}
                    <Ionicons
                      name={item.icon}
                      size={collapsedSidebar ? 22 : 20}
                      color={active ? colors.brand.primary : colors.text.tertiary}
                    />
                    {!collapsedSidebar && (
                      <Text style={[styles.navText, active && styles.navTextActive]}>
                        {item.name}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Bottom section: toggle */}
            <View style={styles.sidebarBottom}>
              <View style={[styles.collapseToggleRow, collapsedSidebar && styles.collapseToggleRowCollapsed]}>
                <Pressable
                  style={(state) => [
                    styles.collapseToggle,
                    isHovered(state) && styles.collapseToggleHovered,
                  ]}
                  onPress={toggleSidebar}
                  accessibilityRole="button"
                  accessibilityLabel={collapsedSidebar ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <Ionicons
                    name={collapsedSidebar ? 'chevron-forward' : 'chevron-back'}
                    size={16}
                    color={colors.text.tertiary}
                  />
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Main content */}
        <View style={styles.content}>
          <Slot />
        </View>
      </View>

      {/* Bottom tabs (narrow screens) */}
      {!showSidebar && (
        <View style={styles.bottomBar}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Pressable
                key={item.path}
                style={styles.bottomTab}
                onPress={() => router.push(item.path)}
                accessibilityRole="tab"
                accessibilityLabel={item.name}
                accessibilityState={{ selected: active }}
              >
                <Ionicons
                  name={item.activeIcon}
                  size={26}
                  color={active ? colors.brand.primary : colors.text.tertiary}
                />
                <Text style={[styles.bottomTabText, active && styles.bottomTabTextActive]}>
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
    </TransactionDataProvider>
  );
}
