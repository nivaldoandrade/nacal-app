import { AppText } from '@/ui/components/AppText';
import { input, inputDark, InputVariant, styles } from '@/ui/components/Input/styles';
import { theme } from '@/ui/styles/theme';
import { useState } from 'react';
import { BlurEvent, FocusEvent, TextInput, TextInputProps, View } from 'react-native';

type InputAppProps = Omit<TextInputProps, 'readOnly'> & InputVariant & {
	error?: boolean;
	Component?: React.ComponentType<TextInputProps>;
	ref?: React.RefObject<TextInput | null>;
	sufix?: string;
	rightAdornment?: React.ReactNode;
	tone?: 'light' | 'dark';
};

export function InputApp({
	intent,
	disabled,
	error,
	Component = TextInput,
	style,
	onFocus,
	onBlur,
	sufix,
	rightAdornment,
	tone = 'light',
	...props
}: InputAppProps) {
	const [isFocused, setIsFocused] = useState(false);

	function handleOnFocus(e: FocusEvent) {
		setIsFocused(true);
		onFocus?.(e);
	}

	function handleOnBlur(e: BlurEvent) {
		setIsFocused(false);
		onBlur?.(e);
	}

	function getInputStatus(): InputVariant['intent'] {
		if (error) {
			return 'error';
		}

		if (isFocused) {
			return 'focus';
		};

		return 'default';
	}

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<Component
					placeholderTextColor={theme.colors.gray[700]}
					style={[
						(tone === 'dark' ? inputDark : input)({ intent: getInputStatus(), disabled }),
						rightAdornment && styles.adornmentPadding,
						style,
					]}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
					readOnly={disabled}
					{...props}
				/>
				{rightAdornment && (
					<View style={[styles.adornment, disabled && styles.adormentDisabled]}>
						{rightAdornment}
					</View>
				)}
			</View>
			{sufix && (
				<AppText
					color={theme.colors.gray[700]}
					style={styles.sufix}
				>
					{sufix}
				</AppText>
			)}
		</View>
	);
}
