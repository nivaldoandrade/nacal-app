import {
  getMealItemsMutationKey,
  syncMealAfterItemsMutation,
} from '@/app/hooks/mutations/mealItemsCache';
import { MealsService } from '@/app/services/MealsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddMealItems(mealId: string) {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationKey: getMealItemsMutationKey(mealId),
    mutationFn: (text: string) => MealsService.addItems({ mealId, text }),
    onSuccess: ({ meal }) => syncMealAfterItemsMutation(queryClient, mealId, meal),
    onError: () => syncMealAfterItemsMutation(queryClient, mealId, undefined),
  });

  return {
    addMealItems: mutateAsync,
    isPending,
  };
}
