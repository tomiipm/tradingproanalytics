import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  useColorScheme,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  BarChart2, 
  Filter, 
  AlertTriangle,
  RefreshCw,
  Lock
} from 'lucide-react-native';
import { useAIStore } from '@/store/aiStore';
import { useUserStore } from '@/store/userStore';
import { AIAnalysis, Currency, TimeFrame } from '@/types';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import AnalysisCard from '@/components/AnalysisCard';
import FilterChip from '@/components/FilterChip';
import EmptyState from '@/components/EmptyState';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { useTranslation } from '@/utils/i18n';

// Currency pairs for analysis - FOREX ONLY
const CURRENCY_PAIRS = [
  // Forex pairs
  { label: 'EUR/USD', value: 'EUR/USD' },
  { label: 'GBP/USD', value: 'GBP/USD' },
  { label: 'USD/JPY', value: 'USD/JPY' },
  { label: 'AUD/USD', value: 'AUD/USD' },
  { label: 'USD/CAD', value: 'USD/CAD' },
  { label: 'EUR/GBP', value: 'EUR/GBP' },
  { label: 'USD/CHF', value: 'USD/CHF' },
  { label: 'NZD/USD', value: 'NZD/USD' },
  { label: 'EUR/JPY', value: 'EUR/JPY' },
  { label: 'GBP/JPY', value: 'GBP/JPY' }
];

// Timeframes for analysis
const TIMEFRAMES = [
  { label: '15m', value: '15M' },
  { label: '1h', value: '1H' },
  { label: '4h', value: '4H' },
  { label: '1d', value: '1D' },
  { label: '1w', value: '1W' },
];

