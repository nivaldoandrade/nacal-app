import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { LimitedTextInput } from '@/ui/components/LimitedTextInput';
import { ModalContent, ModalFooter, ModalHeader, ModalWrapper } from '@/ui/components/ModalWrapper';
import { styles } from '@/ui/screens/mealDetails/components/AddItemModal/styles';
import { useAddItemModal } from '@/ui/screens/mealDetails/components/AddItemModal/useAddItemModal';
import { theme } from '@/ui/styles/theme';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';

export const ADD_ITEM_TEXT_MAX_LENGTH = 300;

interface IAddItemModalProps {
  mealId: string;
  visible: boolean;
  onClose: () => void;
}

export function AddItemModal({ mealId, visible, onClose }: IAddItemModalProps) {
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
                Adicionar item
              </AppText>
              <AppText color={theme.colors.gray[200]}>
                Esqueceu algo? Conte o que faltou e a gente calcula para você.
              </AppText>
            </View>

            <LimitedTextInput
              label='O que você comeu ou bebeu?'
              value={text}
              onChangeText={setText}
              disabled={isPending}
              autoFocus
              maxLength={ADD_ITEM_TEXT_MAX_LENGTH}
              placeholder='Ex.: um copo de coca 350ml'
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
