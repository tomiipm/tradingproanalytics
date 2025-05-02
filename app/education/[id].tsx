import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  useColorScheme,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Award,
  Share2
} from 'lucide-react-native';
import { useEducationStore } from '@/store/educationStore';
import { useUserStore } from '@/store/userStore';
import { EducationContent } from '@/types';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTranslation } from '@/utils/i18n';

export default function EducationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const { articles, isLoading, getArticleById, markArticleAsCompleted } = useEducationStore();
  const [article, setArticle] = useState<EducationContent | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id as string);
      setArticle(foundArticle || null);
    }
  }, [id, articles]);
  
  useEffect(() => {
    // Mark article as read when viewed
    if (article && id) {
      markArticleAsCompleted(id as string);
    }
  }, [article, id]);
  
  // Format category text
  const formatCategory = (category: string) => {
    switch (category) {
      case 'BASICS':
        return t('education_filter_basics');
      case 'TECHNICAL':
        return t('education_filter_technical');
      case 'FUNDAMENTAL':
        return t('education_filter_fundamental');
      case 'PSYCHOLOGY':
        return t('education_filter_psychology');
      case 'RISK_MANAGEMENT':
        return t('education_filter_risk');
      default:
        return category;
    }
  };
  
  // Format level text
  const formatLevel = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return t('education_level_beginner');
      case 'INTERMEDIATE':
        return t('education_level_intermediate');
      case 'ADVANCED':
        return t('education_level_advanced');
      default:
        return level;
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  // Handle share
  const handleShare = () => {
    // Share functionality would go here
    console.log('Share article:', article?.title);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!article) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Article not found
        </Text>
        <Button
          title={t('go_back')}
          onPress={handleBack}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: '',
          headerShown: false,
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.overlay, { backgroundColor: `${colors.background}80` }]} />
          <Button
            title=""
            icon={<ArrowLeft size={20} color={colors.text} />}
            variant="ghost"
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: `${colors.card}CC` }]}
          />
          <Button
            title=""
            icon={<Share2 size={20} color={colors.text} />}
            variant="ghost"
            onPress={handleShare}
            style={[styles.shareButton, { backgroundColor: `${colors.card}CC` }]}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.metaContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {formatCategory(article.category)}
              </Text>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {article.readingTimeMinutes} {t('education_minutes')}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <BookOpen size={16} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {formatDate(article.createdAt)}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Award size={16} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {formatLevel(article.level)}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {article.title}
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {article.description}
          </Text>
          
          <Card style={styles.contentCard}>
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              {article.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl."}
            </Text>
          </Card>
          
          {article.tags && article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={[styles.tagsTitle, { color: colors.text }]}>
                Tags
              </Text>
              <View style={styles.tagsList}>
                {article.tags.map((tag, index) => (
                  <View 
                    key={index} 
                    style={[styles.tagBadge, { backgroundColor: colors.borderLight }]}
                  >
                    <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
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

const { width } = Dimensions.get('window');

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
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 80, // Extra space for bottom navigation
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  shareButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  contentContainer: {
    padding: 16,
  },
  metaContainer: {
    marginBottom: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  contentCard: {
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
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