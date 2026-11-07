import { ApiError, getErrorMessage } from '@/app/errors/apiErrors';
import { useUpdateGoal } from '@/app/hooks/mutations/useUpdateGoal';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { EditGoalSchema, editGoalsSchema } from '@/ui/screens/editGoals/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { toast } from '@/app/libs/sonner';

export function useEditGoals() {
  const [footerHeight, setFooterHeight] = useState(0);

  const { goBack } = useNavigation<AppStackNavigatorProps>();
  const { account } = useAccount();
  const { top, bottom } = useSafeAreaInsets();
  const { isPending, updateGoal } = useUpdateGoal();

  const form = useForm<EditGoalSchema>({
    defaultValues: {
      calories: account?.goal.calories,
      carbohydrates: account?.goal.carbohydrates,
      proteins: account?.goal.proteins,
      fats: account?.goal.fats,
    },
    resolver: zodResolver(editGoalsSchema),
  });

  useFocusEffect(
    useCallback(() => {
      if (!(Platform.OS === 'web')) {
        return;
      }

      SystemUI.setBackgroundColorAsync(null);

    }, []),
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await updateGoal(data);
      toast.success('Metas atualizadas com sucesso!');
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

  return {
    isSubmitting: form.formState.isSubmitting || isPending,
    form,
    top,
    footerHeight,
    setFooterHeight,
    bottom,
    goBack,
    handleSubmit,
  };
}
