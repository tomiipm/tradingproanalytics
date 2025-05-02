import { Platform } from 'react-native';
import {
  initConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  ProductPurchase,
  PurchaseError,
  Subscription,
  SubscriptionPurchase
} from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Product IDs
export const SUBSCRIPTION_SKUS = Platform.select({
  ios: [
    'com.forexsignals.weekly',
    'com.forexsignals.monthly',
    'com.forexsignals.yearly'
  ],
  android: [
    'forex_signals_premium_weekly',
    'forex_signals_premium_monthly',
    'forex_signals_premium_yearly'
  ],
  default: []
});

// Initialize IAP connection
export const initializePurchases = async () => {
  try {
    await initConnection();
    console.log('IAP connection established');
    return true;
  } catch (error) {
    console.error('Failed to establish IAP connection', error);
    return false;
  }
};

// Get available products
export const getAvailableProducts = async () => {
  try {
    const products = await getProducts({ skus: SUBSCRIPTION_SKUS as string[] });
    return products;
  } catch (error) {
    console.error('Failed to get products', error);
    throw error;
  }
};

// Purchase a subscription
export const purchaseSubscription = async (sku: string) => {
  try {
    const purchase = await requestPurchase({ skus: [sku] });
    return purchase;
  } catch (error) {
    console.error('Purchase failed', error);
    throw error;
  }
};

// Get active subscriptions
export const getActiveSubscriptions = async () => {
  try {
    const purchases = await getAvailablePurchases();
    // Filter for active subscriptions
    const activeSubscriptions = purchases.filter(purchase => {
      // For iOS, check if it's still active
      if (Platform.OS === 'ios') {
        return purchase.expirationDate && new Date(purchase.expirationDate) > new Date();
      }
      // For Android, check subscription state
      return purchase.autoRenewing === true;
    });
    return activeSubscriptions;
  } catch (error) {
    console.error('Failed to get active subscriptions', error);
    throw error;
  }
};

// Verify receipt with backend (mock implementation)
export const verifyReceipt = async (purchase: ProductPurchase | SubscriptionPurchase) => {
  try {
    // In a real app, you would send the receipt to your backend for verification
    // This is a mock implementation
    console.log('Verifying receipt with backend', purchase);
    
    // Store purchase info in AsyncStorage for persistence
    await AsyncStorage.setItem('activePurchase', JSON.stringify({
      productId: purchase.productId,
      transactionDate: purchase.transactionDate,
      transactionId: purchase.transactionId,
      expirationDate: purchase.expirationDate || null,
      autoRenewing: purchase.autoRenewing || false
    }));
    
    return {
      isValid: true,
      expirationDate: purchase.expirationDate || null,
      autoRenewing: purchase.autoRenewing || false
    };
  } catch (error) {
    console.error('Receipt verification failed', error);
    throw error;
  }
};

// Get stored purchase info
export const getStoredPurchaseInfo = async () => {
  try {
    const purchaseInfo = await AsyncStorage.getItem('activePurchase');
    if (purchaseInfo) {
      return JSON.parse(purchaseInfo);
    }
    return null;
  } catch (error) {
    console.error('Failed to get stored purchase info', error);
    return null;
  }
};

// Clear stored purchase info
export const clearStoredPurchaseInfo = async () => {
  try {
    await AsyncStorage.removeItem('activePurchase');
    return true;
  } catch (error) {
    console.error('Failed to clear stored purchase info', error);
    return false;
  }
};

// Set up purchase listeners
export const setupPurchaseListeners = () => {
  const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
    console.log('Purchase updated', purchase);
    
    try {
      // Finish the transaction
      if (purchase.transactionId) {
        await finishTransaction({ purchase, isConsumable: false });
      }
      
      // Verify the purchase
      await verifyReceipt(purchase);
    } catch (error) {
      console.error('Error processing purchase update', error);
    }
  });
  
  const purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
    console.error('Purchase error', error);
  });
  
  return () => {
    purchaseUpdateSubscription.remove();
    purchaseErrorSubscription.remove();
  };
};