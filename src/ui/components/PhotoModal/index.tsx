import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { CreateMealLoader } from '@/ui/components/CreateMealLoader';
import type { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { MealQuotaNotice } from '@/ui/components/MealQuotaNotice';
import { ModalContent, ModalFooter, ModalHeader, ModalWrapper } from '@/ui/components/ModalWrapper';
import { CameraCapture } from '@/ui/components/PhotoModal/components/CameraCapture/CameraCapture';
import { PhotoDescriptionInput } from '@/ui/components/PhotoModal/components/PhotoDescriptionInput';
import { PhotoActions } from '@/ui/components/PhotoModal/PhotoActions';
import { styles } from '@/ui/components/PhotoModal/styles';
import { usePhotoModal } from '@/ui/components/PhotoModal/usePhotoModal';
import { theme } from '@/ui/styles/theme';
import { PermissionStatus } from 'expo-camera';
import { CameraIcon, LockIcon } from 'lucide-react-native';
import { Image, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';

export type PhotoActionType = 'takePhoto' | 'reviewing';

interface IPhotoModalProps {
  visible: boolean;
  animationType: CreateMealModalAnimationType;
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
  onDismiss: () => void;
}

export function PhotoModal({
  visible,
  animationType,
  onRequestClose,
  onDismiss,
}: IPhotoModalProps) {
  const {
    isCreateMealLoaderVisible,
    photoActionType,
    permission,
    photoUri,
    description,
    isCapturing,
    cameraRef,
    requestPermission,
    handleTakePicture,
    handleTryAgain,
    handleSend,
    setDescription,
  } = usePhotoModal({ onRequestClose });

  if (!permission) {
    return;
  }

  return (
    <ModalWrapper
      animationType={animationType}
      visible={visible}
      onCloseModal={() => onRequestClose('slide')}
      onDismiss={onDismiss}
    >
      <CreateMealLoader visible={isCreateMealLoaderVisible} />
      <ModalHeader style={styles.header} onPress={() => onRequestClose('slide')} />
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
            {!permission.granted &&
              <View style={styles.permissionContainer}>
                <View style={styles.iconCircle}>
                  <CameraIcon
                    size={32}
                    color={theme.colors.lime[400]}
                    strokeWidth={1.5}
                  />
                </View>

                <AppText size='lg' color={theme.colors.gray[100]}>
                  Ativar câmera
                </AppText>

                <AppText size='sm' color={theme.colors.gray[200]} style={{ textAlign: 'center' }}>
                  Para registrar suas refeições, precisamos de acesso à câmera do
                  seu dispositivo.
                </AppText>

                {permission.status === PermissionStatus.DENIED && (
                  <AppText size='xs' color={theme.colors.gray[400]} style={{ textAlign: 'center' }}>
                    Se a câmera estiver bloqueada, permita o acesso nas
                    configurações do seu celular.
                  </AppText>
                )}

                <View style={styles.privacyBadge}>
                  <LockIcon
                    size={11}
                    color={theme.colors.lime[700]}
                    strokeWidth={2}
                  />
                  <AppText size='xs' color={theme.colors.lime[700]}>
                    Só usada no momento da foto
                  </AppText>
                </View>
              </View>
            }
            {visible && permission.granted && (
              <>
                {!photoUri ? (
                  <View style={styles.cameraAndPhotoContainer}>
                    <CameraCapture
                      ref={cameraRef}
                      style={styles.cameraAndPhotoContainer}
                    />
                    <View style={styles.framingHint}>
                      <AppText size='xs' color={theme.colors.white}>
                        Enquadre só o prato, sem rostos nem documentos
                      </AppText>
                    </View>
                  </View>
                ) : (
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.cameraAndPhotoContainer}
                  />
                )}
              </>
            )}
          </ModalContent>
          <ModalFooter style={styles.footer}>
            {!permission.granted && (
              <ButtonApp
                onPress={requestPermission}
                leftIcon={<LockIcon size={16}
                />}>
                Conceder permissão
              </ButtonApp>
            )}
            {permission.granted && photoActionType === 'reviewing' && (
              <PhotoDescriptionInput
                value={description}
                onChangeText={setDescription}
                disabled={isCreateMealLoaderVisible}
              />
            )}
            {permission.granted && (
              <PhotoActions
                actionType={photoActionType}
                isCapturing={isCapturing}
                onTakePicture={handleTakePicture}
                onTryAgain={handleTryAgain}
                onSend={handleSend}
              />
            )}
            <MealQuotaNotice variant='dark' />
          </ModalFooter>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ModalWrapper>
  );
}
