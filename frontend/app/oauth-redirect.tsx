import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlaidLink as usePlaidLinkWeb } from 'react-plaid-link';
import type { PlaidLinkOnSuccess, PlaidLinkOnExit } from 'react-plaid-link';
import { useAuth } from '../src/contexts/AuthContext';
import { useColors } from '../src/contexts/ThemeContext';
import { useThemeStyles } from '../src/hooks/useThemeStyles';
import { createPlaidLinkToken, exchangePlaidToken } from '../src/api/client';
import type { StyleDeps } from '../src/hooks/useThemeStyles';

const createOAuthRedirectStyles = (deps: StyleDeps) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: deps.colors.surface.bg,
  },
  status: {
    marginTop: 16,
    fontSize: 16,
    color: deps.colors.text.secondary,
  },
});

export default function OAuthRedirect() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const colors = useColors();
  const styles = useThemeStyles(createOAuthRedirectStyles);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState('Completing bank connection...');
  const receivedRedirectUri = useRef<string | null>(null);
  const initiated = useRef(false);

  // Capture the full URL on mount (includes Plaid's oauth_state_id query param)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      receivedRedirectUri.current = window.location.href;
    }
  }, []);

  // Once auth is resolved, request a new link token for OAuth re-init
  useEffect(() => {
    if (authLoading) return;

    if (!session) {
      router.replace('/login');
      return;
    }

    if (initiated.current) return;
    initiated.current = true;

    const redirectUri = receivedRedirectUri.current;
    if (!redirectUri) {
      setStatus('Missing redirect information. Redirecting...');
      router.replace('/dashboard/spending');
      return;
    }

    const token = session.access_token;
    createPlaidLinkToken(token, redirectUri)
      .then((newLinkToken) => {
        setLinkToken(newLinkToken);
      })
      .catch(() => {
        setStatus('Failed to reconnect. Redirecting...');
        router.replace('/dashboard/spending');
      });
  }, [authLoading, session, router]);

  const handleSuccess: PlaidLinkOnSuccess = useCallback(async (publicToken) => {
    if (!session) return;
    setStatus('Linking account...');
    try {
      await exchangePlaidToken(session.access_token, publicToken);
      router.replace('/dashboard/spending');
    } catch {
      setStatus('Connection failed. Redirecting...');
      router.replace('/dashboard/spending');
    }
  }, [session, router]);

  const handleExit: PlaidLinkOnExit = useCallback(() => {
    router.replace('/dashboard/spending');
  }, [router]);

  const { open, ready } = usePlaidLinkWeb({
    token: linkToken,
    receivedRedirectUri: receivedRedirectUri.current ?? undefined,
    onSuccess: handleSuccess,
    onExit: handleExit,
  });

  // Auto-open Plaid Link once the SDK is ready with the new token
  const hasOpened = useRef(false);
  useEffect(() => {
    if (linkToken && ready && !hasOpened.current) {
      hasOpened.current = true;
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <View
      style={styles.container}
      accessibilityLabel="Bank connection in progress"
    >
      <ActivityIndicator size="large" color={colors.brand.primary} />
      <Text style={styles.status}>
        {status}
      </Text>
    </View>
  );
}
