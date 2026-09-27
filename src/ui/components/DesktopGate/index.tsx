import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/components/DesktopGate/styles';
import { useDesktopGate } from '@/ui/components/DesktopGate/useDesktopGate';
import { theme } from '@/ui/styles/theme';
import { SmartphoneIcon } from 'lucide-react-native';
import { ReactNode } from 'react';
import { View } from 'react-native';

interface IDesktopGateProps {
  children: ReactNode;
}

export function DesktopGate({ children }: IDesktopGateProps) {
  const { isBlocked } = useDesktopGate();

  if (isBlocked) {
    return (
      <View style={styles.blocked} accessibilityRole='alert'>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <SmartphoneIcon size={40} color={theme.colors.lime[900]} />
          </View>
          <AppText size='3xl' weight='semiBold' style={styles.title}>
            Abra no celular
          </AppText>
          <AppText color={theme.colors.gray[700]} style={styles.description}>
            Fotografe o prato, fale o que comeu e deixe a gente calcular os
            macros. Tudo isso funciona melhor na palma da mão.
          </AppText>
          <AppText color={theme.colors.gray[700]} size='sm' style={styles.hint}>
            Acesse a NaCal pelo celular para continuar.
          </AppText>
        </View>
      </View>
    );
  }

  return children;
}
