import React, { ReactNode } from 'react';
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: object;
  contentStyle?: object;
  elevated?: boolean;
}

export default function Card({
  children,
  onPress,
  style,
  contentStyle,
  elevated = true,
}: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];

  const cardStyles = [
    styles.card,
    { 
      backgroundColor: colors.card,
      borderColor: colors.border,
      ...(elevated && {
        shadowColor: colors.shadow,
        elevation: 2,
      })
    },
    style,
  ];

  const contentStyles = [
    styles.content,
    contentStyle,
  ];

  if (onPress) {
    return (
      <Pressable
        style={cardStyles}
        onPress={onPress}
        android_ripple={{ color: colors.shadow }}
      >
        <View style={contentStyles}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View style={cardStyles}>
      <View style={contentStyles}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
});