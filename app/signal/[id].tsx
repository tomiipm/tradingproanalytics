import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Share2,
  Lightbulb,
  ListChecks
} from 'lucide-react-native';
import { useSignalStore } from '@/store/signalStore';
import { useUserStore } from '@/store/userStore';
import { Signal, AIStrategy } from '@/types';
import Colors from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';
import Card from '@/components/Card';

export default function SignalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getSignalById } = useSignalStore();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  useEffect(() => {
    if (id) {
      const signalData = getSignalById(id as string);
      setSignal(signalData || null);
      setLoading(false);
    }
  }, [id, getSignalById]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleShare = () => {
    // Implement share functionality
    console.log('Share signal:', id);
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!signal) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <AlertTriangle size={48} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          {t('signal_not_found')}
        </Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {t('signal_not_found_message')}
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}
        >
          <ArrowLeft size={16} color="#FFF" style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };
  
  // Format number safely
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    
    // Check if it's a crypto currency (BTC, ETH, etc.)
    if (signal.isCrypto) {
      // For crypto, show fewer decimal places for large values
      if (value > 1000) {
        return value.toFixed(2);
      } else if (value > 100) {
        return value.toFixed(3);
      } else if (value > 1) {
        return value.toFixed(4);
      } else if (value > 0.01) {
        return value.toFixed(5);
      } else if (value > 0.0001) {
        return value.toFixed(6);
      } else {
        return value.toExponential(4);
      }
    } else if (signal.isIndex) {
      // For indices, show no decimal places for large values
      return value.toFixed(0);
    } else if (signal.isCommodity) {
      // For commodities like gold, show 2 decimal places
      return value.toFixed(2);
    } else {
      // For forex, always show 4 decimal places
      return value.toFixed(4);
    }
  };
  
  // Get type icon
  const getTypeIcon = () => {
    switch (signal.type.toLowerCase()) {
      case 'buy':
        return <TrendingUp size={24} color={colors.buy} />;
      case 'sell':
        return <TrendingDown size={24} color={colors.sell} />;
      case 'neutral':
        return <Minus size={24} color={colors.neutral} />;
      default:
        return <Minus size={24} color={colors.neutral} />;
    }
  };
  
  // Get type color
  const getTypeColor = () => {
    switch (signal.type.toLowerCase()) {
      case 'buy':
        return colors.buy;
      case 'sell':
        return colors.sell;
      case 'neutral':
        return colors.neutral;
      default:
        return colors.neutral;
    }
  };
  
  // Get type text
  const getTypeText = () => {
    switch (signal.type.toLowerCase()) {
      case 'buy':
        return t('signal_type_buy');
      case 'sell':
        return t('signal_type_sell');
      case 'neutral':
        return t('signal_type_neutral');
      default:
        return t('signal_type_neutral');
    }
  };
  
  // Get strength text
  const getStrengthText = () => {
    switch (signal.strength.toLowerCase()) {
      case 'strong':
        return t('signal_strength_strong');
      case 'moderate':
        return t('signal_strength_moderate');
      case 'weak':
        return t('signal_strength_weak');
      default:
        return t('signal_strength_moderate');
    }
  };
  
  // Get asset type badge
  const getAssetTypeBadge = () => {
    if (signal.isCrypto) {
      return (
        <View style={[styles.assetTypeBadge, { backgroundColor: colors.crypto }]}>
          <Text style={styles.assetTypeBadgeText}>Crypto</Text>
        </View>
      );
    } else if (signal.isIndex) {
      return (
        <View style={[styles.assetTypeBadge, { backgroundColor: colors.index }]}>
          <Text style={styles.assetTypeBadgeText}>Index</Text>
        </View>
      );
    } else if (signal.isCommodity) {
      return (
        <View style={[styles.assetTypeBadge, { backgroundColor: colors.commodity }]}>
          <Text style={styles.assetTypeBadgeText}>Commodity</Text>
        </View>
      );
    }
    return null;
  };
  
  // Render AI strategy section
  const renderAIStrategy = () => {
    if (!signal.aiStrategy) return null;
    
    const strategy: AIStrategy = signal.aiStrategy;
    
    return (
      <Card style={styles.strategyCard}>
        <View style={styles.strategyHeader}>
          <Lightbulb size={20} color={colors.primary} style={styles.strategyIcon} />
          <Text style={[styles.strategyTitle, { color: colors.text }]}>
            {strategy.type.replace('_', ' ')} Strategy
          </Text>
        </View>
        
        <Text style={[styles.strategyDescription, { color: colors.textSecondary }]}>
          {strategy.description}
        </Text>
        
        <View style={styles.strategySection}>
          <Text style={[styles.strategySectionTitle, { color: colors.text }]}>
            {t('signal_entry_rules')}
          </Text>
          {strategy.entryRules.map((rule, index) => (
            <View key={`entry-${index}`} style={styles.ruleItem}>
              <View style={[styles.ruleBullet, { backgroundColor: getTypeColor() }]} />
              <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.strategySection}>
          <Text style={[styles.strategySectionTitle, { color: colors.text }]}>
            {t('signal_exit_rules')}
          </Text>
          {strategy.exitRules.map((rule, index) => (
            <View key={`exit-${index}`} style={styles.ruleItem}>
              <View style={[styles.ruleBullet, { backgroundColor: colors.danger }]} />
              <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.strategySection}>
          <Text style={[styles.strategySectionTitle, { color: colors.text }]}>
            {t('signal_risk_management')}
          </Text>
          {strategy.riskManagementRules.map((rule, index) => (
            <View key={`risk-${index}`} style={styles.ruleItem}>
              <View style={[styles.ruleBullet, { backgroundColor: colors.warning }]} />
              <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.strategyMetrics}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              {t('signal_success_rate')}
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {strategy.successRate}%
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              {t('signal_risk_reward')}
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              1:{strategy.riskRewardRatio}
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              {t('signal_complexity')}
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {strategy.complexity}
            </Text>
          </View>
        </View>
        
        <View style={styles.strategySection}>
          <Text style={[styles.strategySectionTitle, { color: colors.text }]}>
            {t('signal_recommended_indicators')}
          </Text>
          <View style={styles.indicatorsContainer}>
            {strategy.indicators.map((indicator, index) => (
              <View key={`indicator-${index}`} style={[styles.indicatorBadge, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.indicatorText, { color: colors.text }]}>
                  {indicator}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={[styles.headerSymbol, { color: colors.text }]}>
            {signal.pair}
          </Text>
          <View style={styles.headerSubtitle}>
            <View style={[styles.timeframeContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.timeframe, { color: colors.textSecondary }]}>
                {signal.timeFrame}
              </Text>
            </View>
            {getAssetTypeBadge()}
          </View>
        </View>
        
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Share2 size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.signalCard}>
          <View style={styles.signalHeader}>
            <View style={styles.signalType}>
              {getTypeIcon()}
              <Text style={[styles.signalTypeText, { color: getTypeColor() }]}>
                {getTypeText()} • {getStrengthText()}
              </Text>
            </View>
            
            <View style={styles.confidenceContainer}>
              <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                {t('signal_confidence')}
              </Text>
              <Text style={[styles.confidenceValue, { color: colors.text }]}>
                {signal.confidence}%
              </Text>
            </View>
          </View>
          
          <View style={styles.priceDetails}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                {t('signal_entry')}
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                {formatNumber(signal.entryPrice)}
              </Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                {t('signal_stop_loss')}
              </Text>
              <Text style={[styles.priceValue, { color: colors.danger }]}>
                {formatNumber(signal.stopLoss)}
              </Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                {t('signal_take_profit')} 1
              </Text>
              <Text style={[styles.priceValue, { color: colors.success }]}>
                {formatNumber(signal.takeProfit1)}
              </Text>
            </View>
            
            {signal.takeProfit2 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                  {t('signal_take_profit')} 2
                </Text>
                <Text style={[styles.priceValue, { color: colors.success }]}>
                  {formatNumber(signal.takeProfit2)}
                </Text>
              </View>
            )}
            
            {signal.takeProfit3 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                  {t('signal_take_profit')} 3
                </Text>
                <Text style={[styles.priceValue, { color: colors.success }]}>
                  {formatNumber(signal.takeProfit3)}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.timeDetails}>
            <View style={styles.timeRow}>
              <Clock size={16} color={colors.textSecondary} style={styles.timeIcon} />
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                {t('signal_created')}:
              </Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>
                {formatDate(signal.timestamp)}
              </Text>
            </View>
            
            <View style={styles.timeRow}>
              <Clock size={16} color={colors.textSecondary} style={styles.timeIcon} />
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
                {t('signal_expires')}:
              </Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>
                {formatDate(signal.expiresAt)}
              </Text>
            </View>
          </View>
          
          <View style={styles.rationaleContainer}>
            <Text style={[styles.rationaleTitle, { color: colors.text }]}>
              {t('signal_rationale')}
            </Text>
            <Text style={[styles.rationaleText, { color: colors.textSecondary }]}>
              {signal.rationale}
            </Text>
          </View>
        </Card>
        
        {renderAIStrategy()}
        
        <View style={styles.footer} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerSymbol: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeframeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  timeframe: {
    fontSize: 12,
    fontWeight: '500',
  },
  assetTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  assetTypeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 80, // Extra space for bottom navigation
  },
  signalCard: {
    marginBottom: 16,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  signalType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalTypeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    fontSize: 12,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceDetails: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeDetails: {
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  rationaleContainer: {
    marginBottom: 8,
  },
  rationaleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  rationaleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  strategyCard: {
    marginBottom: 16,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strategyIcon: {
    marginRight: 8,
  },
  strategyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  strategyDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  strategySection: {
    marginBottom: 16,
  },
  strategySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  strategyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  indicatorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    height: 40,
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