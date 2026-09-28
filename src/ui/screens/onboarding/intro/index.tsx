import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { Step, StepContent, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { styles } from '@/ui/screens/onboarding/intro/styles';
import { useOnboardingIntro } from '@/ui/screens/onboarding/intro/useOnboardingIntro';
import { View } from 'react-native';

export function OnboardingIntro() {
  const { top } = useSafeAreaInsets();
  const { handleStartPress, handleSignOutPress } = useOnboardingIntro();

  return (
    <Step style={{ paddingTop: top }}>
      <StepHeader>
        <StepTitle>Antes de usar a NaCal...</StepTitle>
        <StepSubTitle>
          Você precisa completar seu cadastro. Com algumas perguntas rápidas montamos seu plano de calorias e nutrientes. Leva menos de 1 minuto.
        </StepSubTitle>
      </StepHeader>
      <StepContent position='center'>
        <View style={styles.iconWell}>
          <AppText style={styles.iconEmoji}>🥗</AppText>
        </View>
      </StepContent>
      <StepFooter style={styles.footer}>
        <ButtonApp onPress={handleStartPress}>
          Começar
        </ButtonApp>
        <ButtonApp intent='ghost' onPress={handleSignOutPress}>
          Sair da conta
        </ButtonApp>
      </StepFooter>
    </Step>
  );
}
