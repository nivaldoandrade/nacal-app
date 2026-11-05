import { AppText } from '@/ui/components/AppText';
import { InputApp } from '@/ui/components/Input';
import { styles } from '@/ui/components/PhotoModal/components/PhotoDescriptionInput/styles';
import { theme } from '@/ui/styles/theme';
import { View } from 'react-native';

export const PHOTO_DESCRIPTION_MAX_LENGTH = 300;

interface IPhotoDescriptionInputProps {
  value: string;
  onChangeText: (value: string) => void;
  disabled?: boolean;
}

export function PhotoDescriptionInput({
  value,
  onChangeText,
  disabled,
}: IPhotoDescriptionInputProps) {
  const isNearLimit = value.length >= PHOTO_DESCRIPTION_MAX_LENGTH - 60;

  return (
    <View style={styles.container}>
      <View style={styles.helper}>
        <AppText size='sm' color={theme.colors.gray[200]}>
          Quer contar algum detalhe?
        </AppText>
        <AppText size='xs' color={theme.colors.gray[700]}>
          {isNearLimit ? `${value.length}/${PHOTO_DESCRIPTION_MAX_LENGTH}` : 'Opcional'}
        </AppText>
      </View>
      <InputApp
        value={value}
        onChangeText={onChangeText}
        disabled={disabled}
        multiline
        maxLength={PHOTO_DESCRIPTION_MAX_LENGTH}
        placeholder='Ex.: tinha um suco também, café com açúcar, 2 ovos'
        accessibilityLabel='Quer contar algum detalhe sobre a refeição? Opcional.'
        tone='dark'
        style={styles.input}
      />
    </View>
  );
}
