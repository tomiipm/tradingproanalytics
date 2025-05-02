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
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Key, Mail, User, CheckCircle } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useTranslation } from '@/utils/i18n';
import { createUserWithEmail } from '@/utils/firebase';

export default function SignUpScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useUserStore();
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string) => {
    // Password must be at least 8 characters
    return password.length >= 8;
  };
  
  const handleSignUp = async () => {
    // Reset error
    setError(null);
    
    // Validate email
    if (!email.trim() || !validateEmail(email)) {
      setError(t('signup_error_invalid_email'));
      return;
    }
    
    // Validate password
    if (!validatePassword(password)) {
      setError(t('signup_error_password_length'));
      return;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      setError(t('signup_error_passwords_dont_match'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user with Firebase
      const result = await createUserWithEmail(email, password);
      
      if (result.success) {
        // Log in the user
        const loginSuccess = await login(email, password);
        
        if (loginSuccess) {
          router.replace('/');
        } else {
          setError(t('signup_error_login_after_signup'));
        }
      } else {
        setError(result.error || t('signup_error_general'));
      }
    } catch (error: any) {
      setError(error.message || t('signup_error_general'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t('sign_up'),
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
            {t('signup_title')}
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.neutral }]}>
            {t('signup_subtitle')}
          </Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.neutral} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: colors.text,
                    borderColor: error && !validateEmail(email) ? colors.danger : colors.border,
                    backgroundColor: colors.card
                  }
                ]}
                placeholder={t('signup_email_placeholder')}
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
                    borderColor: error && !validatePassword(password) ? colors.danger : colors.border,
                    backgroundColor: colors.card
                  }
                ]}
                placeholder={t('signup_password_placeholder')}
                placeholderTextColor={colors.neutral}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Key size={20} color={colors.neutral} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: colors.text,
                    borderColor: error && password !== confirmPassword ? colors.danger : colors.border,
                    backgroundColor: colors.card
                  }
                ]}
                placeholder={t('signup_confirm_password_placeholder')}
                placeholderTextColor={colors.neutral}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.passwordRequirements}>
              <View style={styles.requirementRow}>
                <CheckCircle 
                  size={16} 
                  color={password.length >= 8 ? colors.success : colors.neutral} 
                  fill={password.length >= 8 ? colors.success : 'transparent'}
                  style={styles.requirementIcon} 
                />
                <Text style={[
                  styles.requirementText, 
                  { color: password.length >= 8 ? colors.success : colors.neutral }
                ]}>
                  {t('signup_password_requirement_length')}
                </Text>
              </View>
            </View>
            
            {error && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            )}
            
            <Button
              title={t('sign_up')}
              onPress={handleSignUp}
              style={styles.signUpButton}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
            />
          </View>
          
          <View style={styles.loginPromptContainer}>
            <Text style={[styles.loginPromptText, { color: colors.textSecondary }]}>
              {t('signup_already_have_account')}
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
  passwordRequirements: {
    marginBottom: 16,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  signUpButton: {
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
});