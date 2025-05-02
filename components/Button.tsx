import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useColorScheme } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useUserStore();
  const effectiveColorScheme = theme === 'system' ? colorScheme : theme;
  const colors = Colors[effectiveColorScheme as keyof typeof Colors];

  // Determine button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? `${colors.primary}80` : colors.primary,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? `${colors.secondary}80` : colors.secondary,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? `${colors.primary}80` : colors.primary,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: disabled ? `${colors.danger}80` : colors.danger,
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: disabled ? `${colors.primary}80` : colors.primary,
          borderColor: 'transparent',
        };
    }
  };

  // Determine text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return disabled ? `${colors.primary}80` : colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 6,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderRadius: 10,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
    }
  };

  // Determine text size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyles = getButtonStyles();
  const textColor = getTextColor();
  const buttonSize = getButtonSize();
  const fontSize = getTextSize();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles,
        buttonSize,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize },
              icon && (iconPosition === 'left' ? styles.textWithLeftIcon : styles.textWithRightIcon),
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithLeftIcon: {
    marginLeft: 8,
  },
  textWithRightIcon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
});