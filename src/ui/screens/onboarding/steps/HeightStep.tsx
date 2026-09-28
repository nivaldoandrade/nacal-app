
import { MeasurementField } from '@/ui/components/Inputs/MeasurementField';
import { Step, StepContent, StepDismissKeyboard, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { StepAdvanceButton } from '@/ui/screens/onboarding/components/StepAdvanceButton';
import { useOnboarding } from '@/ui/screens/onboarding/context/useOnboarding';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { formatHeight } from '@/ui/utils/formatMeasurement';
import { Controller, useFormContext } from 'react-hook-form';

export function HeightStep() {
  const { advance } = useOnboarding();

  const { control, watch, clearErrors } = useFormContext<OnboardingSchema>();

  const selectedHeight = watch('profile.height');

  return (
    <StepDismissKeyboard>
      <Step>
        <StepHeader>
          <StepTitle>Qual é sua altura?</StepTitle>
          <StepSubTitle>Você pode inserir uma estimativa</StepSubTitle>
        </StepHeader>
        <StepContent position='center'>
          <Controller
            name='profile.height'
            control={control}
            render={({ field, fieldState }) => (
              <MeasurementField
                autoFocus
                name='height'
                placeholder='175'
                unit='cm'
                value={field.value}
                onChange={(value) => {
                  clearErrors('root.api');
                  field.onChange(formatHeight(value));
                }}
                error={fieldState.error?.message}
                returnKeyType='next'
                onSubmitEditing={() => advance('profile.height')}
              />
            )}
          />
        </StepContent>
        <StepFooter >
          <StepAdvanceButton field='profile.height' disabled={!selectedHeight} />
        </StepFooter>
      </Step>
    </StepDismissKeyboard>
  );
}
