import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';

export default function LegalDisclaimerScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: t('legal_disclaimer_title'),
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
        <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
          Last updated: May 1, 2024
        </Text>
        
        <Text style={[styles.title, { color: colors.text }]}>Legal Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The information provided in this application is for general informational purposes only. All information in the application is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information in the application.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the application or reliance on any information provided in the application. Your use of the application and your reliance on any information in the application is solely at your own risk.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>No Financial Advice</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The information contained in this application is not intended to be a source of financial, investment, or trading advice. The trading signals, AI analysis, and educational content should not be construed as financial, investment, or trading advice. You should consult with a professional financial advisor before making any financial decisions.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          We are not responsible for any investment decisions made by users based on the information provided in this application. Any action you take upon the information you find in this application is strictly at your own risk.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>External Links</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The application may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Errors and Omissions</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The information given by the application is for general guidance on matters of interest only. Even if the application takes every precaution to ensure that the content is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules, and regulations, there may be delays, omissions, or inaccuracies in the information contained in the application.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The application is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in the application is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Fair Use Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          This application may use copyrighted material which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright Law. If you wish to use copyrighted material from this application for your own purposes that go beyond "fair use", you must obtain permission from the copyright owner.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Views Expressed Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The views and opinions expressed in this application are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company. Assumptions made in the analysis are not reflective of the position of any entity other than the author(s).
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>No Responsibility Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The information on the application is provided with the understanding that the authors and publishers are not herein engaged in rendering legal, accounting, tax, investment, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, investment, or other competent advisers.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          In no event shall the application or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the application.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          If you have any questions about this disclaimer, please contact us at legal@tradingsignals.app.
        </Text>
      </ScrollView>
      
      <View style={[styles.backButtonContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}
        >
          <ArrowLeft size={20} color="#FFFFFF" style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingBottom: 80, // Extra space for the back button
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});