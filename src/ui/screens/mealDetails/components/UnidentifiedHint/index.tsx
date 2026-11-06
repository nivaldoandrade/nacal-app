import { isUnidentifiedKind, UnidentifiedKind } from '@/app/types/Meal';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { UNIDENTIFIED_COPY } from '@/ui/screens/mealDetails/components/UnidentifiedHint/copy';
import { styles } from '@/ui/screens/mealDetails/components/UnidentifiedHint/styles';
import { theme } from '@/ui/styles/theme';
import { PlusIcon } from 'lucide-react-native';
import { View } from 'react-native';

interface IUnidentifiedHintProps {
  kind: UnidentifiedKind;
  onAddItem: () => void;
}

export function UnidentifiedHint({ kind, onAddItem }: IUnidentifiedHintProps) {
  if (!isUnidentifiedKind(kind)) {
    return null;
  }

  const { icon: Icon, title, description, action } = UNIDENTIFIED_COPY[kind];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWell}>
          <Icon size={22} color={theme.colors.lime[700]} />
        </View>
        <View style={styles.texts}>
          <AppText weight='semiBold' color={theme.colors.black[700]}>
            {title}
          </AppText>
          <AppText size='sm' color={theme.colors.gray[700]}>
            {description}
          </AppText>
        </View>
      </View>
      <ButtonApp
        intent='neutral'
        leftIcon={<PlusIcon size={18} color={theme.colors.black[700]} />}
        onPress={onAddItem}
      >
        {action}
      </ButtonApp>
    </View>
  );
}
