
import { MeasurementField } from '@/ui/components/Inputs/MeasurementField';
import { Step, StepContent, StepDismissKeyboard, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { StepAdvanceButton } from '@/ui/screens/onboarding/components/StepAdvanceButton';
import { useOnboarding } from '@/ui/screens/onboarding/context/useOnboarding';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { formatWeight } from '@/ui/utils/formatMeasurement';
import { Controller, useFormContext } from 'react-hook-form';

export function WeightStep() {
  const { advance } = useOnboarding();

  const { control, watch, clearErrors } = useFormContext<OnboardingSchema>();

  const selectedWeight = watch('profile.weight');

  return (
    <StepDismissKeyboard>
      <Step>
        <StepHeader>
          <StepTitle>Qual é seu peso?</StepTitle>
          <StepSubTitle>Você pode inserir uma estimativa</StepSubTitle>
        </StepHeader>
        <StepContent position='center'>
          <Controller
            name='profile.weight'
            control={control}
            render={({ field, fieldState }) => (

              <MeasurementField
                autoFocus
                name='weight'
                placeholder='80'
                unit='kg'
                value={field.value}
                onChange={(value) => {
                  clearErrors('root.api');
                  field.onChange(formatWeight(value));
                }}
                error={fieldState.error?.message}
                returnKeyType='next'
                onSubmitEditing={() => advance('profile.weight')}
              />
            )}
          />
        </StepContent>
        <StepFooter >
          <StepAdvanceButton field='profile.weight' disabled={!selectedWeight} />
        </StepFooter>
      </Step>
    </StepDismissKeyboard>
  );
}
