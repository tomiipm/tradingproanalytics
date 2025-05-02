import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  useColorScheme, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useTranslation } from '@/utils/i18n';
import { resetPassword } from '@/utils/firebase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleResetPassword = async () => {
    // Reset states
    setError(null);
    setIsSuccess(false);
    
    // Validate email
    if (!email.trim() || !validateEmail(email)) {
      setError(t('forgot_password_error_invalid_email'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send password reset email
      const result = await resetPassword(email);
      
      if (result.success) {
        setIsSuccess(true);
        Alert.alert(
          t('forgot_password_success_title'),
          t('forgot_password_success_message'),
          [
            { 
              text: t('ok'), 
              onPress: () => router.push('/login') 
            }
          ]
        );
      } else {
        setError(result.error || t('forgot_password_error_general'));
      }
    } catch (error: any) {
      setError(error.message || t('forgot_password_error_general'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t('forgot_password'),
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
          <Text style={[styles.title, { color: colors.text }]}>
            {t('forgot_password_title')}
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.neutral }]}>
            {t('forgot_password_subtitle')}
          </Text>
          
          <View style={styles.formContainer}>
            {isSuccess ? (
              <View style={styles.successContainer}>
                <CheckCircle size={64} color={colors.success} />
                <Text style={[styles.successText, { color: colors.text }]}>
                  {t('forgot_password_email_sent')}
                </Text>
                <Text style={[styles.successSubtext, { color: colors.textSecondary }]}>
                  {t('forgot_password_check_inbox')}
                </Text>
              </View>
            ) : (
              <>
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
                    placeholder={t('forgot_password_email_placeholder')}
                    placeholderTextColor={colors.neutral}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>
                
                {error && (
                  <Text style={[styles.errorText, { color: colors.danger }]}>
                    {error}
                  </Text>
                )}
                
                <Button
                  title={t('forgot_password_reset_button')}
                  onPress={handleResetPassword}
                  style={styles.resetButton}
                  loading={isLoading}
                  disabled={isLoading}
                  fullWidth
                />
              </>
            )}
          </View>
          
          <View style={styles.loginPromptContainer}>
            <Text style={[styles.loginPromptText, { color: colors.textSecondary }]}>
              {t('forgot_password_remember')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                {t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
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
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 8,
  },
  loginPromptContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginPromptText: {
    fontSize: 14,
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});