import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme,
  Linking
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  FileText, 
  AlertTriangle, 
  Scale, 
  ChevronRight 
} from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';
import Card from '@/components/Card';

export default function HelpCenterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const handleBack = () => {
    router.back();
  };
  
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@tradingsignals.app?subject=Support%20Request');
  };
  
  const handleFAQ = () => {
    router.push('/faq');
  };
  
  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };
  
  const handleRiskDisclaimer = () => {
    router.push('/risk-disclaimer');
  };
  
  const handleLegalDisclaimer = () => {
    router.push('/legal-disclaimer');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: 'Help Center',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <HelpCircle size={48} color={colors.primary} style={styles.headerIcon} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            How can we help you?
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Find answers to common questions or contact our support team
          </Text>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Contact Support
        </Text>
        
        <Card onPress={handleEmailSupport} style={styles.contactCard}>
          <View style={styles.contactCardContent}>
            <Mail size={24} color={colors.primary} style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={[styles.contactTitle, { color: colors.text }]}>
                Email Support
              </Text>
              <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                Send us an email and we'll respond within 24 hours
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </Card>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Resources
        </Text>
        
        <Card onPress={handleFAQ} style={styles.resourceCard}>
          <View style={styles.resourceCardContent}>
            <MessageCircle size={24} color={colors.primary} style={styles.resourceIcon} />
            <View style={styles.resourceTextContainer}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Frequently Asked Questions
              </Text>
              <Text style={[styles.resourceDescription, { color: colors.textSecondary }]}>
                Find answers to common questions
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </Card>
        
        <Card onPress={handlePrivacyPolicy} style={styles.resourceCard}>
          <View style={styles.resourceCardContent}>
            <FileText size={24} color={colors.primary} style={styles.resourceIcon} />
            <View style={styles.resourceTextContainer}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Privacy Policy
              </Text>
              <Text style={[styles.resourceDescription, { color: colors.textSecondary }]}>
                Learn how we protect your data
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </Card>
        
        <Card onPress={handleRiskDisclaimer} style={styles.resourceCard}>
          <View style={styles.resourceCardContent}>
            <AlertTriangle size={24} color={colors.primary} style={styles.resourceIcon} />
            <View style={styles.resourceTextContainer}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Risk Disclaimer
              </Text>
              <Text style={[styles.resourceDescription, { color: colors.textSecondary }]}>
                Important information about trading risks
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </Card>
        
        <Card onPress={handleLegalDisclaimer} style={styles.resourceCard}>
          <View style={styles.resourceCardContent}>
            <Scale size={24} color={colors.primary} style={styles.resourceIcon} />
            <View style={styles.resourceTextContainer}>
              <Text style={[styles.resourceTitle, { color: colors.text }]}>
                Legal Disclaimer
              </Text>
              <Text style={[styles.resourceDescription, { color: colors.textSecondary }]}>
                Terms and conditions of using our app
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </Card>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for bottom navigation
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactCard: {
    marginBottom: 24,
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIcon: {
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
  },
  resourceCard: {
    marginBottom: 12,
  },
  resourceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  resourceIcon: {
    marginRight: 16,
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
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