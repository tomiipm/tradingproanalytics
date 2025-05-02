import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { Crown, ShoppingCart } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';

interface SubscriptionBannerProps {
  message: string;
  buttonText: string;
  onPress: () => void;
}

export default function SubscriptionBanner({ message, buttonText, onPress }: SubscriptionBannerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
      <View style={styles.content}>
        {Platform.OS === 'android' ? (
          <ShoppingCart size={20} color={colors.warning} style={styles.icon} />
        ) : (
          <Crown size={20} color={colors.warning} style={styles.icon} />
        )}
        <Text style={[styles.message, { color: colors.text }]}>
          {message}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.warning }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});