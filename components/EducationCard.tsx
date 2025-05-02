import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  useColorScheme 
} from 'react-native';
import { Clock, GraduationCap, CheckCircle } from 'lucide-react-native';
import { EducationCategory, EducationLevel } from '@/types';
import { useUserStore } from '@/store/userStore';
import { useEducationStore } from '@/store/educationStore';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { useTranslation } from '@/utils/i18n';

interface EducationCardProps {
  id: string;
  title: string;
  description: string;
  category: EducationCategory;
  level: EducationLevel;
  readingTimeMinutes: number;
  imageUrl: string;
  onPress: () => void;
}

export default function EducationCard({ 
  id,
  title, 
  description, 
  category, 
  level, 
  readingTimeMinutes, 
  imageUrl, 
  onPress 
}: EducationCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  const { completedArticles } = useEducationStore();
  
  const isCompleted = completedArticles.includes(id);
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'BASICS': return t('education_filter_basics');
      case 'TECHNICAL': return t('education_filter_technical');
      case 'FUNDAMENTAL': return t('education_filter_fundamental');
      case 'PSYCHOLOGY': return t('education_filter_psychology');
      case 'RISK_MANAGEMENT': return t('education_filter_risk');
      default: return category;
    }
  };
  
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER': return t('education_level_beginner');
      case 'INTERMEDIATE': return t('education_level_intermediate');
      case 'ADVANCED': return t('education_level_advanced');
      default: return level;
    }
  };
  
  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {getCategoryLabel(category)}
          </Text>
        </View>
        
        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: colors.success }]}>
            <CheckCircle size={12} color="#FFFFFF" fill="#FFFFFF" style={styles.completedIcon} />
            <Text style={styles.completedText}>
              Completed
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {title}
        </Text>
        
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.levelContainer}>
            <GraduationCap size={14} color={colors.textSecondary} style={styles.icon} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {getLevelLabel(level)}
            </Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.textSecondary} style={styles.icon} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {readingTimeMinutes} {t('education_minutes')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedIcon: {
    marginRight: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
  },
});