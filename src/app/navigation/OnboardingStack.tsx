import { useOnboarding } from '@/ui/screens/onboarding/context/useOnboarding';
import { ActivityLevelStep } from '@/ui/screens/onboarding/steps/ActivityLevelStep';
import { BirthDateStep } from '@/ui/screens/onboarding/steps/BirthDateStep';
import { CreateAccountStep } from '@/ui/screens/onboarding/steps/CreateAccountStep';
import { TermsStep } from '@/ui/screens/onboarding/steps/TermsStep';
import { GenderStep } from '@/ui/screens/onboarding/steps/GenderStep';
import { GoalStep } from '@/ui/screens/onboarding/steps/GoalStep';
import { HeightStep } from '@/ui/screens/onboarding/steps/HeightStep';
import { WeightStep } from '@/ui/screens/onboarding/steps/WeightStep';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type OnboardingParamList = {
  TermsStep: undefined;
  GoalStep: undefined;
  GenderStep: undefined;
  BirthDateStep: undefined;
  HeightStep: undefined;
  WeightStep: undefined;
  ActivityLevelStep: undefined;
  CreateAccountStep: undefined;
}

const Stack = createNativeStackNavigator<OnboardingParamList>();

export type OnboardingStackNavigationProps = NativeStackNavigationProp<OnboardingParamList>;

export type OnboardingStackScreenProps<T extends keyof OnboardingParamList> =
  NativeStackScreenProps<OnboardingParamList, T>;

export function OnboardingStack() {
  const { initialStep } = useOnboarding();

  return (
    <Stack.Navigator
      initialRouteName={initialStep}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TermsStep" component={TermsStep} />
      <Stack.Screen name="GoalStep" component={GoalStep} />
      <Stack.Screen name="GenderStep" component={GenderStep} />
      <Stack.Screen name="BirthDateStep" component={BirthDateStep} />
      <Stack.Screen name="HeightStep" component={HeightStep} />
      <Stack.Screen name="WeightStep" component={WeightStep} />
      <Stack.Screen name="ActivityLevelStep" component={ActivityLevelStep} />
      <Stack.Screen name="CreateAccountStep" component={CreateAccountStep} />
    </Stack.Navigator>
  );
}
