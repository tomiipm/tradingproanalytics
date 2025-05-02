import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  ScrollView,
  useColorScheme 
} from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useTranslation } from '@/utils/i18n';
import { useSignalStore } from '@/store/signalStore';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import SignalCard from '@/components/SignalCard';
import FilterChip from '@/components/FilterChip';
import EmptyState from '@/components/EmptyState';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import Button from '@/components/Button';

// Filter types
type FilterType = 'all' | 'buy' | 'sell' | 'strong' | 'moderate' | 'weak';

export default function SignalsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { signals, fetchSignals, isLoading, error } = useSignalStore();
  const { isPremium } = useUserStore();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  // State for filters
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['all']);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch signals on mount
  useEffect(() => {
    fetchSignals(isPremium);
  }, [fetchSignals, isPremium]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSignals(isPremium);
    setRefreshing(false);
  };

  // Handle filter selection
  const handleFilterPress = (filter: FilterType) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.filter(f => f !== 'all');
      if (newFilters.includes(filter)) {
        // Remove filter if already selected
        if (newFilters.length === 1) {
          // If it's the last filter, revert to 'all'
          setActiveFilters(['all']);
        } else {
          setActiveFilters(newFilters.filter(f => f !== filter));
        }
      } else {
        // Add filter
        setActiveFilters([...newFilters, filter]);
      }
    }
  };

  // Filter signals based on active filters - ONLY FOREX
  const filteredSignals = signals
    // First filter to only include forex signals (not crypto, not indices, not commodities)
    .filter(signal => !signal.isCrypto && !signal.isIndex && !signal.isCommodity)
    // Then apply the active filters
    .filter(signal => {
      if (activeFilters.includes('all')) return true;
      
      const typeMatch = activeFilters.includes(signal.type.toLowerCase() as FilterType);
      const strengthMatch = activeFilters.includes(signal.strength.toLowerCase() as FilterType);
      
      return typeMatch || strengthMatch;
    });

  // Handle navigation to notifications
  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  // Handle navigation to search
  const handleSearchPress = () => {
    // Implement search functionality
    console.log('Search pressed');
  };

  // Render filter chips
  const renderFilterChips = () => {
    const filters: { key: FilterType; label: string }[] = [
      { key: 'all', label: t('filter_all') },
      { key: 'buy', label: t('filter_buy') },
      { key: 'sell', label: t('filter_sell') },
      { key: 'strong', label: t('filter_strong') },
      { key: 'moderate', label: t('filter_moderate') },
      { key: 'weak', label: t('filter_weak') },
    ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map(filter => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            isSelected={activeFilters.includes(filter.key)}
            onPress={() => handleFilterPress(filter.key)}
          />
        ))}
      </ScrollView>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <EmptyState
        title={t('signals_empty')}
        message={t('signals_empty_message')}
        icon={<AlertTriangle size={48} color={colors.warning} />}
        buttonTitle={t('signals_refresh')}
        onButtonPress={handleRefresh}
      />
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <AlertTriangle size={48} color={colors.danger} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          {t('signals_error')}
        </Text>
        <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
          {t('signals_error_message')}
        </Text>
        <Button
          title={t('retry')}
          onPress={handleRefresh}
          variant="primary"
          size="medium"
          icon={<RefreshCw size={16} color={colors.card} />}
        />
      </View>
    );
  };

  // Render list header
  const renderListHeader = () => {
    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('signals_filter_by')}
          </Text>
        </View>
        {renderFilterChips()}
        
        {!isPremium && (
          <SubscriptionBanner 
            message={t('signals_subscription_banner')}
            buttonText={t('subscribe_now')}
            onPress={() => router.push('/subscription')}
          />
        )}
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('signals_forex_only')}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={t('signals_title')}
        subtitle={t('signals_subtitle')}
        showNotification
        showSearch
        onNotificationPress={handleNotificationPress}
        onSearchPress={handleSearchPress}
      />
      
      {error ? (
        renderError()
      ) : (
        <FlatList
          data={filteredSignals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SignalCard
              id={item.id}
              symbol={item.pair || item.symbol || ""}
              timeframe={item.timeFrame || item.timeframe || ""}
              type={(item.type || "neutral").toLowerCase() as 'buy' | 'sell' | 'neutral'}
              strength={(item.strength || "moderate").toLowerCase() as 'strong' | 'moderate' | 'weak'}
              entry={item.entryPrice || item.entry || null}
              stopLoss={item.stopLoss || null}
              takeProfit={item.takeProfit1 || item.takeProfit || null}
              confidence={item.confidence || 0}
              createdAt={item.timestamp || item.createdAt || new Date()}
              isPremium={item.isPremium || false}
              isCrypto={false}
              isIndex={false}
              isCommodity={false}
              strategyType={item.aiStrategy?.type}
            />
          )}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
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
  listContent: {
    paddingBottom: 100, // Extra padding for bottom tab bar
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});