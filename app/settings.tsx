import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Bell, 
  Moon, 
  Sun, 
  ChevronRight,
  Trash2,
  RefreshCw,
  Languages,
  Clock,
  DollarSign,
  ArrowLeft,
  Shield,
  AlertTriangle,
  FileText
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from '@/utils/i18n';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const { 
    preferences, 
    toggleDarkMode, 
    toggleNotifications,
    updatePreferences
  } = useUserStore();
  
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  
  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <Pressable
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      android_ripple={{ color: colors.borderLight }}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      {rightElement || <ChevronRight size={20} color={colors.neutral} />}
    </Pressable>
  );
  
  const handleClearData = () => {
    Alert.alert(
      t('settings_clear_data_confirm'),
      t('settings_clear_data_message'),
      [
        {
          text: t('action_cancel'),
          style: "cancel"
        },
        { 
          text: t('settings_clear_data'), 
          style: "destructive",
          onPress: () => {
            // Implement clear data functionality
            console.log('Clear app data');
          }
        }
      ]
    );
  };
  
  const toggleShowProfitLoss = () => {
    updatePreferences({
      showProfitLoss: !preferences.showProfitLoss
    });
  };
  
  const getLanguageDisplayName = () => {
    const currentLanguage = preferences.language;
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'pl', name: 'Polski' },
      { code: 'zh', name: '中文' }
    ];
    
    const language = languages.find(lang => lang.code === currentLanguage);
    return language ? language.name : 'English';
  };
  
  const navigateToPrivacyPolicy = () => {
    router.push('/privacy-policy');
  };
  
  const navigateToRiskDisclaimer = () => {
    router.push('/risk-disclaimer');
  };
  
  const navigateToLegalDisclaimer = () => {
    router.push('/legal-disclaimer');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t('settings_title'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 8 }}>
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings_appearance')}
          </Text>
          
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={styles.menuItemLeft}>
              {effectiveColorScheme === 'dark' ? (
                <Moon size={20} color={colors.text} style={styles.menuItemIcon} />
              ) : (
                <Sun size={20} color={colors.text} style={styles.menuItemIcon} />
              )}
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                {t('settings_dark_mode')}
              </Text>
            </View>
            <Switch
              value={theme === 'dark' || (theme === 'system' && effectiveColorScheme === 'dark')}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={theme === 'dark' || (theme === 'system' && effectiveColorScheme === 'dark') ? colors.primary : colors.neutral}
            />
          </View>
          
          {renderMenuItem(
            <Languages size={20} color={colors.text} style={styles.menuItemIcon} />,
            t('settings_language'),
            () => setLanguageModalVisible(true),
            <Text style={[styles.menuItemValue, { color: colors.neutral }]}>
              {getLanguageDisplayName()}
            </Text>
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings_notifications')}
          </Text>
          
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={styles.menuItemLeft}>
              <Bell size={20} color={colors.text} style={styles.menuItemIcon} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                {t('settings_enable_notifications')}
              </Text>
            </View>
            <Switch
              value={preferences.notificationSettings?.enabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={preferences.notificationSettings?.enabled ? colors.primary : colors.neutral}
            />
          </View>
          
          {renderMenuItem(
            <Clock size={20} color={colors.text} style={styles.menuItemIcon} />,
            t('settings_quiet_hours'),
            () => {},
            <Text style={[styles.menuItemValue, { color: colors.neutral }]}>Off</Text>
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings_trading')}
          </Text>
          
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={styles.menuItemLeft}>
              <DollarSign size={20} color={colors.text} style={styles.menuItemIcon} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>
                {t('settings_show_profit_loss')}
              </Text>
            </View>
            <Switch
              value={preferences.showProfitLoss}
              onValueChange={toggleShowProfitLoss}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={preferences.showProfitLoss ? colors.primary : colors.neutral}
            />
          </View>
          
          {renderMenuItem(
            <RefreshCw size={20} color={colors.text} style={styles.menuItemIcon} />,
            t('settings_refresh_interval'),
            () => {},
            <Text style={[styles.menuItemValue, { color: colors.neutral }]}>15 min</Text>
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('settings_about')}
          </Text>
          
          {renderMenuItem(
            <Shield size={20} color={colors.text} style={styles.menuItemIcon} />,
            t('privacy_policy_title'),
            navigateToPrivacyPolicy
          )}
          
          {renderMenuItem(
            <AlertTriangle size={20} color={colors.text} style={styles.menuItemIcon} />,
            t('risk_disclaimer_title'),
            navigateToRiskDisclaimer
          )}
          
          {renderMenuItem(
            <FileText size={20} color={colors.text} style={styles.menuItemIcon} />,
            t('legal_disclaimer_title'),
            navigateToLegalDisclaimer
          )}
        </View>
        
        <View style={styles.dangerSection}>
          <Button
            title={t('settings_clear_data')}
            onPress={handleClearData}
            variant="danger"
            icon={<Trash2 size={16} color="#FFFFFF" />}
            fullWidth
          />
          <Text style={[styles.dangerNote, { color: colors.neutral }]}>
            {t('settings_clear_data_message')}
          </Text>
        </View>
        
        <Text style={[styles.versionText, { color: colors.neutral }]}>
          {t('profile_version')} 1.0.0
        </Text>
      </ScrollView>
      
      <LanguageSelector 
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 15,
  },
  menuItemValue: {
    fontSize: 14,
  },
  apiKeyText: {
    fontSize: 14,
    maxWidth: 150,
  },
  dangerSection: {
    marginBottom: 24,
  },
  dangerNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 16,
  },
});