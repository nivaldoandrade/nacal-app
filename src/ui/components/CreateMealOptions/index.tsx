import { AppText } from '@/ui/components/AppText';
import type { CreateMealModalType } from '@/ui/components/CreateMealModals';
import { styles } from '@/ui/components/CreateMealOptions/styles';
import { CameraIcon, CaseSensitiveIcon, LucideIcon, MicIcon } from 'lucide-react-native';
import { Platform, Pressable, PressableProps, View } from 'react-native';

interface ICreateMealOptionsProps {
  disabled?: boolean;
  onSelect?: (type: Exclude<CreateMealModalType, null>) => void;
}

export function CreateMealOptions({
  disabled,
  onSelect,
}: ICreateMealOptionsProps,
) {

  return (
    <View style={styles.container}>
      <OptionButton
        icon={MicIcon}
        label='Áudio'
        disabled={disabled}
        onPress={() => onSelect?.('audio')}
      />
      <OptionButton
        icon={CameraIcon}
        label='Foto'
        disabled={disabled}
        onPress={() => onSelect?.('photo')}
      />
      <OptionButton
        icon={CaseSensitiveIcon}
        label='Texto'
        disabled={disabled}
        onPress={() => onSelect?.('text')}
      />
    </View>
  );
}

interface IOptionButtonProps extends PressableProps {
  icon: LucideIcon;
  label: string;
}

function OptionButton({ icon: Icon, label, disabled = false, ...props }: IOptionButtonProps) {
  return (
    <View style={styles.buttonWrapper}>
      <Pressable
        android_ripple={{ color: 'rgba(0, 0, 0, 0.2)' }}
        disabled={disabled}
        style={({ pressed }) => [
          styles.buttonContainer,
          (pressed || disabled) && {
            ...Platform.select({
              ios: { opacity: 0.7 },
              web: { opacity: 0.4 },
              default: null,
            }),
          },
        ]}
        {...props}
      >
        <View style={styles.icon}>
          <Icon size={24} />
        </View>
        <AppText weight='semiBold' style={{ letterSpacing: -0.16 }}>
          {label}
        </AppText>
      </Pressable>
    </View>
  );
}
