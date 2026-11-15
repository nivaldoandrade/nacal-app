import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { styles } from '@/ui/screens/connectionError/styles';
import { theme } from '@/ui/styles/theme';
import { WifiOffIcon } from 'lucide-react-native';
import { View } from 'react-native';

export function ConnectionError() {
  const { retrySessionRestore, isRestoringSession, signOut } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]} accessibilityRole='alert'>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <WifiOffIcon size={36} color={theme.colors.gray[700]} />
        </View>
        <AppText size='3xl' weight='semiBold' style={styles.title}>
          Não foi possível carregar sua conta
        </AppText>
        <AppText color={theme.colors.gray[700]} style={styles.description}>
          Pode ser a internet ou uma instabilidade do nosso lado. Tente de novo em instantes.
        </AppText>
        <ButtonApp
          style={styles.button}
          onPress={retrySessionRestore}
          isLoading={isRestoringSession}
        >
          Tentar de novo
        </ButtonApp>
        <ButtonApp
          intent='ghost'
          style={styles.secondaryButton}
          onPress={signOut}
          disabled={isRestoringSession}
        >
          Sair da conta
        </ButtonApp>
      </View>
    </View>
  );
}
