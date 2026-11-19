import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { AppText } from '@/ui/components/AppText';
import { Avatar } from '@/ui/components/Avatar';
import { styles } from '@/ui/screens/profile/styles';
import { theme } from '@/ui/styles/theme';
import { getAge } from '@/ui/utils/getAge';
import { useNavigation } from '@react-navigation/native';
import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export function ProfileCard() {
  const { navigate } = useNavigation<AppStackNavigatorProps>();
  const { account } = useAccount();

  if (!account) {
    return null;
  }

  const { name, birthDate, height, weight } = account.profile;
  const age = getAge(birthDate, new Date());
  const summary = [
    `${age} ${age === 1 ? 'ano' : 'anos'}`,
    `${numberFormat.format(height)} cm`,
    `${numberFormat.format(weight)} kg`,
  ].join(' · ');

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={`Editar perfil de ${name}`}
      onPress={() => navigate('EditProfile')}
      style={({ pressed }) => [styles.profileCard, pressed && styles.pressed]}
    >
      <Avatar name={name} />
      <View style={styles.rowText}>
        <AppText weight='semiBold' numberOfLines={1}>{name}</AppText>
        <AppText size='sm' color={theme.colors.gray[700]}>{summary}</AppText>
      </View>
      <ChevronRightIcon size={18} color={theme.colors.gray[700]} />
    </Pressable>
  );
}
