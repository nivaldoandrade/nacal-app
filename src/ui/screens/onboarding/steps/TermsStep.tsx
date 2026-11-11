import { legal } from '@/app/config/legal';
import { openExternalUrl } from '@/app/libs/openExternalUrl';
import { AppText } from '@/ui/components/AppText';
import { Step, StepContent, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { StepAdvanceButton } from '@/ui/screens/onboarding/components/StepAdvanceButton';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { theme } from '@/ui/styles/theme';
import { CheckIcon } from 'lucide-react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

export function TermsStep() {
  const { control, watch } = useFormContext<OnboardingSchema>();
  const acceptedTerms = watch('acceptedTerms');

  return (
    <Step>
      <StepHeader>
        <StepTitle>Antes de começar</StepTitle>
        <StepSubTitle>
          Precisamos do seu OK para cuidar dos seus dados com transparência.
        </StepSubTitle>
      </StepHeader>
      <StepContent>
        <View style={styles.cards}>
          <View style={styles.card}>
            <AppText weight='semiBold'>Seus dados</AppText>
            <AppText color={theme.colors.gray[700]} size='sm'>
              Usamos suas informações para calcular metas e analisar refeições. Você pode pedir a exclusão da sua conta quando quiser.
            </AppText>
          </View>
          <View style={styles.card}>
            <AppText weight='semiBold'>Estimativas com IA</AppText>
            <AppText color={theme.colors.gray[700]} size='sm'>
              As análises podem ter pequenas variações e não substituem orientação médica ou nutricional.
            </AppText>
          </View>
          <Controller
            name='acceptedTerms'
            control={control}
            render={({ field }) => (
              <View style={styles.consent}>
                <Pressable
                  accessibilityRole='checkbox'
                  accessibilityLabel='Aceitar os Termos de Uso e a Política de Privacidade'
                  accessibilityState={{ checked: field.value }}
                  hitSlop={8}
                  onPress={() => field.onChange(!field.value)}
                  style={[styles.checkbox, field.value && styles.checkboxChecked]}
                >
                  {field.value && (
                    <CheckIcon size={16} color={theme.colors.black[700]} />
                  )}
                </Pressable>
                <AppText style={styles.consentText}>
                  <AppText onPress={() => field.onChange(!field.value)}>
                    Li e aceito os{' '}
                  </AppText>
                  <AppText
                    accessibilityRole='link'
                    weight='medium'
                    style={styles.link}
                    onPress={() => openExternalUrl(legal.termsUrl)}
                  >
                    Termos de Uso
                  </AppText>
                  <AppText onPress={() => field.onChange(!field.value)}>
                    {' '}e a{' '}
                  </AppText>
                  <AppText
                    accessibilityRole='link'
                    weight='medium'
                    style={styles.link}
                    onPress={() => openExternalUrl(legal.privacyUrl)}
                  >
                    Política de Privacidade
                  </AppText>
                  .
                </AppText>
              </View>
            )}
          />
        </View>
      </StepContent>
      <StepFooter>
        <StepAdvanceButton field='acceptedTerms' disabled={!acceptedTerms} />
      </StepFooter>
    </Step>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: 12,
  },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.gray[200],
  },
  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.gray[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: theme.colors.lime[700],
    backgroundColor: theme.colors.lime[400],
  },
  consentText: {
    flex: 1,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
