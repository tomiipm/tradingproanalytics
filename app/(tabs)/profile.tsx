import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme,
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  HelpCircle, 
  Shield, 
  FileText,
  User,
  Crown,
  Mail
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/utils/i18n';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import { getAvailablePurchases } from '@/utils/purchases';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { 
    theme, 
    setTheme, 
    preferences, 
    updatePreferences,
    isPremium,
    isGuest,
    username,
    email,
    logout,
    isLoading: storeLoading
  } = useUserStore();
  
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<string | null>(null);
  
  const colorScheme = useColorScheme() ?? 'light';
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (isPremium && !isGuest) {
        try {
          setIsCheckingSubscription(true);
          const purchases = await getAvailablePurchases();
          
          if (purchases.length > 0) {
            // Get the most recent purchase
            const latestPurchase = purchases[0];
            
            // Format expiration date if available
            let expirationInfo = '';
            if (latestPurchase.expirationDate) {
              const expiryDate = new Date(latestPurchase.expirationDate);
              expirationInfo = expiryDate.toLocaleDateString();
            }
            
            // Set subscription info
            setSubscriptionInfo(
              `${latestPurchase.productId} - ${expirationInfo}`
            );
          } else {
            setSubscriptionInfo(t('subscription_status_unknown'));
          }
        } catch (error) {
          console.error('Failed to check subscription:', error);
          setSubscriptionInfo(t('subscription_status_error'));
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };
    
    checkSubscription();
  }, [isPremium, isGuest]);
  
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleNotificationsToggle = () => {
    updatePreferences({
      notificationSettings: {
        ...preferences.notificationSettings,
        enabled: !preferences.notificationSettings.enabled
      }
    });
  };
  
  const handleSubscriptionPress = () => {
    if (isGuest) {
      Alert.alert(
        t('guest_mode'),
        t('guest_mode_subscription_message'),
        [{ text: t('ok') }]
      );
    } else {
      router.push('/subscription');
    }
  };
  
  const handleLogout = () => {
    Alert.alert(
      t('logout_confirmation_title'),
      t('logout_confirmation_message'),
      [
        {
          text: t('cancel'),
          style: 'cancel'
        },
        {
          text: t('logout'),
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(
                t('error'),
                t('logout_error'),
                [{ text: t('ok') }]
              );
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const openLanguageSelector = () => {
    setIsLanguageSelectorVisible(true);
  };
  
  const closeLanguageSelector = () => {
    setIsLanguageSelectorVisible(false);
  };
  
  if (storeLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={t('profile_title')}
        subtitle={t('profile_subtitle')}
      />
      
      <ScrollView style={styles.content}>
        {/* User Info Section */}
        <View style={[styles.userInfoContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <User size={32} color="#FFFFFF" />
          </View>
          
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: colors.text }]}>
              {username || t('guest')}
            </Text>
            
            {email && (
              <View style={styles.emailContainer}>
                <Mail size={14} color={colors.textSecondary} style={styles.emailIcon} />
                <Text style={[styles.emailText, { color: colors.textSecondary }]}>
                  {email}
                </Text>
              </View>
            )}
            
            <View style={styles.statusContainer}>
              {isPremium ? (
                <>
                  <Crown size={16} color={colors.warning} style={styles.statusIcon} />
                  <Text style={[styles.statusText, { color: colors.warning }]}>
                    {isGuest ? t('guest_mode') : t('premium_user')}
                  </Text>
                </>
              ) : (
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                  {t('free_user')}
                </Text>
              )}
            </View>
            
            {isPremium && !isGuest && subscriptionInfo && (
              <Text style={[styles.subscriptionInfo, { color: colors.textSecondary }]}>
                {subscriptionInfo}
              </Text>
            )}
            
            {isCheckingSubscription && (
              <ActivityIndicator size="small" color={colors.primary} style={styles.subscriptionLoader} />
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.subscriptionButton, { backgroundColor: isGuest ? colors.success : colors.warning }]}
            onPress={handleSubscriptionPress}
          >
            <Text style={styles.subscriptionButtonText}>
              {isGuest ? t('guest_access') : isPremium ? t('manage_subscription') : t('upgrade')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings')}
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Bell size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('notifications')}
                </Text>
              </View>
              <Switch
                value={preferences.notificationSettings.enabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                {theme === 'dark' ? (
                  <Moon size={20} color={colors.text} style={styles.settingIcon} />
                ) : (
                  <Sun size={20} color={colors.text} style={styles.settingIcon} />
                )}
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {theme === 'dark' ? t('dark_mode') : t('light_mode')}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={openLanguageSelector}
            >
              <View style={styles.settingLabelContainer}>
                <Settings size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('language')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('support')}
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => router.push('/help-center')}
            >
              <View style={styles.settingLabelContainer}>
                <HelpCircle size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('help_center')}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => router.push('/faq')}
            >
              <View style={styles.settingLabelContainer}>
                <FileText size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('faq')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('legal')}
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => router.push('/privacy-policy')}
            >
              <View style={styles.settingLabelContainer}>
                <Shield size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('privacy_policy')}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => router.push('/risk-disclaimer')}
            >
              <View style={styles.settingLabelContainer}>
                <FileText size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('risk_disclaimer')}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => router.push('/legal-disclaimer')}
            >
              <View style={styles.settingLabelContainer}>
                <FileText size={20} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('legal_disclaimer')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.danger }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FFFFFF" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            {t('version')} 1.0.0
          </Text>
        </View>
      </ScrollView>
      
      <LanguageSelector 
        visible={isLanguageSelectorVisible} 
        onClose={closeLanguageSelector} 
      />
    </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emailIcon: {
    marginRight: 4,
  },
  emailText: {
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subscriptionInfo: {
    fontSize: 12,
    marginTop: 4,
  },
  subscriptionLoader: {
    marginTop: 4,
  },
  subscriptionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  subscriptionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
  },
});