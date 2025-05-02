import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ScrollView, 
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  GraduationCap, 
  Filter, 
  AlertTriangle 
} from 'lucide-react-native';
import { useEducationStore } from '@/store/educationStore';
import { useUserStore } from '@/store/userStore';
import { EducationContent } from '@/types';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import EducationCard from '@/components/EducationCard';
import FilterChip from '@/components/FilterChip';
import EmptyState from '@/components/EmptyState';
import { useTranslation } from '@/utils/i18n';

export default function EducationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const { 
    articles, 
    isLoading, 
    error,
    fetchArticles
  } = useEducationStore();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  useEffect(() => {
    if (articles.length === 0) {
      fetchArticles();
    }
  }, []);
  
  const handleArticlePress = (id: string) => {
    router.push(`/education/${id}`);
  };
  
  // Filter articles based on active filter
  const filteredArticles = articles.filter((article: EducationContent) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'basics') return article.category === 'BASICS';
    if (activeFilter === 'technical') return article.category === 'TECHNICAL';
    if (activeFilter === 'fundamental') return article.category === 'FUNDAMENTAL';
    if (activeFilter === 'psychology') return article.category === 'PSYCHOLOGY';
    if (activeFilter === 'risk') return article.category === 'RISK_MANAGEMENT';
    return true;
  });
  
  const renderArticleCard = ({ item }: { item: EducationContent }) => (
    <EducationCard
      id={item.id}
      title={item.title}
      description={item.description}
      category={item.category}
      level={item.level}
      readingTimeMinutes={item.readingTimeMinutes}
      imageUrl={item.imageUrl}
      onPress={() => handleArticlePress(item.id)}
    />
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={t('education_title')}
        subtitle={t('education_subtitle')}
        showNotification
      />
      
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
            label={t('education_filter_all')}
            isSelected={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterChip
            label={t('education_filter_basics')}
            isSelected={activeFilter === 'basics'}
            onPress={() => setActiveFilter('basics')}
          />
          <FilterChip
            label={t('education_filter_technical')}
            isSelected={activeFilter === 'technical'}
            onPress={() => setActiveFilter('technical')}
          />
          <FilterChip
            label={t('education_filter_fundamental')}
            isSelected={activeFilter === 'fundamental'}
            onPress={() => setActiveFilter('fundamental')}
          />
          <FilterChip
            label={t('education_filter_psychology')}
            isSelected={activeFilter === 'psychology'}
            onPress={() => setActiveFilter('psychology')}
          />
          <FilterChip
            label={t('education_filter_risk')}
            isSelected={activeFilter === 'risk'}
            onPress={() => setActiveFilter('risk')}
          />
        </ScrollView>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('loading')}
          </Text>
        </View>
      ) : error ? (
        <EmptyState
          icon={<AlertTriangle size={48} color={colors.textSecondary} />}
          title={t('education_error')}
          message={t('education_error_message')}
          actionLabel={t('retry')}
          onAction={fetchArticles}
        />
      ) : filteredArticles.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={48} color={colors.textSecondary} />}
          title={t('education_empty')}
          message={t('education_empty_message')}
          actionLabel={t('filter_all')}
          onAction={() => setActiveFilter('all')}
        />
      ) : (
        <FlatList
          data={filteredArticles}
          renderItem={renderArticleCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
});