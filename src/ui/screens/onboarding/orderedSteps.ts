import { OnboardingParamList } from '@/app/navigation/OnboardingStack';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { Path } from 'react-hook-form';

export type OrderedSteps = (keyof OnboardingParamList)[];

export const orderedSteps: OrderedSteps = [
  'TermsStep',
  'GoalStep',
  'GenderStep',
  'BirthDateStep',
  'HeightStep',
  'WeightStep',
  'ActivityLevelStep',
  'CreateAccountStep',
];

export const stepFields: Record<keyof OnboardingParamList, Path<OnboardingSchema>> = {
  TermsStep: 'acceptedTerms',
  GoalStep: 'profile.goal',
  GenderStep: 'profile.gender',
  BirthDateStep: 'profile.birthDate',
  HeightStep: 'profile.height',
  WeightStep: 'profile.weight',
  ActivityLevelStep: 'profile.activityLevel',
  CreateAccountStep: 'account',
};
