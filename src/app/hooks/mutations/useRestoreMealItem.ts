import {
  getMealItemsMutationKey,
  insertFoodByOrder,
  syncMealAfterItemsMutation,
  updateMealFoodsInCache,
} from '@/app/hooks/mutations/mealItemsCache';
import { MealsService } from '@/app/services/MealsService';
import { Food } from '@/app/types/Food';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRestoreMealItem(mealId: string) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: getMealItemsMutationKey(mealId),
    mutationFn: (food: Food) => MealsService.restoreItem({ mealId, itemId: food.id }),
    onMutate: async (food) => {
      await updateMealFoodsInCache(
        queryClient,
        mealId,
        (foods) => insertFoodByOrder(foods, food),
      );
    },
    onSuccess: ({ meal }) => syncMealAfterItemsMutation(queryClient, mealId, meal),
    onError: () => syncMealAfterItemsMutation(queryClient, mealId, undefined),
  });

  return {
    restoreMealItem: mutateAsync,
  };
}
