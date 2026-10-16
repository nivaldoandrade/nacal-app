import { AppText } from '@/ui/components/AppText';
import { Actions } from '@/ui/components/AudioModal/Actions';
import { styles } from '@/ui/components/AudioModal/styles';
import { useAudioModal } from '@/ui/components/AudioModal/useAudioModal';
import { CreateMealLoader } from '@/ui/components/CreateMealLoader';
import { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { FreeQuotaNotice } from '@/ui/components/FreeQuotaNotice';
import {
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalWrapper,
} from '@/ui/components/ModalWrapper';
import { theme } from '@/ui/styles/theme';
import { View } from 'react-native';

export type ActionType = 'startRecord' | 'recording' | 'reviewing';

interface IAudioModalProps {
  visible: boolean;
  animationType: CreateMealModalAnimationType;
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
  onDismiss: () => void;
}

export function AudioModal({
  visible,
  animationType,
  onRequestClose,
  onDismiss,
}: IAudioModalProps) {

  const {
    isRecording,
    recordingStatus,
    handleTryAgain,
    handleSend,
    handleChangeRecordingStatus,
    recordedUri,
    audioRecorder,
    isCreateMealLoaderVisible,
  } = useAudioModal({ visible, onRequestClose });

  return (
    <ModalWrapper
      style={styles.wrapper}
      visible={visible}
      animationType={animationType}
      onCloseModal={() => onRequestClose('slide')}
      onDismiss={onDismiss}
    >
      <CreateMealLoader visible={isCreateMealLoaderVisible} />
      <ModalHeader style={styles.header} onPress={() => onRequestClose('slide')} />
      <ModalContent style={styles.content}>
        <View style={[styles.circle1, isRecording && styles.circle1Recording]}>
          <View style={[styles.circle2, isRecording && styles.circle2Recording]}>
            <View style={[styles.circle3, isRecording && styles.circle3Recording]} />
          </View>
        </View>

        <View style={styles.exampleContent}>
          <AppText color={theme.colors.gray[500]} style={{ textAlign: 'center' }}>
            Tente dizer algo como: 100g de Arroz, 2 Ovos e 100g de Salada
          </AppText>
        </View>
      </ModalContent>
      <ModalFooter style={styles.footer}>
        <Actions
          actionType={recordingStatus}
          onTryAgain={handleTryAgain}
          onSend={handleSend}
          onChangeRecordingStatus={handleChangeRecordingStatus}
          recordedUri={recordedUri}
          audioRecorder={audioRecorder}
        />
        <FreeQuotaNotice variant='dark' />
      </ModalFooter>
    </ModalWrapper>
  );
}

