import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp, TrendingDown, Minus, Lock, Lightbulb } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from '@/utils/i18n';
import Colors from '@/constants/colors';
import Card from '@/components/Card';

interface SignalCardProps {
  id: string;
  symbol: string;
  timeframe: string;
  type: 'buy' | 'sell' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
  entry: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  confidence: number;
  createdAt: Date | string;
  isPremium?: boolean;
  isCrypto?: boolean;
  isIndex?: boolean;
  isCommodity?: boolean;
  strategyType?: string;
}

export default function SignalCard({
  id,
  symbol,
  timeframe,
  type,
  strength,
  entry,
  stopLoss,
  takeProfit,
  confidence,
  createdAt,
  isPremium = false,
  isCrypto = false,
  isIndex = false,
  isCommodity = false,
  strategyType,
}: SignalCardProps) {
  const router = useRouter();
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
    const signalDate = typeof date === 'string' ? new Date(date) : date;
    
    // Calculate time difference in milliseconds
    const diff = now.getTime() - signalDate.getTime();
    
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

  // Handle card press
  const handlePress = () => {
    if (isPremium && !userIsPremium) {
      // Navigate to subscription page if premium signal and user is not premium
      router.push('/subscription');
    } else {
      // Navigate to signal details
      router.push(`/signal/${id}`);
    }
  };

  // Get type icon
  const getTypeIcon = () => {
    switch (type) {
      case 'buy':
        return <TrendingUp size={20} color={colors.buy} />;
      case 'sell':
        return <TrendingDown size={20} color={colors.sell} />;
      case 'neutral':
        return <Minus size={20} color={colors.neutral} />;
      default:
        return <Minus size={20} color={colors.neutral} />;
    }
  };

  // Get type color
  const getTypeColor = () => {
    switch (type) {
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
    switch (type) {
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
    switch (strength) {
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
    <Card onPress={handlePress} style={styles.container}>
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
        
        <View style={styles.typeContainer}>
          {getTypeIcon()}
          <Text style={[styles.type, { color: getTypeColor() }]}>
            {getTypeText()} • {getStrengthText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('signal_entry')}
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatNumber(entry)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('signal_stop_loss')}
          </Text>
          <Text style={[styles.detailValue, { color: colors.danger }]}>
            {formatNumber(stopLoss)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('signal_take_profit')}
          </Text>
          <Text style={[styles.detailValue, { color: colors.success }]}>
            {formatNumber(takeProfit)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
            {t('signal_confidence')}
          </Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {confidence}%
          </Text>
        </View>
        
        {strategyType && (
          <View style={[styles.strategyContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Lightbulb size={16} color={colors.primary} style={styles.strategyIcon} />
            <Text style={[styles.strategyText, { color: colors.text }]}>
              {strategyType.replace('_', ' ')} Strategy
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
          {formatDate(createdAt)}
        </Text>
        <Pressable 
          style={[
            styles.viewButton,
            { backgroundColor: isPremium && !userIsPremium ? colors.warning : colors.primary }
          ]}
          onPress={handlePress}
        >
          {isPremium && !userIsPremium ? (
            <Lock size={14} color="#FFF" style={styles.viewButtonIcon} />
          ) : null}
          <Text style={styles.viewButtonText}>
            {isPremium && !userIsPremium 
              ? t('premium_unlock') 
              : t('signal_view_details')}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
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
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
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
  strategyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  strategyIcon: {
    marginRight: 8,
  },
  strategyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewButtonIcon: {
    marginRight: 4,
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});