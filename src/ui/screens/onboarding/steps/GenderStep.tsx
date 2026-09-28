
import { GenderInput } from '@/ui/components/Inputs/GenderInput';
import { Step, StepContent, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { StepAdvanceButton } from '@/ui/screens/onboarding/components/StepAdvanceButton';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { Controller, useFormContext } from 'react-hook-form';

export function GenderStep() {
  const { control, watch } = useFormContext<OnboardingSchema>();

  const selectedGender = watch('profile.gender');

  return (
    <Step>
      <StepHeader>
        <StepTitle>Qual é seu gênero?</StepTitle>
        <StepSubTitle>Seu gênero influencia no tipo da dieta</StepSubTitle>
      </StepHeader>
      <StepContent>
        <Controller
          name='profile.gender'
          control={control}
          render={({ field }) => (
            <GenderInput isLabel={false} value={field.value} onChange={field.onChange} />
          )}
        />
      </StepContent>
      <StepFooter >
        <StepAdvanceButton field='profile.gender' disabled={!selectedGender} />
      </StepFooter>
    </Step>
  );
}
