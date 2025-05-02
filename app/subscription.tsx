import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  useColorScheme,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Check, 
  ChevronLeft, 
  Lock, 
  ShoppingCart,
  User
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/utils/i18n';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import {
  getAvailableProducts,
  purchaseSubscription,
  SUBSCRIPTION_SKUS
} from '@/utils/purchases';

// Product type definition
interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  localizedPrice: string;
  subscriptionPeriodNumberIOS?: string;
  subscriptionPeriodUnitIOS?: string;
  introductoryPrice?: string;
  introductoryPriceAsAmountIOS?: string;
  introductoryPricePaymentModeIOS?: string;
  introductoryPriceNumberOfPeriodsIOS?: string;
  introductoryPriceSubscriptionPeriodIOS?: string;
  subscriptionPeriodAndroid?: string;
  introductoryPriceCyclesAndroid?: string;
  introductoryPricePeriodAndroid?: string;
  freeTrialPeriodAndroid?: string;
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { activateSubscription, isPremium, isGuest } = useUserStore();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Fetch available products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const availableProducts = await getAvailableProducts();
        setProducts(availableProducts);
        
        // Set the first product as selected by default
        if (availableProducts.length > 0) {
          setSelectedProductId(availableProducts[0].productId);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        Alert.alert(
          t('error'),
          t('subscription_products_fetch_error'),
          [{ text: t('ok') }]
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!selectedProductId) {
      Alert.alert(
        t('error'),
        t('subscription_select_plan'),
        [{ text: t('ok') }]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        // For mobile platforms, use in-app purchases
        setPurchaseInProgress(true);
        
        try {
          await purchaseSubscription(selectedProductId);
          
          // Note: The purchase will be processed by the purchaseUpdatedListener in utils/purchases.ts
          // which will update the user's subscription status
          
          Alert.alert(
            t('subscription_success_title'),
            Platform.OS === 'android' 
              ? t('subscription_success_message_google_play')
              : t('subscription_success_message_apple'),
            [
              { 
                text: t('ok'), 
                onPress: () => router.push('/') 
              }
            ]
          );
        } catch (error: any) {
          console.error('Purchase error:', error);
          
          // Check if user canceled the purchase
          if (error.code === 'E_USER_CANCELLED') {
            Alert.alert(
              t('subscription_cancelled_title'),
              t('subscription_cancelled_message'),
              [{ text: t('ok') }]
            );
          } else {
            Alert.alert(
              t('error'),
              t('subscription_purchase_error'),
              [{ text: t('ok') }]
            );
          }
        }
      } else {
        // For web or unsupported platforms, show a message
        Alert.alert(
          t('subscription_platform_error'),
          t('subscription_mobile_only'),
          [{ text: t('ok') }]
        );
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert(
        t('error'),
        t('subscription_general_error'),
        [{ text: t('ok') }]
      );
    } finally {
      setIsLoading(false);
      setPurchaseInProgress(false);
    }
  };
  
  // If already subscribed, show a different message
  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('subscription_title')}
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.alreadySubscribedContainer}>
          {isGuest ? (
            <User size={64} color={colors.success} />
          ) : (
            <Check size={64} color={colors.success} />
          )}
          
          <Text style={[styles.alreadySubscribedTitle, { color: colors.text }]}>
            {isGuest ? t('guest_mode_active') : t('subscription_already_subscribed')}
          </Text>
          
          <Text style={[styles.alreadySubscribedMessage, { color: colors.textSecondary }]}>
            {isGuest 
              ? t('guest_mode_description') 
              : t('subscription_already_subscribed_message')}
          </Text>
          
          <Button
            title={t('back_to_home')}
            onPress={() => router.push('/')}
            variant="primary"
            size="large"
            style={styles.backToHomeButton}
            fullWidth
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('subscription_title')}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Lock size={48} color={colors.primary} />
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {t('subscription_hero_title')}
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            {t('subscription_hero_subtitle')}
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {t('loading_products')}
            </Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {products.length > 0 ? (
              products.map((product) => (
                <TouchableOpacity
                  key={product.productId}
                  style={[
                    styles.planCard,
                    { 
                      backgroundColor: colors.card,
                      borderColor: selectedProductId === product.productId ? colors.primary : colors.border,
                      borderWidth: selectedProductId === product.productId ? 2 : 1
                    }
                  ]}
                  onPress={() => setSelectedProductId(product.productId)}
                >
                  <View style={styles.planHeader}>
                    <Text style={[styles.planTitle, { color: colors.text }]}>
                      {product.title}
                    </Text>
                    <View style={[
                      styles.planCheckbox,
                      { 
                        backgroundColor: selectedProductId === product.productId ? colors.primary : 'transparent',
                        borderColor: selectedProductId === product.productId ? colors.primary : colors.border
                      }
                    ]}>
                      {selectedProductId === product.productId && (
                        <Check size={16} color="#FFF" />
                      )}
                    </View>
                  </View>
                  
                  <Text style={[styles.planPrice, { color: colors.text }]}>
                    {product.localizedPrice}
                    {Platform.OS === 'android' && product.subscriptionPeriodAndroid && (
                      <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                        {' / '}
                        {product.subscriptionPeriodAndroid.includes('P1W') ? t('week') :
                         product.subscriptionPeriodAndroid.includes('P1M') ? t('month') :
                         product.subscriptionPeriodAndroid.includes('P1Y') ? t('year') : t('period')}
                      </Text>
                    )}
                    {Platform.OS === 'ios' && product.subscriptionPeriodUnitIOS && (
                      <Text style={[styles.planPeriod, { color: colors.textSecondary }]}>
                        {' / '}
                        {product.subscriptionPeriodUnitIOS === 'WEEK' ? t('week') :
                         product.subscriptionPeriodUnitIOS === 'MONTH' ? t('month') :
                         product.subscriptionPeriodUnitIOS === 'YEAR' ? t('year') : t('period')}
                      </Text>
                    )}
                  </Text>
                  
                  <Text style={[styles.planDescription, { color: colors.textSecondary }]}>
                    {product.description}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={[styles.noProductsContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.noProductsText, { color: colors.text }]}>
                  {t('subscription_no_products')}
                </Text>
              </View>
            )}
            
            <View
              style={[
                styles.planCard,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.primary,
                  borderWidth: 2
                }
              ]}
            >
              <View style={styles.planHeader}>
                <Text style={[styles.planTitle, { color: colors.text }]}>
                  {t('subscription_premium_title')}
                </Text>
                <View style={[
                  styles.planCheckbox,
                  { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  }
                ]}>
                  <Check size={16} color="#FFF" />
                </View>
              </View>
              
              <Text style={[styles.planPrice, { color: colors.text }]}>
                7,99 zł / {t('week')}
              </Text>
              
              <Text style={[styles.planDescription, { color: colors.textSecondary }]}>
                {t('subscription_premium_description')}
              </Text>
              
              <View style={styles.planFeatures}>
                {[
                  t('subscription_feature_crypto'),
                  t('subscription_feature_indices'),
                  t('subscription_feature_commodities'),
                  t('subscription_feature_analysis'),
                  t('subscription_feature_alerts'),
                  t('subscription_feature_priority'),
                  t('subscription_feature_webinars'),
                  t('subscription_feature_support')
                ].map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Check size={16} color={colors.success} style={styles.featureIcon} />
                    <Text style={[styles.featureText, { color: colors.text }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.checkoutSection}>
          <Text style={[styles.checkoutTitle, { color: colors.text }]}>
            {t('subscription_checkout_title')}
          </Text>
          
          <View style={styles.paymentInfo}>
            <ShoppingCart size={20} color={colors.textSecondary} style={styles.paymentIcon} />
            <Text style={[styles.paymentText, { color: colors.textSecondary }]}>
              {Platform.OS === 'android' 
                ? t('subscription_payment_info_google_play')
                : Platform.OS === 'ios'
                  ? t('subscription_payment_info_apple')
                  : t('subscription_mobile_only')}
            </Text>
          </View>
          
          {purchaseInProgress ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                {t('subscription_processing')}
              </Text>
            </View>
          ) : (
            <Button
              title={isLoading ? t('loading') : t('subscribe_now')}
              onPress={handleSubscribe}
              variant="primary"
              size="large"
              disabled={isLoading || (Platform.OS !== 'android' && Platform.OS !== 'ios')}
              loading={isLoading}
              style={styles.subscribeButton}
              fullWidth
            />
          )}
          
          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            {Platform.OS === 'android'
              ? t('subscription_disclaimer_google_play')
              : Platform.OS === 'ios'
                ? t('subscription_disclaimer_apple')
                : t('subscription_disclaimer_general')}
          </Text>
          
          <View style={styles.guestSection}>
            <Text style={[styles.guestTitle, { color: colors.text }]}>
              {t('guest_mode_option')}
            </Text>
            <TouchableOpacity
              style={[styles.guestButton, { backgroundColor: colors.success }]}
              onPress={() => {
                router.push('/login');
              }}
            >
              <User size={16} color="#FFFFFF" style={styles.guestButtonIcon} />
              <Text style={styles.guestButtonText}>
                {t('login_as_guest')}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.guestDescription, { color: colors.textSecondary }]}>
              {t('guest_mode_info')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    paddingHorizontal: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  planCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '400',
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  planFeatures: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  checkoutSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentIcon: {
    marginRight: 8,
  },
  paymentText: {
    fontSize: 14,
  },
  subscribeButton: {
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  alreadySubscribedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alreadySubscribedTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  alreadySubscribedMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backToHomeButton: {
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  guestSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  guestButtonIcon: {
    marginRight: 8,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guestDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  noProductsContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  noProductsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});