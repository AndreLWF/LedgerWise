import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, Text, View } from 'react-native';
import { type TimePeriod, periodToDateRange } from '../../src/components/TimePeriodSelector';
import TellerModal from '../../src/components/TellerModal';
import SpendingSummary from '../../src/spending';
import { enrollAccount } from '../../src/api/client';
import { useTellerConnect } from '../../src/hooks/useTellerConnect';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTransactionData, useDataSlice } from '../../src/contexts/TransactionDataContext';
import { spendingScreenStyles as styles } from '../../src/styles/spendingScreen.styles';

export default function SpendingScreen() {
  const [tellerError, setTellerError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>({
    type: 'all',
    year: new Date().getFullYear(),
  });
  const { session } = useAuth();
  const token = session?.access_token ?? null;
  const dateRange = useMemo(() => periodToDateRange(selectedPeriod), [selectedPeriod]);

  const { hasAccounts, accountsLoading, error: dataError, refresh } = useTransactionData();
  const { transactions, summaryData, loading: sliceLoading } = useDataSlice(dateRange);

  const {
    showWebView, tellerSource,
    openTellerConnect, handleWebViewMessage, closeWebView,
  } = useTellerConnect(
    async (accessToken: string) => {
      setTellerError(null);
      try {
        await enrollAccount(token!, accessToken);
        refresh();
      } catch (err) {
        setTellerError(
          err instanceof Error ? err.message : 'Failed to enroll account',
        );
      }
    },
    setTellerError,
  );

  const error = tellerError || dataError;

  return (
    <View style={styles.container}>
      {!hasAccounts && !accountsLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Connect a bank account to see your spending
          </Text>
          <Pressable
            style={({ pressed }) => [styles.connectButton, pressed && styles.connectButtonPressed]}
            onPress={openTellerConnect}
          >
            <Text style={styles.connectButtonText}>Connect Bank</Text>
          </Pressable>
        </View>
      )}

      {accountsLoading && !hasAccounts && (
        <ActivityIndicator style={styles.spinner} size="large" color="#6366F1" />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {hasAccounts && (
        <SpendingSummary
          data={summaryData}
          transactions={transactions}
          loading={sliceLoading}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      )}

      {hasAccounts && (
        <Pressable
          style={({ pressed }) => [styles.addAccountButton, pressed && styles.addAccountButtonPressed]}
          onPress={openTellerConnect}
        >
          <Text style={styles.addAccountText}>+ Add Account</Text>
        </Pressable>
      )}

      {Platform.OS !== 'web' && (
        <TellerModal
          visible={showWebView}
          tellerSource={tellerSource}
          onMessage={handleWebViewMessage}
          onClose={closeWebView}
        />
      )}
    </View>
  );
}
