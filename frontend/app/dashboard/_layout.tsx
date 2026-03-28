import { useEffect, useState } from 'react';
import { Redirect, Slot, usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { TransactionDataProvider } from '../../src/contexts/TransactionDataContext';
import LedgerWiseLogo from '../../src/components/LedgerWiseLogo';
import { dashboardLayoutStyles as styles } from '../../src/styles/dashboardLayout.styles';
import { text, brand } from '../../src/theme';
import { isHovered } from '../../src/utils/pressable';

interface NavItem {
  name: string;
  path: '/dashboard/overview' | '/dashboard/spending' | '/dashboard/analytics' | '/dashboard/settings';
  icon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { name: 'Overview', path: '/dashboard/overview', icon: 'trending-up' },
  { name: 'Spending', path: '/dashboard/spending', icon: 'pie-chart-outline' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: 'bar-chart-outline' },
  { name: 'Settings', path: '/dashboard/settings', icon: 'settings-outline' },
];

const SIDEBAR_BREAKPOINT = 768;

export default function DashboardLayout() {
  const { session, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // On web, useWindowDimensions can return a stale/default width during SSR.
  // Default to mobile layout until the client has mounted and measured.
  const [mounted, setMounted] = useState(Platform.OS !== 'web');
  useEffect(() => { setMounted(true); }, []);

  if (!session) {
    return <Redirect href="/login" />;
  }

  const showSidebar = mounted && width >= SIDEBAR_BREAKPOINT;
  const token = session.access_token ?? null;

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  return (
    <TransactionDataProvider token={token}>
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (showSidebar ? 20 : 12) }]}>
        <View style={styles.headerLeft}>
          <LedgerWiseLogo size={showSidebar ? 32 : 26} />
          <Text style={[styles.headerTitle, !showSidebar && styles.headerTitleMobile]}>LedgerWise</Text>
        </View>
        <Pressable
          style={(state) => [
            styles.signOutButton,
            isHovered(state) && styles.signOutButtonHovered,
          ]}
          onPress={signOut}
        >
          <Ionicons name="log-out-outline" size={16} color={text.secondary} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {/* Sidebar (wide screens only) */}
        {showSidebar && (
          <View style={styles.sidebar}>
            <ScrollView style={styles.sidebarNav} showsVerticalScrollIndicator={false}>
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Pressable
                    key={item.path}
                    style={(state) => [
                      styles.navItem,
                      active && styles.navItemActive,
                      isHovered(state) && !active && styles.navItemHovered,
                    ]}
                    onPress={() => router.push(item.path)}
                  >
                    {active && <View style={styles.navActiveIndicator} />}
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={active ? brand.primary : text.tertiary}
                    />
                    <Text style={[styles.navText, active && styles.navTextActive]}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Pro Tip card */}
            <View style={styles.proTipCard}>
              <Text style={styles.proTipTitle}>Pro Tip</Text>
              <Text style={styles.proTipText}>
                Categorize all transactions to get better insights
              </Text>
            </View>
          </View>
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
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? brand.primary : text.tertiary}
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
