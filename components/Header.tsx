import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showSearch?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  showNotification = false,
  showSearch = false,
  onSearchPress,
  onNotificationPress,
}: HeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              hitSlop={8}
            >
              <ArrowLeft size={20} color={colors.text} />
            </Pressable>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          {showSearch && (
            <Pressable
              onPress={onSearchPress}
              style={[styles.iconButton, { backgroundColor: colors.card }]}
              hitSlop={8}
            >
              <Search size={20} color={colors.text} />
            </Pressable>
          )}
          {showNotification && (
            <Pressable
              onPress={onNotificationPress}
              style={[styles.iconButton, { backgroundColor: colors.card, marginLeft: 8 }]}
              hitSlop={8}
            >
              <Bell size={20} color={colors.text} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});