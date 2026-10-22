import { Toaster } from '@/app/libs/sonner';
import { ButtonApp } from '@/ui/components/Button';
import { styles } from '@/ui/components/ModalWrapper/styles';
import { theme } from '@/ui/styles/theme';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { StatusBar } from 'expo-status-bar';
import { XIcon } from 'lucide-react-native';
import { Modal, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const MODAL_TOASTER_ID = 'modal';

interface IModalWrapperProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>;
  visible?: boolean;
  onCloseModal: () => void;
  animationType?: 'slide' | 'fade';
  onDismiss?: () => void;
}

export function ModalWrapper({
  children,
  style,
  visible,
  onCloseModal,
  animationType = 'slide',
  onDismiss,
}: IModalWrapperProps) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType={animationType}
      onRequestClose={onCloseModal}
      onDismiss={onDismiss}
    >
      <StatusBar style='light' />
      <View style={styles.container}>
        <SafeAreaProvider>
          <View style={[styles.wrapper, { paddingTop: top, paddingBottom: bottom }, style]}>
            {children}
          </View>
          <Toaster
            id={MODAL_TOASTER_ID}
            fullWindowOverlay={false}
            position='bottom-center'
          />
        </SafeAreaProvider>
      </View>
    </Modal>
  );
}

interface IModalHeaderProps {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export function ModalHeader({ style, onPress }: IModalHeaderProps) {

  return (
    <View style={[styles.header, style]}>
      <ButtonApp intent='neutral' size='icon' onPress={onPress}>
        <XIcon size={20} color={theme.colors.gray[500]} />
      </ButtonApp>
    </View>
  );
}

interface IModalContentProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>;
}

export function ModalContent({ children, style }: IModalContentProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

interface IModalFooterProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>;
}

export function ModalFooter({ children, style }: IModalFooterProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}
