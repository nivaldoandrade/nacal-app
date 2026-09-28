import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useSocialAuth } from '@/app/hooks/useSocialAuth';
import { toast } from '@/app/libs/sonner';
import { AccountsService } from '@/app/services/AccountsService';
import { AuthService } from '@/app/services/AuthService';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type OnboardingSubmitFlow = 'completeProfile' | 'signUp';

interface IUseOnboardingSubmitParams {
  flow: OnboardingSubmitFlow;
}

export function useOnboardingSubmit({ flow }: IUseOnboardingSubmitParams) {
  const { completeOnboarding, completeSocialOnboarding, signInWithSocial } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const reauthAttemptedRef = useRef(false);

  const { getValues } = useFormContext<OnboardingSchema>();

  function getProfilePayload(): Omit<AccountsService.CompleteOnboardingParams, 'accessToken'> {
    const profile = getValues('profile');

    return {
      birthDate: profile.birthDate.toISOString().split('T')[0],
      height: Number(profile.height),
      weight: Number(profile.weight),
      gender: profile.gender,
      goal: profile.goal,
      activityLevel: profile.activityLevel,
    };
  }

  async function submitOnboarding() {
    await completeOnboarding(getProfilePayload());
  }

  async function handleCompleteProfileSocialSuccess(response: AuthService.SignInWithSocial['response']) {
    const isOnboarded = await signInWithSocial(response);

    if (isOnboarded) {
      return;
    }

    await submitOnboarding();
  }

  async function handleSignUpSocialSuccess(
    response: AuthService.SignInWithSocial['response'],
  ) {
    const isOnboarded = await signInWithSocial(response);

    if (isOnboarded) {
      return;
    }

    try {
      await completeSocialOnboarding(response, getProfilePayload());
    } catch (error) {
      if (
        getApiErrorCode(error) === ErrorCode.INVALID_GRANT
        && !reauthAttemptedRef.current
      ) {
        reauthAttemptedRef.current = true;
        await signInWithGoogle();
        return;
      }

      throw error;
    }
  }

  const { signInWithGoogle, isLoading: isGoogleLoading } = useSocialAuth({
    onSuccess: flow === 'completeProfile'
      ? handleCompleteProfileSocialSuccess
      : handleSignUpSocialSuccess,
  });

  async function finishOnboarding() {
    setIsSubmitting(true);
    try {
      await submitOnboarding();
    } catch (error) {
      if (
        getApiErrorCode(error) === ErrorCode.INVALID_GRANT
        && !reauthAttemptedRef.current
      ) {
        reauthAttemptedRef.current = true;
        await signInWithGoogle();
        return;
      }

      toast.error(getErrorMessage(getApiErrorCode(error)));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    finishOnboarding,
    signInWithGoogle,
    isSubmitting,
    isGoogleLoading,
  };
}
