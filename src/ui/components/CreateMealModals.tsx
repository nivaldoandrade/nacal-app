import { AudioModal } from '@/ui/components/AudioModal';
import { PhotoModal } from '@/ui/components/PhotoModal';
import { TextMealModal } from '@/ui/components/TextMealModal';

export type CreateMealModalType = 'audio' | 'photo' | 'text' | null;
export type CreateMealModalAnimationType = 'slide' | 'fade';

interface ICreateMealModalsProps {
  activeCreateMealModal: CreateMealModalType;
  visible: boolean;
  animationType: CreateMealModalAnimationType;
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
  onDismiss: () => void;
}

export function CreateMealModals({
  activeCreateMealModal,
  ...props
}: ICreateMealModalsProps) {

  if (activeCreateMealModal === 'audio') {
    return <AudioModal {...props} />;
  }

  if (activeCreateMealModal === 'photo') {
    return <PhotoModal {...props} />;
  }

  if (activeCreateMealModal === 'text') {
    return <TextMealModal {...props} />;
  }

  return null;
}
