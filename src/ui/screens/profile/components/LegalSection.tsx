import { legal } from '@/app/config/legal';
import { openExternalUrl } from '@/app/libs/openExternalUrl';
import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/screens/profile/styles';
import { theme } from '@/ui/styles/theme';
import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

const links = [
  { label: 'Termos de Uso', url: legal.termsUrl },
  { label: 'Política de Privacidade', url: legal.privacyUrl },
];

export function LegalSection() {
  return (
    <View style={styles.section}>
      <AppText size='sm' weight='medium' color={theme.colors.gray[700]}>
        Sobre
      </AppText>
      <View style={styles.listCard}>
        {links.map((link, index) => (
          <Pressable
            key={link.url}
            accessibilityRole='link'
            onPress={() => openExternalUrl(link.url)}
            style={({ pressed }) => [
              styles.listRow,
              index < links.length - 1 && styles.listRowDivider,
              pressed && styles.pressed,
            ]}
          >
            <AppText style={styles.rowText}>{link.label}</AppText>
            <ChevronRightIcon size={18} color={theme.colors.gray[700]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
