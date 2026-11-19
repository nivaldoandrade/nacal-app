import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import * as SystemUI from 'expo-system-ui';
import { useCallback } from 'react';

export function useProfile() {
  const { signOut } = useAuth();
  const { top, bottom } = useSafeAreaInsets();

  const handleSignOut = useCallback(() => {
    SystemUI.setBackgroundColorAsync(null);
    signOut();
  }, [signOut]);

  return {
    top,
    bottom,
    handleSignOut,
  };
}
