import { usePwaInstall } from '@/app/hooks/usePwaInstall';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { InstallAppSheet } from '@/ui/components/InstallAppSheet';
import { IInstallAppSheet } from '@/ui/components/InstallAppSheet/IInstallAppSheet';
import { styles } from '@/ui/screens/profile/styles';
import { theme } from '@/ui/styles/theme';
import { SmartphoneIcon } from 'lucide-react-native';
import { useRef } from 'react';
import { View } from 'react-native';

export function InstallAppSection() {
  const { isInstallable } = usePwaInstall();
  const sheetRef = useRef<IInstallAppSheet>(null);

  if (!isInstallable) {
    return null;
  }

  return (
    <View style={styles.planSection}>
      <AppText size='sm' weight='medium' color={theme.colors.gray[700]}>
        App
      </AppText>
      <View style={styles.planCard}>
        <View style={styles.installRow}>
          <View style={styles.installIcon}>
            <SmartphoneIcon size={20} color={theme.colors.black[700]} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText weight='semiBold'>Instale na tela inicial</AppText>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Abra o NaCal com um toque, em tela cheia.
            </AppText>
          </View>
        </View>
        <ButtonApp intent='secondary' onPress={() => sheetRef.current?.open()}>
          Ver como instalar
        </ButtonApp>
      </View>
      <InstallAppSheet ref={sheetRef} source='manual' />
    </View>
  );
}
