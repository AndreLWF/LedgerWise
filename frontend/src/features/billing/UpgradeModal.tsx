import { useCallback, useRef, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useColors } from '../../contexts/ThemeContext';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import { createCheckoutSession } from '../../api/client';
import { STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY } from '../../config/stripe';
import { isHovered } from '../../utils/pressable';
import PlanCard from './components/PlanCard';
import { createBillingStyles } from './styles/billing.styles';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  const { session } = useAuth();
  const colors = useColors();
  const styles = useThemeStyles(createBillingStyles);
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stopPropagation = useRef(() => {}).current;

  const handleSubscribe = useCallback(async (priceId: string) => {
    const token = session?.access_token;
    if (!token) return;

    setLoadingPriceId(priceId);
    setError(null);
    try {
      const checkoutUrl = await createCheckoutSession(token, priceId);
      if (!checkoutUrl.startsWith('https://checkout.stripe.com/')) {
        throw new Error('Invalid checkout URL');
      }
      await Linking.openURL(checkoutUrl);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingPriceId(null);
    }
  }, [session?.access_token]);

  const handleClose = useCallback(() => {
    setError(null);
    setLoadingPriceId(null);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Close upgrade modal"
      >
        <Pressable
          style={styles.modalContainer}
          onPress={stopPropagation}
          accessibilityRole="none"
          importantForAccessibility="no"
        >
          {/* Close button */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderSpacer} />
            <View style={styles.modalTitleRow}>
              <Text style={styles.pageTitle}>Upgrade to Pro</Text>
            </View>
            <Pressable
              style={(state) => [
                styles.closeButton,
                isHovered(state) && styles.closeButtonHovered,
              ]}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={20} color={colors.text.secondary} />
            </Pressable>
          </View>

          <Text style={styles.pageSubtitle}>
            Unlock the full power of LedgerWise with a Pro subscription.
          </Text>

          {error && (
            <View
              style={styles.errorBanner}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ScrollView
            style={styles.modalScrollArea}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.cardsRow}>
              <PlanCard
                name="Monthly"
                price="$3"
                period="/month"
                priceId={STRIPE_PRICE_MONTHLY}
                loading={loadingPriceId === STRIPE_PRICE_MONTHLY}
                onSubscribe={handleSubscribe}
              />
              <PlanCard
                name="Yearly"
                price="$30"
                period="/year"
                savings="Save $6/year"
                highlighted
                priceId={STRIPE_PRICE_YEARLY}
                loading={loadingPriceId === STRIPE_PRICE_YEARLY}
                onSubscribe={handleSubscribe}
              />
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
