import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { ApiError, getErrorMessage } from '@/app/errors/apiErrors';
import { useUpdateProfile } from '@/app/hooks/mutations/useUpdateProfile';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { toast } from '@/app/libs/sonner';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { ProfileSchema, profileSchema } from '@/ui/screens/profile/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

export function useProfile() {
  const [footerHeight, setFooterHeight] = useState(0);

  const { goBack } = useNavigation<AppStackNavigatorProps>();
  const { signOut } = useAuth();
  const { account } = useAccount();
  const { top, bottom } = useSafeAreaInsets();
  const { isPending, updateProfile } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      name: account?.profile.name ?? '',
      birthDate: account?.profile.birthDate ?? new Date(),
      height: String(account?.profile.height ?? ''),
      weight: String(account?.profile.weight ?? ''),
      gender: (account?.profile.gender ?? '') as ProfileSchema['gender'],
    },
    resolver: zodResolver(profileSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await updateProfile({
        name: data.name,
        height: data.height,
        weight: data.weight,
        gender: data.gender,
        birthDate: data.birthDate.toISOString().split('T')[0],
      });
      toast.success('Perfil atualizado com sucesso!');
      goBack();
    } catch (error) {
      if (isAxiosError<ApiError>(error)) {
        const code = error.response?.data?.error?.code;
        const message = getErrorMessage(code);
        code === 'VALIDATION' && form.setError('root.api', { message });
        toast.error(message);
      }
    }
  });

  const handleSignOut = useCallback(() => {
    SystemUI.setBackgroundColorAsync(null);
    signOut();
  }, [signOut]);

  return {
    isSubmitting: form.formState.isSubmitting || isPending,
    form,
    top,
    footerHeight,
    setFooterHeight,
    bottom,
    goBack,
    handleSubmit,
    handleSignOut,
  };
}
