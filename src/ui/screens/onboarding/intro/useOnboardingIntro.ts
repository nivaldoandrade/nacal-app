import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { AuthStackNavigatorProps } from '@/app/navigation/AuthStack';
import { queryClient } from '@/app/libs/queryClient';
import { AccountsService } from '@/app/services/AccountsService';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export function useOnboardingIntro() {
  const navigation = useNavigation<AuthStackNavigatorProps>();

  const { isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    }
  }, [isSignedIn, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      const isOnboarded = queryClient
        .getQueryData<AccountsService.Me>(['accounts'])
        ?.isOnboarded;

      if (isSignedIn && isOnboarded !== true) {
        signOut();
      }
    });

    return unsubscribe;
  }, [navigation, isSignedIn, signOut]);

  function handleStartPress() {
    navigation.navigate('Onboarding');
  }

  function handleSignOutPress() {
    signOut();
  }

  return {
    handleStartPress,
    handleSignOutPress,
  };
}
