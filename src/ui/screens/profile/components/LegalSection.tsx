import { getDeleteAccountUrl, legal } from '@/app/config/legal';
import { useAccount } from '@/app/hooks/queries/useAccount';
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
  const { email } = useAccount();

  return (
    <View style={styles.planSection}>
      <AppText size='sm' weight='medium' color={theme.colors.gray[700]}>
        Sobre
      </AppText>
      <View style={styles.legalCard}>
        {links.map((link) => (
          <Pressable
            key={link.url}
            accessibilityRole='link'
            onPress={() => openExternalUrl(link.url)}
            style={[styles.legalRow, styles.legalRowDivider]}
          >
            <AppText style={styles.legalRowText}>{link.label}</AppText>
            <ChevronRightIcon size={18} color={theme.colors.gray[700]} />
          </Pressable>
        ))}
        <Pressable
          accessibilityRole='link'
          onPress={() => openExternalUrl(getDeleteAccountUrl(email))}
          style={styles.legalRow}
        >
          <View style={styles.legalRowText}>
            <AppText>Excluir conta</AppText>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Abrimos um e-mail para {legal.supportEmail} com o e-mail da sua conta. Se ele sair de outro endereço, confirmamos o pedido pelo e-mail da conta. Apagamos tudo em até 15 dias.
            </AppText>
          </View>
          <ChevronRightIcon size={18} color={theme.colors.gray[700]} />
        </Pressable>
      </View>
    </View>
  );
}
