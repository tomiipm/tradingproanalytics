import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  useColorScheme,
  TouchableOpacity
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Bell, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const { 
    preferences, 
    toggleNotifications, 
    toggleNotificationType, 
    updatePreferences 
  } = useUserStore();
  
  const { notificationSettings } = preferences;
  
  const handleToggleNotifications = () => {
    toggleNotifications();
  };
  
  const handleToggleNotificationType = (type: 'NEW_SIGNAL' | 'SIGNAL_UPDATE' | 'PRICE_ALERT' | 'EDUCATIONAL') => {
    toggleNotificationType(type);
  };
  
  const handleToggleSignalAlerts = () => {
    updatePreferences({
      signalAlerts: !preferences.signalAlerts
    });
  };
  
  const handleToggleAnalysisUpdates = () => {
    updatePreferences({
      analysisUpdates: !preferences.analysisUpdates
    });
  };
  
  const handleToggleEducationAlerts = () => {
    updatePreferences({
      educationAlerts: !preferences.educationAlerts
    });
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('notifications_title'),
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView>
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.mainToggleRow}>
              <View style={styles.mainToggleContent}>
                <Bell size={24} color={colors.text} style={styles.mainToggleIcon} />
                <View>
                  <Text style={[styles.mainToggleTitle, { color: colors.text }]}>
                    {t('notifications_all')}
                  </Text>
                  <Text style={[styles.mainToggleDescription, { color: colors.neutral }]}>
                    {t('notifications_all_description')}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationSettings?.enabled ?? false}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                thumbColor={notificationSettings?.enabled ? colors.tint : colors.neutral}
              />
            </View>
          </View>
          
          {(notificationSettings?.enabled ?? false) && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('notifications_types')}
              </Text>
              
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <TrendingUp size={20} color={colors.text} style={styles.toggleIcon} />
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_new_signals')}
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings?.types?.NEW_SIGNAL ?? false}
                    onValueChange={() => handleToggleNotificationType('NEW_SIGNAL')}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={notificationSettings?.types?.NEW_SIGNAL ? colors.tint : colors.neutral}
                  />
                </View>
                
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <AlertTriangle size={20} color={colors.text} style={styles.toggleIcon} />
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_signal_updates')}
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings?.types?.SIGNAL_UPDATE ?? false}
                    onValueChange={() => handleToggleNotificationType('SIGNAL_UPDATE')}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={notificationSettings?.types?.SIGNAL_UPDATE ? colors.tint : colors.neutral}
                  />
                </View>
                
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <BarChart3 size={20} color={colors.text} style={styles.toggleIcon} />
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_price_alerts')}
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings?.types?.PRICE_ALERT ?? false}
                    onValueChange={() => handleToggleNotificationType('PRICE_ALERT')}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={notificationSettings?.types?.PRICE_ALERT ? colors.tint : colors.neutral}
                  />
                </View>
                
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <BookOpen size={20} color={colors.text} style={styles.toggleIcon} />
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_educational')}
                    </Text>
                  </View>
                  <Switch
                    value={notificationSettings?.types?.EDUCATIONAL ?? false}
                    onValueChange={() => handleToggleNotificationType('EDUCATIONAL')}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={notificationSettings?.types?.EDUCATIONAL ? colors.tint : colors.neutral}
                  />
                </View>
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('notifications_preferences')}
              </Text>
              
              <View style={[styles.section, { backgroundColor: colors.card }]}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_signal_alerts')}
                    </Text>
                    <Text style={[styles.toggleDescription, { color: colors.neutral }]}>
                      {t('notifications_signal_alerts_description')}
                    </Text>
                  </View>
                  <Switch
                    value={preferences.signalAlerts}
                    onValueChange={handleToggleSignalAlerts}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={preferences.signalAlerts ? colors.tint : colors.neutral}
                  />
                </View>
                
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_analysis_updates')}
                    </Text>
                    <Text style={[styles.toggleDescription, { color: colors.neutral }]}>
                      {t('notifications_analysis_updates_description')}
                    </Text>
                  </View>
                  <Switch
                    value={preferences.analysisUpdates}
                    onValueChange={handleToggleAnalysisUpdates}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={preferences.analysisUpdates ? colors.tint : colors.neutral}
                  />
                </View>
                
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelContainer}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      {t('notifications_education_alerts')}
                    </Text>
                    <Text style={[styles.toggleDescription, { color: colors.neutral }]}>
                      {t('notifications_education_alerts_description')}
                    </Text>
                  </View>
                  <Switch
                    value={preferences.educationAlerts}
                    onValueChange={handleToggleEducationAlerts}
                    trackColor={{ false: colors.border, true: `${colors.tint}80` }}
                    thumbColor={preferences.educationAlerts ? colors.tint : colors.neutral}
                  />
                </View>
              </View>
              
              <Text style={[styles.disclaimer, { color: colors.neutral }]}>
                {t('notifications_disclaimer')}
              </Text>
            </>
          )}
        </ScrollView>
        
        <View style={[styles.bottomNavContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.bottomNavButton, { backgroundColor: colors.primary }]}
            onPress={handleBack}
          >
            <ArrowLeft size={20} color="#FFFFFF" style={styles.bottomNavButtonIcon} />
            <Text style={styles.bottomNavButtonText}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  mainToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  mainToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  mainToggleIcon: {
    marginRight: 16,
  },
  mainToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainToggleDescription: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 12,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 80, // Extra space for bottom navigation
    paddingHorizontal: 16,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  bottomNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  bottomNavButtonIcon: {
    marginRight: 8,
  },
  bottomNavButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});