export default function AnalysisScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme, isPremium } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const { 
    analyses, 
    isGenerating, 
    error,
    generateAnalysis,
    fetchAnalyses
  } = useAIStore();
  
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState<boolean>(false);
  
  useEffect(() => {
    // Auto-generate analyses for forex currency pairs on initial load
    if (analyses.length === 0) {
      autoGenerateAnalyses();
    }
    
    // Show subscription banner if there was a subscription error
    if (error && error.includes('Subscription required')) {
      setShowSubscriptionBanner(true);
    }
  }, [analyses.length, error]);
  
  // Function to automatically generate analyses for forex currency pairs
  const autoGenerateAnalyses = async () => {
    // Use only forex pairs
    const eligiblePairs = CURRENCY_PAIRS.slice(0, 10); // Limit to 10 pairs to avoid overloading
    
    // Use a default timeframe for all analyses
    const defaultTimeframe = '1H';
    
    // Generate analyses for each pair
    for (const pair of eligiblePairs) {
      try {
        // Skip invalid pairs like USD/USD
        if (pair.value === "USD/USD") {
          console.log("Skipping invalid pair: USD/USD");
          continue;
        }
        
        // Skip pairs where the currency is the same as the timeframe (e.g., USD/1H)
        const [baseCurrency, quoteCurrency] = pair.value.split('/');
        if (TIMEFRAMES.some(tf => tf.value === baseCurrency || tf.value === quoteCurrency)) {
          console.log(`Skipping invalid pair with timeframe as currency: ${pair.value}`);
          continue;
        }
        
        // Skip pairs where base and quote currencies are the same
        if (baseCurrency === quoteCurrency) {
          console.log(`Skipping invalid pair with same currencies: ${pair.value}`);
          continue;
        }
        
        await generateAnalysis(pair.value, defaultTimeframe as TimeFrame);
      } catch (error) {
        console.error(`Error generating analysis for ${pair.value}:`, error);
        // Continue with other pairs even if one fails
      }
    }
  };
  
  const handleRefresh = () => {
    setShowSubscriptionBanner(false);
    autoGenerateAnalyses();
  };
  
  const handleAnalysisPress = (id: string, isPremiumContent: boolean) => {
    // Check if this is premium content and user is not premium
    if (isPremiumContent && !isPremium) {
      // Show subscription prompt
      Alert.alert(
        t('premium_content'),
        t('premium_content_message'),
        [
          {
            text: t('cancel'),
            style: 'cancel'
          },
          {
            text: t('upgrade'),
            onPress: () => router.push('/subscription')
          }
        ]
      );
      return;
    }
    
    // If user has access, navigate to the analysis
    router.push(`/analysis/${id}`);
  };
  
  const handleSubscribe = () => {
    router.push('/subscription');
  };
  
  // Filter analyses to show only forex pairs
  const filteredAnalyses = analyses.filter((analysis: AIAnalysis) => {
    // First, exclude any invalid pairs like "USD/USD"
    if (analysis.pair === "USD/USD") return false;
    
    // Exclude crypto, indices, and commodities - show only forex
    if (analysis.isCrypto || analysis.isIndex || analysis.isCommodity) return false;
    
    // Then apply other filters
    if (activeFilter === 'all') return true;
    if (activeFilter === 'bullish') return analysis.sentiment === 'BULLISH';
    if (activeFilter === 'bearish') return analysis.sentiment === 'BEARISH';
    if (activeFilter === 'neutral') return analysis.sentiment === 'NEUTRAL';
    return true;
  });
  
  const renderAnalysisCard = ({ item }: { item: AIAnalysis }) => (
    <AnalysisCard
      id={item.id}
      symbol={item.pair}
      timeframe={item.timeFrame}
      sentiment={item.sentiment.toLowerCase() as 'bullish' | 'bearish' | 'neutral'}
      support={item.keyLevels.support[0]}
      resistance={item.keyLevels.resistance[0]}
      createdAt={item.timestamp}
      isPremium={item.isPremium}
      isCrypto={item.isCrypto}
      isIndex={item.isIndex}
      isCommodity={item.isCommodity}
      strategyType={item.aiStrategy?.type}
      onPress={() => handleAnalysisPress(item.id, item.isPremium)}
    />
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={t('analysis_title')}
        subtitle={t('analysis_subtitle')}
        showNotification
      />
      
      {showSubscriptionBanner && !isPremium && (
        <SubscriptionBanner
          message={t('subscription_banner_message')}
          buttonText={t('upgrade')}
          onPress={handleSubscribe}
        />
      )}
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterLabelContainer}>
          <Filter size={16} color={colors.textSecondary} />
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
            {t('signals_filter_by')}
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollContent}
        >
          <FilterChip
            label={t('filter_all')}
            isSelected={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterChip
            label={t('sentiment_bullish')}
            isSelected={activeFilter === 'bullish'}
            onPress={() => setActiveFilter('bullish')}
          />
          <FilterChip
            label={t('sentiment_bearish')}
            isSelected={activeFilter === 'bearish'}
            onPress={() => setActiveFilter('bearish')}
          />
          <FilterChip
            label={t('sentiment_neutral')}
            isSelected={activeFilter === 'neutral'}
            onPress={() => setActiveFilter('neutral')}
          />
        </ScrollView>
      </View>
      
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('analysis_recent')}
        </Text>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isGenerating}
        >
          <RefreshCw 
            size={16} 
            color={colors.primary} 
            style={[isGenerating && styles.rotating]}
          />
          <Text style={[styles.refreshText, { color: colors.primary }]}>
            {isGenerating ? t('loading') : t('signals_refresh')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isGenerating && analyses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('analysis_generating')}
          </Text>
        </View>
      ) : error && !error.includes('Subscription required') ? (
        <EmptyState
          icon={<AlertTriangle size={48} color={colors.textSecondary} />}
          title={t('analysis_error')}
          message={error}
          actionLabel={t('retry')}
          onAction={handleRefresh}
        />
      ) : filteredAnalyses.length === 0 ? (
        <EmptyState
          icon={<BarChart2 size={48} color={colors.textSecondary} />}
          title={t('analysis_empty')}
          message={t('analysis_empty_message')}
          actionLabel={t('analysis_generate')}
          onAction={handleRefresh}
        />
      ) : (
        <FlatList
          data={filteredAnalyses}
          renderItem={renderAnalysisCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            !isPremium ? (
              <View style={styles.premiumPromoContainer}>
                <View style={[styles.premiumPromo, { backgroundColor: colors.card }]}>
                  <Lock size={24} color={colors.warning} style={styles.premiumIcon} />
                  <Text style={[styles.premiumTitle, { color: colors.text }]}>
                    {t('premium_promo_title')}
                  </Text>
                  <Text style={[styles.premiumDescription, { color: colors.textSecondary }]}>
                    {t('premium_promo_description')}
                  </Text>
                  <TouchableOpacity 
                    style={[styles.upgradeButton, { backgroundColor: colors.warning }]}
                    onPress={handleSubscribe}
                  >
                    <Text style={styles.upgradeButtonText}>
                      {t('upgrade_now')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    marginLeft: 4,
  },
  filtersScrollContent: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 14,
    marginLeft: 4,
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  premiumPromoContainer: {
    paddingVertical: 16,
  },
  premiumPromo: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  premiumIcon: {
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  premiumDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});