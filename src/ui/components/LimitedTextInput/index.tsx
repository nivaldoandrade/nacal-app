import { AppText } from '@/ui/components/AppText';
import { InputApp } from '@/ui/components/Input';
import { styles } from '@/ui/components/LimitedTextInput/styles';
import { theme } from '@/ui/styles/theme';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

const NEAR_LIMIT_THRESHOLD = 60;

interface ILimitedTextInputProps {
  label: string;
  hint?: string;
  value: string;
  onChangeText: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function LimitedTextInput({
  label,
  hint,
  value,
  onChangeText,
  maxLength,
  placeholder,
  accessibilityLabel,
  disabled,
  autoFocus,
  containerStyle,
  inputStyle,
}: ILimitedTextInputProps) {
  const isNearLimit = value.length >= maxLength - NEAR_LIMIT_THRESHOLD;
  const helperText = isNearLimit ? `${value.length}/${maxLength}` : hint;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.helper}>
        <AppText size='sm' color={theme.colors.gray[200]}>
          {label}
        </AppText>
        {!!helperText && (
          <AppText size='xs' color={theme.colors.gray[700]}>
            {helperText}
          </AppText>
        )}
      </View>
      <InputApp
        value={value}
        onChangeText={onChangeText}
        disabled={disabled}
        multiline
        autoFocus={autoFocus}
        maxLength={maxLength}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel ?? label}
        tone='dark'
        style={inputStyle}
      />
    </View>
  );
}
