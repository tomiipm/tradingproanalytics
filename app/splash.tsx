import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/utils/i18n';
import Colors from '@/constants/colors';
import { auth, isGuestMode } from '@/utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getStoredPurchaseInfo } from '@/utils/purchases';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme, setUser, activateSubscription } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if user is in guest mode
        const guestMode = await isGuestMode();
        
        if (guestMode) {
          // User is in guest mode
          useUserStore.setState({
            isGuest: true,
            isPremium: true,
            username: 'Guest',
            isAuthenticated: true
          });
          
          setTimeout(() => {
            router.replace('/');
          }, 1000);
          return;
        }
        
        // Check Firebase auth state
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // User is signed in
            setUser(user);
            
            // Check for active subscription
            const purchaseInfo = await getStoredPurchaseInfo();
            if (purchaseInfo) {
              const expiryDate = purchaseInfo.expirationDate 
                ? new Date(purchaseInfo.expirationDate) 
                : null;
              
              if (expiryDate && expiryDate > new Date()) {
                activateSubscription(false);
              }
            }
            
            setTimeout(() => {
              router.replace('/');
            }, 1000);
          } else {
            // User is not signed in
            setTimeout(() => {
              router.replace('/login');
            }, 1000);
          }
          
          setIsLoading(false);
        });
        
        // Clean up subscription
        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsLoading(false);
        
        // Navigate to login on error
        setTimeout(() => {
          router.replace('/login');
        }, 1000);
      }
    };
    
    checkAuthState();
  }, [router, setUser, activateSubscription]);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop' }}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={[styles.appName, { color: colors.text }]}>
        {t('app_name')}
      </Text>
      
      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        {t('app_tagline')}
      </Text>
      
      {isLoading && (
        <ActivityIndicator 
          size="large" 
          color={colors.primary} 
          style={styles.loader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  loader: {
    marginTop: 24,
  },
});