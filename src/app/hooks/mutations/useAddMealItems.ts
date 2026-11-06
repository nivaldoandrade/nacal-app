import { MealsService } from '@/app/services/MealsService';
import { MealItem } from '@/app/types/Meal';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddMealItems() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (params: MealsService.AddItems['params']) => MealsService.addItems(params),
    onSuccess: ({ meal }) => {
      queryClient.setQueryData<MealItem>(['meal', meal.id], meal);
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
    onError: (_error, { mealId }) => {
      queryClient.invalidateQueries({ queryKey: ['meal', mealId] });
    },
  });

  return {
    addMealItems: mutateAsync,
    isPending,
  };
}
