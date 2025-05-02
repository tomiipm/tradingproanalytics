import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { TrendingUp, TrendingDown, Lock } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/utils/i18n';
import { formatDistanceToNow } from '@/utils/dateUtils';
import Colors from '@/constants/colors';
import Card from '@/components/Card';

interface AnalysisCardProps {
  id: string;
  symbol: string;
  timeframe: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  support: number;
  resistance: number;
  createdAt: Date | string;
  isPremium?: boolean;
  isCrypto?: boolean;
  isIndex?: boolean;
  isCommodity?: boolean;
  strategyType?: string;
  onPress: () => void;
}

export default function AnalysisCard({
  id,
  symbol,
  timeframe,
  sentiment,
  support,
  resistance,
  createdAt,
  isPremium = false,
  isCrypto = false,
  isIndex = false,
  isCommodity = false,
  strategyType,
  onPress,
}: AnalysisCardProps) {
  const { t } = useTranslation();
  const { isPremium: userIsPremium } = useUserStore();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];

  // Format date
  const formatDate = (date: Date | string) => {
    if (!date) return 'just now';
    
    const now = new Date();
    const analysisDate = typeof date === 'string' ? new Date(date) : date;
    
    // Calculate time difference in milliseconds
    const diff = now.getTime() - analysisDate.getTime();
    
    // Convert to minutes, hours, days
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'just now';
    }
  };

  // Format number safely
  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    
    // Check if it's a crypto currency (BTC, ETH, etc.)
    if (isCrypto) {
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
    } else if (isIndex) {
      // For indices, show no decimal places for large values
      return value.toFixed(0);
    } else if (isCommodity) {
      // For commodities like gold, show 2 decimal places
      return value.toFixed(2);
    } else {
      // For forex, always show 4 decimal places
      return value.toFixed(4);
    }
  };

  // Get sentiment icon
  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp size={20} color={colors.buy} />;
      case 'bearish':
        return <TrendingDown size={20} color={colors.sell} />;
      case 'neutral':
        return <TrendingDown size={20} color={colors.neutral} />;
      default:
        return <TrendingDown size={20} color={colors.neutral} />;
    }
  };

  // Get sentiment color
  const getSentimentColor = () => {
    switch (sentiment) {
      case 'bullish':
        return colors.buy;
      case 'bearish':
        return colors.sell;
      case 'neutral':
        return colors.neutral;
      default:
        return colors.neutral;
    }
  };

  // Get sentiment text
  const getSentimentText = () => {
    switch (sentiment) {
      case 'bullish':
        return t('sentiment_bullish');
      case 'bearish':
        return t('sentiment_bearish');
      case 'neutral':
        return t('sentiment_neutral');
      default:
        return t('sentiment_neutral');
    }
  };

  // Get asset type badge
  const getAssetTypeBadge = () => {
    if (isCrypto) {
      return (
        <View style={[styles.assetTypeBadge, { backgroundColor: colors.crypto }]}>
          <Text style={styles.assetTypeBadgeText}>Crypto</Text>
        </View>
      );
    } else if (isIndex) {
      return (
        <View style={[styles.assetTypeBadge, { backgroundColor: colors.index }]}>
          <Text style={styles.assetTypeBadgeText}>Index</Text>
        </View>
      );
    } else if (isCommodity) {
      return (
        <View style={[styles.assetTypeBadge, { backgroundColor: colors.commodity }]}>
          <Text style={styles.assetTypeBadgeText}>Commodity</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Card 
      onPress={onPress} 
      style={[
        styles.container,
        isPremium && !userIsPremium && styles.premiumContainer
      ]}
    >
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={[styles.symbol, { color: colors.text }]}>
            {symbol}
          </Text>
          <View style={[styles.timeframeContainer, { backgroundColor: colors.borderLight }]}>
            <Text style={[styles.timeframe, { color: colors.textSecondary }]}>
              {timeframe}
            </Text>
          </View>
          {getAssetTypeBadge()}
        </View>
        
        <View style={styles.sentimentContainer}>
          {getSentimentIcon()}
          <Text style={[styles.sentiment, { color: getSentimentColor() }]}>
            {getSentimentText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('analysis_support')}
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatNumber(support)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('analysis_resistance')}
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatNumber(resistance)}
          </Text>
        </View>
        
        {strategyType && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              {t('analysis_strategy')}
            </Text>
            <Text style={[styles.detailValue, { color: colors.primary }]}>
              {strategyType.replace('_', ' ')}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
          {formatDate(createdAt)}
        </Text>
        
        {isPremium && !userIsPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: colors.warning }]}>
            <Lock size={12} color="#FFF" style={styles.premiumIcon} />
            <Text style={styles.premiumText}>{t('premium_content')}</Text>
          </View>
        )}
      </View>
      
      {isPremium && !userIsPremium && (
        <View style={[styles.overlay, { backgroundColor: `${colors.card}CC` }]}>
          <Lock size={24} color={colors.warning} />
          <Text style={[styles.overlayText, { color: colors.text }]}>
            {t('premium_content')}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  premiumContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    marginBottom: 16,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
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
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentiment: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumIcon: {
    marginRight: 4,
  },
  premiumText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  overlayText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});