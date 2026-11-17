import { getDeviceTimeZone } from '@/app/libs/getDeviceTimeZone';
import { insertMealIntoDayList } from '@/app/hooks/mutations/mealItemsCache';
import { updateMealQuotaInCache } from '@/app/hooks/mutations/mealQuotaCache';
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
    onSuccess: ({ meal, mealQuota, dailyMealQuota }) => {
      queryClient.setQueryData<MealItem>(['meal', meal.id], meal);
      insertMealIntoDayList(queryClient, meal);
      updateMealQuotaInCache(queryClient, { mealQuota, dailyMealQuota });
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
