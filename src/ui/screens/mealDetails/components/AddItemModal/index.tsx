import { isUnidentifiedKind, UnidentifiedKind } from '@/app/types/Meal';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { LimitedTextInput } from '@/ui/components/LimitedTextInput';
import { ModalContent, ModalFooter, ModalHeader, ModalWrapper } from '@/ui/components/ModalWrapper';
import { styles } from '@/ui/screens/mealDetails/components/AddItemModal/styles';
import { useAddItemModal } from '@/ui/screens/mealDetails/components/AddItemModal/useAddItemModal';
import { UNIDENTIFIED_COPY } from '@/ui/screens/mealDetails/components/UnidentifiedHint/copy';
import { theme } from '@/ui/styles/theme';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';

export const ADD_ITEM_TEXT_MAX_LENGTH = 300;

const DEFAULT_COPY = {
  title: 'Adicionar item',
  subtitle: 'Esqueceu algo? Conte o que faltou e a gente calcula para você.',
  placeholder: 'Ex.: um copo de coca 350ml',
};

function getModalCopy(hint: UnidentifiedKind | null | undefined) {
  if (!isUnidentifiedKind(hint)) {
    return DEFAULT_COPY;
  }

  const copy = UNIDENTIFIED_COPY[hint];

  return {
    title: copy.action,
    subtitle: copy.modalSubtitle ?? DEFAULT_COPY.subtitle,
    placeholder: copy.modalPlaceholder ?? DEFAULT_COPY.placeholder,
  };
}

interface IAddItemModalProps {
  mealId: string;
  hint?: UnidentifiedKind | null;
  visible: boolean;
  onClose: () => void;
}

export function AddItemModal({ mealId, hint, visible, onClose }: IAddItemModalProps) {
  const copy = getModalCopy(hint);

  const {
    text,
    setText,
    isPending,
    canSubmit,
    handleClose,
    handleDismiss,
    handleSubmit,
  } = useAddItemModal({ mealId, onClose });

  return (
    <ModalWrapper
      visible={visible}
      onCloseModal={handleClose}
      onDismiss={handleDismiss}
    >
      <ModalHeader style={styles.header} onPress={handleClose} />
      <TouchableWithoutFeedback
        accessible={false}
        disabled={Platform.OS === 'web'}
        onPress={Keyboard.dismiss}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'web' ? undefined : 'padding'}
        >
          <ModalContent style={styles.content}>
            <View style={styles.titleContainer}>
              <AppText size='2xl' weight='semiBold' color={theme.colors.white}>
                {copy.title}
              </AppText>
              <AppText color={theme.colors.gray[200]}>
                {copy.subtitle}
              </AppText>
            </View>

            <LimitedTextInput
              label='O que você comeu ou bebeu?'
              value={text}
              onChangeText={setText}
              disabled={isPending}
              autoFocus
              maxLength={ADD_ITEM_TEXT_MAX_LENGTH}
              placeholder={copy.placeholder}
              inputStyle={styles.input}
            />
          </ModalContent>

          <ModalFooter style={styles.footer}>
            <ButtonApp
              onPress={handleSubmit}
              disabled={!canSubmit}
              isLoading={isPending}
            >
              Adicionar
            </ButtonApp>
          </ModalFooter>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ModalWrapper>
  );
}
