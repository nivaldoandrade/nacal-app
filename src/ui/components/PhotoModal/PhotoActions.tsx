import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { PhotoActionType } from '@/ui/components/PhotoModal';
import { theme } from '@/ui/styles/theme';
import { CameraIcon, CheckIcon, Trash2Icon } from 'lucide-react-native';
import { View } from 'react-native';

interface IPhotoActionsProps {
  actionType?: PhotoActionType;
  isCapturing?: boolean;
  onTakePicture: () => Promise<void>;
  onTryAgain: () => void;
  onSend: () => void;
}

export function PhotoActions({
  actionType,
  isCapturing = false,
  onTakePicture,
  onTryAgain,
  onSend,
}: IPhotoActionsProps) {

  if (actionType === 'takePhoto') {
    return (
      <>
        <ButtonApp
          intent='neutral'
          size='icon'
          disabled={isCapturing}
          isLoading={isCapturing}
          onPress={onTakePicture}
        >
          <CameraIcon size={20} color={theme.colors.lime[600]} />
        </ButtonApp>
        <AppText
          color={theme.colors.gray[500]}
          style={{ textAlign: 'center' }}
        >
          Tirar foto
        </AppText>
      </>
    );
  }

  if (actionType === 'reviewing') {
    return (
      <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center' }}>
        <ButtonApp intent='neutral' size='icon' onPress={onTryAgain}>
          <Trash2Icon size={20} color={theme.colors.gray[500]} />
        </ButtonApp>
        <ButtonApp size='icon' onPress={onSend}>
          <CheckIcon size={20} />
        </ButtonApp>
      </View>
    );
  }

}
