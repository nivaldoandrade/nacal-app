import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { CreateMealLoader } from '@/ui/components/CreateMealLoader';
import type { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { FreeQuotaNotice } from '@/ui/components/FreeQuotaNotice';
import { ModalContent, ModalFooter, ModalHeader, ModalWrapper } from '@/ui/components/ModalWrapper';
import { CameraCapture } from '@/ui/components/PhotoModal/components/CameraCapture/CameraCapture';
import { PhotoActions } from '@/ui/components/PhotoModal/PhotoActions';
import { styles } from '@/ui/components/PhotoModal/styles';
import { usePhotoModal } from '@/ui/components/PhotoModal/usePhotoModal';
import { theme } from '@/ui/styles/theme';
import { PermissionStatus } from 'expo-camera';
import { CameraIcon, LockIcon } from 'lucide-react-native';
import { Image, View } from 'react-native';

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
    isCapturing,
    cameraRef,
    requestPermission,
    handleTakePicture,
    handleTryAgain,
    handleSend,
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
              <CameraCapture
                ref={cameraRef}
                style={styles.cameraAndPhotoContainer}
              />
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
        {permission.granted && (
          <PhotoActions
            actionType={photoActionType}
            isCapturing={isCapturing}
            onTakePicture={handleTakePicture}
            onTryAgain={handleTryAgain}
            onSend={handleSend}
          />
        )}
        <FreeQuotaNotice variant='dark' />
      </ModalFooter>
    </ModalWrapper>
  );
}
