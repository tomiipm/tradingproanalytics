import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  useColorScheme
} from 'react-native';
import { X } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { useTranslation, Language } from '@/utils/i18n';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

// Define the LanguageItem type to match what getAvailableLanguages returns
interface LanguageItem {
  code: Language;
  name: string;
  nativeName: string;
}

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  const { t } = useTranslation();
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('profile_language')}
            </Text>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.languageContainer}>
            <Text style={[styles.languageInfo, { color: colors.textSecondary }]}>
              This app is currently available in English only.
            </Text>
            
            <TouchableOpacity
              style={[styles.languageItem, { borderBottomColor: colors.border }]}
              onPress={onClose}
            >
              <View style={styles.languageInfo}>
                <Text style={[styles.languageName, { color: colors.text }]}>
                  English
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  languageContainer: {
    padding: 16,
  },
  languageInfo: {
    fontSize: 14,
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
});