import { LimitedTextInput } from '@/ui/components/LimitedTextInput';
import { styles } from '@/ui/components/PhotoModal/components/PhotoDescriptionInput/styles';

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
  return (
    <LimitedTextInput
      label='Quer contar algum detalhe?'
      hint='Opcional'
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      maxLength={PHOTO_DESCRIPTION_MAX_LENGTH}
      placeholder='Ex.: tinha um suco também, café com açúcar, 2 ovos'
      accessibilityLabel='Quer contar algum detalhe sobre a refeição? Opcional.'
      containerStyle={styles.container}
      inputStyle={styles.input}
    />
  );
}
