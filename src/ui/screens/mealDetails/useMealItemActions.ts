import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useDeleteMeal } from '@/app/hooks/mutations/useDeleteMeal';
import { useRemoveMealItem } from '@/app/hooks/mutations/useRemoveMealItem';
import { useRestoreMealItem } from '@/app/hooks/mutations/useRestoreMealItem';
import { toast } from '@/app/libs/sonner';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { Food } from '@/app/types/Food';
import { IDeleteMealSheet } from '@/ui/screens/mealDetails/components/DeleteMealSheet/IDeleteMealSheet';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

const UNDO_TOAST_DURATION_MS = 5000;

function showRemoveError(error: unknown) {
  const code = getApiErrorCode(error);

  if (code === ErrorCode.MEAL_LAST_ITEM || code === ErrorCode.RATE_LIMIT_EXCEEDED) {
    toast.info(getErrorMessage(code));
    return;
  }

  if (code === ErrorCode.MEAL_NOT_EDITABLE) {
    toast.info('Essa refeição não pode mais ser editada.');
    return;
  }

  toast.error('Não conseguimos remover o item. Tente novamente!');
}

interface IUseMealItemActionsParams {
  mealId: string;
  foodsCount: number;
}

export function useMealItemActions({ mealId, foodsCount }: IUseMealItemActionsParams) {
  const navigation = useNavigation<AppStackNavigatorProps>();
  const queryClient = useQueryClient();
  const deleteMealSheetRef = useRef<IDeleteMealSheet>(null);
  const undoToastIdsRef = useRef(new Set<string | number>());
  const isMealDeletedRef = useRef(false);
  const { removeMealItem } = useRemoveMealItem(mealId);
  const { restoreMealItem } = useRestoreMealItem(mealId);
  const { deleteMeal, isPending: isDeletingMeal } = useDeleteMeal();

  useEffect(() => () => {
    if (isMealDeletedRef.current) {
      queryClient.removeQueries({ queryKey: ['meal', mealId], exact: true });
    }
  }, [mealId, queryClient]);

  const handleUndo = useCallback(async (food: Food, removal: Promise<boolean>) => {
    const removed = await removal;

    if (!removed) {
      return;
    }

    try {
      await restoreMealItem(food);
    } catch (error) {
      console.error(error);

      const code = getApiErrorCode(error);

      if (code === ErrorCode.MEAL_ITEM_LIMIT_REACHED || code === ErrorCode.RATE_LIMIT_EXCEEDED) {
        toast.info(getErrorMessage(code));
        return;
      }

      toast.error('Não conseguimos desfazer a remoção. Tente novamente!');
    }
  }, [restoreMealItem]);

  const handleRemoveFood = useCallback((food: Food) => {
    if (foodsCount <= 1) {
      deleteMealSheetRef.current?.open('lastItem');
      return;
    }

    let toastId: string | number | undefined;

    const forgetToast = () => {
      if (toastId !== undefined) {
        undoToastIdsRef.current.delete(toastId);
      }
    };

    const removal = removeMealItem(food.id).then(
      () => true,
      (error: unknown) => {
        console.error(error);

        if (toastId !== undefined) {
          toast.dismiss(toastId);
          forgetToast();
        }

        showRemoveError(error);
        return false;
      },
    );

    toastId = toast('Item removido.', {
      duration: UNDO_TOAST_DURATION_MS,
      action: {
        label: 'Desfazer',
        onClick: () => {
          forgetToast();
          handleUndo(food, removal);
        },
      },
      onDismiss: forgetToast,
      onAutoClose: forgetToast,
    });

    undoToastIdsRef.current.add(toastId);
  }, [foodsCount, removeMealItem, handleUndo]);

  const openDeleteMeal = useCallback(() => {
    deleteMealSheetRef.current?.open('meal');
  }, []);

  const handleConfirmDeleteMeal = useCallback(async () => {
    try {
      await deleteMeal(mealId);

      isMealDeletedRef.current = true;
      undoToastIdsRef.current.forEach((toastId) => toast.dismiss(toastId));
      undoToastIdsRef.current.clear();
      deleteMealSheetRef.current?.dismiss();

      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }

      toast.success('Refeição excluída.');
    } catch (error) {
      console.error(error);

      const code = getApiErrorCode(error);

      if (code === ErrorCode.MEAL_NOT_EDITABLE) {
        toast.info('Essa refeição não pode ser excluída agora.');
        return;
      }

      if (code === ErrorCode.RATE_LIMIT_EXCEEDED) {
        toast.info(getErrorMessage(code));
        return;
      }

      toast.error('Não conseguimos excluir a refeição. Tente novamente!');
    }
  }, [deleteMeal, mealId, navigation]);

  return {
    deleteMealSheetRef,
    isDeletingMeal,
    handleRemoveFood,
    openDeleteMeal,
    handleConfirmDeleteMeal,
  };
}
