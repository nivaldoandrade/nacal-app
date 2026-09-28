import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { AuthStackNavigatorProps, AuthStackParamList } from '@/app/navigation/AuthStack';
import { OnboardingParamList } from '@/app/navigation/OnboardingStack';
import { orderedSteps } from '@/ui/screens/onboarding/orderedSteps';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { useOnboardingSubmit } from '@/ui/screens/onboarding/useOnboardingSubmit';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import { Path, useFormContext } from 'react-hook-form';

const ONBOARDING_ROUTE_NAME = 'Onboarding' satisfies keyof AuthStackParamList;

interface IOnboardingContextProps {
  initialStep: keyof OnboardingParamList;
  currentStepIndex: number;
  totalStep: number;
  isLastStep: boolean;
  isAdvanceLoading: boolean;
  nextStep: () => void;
  previousStep: () => void;
  advance: (field: Path<OnboardingSchema>) => Promise<void>;
}

interface IOnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingContext = createContext({} as IOnboardingContextProps);

export function OnboardingProvider({ children }: IOnboardingProviderProps) {
  const navigation = useNavigation<AuthStackNavigatorProps>();

  const { shouldShowOnboarding } = useAuth();
  const { trigger } = useFormContext<OnboardingSchema>();

  const { finishOnboarding, isSubmitting, isGoogleLoading } = useOnboardingSubmit({
    flow: 'completeProfile',
  });

  const flowSteps = useMemo(() => {
    return shouldShowOnboarding
      ? orderedSteps.filter(step => step !== 'CreateAccountStep')
      : orderedSteps;
  }, [shouldShowOnboarding]);

  const currentStepIndex = useNavigationState(state => {
    const onboardingRoute = state.routes[state.index];

    if (
      onboardingRoute?.name !== ONBOARDING_ROUTE_NAME
      || !onboardingRoute.state
    ) {
      return 0;
    }

    const nestedState = onboardingRoute.state;
    const currentName = nestedState.routes[nestedState.index ?? 0]?.name;

    if (!currentName) {
      return 0;
    }

    return flowSteps.indexOf(currentName as keyof OnboardingParamList);
  });

  const nextStep = useCallback(() => {
    const nextStep = flowSteps[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    navigation.navigate('Onboarding', { screen: nextStep });
  }, [navigation, currentStepIndex, flowSteps]);

  const previousStep = useCallback(() => {
    const previousStepIndex = currentStepIndex - 1;

    if (previousStepIndex < 0) {
      navigation.popToTop();
      return;
    }

    const previousStep = flowSteps[currentStepIndex - 1];

    navigation.navigate('Onboarding', {
      screen: previousStep, pop: true,
    });
  }, [navigation, currentStepIndex, flowSteps]);

  const isLastStep = currentStepIndex === flowSteps.length - 1;

  const advance = useCallback(async (field: Path<OnboardingSchema>) => {
    const isValid = await trigger(field);

    if (!isValid) {
      return;
    }

    if (isLastStep && shouldShowOnboarding) {
      await finishOnboarding();
      return;
    }

    nextStep();
  }, [trigger, isLastStep, shouldShowOnboarding, finishOnboarding, nextStep]);

  return (
    <OnboardingContext value={{
      currentStepIndex,
      nextStep,
      previousStep,
      advance,
      initialStep: flowSteps[0],
      totalStep: flowSteps.length,
      isLastStep,
      isAdvanceLoading: isSubmitting || isGoogleLoading,
    }}>
      {children}
    </ OnboardingContext>
  );
}
