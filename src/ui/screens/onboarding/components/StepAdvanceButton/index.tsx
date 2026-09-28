import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { ButtonApp } from '@/ui/components/Button';
import { useOnboarding } from '@/ui/screens/onboarding/context/useOnboarding';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { ArrowRightIcon } from 'lucide-react-native';
import { Path } from 'react-hook-form';
import { View } from 'react-native';

interface IStepAdvanceButtonProps {
  field: Path<OnboardingSchema>;
  disabled?: boolean;
  onBeforeAdvance?: () => boolean | Promise<boolean>;
}

export function StepAdvanceButton({
  field,
  disabled = false,
  onBeforeAdvance,
}: IStepAdvanceButtonProps) {
  const { advance, isLastStep, isAdvanceLoading } = useOnboarding();
  const { shouldShowOnboarding } = useAuth();

  const isFinishing = isLastStep && shouldShowOnboarding;

  async function handlePress() {
    if (onBeforeAdvance && !(await onBeforeAdvance())) {
      return;
    }

    await advance(field);
  }

  if (isFinishing) {
    return (
      <View style={{ width: '100%' }}>
        <ButtonApp
          disabled={disabled || isAdvanceLoading}
          isLoading={isAdvanceLoading}
          onPress={handlePress}
        >
          Concluir
        </ButtonApp>
      </View>
    );
  }

  return (
    <ButtonApp
      disabled={disabled}
      size='icon'
      onPress={handlePress}
    >
      <ArrowRightIcon />
    </ButtonApp>
  );
}
