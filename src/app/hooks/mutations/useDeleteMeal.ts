import { ErrorCode, getApiErrorCode } from '@/app/errors/apiErrors';
import { MealsService } from '@/app/services/MealsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteMeal(mealId: string) {
  try {
    await MealsService.deleteMeal(mealId);
  } catch (error) {
    if (getApiErrorCode(error) === ErrorCode.RESOURCE_NOT_FOUND) {
      return;
    }

    throw error;
  }
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: deleteMeal,
    onSuccess: (_data, mealId) => {
      queryClient.setQueriesData<MealsService.ListByDayResponse>({ queryKey: ['meals'] }, (data) => (
        data
          ? { ...data, meals: data.meals.filter((meal) => meal.id !== mealId) }
          : data
      ));
    },
  });

  return {
    deleteMeal: mutateAsync,
    isPending,
  };
}
