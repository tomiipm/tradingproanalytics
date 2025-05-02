import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function FilterChip({ 
  label, 
  isSelected, 
  onPress,
  disabled = false
}: FilterChipProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  
  // Determine which theme to use (user preference or system)
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: isSelected ? colors.primary : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1
        }
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          { color: isSelected ? '#FFFFFF' : colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});