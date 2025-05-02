import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { formatDistanceToNow } from '@/utils/dateUtils';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

interface ApiStatusIndicatorProps {
  isConnected: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export default function ApiStatusIndicator({ 
  isConnected, 
  lastUpdated, 
  onRefresh 
}: ApiStatusIndicatorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];
  
  const getFormattedTime = () => {
    if (!lastUpdated) return 'Never';
    return formatDistanceToNow(lastUpdated);
  };
  
  return (
    <Pressable
      onPress={onRefresh}
      style={styles.container}
      hitSlop={8}
    >
      <RefreshCw size={18} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.text}>
        {isConnected ? 'Updated ' + getFormattedTime() : 'Tap to refresh'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});