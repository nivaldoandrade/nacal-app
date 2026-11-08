import {
  getMealItemsMutationKey,
  syncMealAfterItemsMutation,
  updateMealFoodsInCache,
} from '@/app/hooks/mutations/mealItemsCache';
import { MealsService } from '@/app/services/MealsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRemoveMealItem(mealId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: getMealItemsMutationKey(mealId),
    mutationFn: (itemId: string) => MealsService.removeItem({ mealId, itemId }),
    onMutate: async (itemId) => {
      await updateMealFoodsInCache(
        queryClient,
        mealId,
        (foods) => foods.filter((food) => food.id !== itemId),
      );
    },
    onSuccess: ({ meal }) => syncMealAfterItemsMutation(queryClient, mealId, meal),
    onError: () => syncMealAfterItemsMutation(queryClient, mealId, undefined),
  });

  return {
    removeMealItem: mutateAsync,
  };
}
