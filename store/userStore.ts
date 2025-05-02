import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency, TimeFrame, NotificationType } from '@/types';
import { Language } from '@/utils/i18n';
import { 
  auth, 
  signInWithEmail, 
  signOutUser, 
  signInAsGuest, 
  clearGuestMode,
  isGuestMode
} from '@/utils/firebase';
import {
  getStoredPurchaseInfo,
  clearStoredPurchaseInfo
} from '@/utils/purchases';
import { User } from 'firebase/auth';

interface NotificationSettings {
  enabled: boolean;
  types: {
    [key in NotificationType]: boolean;
  };
}

interface UserPreferences {
  preferredCurrencies: (Currency | 'US30' | 'SP500')[];
  preferredTimeFrames: TimeFrame[];
  notificationSettings: NotificationSettings;
  language: Language;
  showProfitLoss?: boolean;
  signalAlerts?: boolean;
  analysisUpdates?: boolean;
  educationAlerts?: boolean;
  darkMode?: boolean;
}

interface GooglePlaySubscription {
  productId: string;
  purchaseToken: string;
  transactionDate: number;
  expiryDate: number;
}

interface SubscriptionInfo {
  isActive: boolean;
  expiresAt: string | null; // ISO date string
  isTrial: boolean;
  googlePlayData?: GooglePlaySubscription;
  autoRenewing?: boolean;
}

interface UserState {
  theme: 'light' | 'dark' | 'system';
  preferences: UserPreferences;
  subscription: SubscriptionInfo;
  isPremium: boolean;
  isGuest: boolean;
  username: string | null;
  email: string | null;
  uid: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleNotifications: () => void;
  toggleNotificationType: (type: NotificationType) => void;
  setLanguage: (language: Language) => void;
  toggleDarkMode: () => void;
  
  activateSubscription: (isTrial: boolean) => void;
  deactivateSubscription: () => void;
  setIsPremium: (value: boolean) => void;
  
  login: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  
  updateGooglePlaySubscription: (subscriptionData: GooglePlaySubscription) => void;
  verifySubscription: () => Promise<boolean>;
  
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  types: {
    NEW_SIGNAL: true,
    SIGNAL_UPDATE: true,
    PRICE_ALERT: true,
    EDUCATIONAL: true
  }
};

// Define forex pairs
const forexPairs: (Currency | 'US30' | 'SP500')[] = [
  'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK', 'DKK',
  'SGD', 'HKD', 'MXN', 'ZAR', 'TRY', 'PLN', 'HUF', 'CZK', 'ILS', 'THB',
  'IDR', 'MYR', 'PHP', 'INR', 'BRL', 'XAU', 'US30', 'SP500'
];

// Google Play product IDs
export const SUBSCRIPTION_PRODUCT_ID = 'forex_signals_premium_weekly';

