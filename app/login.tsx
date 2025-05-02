import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  useColorScheme, 
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Key, Mail, ShoppingCart, User } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useTranslation } from '@/utils/i18n';
import { initializePurchases, setupPurchaseListeners } from '@/utils/purchases';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { login, loginAsGuest, error: storeError, isLoading: storeLoading } = useUserStore();
  
  // Initialize purchases on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize in-app purchases
        await initializePurchases();
        
        // Set up purchase listeners
        const removeListeners = setupPurchaseListeners();
        
        setIsInitializing(false);
        
        // Clean up listeners on unmount
        return () => {
          removeListeners();
        };
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitializing(false);
      }
    };
    
    initializeApp();
  }, []);
  
  // Update local error state when store error changes
  useEffect(() => {
    if (storeError) {
      setError(storeError);
    }
  }, [storeError]);
  
  // Update local loading state when store loading changes
  useEffect(() => {
    setIsLoading(storeLoading);
  }, [storeLoading]);
  
  const handleLogin = async () => {
    if (!email.trim()) {
      setError(t('login_error_empty_username'));
      return;
    }
    
    if (!password.trim()) {
      setError(t('login_error_empty_password'));
      return;
    }
    
    setError(null);
    
    const success = await login(email, password);
    
    if (success) {
      router.replace('/');
    }
  };
  
  const handleGuestLogin = async () => {
    setError(null);
    
    const success = await loginAsGuest();
    
    if (success) {
      router.replace('/');
    }
  };
  
  const handleSubscribe = () => {
    router.push('/subscription');
  };
  
  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };
  
  const handleSignUp = () => {
    router.push('/signup');
  };
  
  if (isInitializing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          {t('initializing')}
        </Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t('login'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {t('login_welcome')}
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.neutral }]}>
            {Platform.OS === 'android' 
              ? t('login_subtitle_google_play')
              : t('login_subtitle')}
          </Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.neutral} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: colors.text,
                    borderColor: error ? colors.danger : colors.border,
                    backgroundColor: colors.card
                  }
                ]}
                placeholder={t('login_email_placeholder')}
                placeholderTextColor={colors.neutral}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Key size={20} color={colors.neutral} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: colors.text,
                    borderColor: error ? colors.danger : colors.border,
                    backgroundColor: colors.card
                  }
                ]}
                placeholder={t('login_password_placeholder')}
                placeholderTextColor={colors.neutral}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                {t('forgot_password')}
              </Text>
            </TouchableOpacity>
            
            {error && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            )}
            
            <Button
              title={t('login')}
              onPress={handleLogin}
              style={styles.loginButton}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            />
            
            <TouchableOpacity 
              style={[styles.guestButton, { borderColor: colors.border }]} 
              onPress={handleGuestLogin}
              disabled={isLoading}
            >
              <Text style={[styles.guestButtonText, { color: colors.text }]}>
                {t('login_as_guest')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.neutral }]}>
              {t('login_no_account')}
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          
          <Button
            title={t('sign_up')}
            onPress={handleSignUp}
            variant="outline"
            style={styles.signUpButton}
            fullWidth
          />
          
          <Button
            title={t('subscribe_now')}
            onPress={handleSubscribe}
            variant="outline"
            style={styles.subscribeButton}
            icon={Platform.OS === 'android' ? <ShoppingCart size={16} color={colors.primary} /> : undefined}
            fullWidth
          />
          
          {Platform.OS === 'android' && (
            <Text style={[styles.googlePlayNote, { color: colors.textTertiary }]}>
              {t('login_google_play_note')}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 48,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  guestButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  signUpButton: {
    marginBottom: 12,
  },
  subscribeButton: {},
  googlePlayNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});