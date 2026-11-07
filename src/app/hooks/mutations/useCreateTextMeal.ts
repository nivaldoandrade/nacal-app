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
      queryClient.setQueryData<MealsService.ListByDayResponse>(
        ['meals', toLocalIsoDate(meal.createdAt)],
        (current) => {
          if (!current || current.meals.some(({ id }) => id === meal.id)) {
            return current;
          }

          return {
            meals: [
              {
                id: meal.id,
                name: meal.name,
                icon: meal.icon,
                foods: meal.foods,
                createdAt: meal.createdAt.toISOString(),
                timeZone: getDeviceTimeZone(),
              },
              ...current.meals,
            ],
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', toLocalIsoDate(new Date())] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    createTextMeal: mutateAsync,
    isPending,
    isSuccess,
  };
}
