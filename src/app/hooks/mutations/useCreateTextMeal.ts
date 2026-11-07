import { getDeviceTimeZone } from '@/app/libs/getDeviceTimeZone';
import { MealsService } from '@/app/services/MealsService';
import { MealItem } from '@/app/types/Meal';
import { toLocalIsoDate } from '@/app/utils/toLocalIsoDate';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateTextMeal() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: (text: string) => MealsService.createFromText({
      text: text.trim(),
      timeZone: getDeviceTimeZone(),
    }),
    onSuccess: ({ meal }) => {
      queryClient.setQueryData<MealItem>(['meal', meal.id], meal);
      queryClient.invalidateQueries({ queryKey: ['meals', toLocalIsoDate(meal.createdAt)] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    createTextMeal: mutateAsync,
    isPending,
    isSuccess,
  };
}
