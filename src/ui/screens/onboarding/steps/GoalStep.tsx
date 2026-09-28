
import { RadioGroup, RadioGroupItem, RadioGroupItemIcon, RadioGroupItemLabel } from '@/ui/components/RadioGroup';
import { Step, StepContent, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { StepAdvanceButton } from '@/ui/screens/onboarding/components/StepAdvanceButton';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { goalInfo } from '@/ui/utils/goal';
import { Controller, useFormContext } from 'react-hook-form';

export function GoalStep() {
  const { control, watch } = useFormContext<OnboardingSchema>();

  const selectedGoal = watch('profile.goal');

  return (
    <Step>
      <StepHeader>
        <StepTitle>Qual é seu objetivo?</StepTitle>
        <StepSubTitle>O que você pretende alcançar com a dieta?</StepSubTitle>
      </StepHeader>
      <StepContent>
        <Controller
          name='profile.goal'
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onChange={field.onChange}>
              {goalInfo.map((goal) => (
                <RadioGroupItem key={goal.value} value={goal.value}>
                  <RadioGroupItemIcon>{goal.icon}</RadioGroupItemIcon>
                  <RadioGroupItemLabel>{goal.label}</RadioGroupItemLabel>
                </RadioGroupItem>
              ))}
            </RadioGroup>
          )}
        />

      </StepContent>
      <StepFooter >
        <StepAdvanceButton field='profile.goal' disabled={!selectedGoal} />
      </StepFooter>
    </Step>
  );
}