// Guest credentials
const GUEST_USERNAME = 'admin';
const GUEST_PASSWORD = '312012';

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      preferences: {
        preferredCurrencies: [...forexPairs],
        preferredTimeFrames: ['15M', '1H', '4H', '1D', '1W'],
        notificationSettings: defaultNotificationSettings,
        language: 'en',
        showProfitLoss: true,
        signalAlerts: true,
        analysisUpdates: true,
        educationAlerts: true,
        darkMode: false
      },
      subscription: {
        isActive: false,
        expiresAt: null,
        isTrial: false,
        autoRenewing: false
      },
      isPremium: false,
      isGuest: false,
      username: null,
      email: null,
      uid: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setTheme: (theme) => set({ theme }),
      
      updatePreferences: (newPreferences) => set((state) => ({
        preferences: {
          ...state.preferences,
          ...newPreferences
        }
      })),
      
      toggleNotifications: () => set((state) => ({
        preferences: {
          ...state.preferences,
          notificationSettings: {
            ...state.preferences.notificationSettings,
            enabled: !state.preferences.notificationSettings.enabled
          }
        }
      })),
      
      toggleNotificationType: (type) => set((state) => ({
        preferences: {
          ...state.preferences,
          notificationSettings: {
            ...state.preferences.notificationSettings,
            types: {
              ...state.preferences.notificationSettings.types,
              [type]: !state.preferences.notificationSettings.types[type]
            }
          }
        }
      })),
      
      setLanguage: (language) => {
        // Language is always 'en' now
        set((state) => ({
          preferences: {
            ...state.preferences,
            language: 'en'
          }
        }));
      },
      
      toggleDarkMode: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        return { theme: newTheme };
      }),
      
      activateSubscription: (isTrial) => {
        const expiresAt = new Date();
        // Set expiration to 7 days for regular subscription (weekly subscription)
        expiresAt.setDate(expiresAt.getDate() + (isTrial ? 1 : 7)); 
        
        set({
          subscription: {
            isActive: true,
            expiresAt: expiresAt.toISOString(),
            isTrial,
            autoRenewing: !isTrial
          },
          isPremium: true
        });
      },
      
      deactivateSubscription: () => set((state) => ({
        subscription: {
          isActive: false,
          expiresAt: null,
          isTrial: false,
          autoRenewing: false,
          googlePlayData: undefined
        },
        // Keep premium status if in guest mode
        isPremium: state.isGuest
      })),
      
      setIsPremium: (value) => {
        if (value) {
          // If setting to true, activate a default subscription
          const isTrial = false;
          get().activateSubscription(isTrial);
        } else {
          // If setting to false, deactivate subscription
          get().deactivateSubscription();
        }
      },
      
      login: async (email, password) => {
        const { setLoading, setError, setUser } = get();
        
        // Check for guest credentials
        if (email === GUEST_USERNAME && password === GUEST_PASSWORD) {
          return get().loginAsGuest();
        }
        
        try {
          setLoading(true);
          setError(null);
          
          const result = await signInWithEmail(email, password);
          
          if (result.success && result.user) {
            setUser(result.user);
            
            // Check for stored subscription
            const purchaseInfo = await getStoredPurchaseInfo();
            if (purchaseInfo) {
              const expiryDate = purchaseInfo.expirationDate 
                ? new Date(purchaseInfo.expirationDate) 
                : null;
              
              if (expiryDate && expiryDate > new Date()) {
                get().activateSubscription(false);
              }
            }
            
            return true;
          } else {
            setError(result.error || "Login failed");
            return false;
          }
        } catch (error: any) {
          setError(error.message);
          return false;
        } finally {
          setLoading(false);
        }
      },
      
      loginAsGuest: async () => {
        const { setLoading, setError } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          const result = await signInAsGuest();
          
          if (result.success) {
            set({
              isGuest: true,
              isPremium: true, // Guest has premium access
              username: GUEST_USERNAME,
              isAuthenticated: true
            });
            return true;
          } else {
            setError(result.error || "Guest login failed");
            return false;
          }
        } catch (error: any) {
          setError(error.message);
          return false;
        } finally {
          setLoading(false);
        }
      },
      
      logout: async () => {
        const { setLoading, setError, setUser } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Check if in guest mode
          if (get().isGuest) {
            await clearGuestMode();
          } else {
            await signOutUser();
          }
          
          // Clear subscription data
          await clearStoredPurchaseInfo();
          
          set({
            isPremium: false,
            isGuest: false,
            username: null,
            email: null,
            uid: null,
            user: null,
            isAuthenticated: false,
            subscription: {
              isActive: false,
              expiresAt: null,
              isTrial: false,
              autoRenewing: false,
              googlePlayData: undefined
            }
          });
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      },
      
      updateGooglePlaySubscription: (subscriptionData) => {
        const expiryDate = new Date(subscriptionData.expiryDate);
        
        set((state) => ({
          subscription: {
            ...state.subscription,
            isActive: true,
            expiresAt: expiryDate.toISOString(),
            isTrial: false,
            autoRenewing: true,
            googlePlayData: subscriptionData
          },
          isPremium: true
        }));
      },
      
      verifySubscription: async () => {
        const { subscription, isGuest } = get();
        
        // If user is in guest mode, they have premium access
        if (isGuest) {
          return true;
        }
        
        // Check for stored purchase info
        const purchaseInfo = await getStoredPurchaseInfo();
        if (purchaseInfo) {
          const expiryDate = purchaseInfo.expirationDate 
            ? new Date(purchaseInfo.expirationDate) 
            : null;
          
          if (expiryDate && expiryDate > new Date()) {
            return true;
          } else if (purchaseInfo.autoRenewing) {
            // If auto-renewing, we should check with the store
            // For now, assume it's still valid
            return true;
          }
        }
        
        // If no subscription data, not subscribed
        if (!subscription.isActive) {
          return false;
        }
        
        // If Google Play data exists, verify with Google Play
        if (subscription.googlePlayData) {
          try {
            // In a real app, you would verify with Google Play API
            // For now, just check if the expiry date is in the future
            const expiryDate = new Date(subscription.googlePlayData.expiryDate);
            const now = new Date();
            
            if (expiryDate > now) {
              return true;
            } else if (subscription.autoRenewing) {
              // If auto-renewing, we should check with Google Play API
              // For now, assume it's still valid
              return true;
            } else {
              // Expired and not auto-renewing
              get().deactivateSubscription();
              return false;
            }
          } catch (error) {
            console.error('Error verifying subscription:', error);
            return false;
          }
        }
        
        // For non-Google Play subscriptions, check expiry date
        if (subscription.expiresAt) {
          const expiryDate = new Date(subscription.expiresAt);
          const now = new Date();
          
          if (expiryDate > now) {
            return true;
          } else {
            get().deactivateSubscription();
            return false;
          }
        }
        
        return false;
      },
      
      setUser: (user) => {
        if (user) {
          set({
            user,
            uid: user.uid,
            email: user.email,
            username: user.displayName || user.email?.split('@')[0] || null,
            isAuthenticated: true
          });
        } else {
          set({
            user: null,
            uid: null,
            email: null,
            username: null,
            isAuthenticated: false
          });
        }
      },
      
      setError: (error) => set({ error }),
      
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);