import { AppText } from '@/ui/components/AppText';
import { button, ButtonVariants, styles } from '@/ui/components/Button/styles';
import { theme } from '@/ui/styles/theme';
import { ReactNode } from 'react';
import { ActivityIndicator, Platform, Pressable, PressableProps, View } from 'react-native';

type ButtonProps = Omit<PressableProps, 'disabled'> & ButtonVariants & {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function ButtonApp({
  children,
  intent,
  size,
  disabled,
  isLoading,
  style,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const childrenElement = (
    typeof children === 'string'
      ? (
        <View style={styles.content}>
          {leftIcon}
          <AppText weight='medium'>{children}</AppText>
          {rightIcon}
        </View>
      )
      : children
  );

  return (
    <Pressable
      android_ripple={{ color: 'rgba(0, 0, 0, 0.2)' }}
      style={({ pressed }) => [
        button({ intent, size, disabled: disabled || isLoading }),
        typeof style === 'function' ? style({ pressed }) : style,
        pressed && {
          ...Platform.select({
            ios: { opacity: 0.7 },
            web: { opacity: 0.4 },
            default: null,
          }),
        },
      ]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading
        ? <ActivityIndicator color={theme.colors.black[700]} />
        : childrenElement
      }
    </Pressable>

  );
}
