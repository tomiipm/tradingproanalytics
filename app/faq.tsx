import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { useTranslation } from '@/utils/i18n';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  
  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  const faqItems: FAQItem[] = [
    {
      question: t("faq_question_1"),
      answer: t("faq_answer_1")
    },
    {
      question: t("faq_question_2"),
      answer: t("faq_answer_2")
    },
    {
      question: t("faq_question_3"),
      answer: t("faq_answer_3")
    },
    {
      question: t("faq_question_4"),
      answer: t("faq_answer_4")
    },
    {
      question: t("faq_question_5"),
      answer: t("faq_answer_5")
    },
    {
      question: t("faq_question_6"),
      answer: t("faq_answer_6")
    },
    {
      question: t("faq_question_7"),
      answer: t("faq_answer_7")
    },
    {
      question: t("faq_question_8"),
      answer: t("faq_answer_8")
    },
    {
      question: t("faq_question_9"),
      answer: t("faq_answer_9")
    },
    {
      question: t("faq_question_10"),
      answer: t("faq_answer_10")
    }
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("faq_title")}
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t("faq_description")}
        </Text>
        
        {faqItems.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.faqItem, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.border
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.questionContainer}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.question, { color: colors.text }]}>
                {item.question}
              </Text>
              {expandedIndex === index ? (
                <ChevronUp size={20} color={colors.primary} />
              ) : (
                <ChevronDown size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <Text style={[styles.answer, { color: colors.textSecondary }]}>
                {item.answer}
              </Text>
            )}
          </View>
        ))}
        
        <View style={styles.contactSection}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            {t("faq_still_have_questions")}
          </Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            {t("faq_contact_us")}
          </Text>
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/help-center')}
          >
            <Text style={styles.contactButtonText}>
              {t("faq_contact_support")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  answer: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});