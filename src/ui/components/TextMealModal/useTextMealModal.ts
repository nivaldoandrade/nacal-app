import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useCreateTextMeal } from '@/app/hooks/mutations/useCreateTextMeal';
import { toast } from '@/app/libs/sonner';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import type { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { MODAL_TOASTER_ID } from '@/ui/components/ModalWrapper';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Keyboard, Platform } from 'react-native';

function getUnidentifiedFoodsMessage(count: number) {
  return count === 1
    ? 'Um item não foi identificado. Se quiser, complete em “Adicionar item”.'
    : 'Alguns itens não foram identificados. Se quiser, complete em “Adicionar item”.';
}

interface IUseTextMealModalParams {
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
}

export function useTextMealModal({ onRequestClose }: IUseTextMealModalParams) {
  const [text, setText] = useState('');

  const { navigate, addListener } = useNavigation<AppStackNavigatorProps>();
  const { createTextMeal, isPending, isSuccess } = useCreateTextMeal();

  const isBusy = isPending || isSuccess;
  const canSubmit = text.trim().length > 0 && !isBusy;

  function handleClose() {
    if (isBusy) {
      return;
    }

    onRequestClose('slide');
  }

  function openMealDetails(mealId: string) {
    const unsubscribe = addListener('transitionEnd', () => {
      unsubscribe();
      onRequestClose('fade');
    });

    navigate('MealDetails', { mealId });

    if (Platform.OS === 'web') {
      unsubscribe();
      onRequestClose('fade');
    }
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    Keyboard.dismiss();

    try {
      const { meal, unidentifiedFoodsCount } = await createTextMeal(text);

      openMealDetails(meal.id);

      if (unidentifiedFoodsCount > 0) {
        toast.info(getUnidentifiedFoodsMessage(unidentifiedFoodsCount));
      }
    } catch (error) {
      console.error(error);

      const code = getApiErrorCode(error);

      if (code === ErrorCode.FREE_QUOTA_EXCEEDED) {
        onRequestClose('fade');
        toast.error(getErrorMessage(code));
        navigate('Plans');
        return;
      }

      if (code === ErrorCode.NO_FOOD_IDENTIFIED || code === ErrorCode.RATE_LIMIT_EXCEEDED) {
        toast.info(getErrorMessage(code), { toasterId: MODAL_TOASTER_ID });
        return;
      }

      toast.error('Não conseguimos registrar sua refeição. Tente novamente!', {
        toasterId: MODAL_TOASTER_ID,
      });
    }
  }

  return {
    text,
    setText,
    canSubmit,
    isCreateMealLoaderVisible: isBusy,
    handleClose,
    handleSubmit,
  };
}
