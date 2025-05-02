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

export default function RiskDisclaimerScreen() {
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
          title: t('risk_disclaimer_title'),
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
        
        <Text style={[styles.title, { color: colors.text }]}>Risk Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Trading in financial markets involves substantial risk and is not suitable for every investor. The high degree of leverage can work against you as well as for you. Before deciding to trade any financial instrument, you should carefully consider your investment objectives, level of experience, and risk appetite.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Trading Signals Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The trading signals provided in this application are for informational purposes only and should not be considered as financial advice or a recommendation to buy or sell any financial instrument. All trading signals are generated based on technical and/or fundamental analysis, which may not always accurately predict market movements.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Past performance is not indicative of future results. No representation is being made that any account will or is likely to achieve profits or losses similar to those discussed within this application. The past performance of any trading system or methodology is not necessarily indicative of future results.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Analysis Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The AI-powered market analysis provided in this application is generated through algorithmic processes and machine learning models. While we strive for accuracy, these analyses are subject to limitations and may not account for all market variables or unforeseen events.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          AI analysis should be considered as one of many tools in your trading decision process and not as the sole basis for investment decisions. Always conduct your own research and due diligence before making any trading decisions.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Educational Content Disclaimer</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          The educational content provided in this application is for informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information contained.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this application.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk of Loss</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          All forms of trading carry a high level of risk so you should only speculate with money you can afford to lose. You can lose more than your initial deposit and stake. Please ensure your chosen method matches your investment objectives, familiarize yourself with the risks involved and if necessary seek independent advice.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Foreign exchange, futures, options, and other leveraged trading involves substantial risk of loss and is not suitable for all investors. The valuation of futures, options, and other leveraged trading may fluctuate, and, as a result, clients may lose more than their original investment.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>No Guarantees</Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          There are no guarantees or certainties in trading. The trading signals, AI analysis, and educational content provided do not guarantee that you will make a profit. They should not be viewed as a recommendation or solicitation to buy or sell any financial instrument.
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          By using this application, you acknowledge and agree that you are solely responsible for your trading decisions and that the creators, developers, and providers of this application shall not be held liable for any losses, damages, or other negative consequences resulting from your trading activities.
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