import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { CreateMealLoader } from '@/ui/components/CreateMealLoader';
import type { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { FreeQuotaNotice } from '@/ui/components/FreeQuotaNotice';
import { LimitedTextInput } from '@/ui/components/LimitedTextInput';
import { ModalContent, ModalFooter, ModalHeader, ModalWrapper } from '@/ui/components/ModalWrapper';
import { styles } from '@/ui/components/TextMealModal/styles';
import { useTextMealModal } from '@/ui/components/TextMealModal/useTextMealModal';
import { theme } from '@/ui/styles/theme';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';

export const TEXT_MEAL_MAX_LENGTH = 500;

interface ITextMealModalProps {
  visible: boolean;
  animationType: CreateMealModalAnimationType;
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
  onDismiss: () => void;
}

export function TextMealModal({
  visible,
  animationType,
  onRequestClose,
  onDismiss,
}: ITextMealModalProps) {
  const {
    text,
    setText,
    canSubmit,
    isCreateMealLoaderVisible,
    handleClose,
    handleSubmit,
  } = useTextMealModal({ onRequestClose });

  return (
    <ModalWrapper
      animationType={animationType}
      visible={visible}
      onCloseModal={handleClose}
      onDismiss={onDismiss}
    >
      <CreateMealLoader visible={isCreateMealLoaderVisible} />
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
                Descreva sua refeição
              </AppText>
              <AppText color={theme.colors.gray[200]}>
                Conte o que você comeu ou bebeu e a gente calcula para você.
              </AppText>
            </View>

            <LimitedTextInput
              label='O que você comeu ou bebeu?'
              value={text}
              onChangeText={setText}
              disabled={isCreateMealLoaderVisible}
              autoFocus
              maxLength={TEXT_MEAL_MAX_LENGTH}
              placeholder='Ex.: no almoço comi arroz, feijão, um bife e salada'
              inputStyle={styles.input}
            />
          </ModalContent>

          <ModalFooter style={styles.footer}>
            <ButtonApp onPress={handleSubmit} disabled={!canSubmit}>
              Registrar
            </ButtonApp>
            <FreeQuotaNotice variant='dark' />
          </ModalFooter>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ModalWrapper>
  );
}
