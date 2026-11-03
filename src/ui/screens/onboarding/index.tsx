import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { queryClient } from '@/app/libs/queryClient';
import { OnboardingStack } from '@/app/navigation/OnboardingStack';
import { AccountsService } from '@/app/services/AccountsService';
import { OnboardingHeader } from '@/ui/screens/onboarding/components/onboardingHeader';
import { OnboardingProvider } from '@/ui/screens/onboarding/context';
import { onboardingSchema } from '@/ui/screens/onboarding/schema';
import { theme } from '@/ui/styles/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View } from 'react-native';

export function Onboarding() {
  const { signOut } = useAuth();
  const form = useForm({
    defaultValues: {
      acceptedTerms: false,
      profile: {
        name: '',
        height: '',
        weight: '',
        birthDate: new Date(),
      },
      account: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    },
    resolver: zodResolver(onboardingSchema),
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        const isOnboarded = queryClient
          .getQueryData<AccountsService.Me>(['accounts'])
          ?.isOnboarded;

        if (isOnboarded === false) {
          signOut();
        }
      };
    }, [signOut]),
  );

  return (
    <FormProvider {...form}>
      <OnboardingProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
          <OnboardingHeader />
          <OnboardingStack />
        </View>
      </OnboardingProvider>
    </FormProvider>
  );
}
