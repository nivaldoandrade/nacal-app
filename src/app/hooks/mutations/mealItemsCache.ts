import { getDeviceTimeZone } from '@/app/libs/getDeviceTimeZone';
import { MealsService } from '@/app/services/MealsService';
import { Food } from '@/app/types/Food';
import { MealItem } from '@/app/types/Meal';
import { toLocalIsoDate } from '@/app/utils/toLocalIsoDate';
import { QueryClient } from '@tanstack/react-query';

export function insertMealIntoDayList(queryClient: QueryClient, meal: MealItem) {
  const queryKey = ['meals', toLocalIsoDate(meal.createdAt)];
  const wasInvalidated = queryClient.getQueryState(queryKey)?.isInvalidated ?? false;

  queryClient.setQueryData<MealsService.ListByDayResponse>(
    queryKey,
    (current) => {
      if (!current || current.meals.some(({ id }) => id === meal.id)) {
        return current;
      }

      const listMeal = {
        id: meal.id,
        name: meal.name,
        icon: meal.icon,
        foods: meal.foods,
        createdAt: meal.createdAt.toISOString(),
        timeZone: getDeviceTimeZone(),
      };

      const nextIndex = current.meals.findIndex(
        ({ createdAt }) => new Date(createdAt).getTime() < meal.createdAt.getTime(),
      );

      if (nextIndex === -1) {
        return { meals: [...current.meals, listMeal] };
      }

      return {
        meals: [...current.meals.slice(0, nextIndex), listMeal, ...current.meals.slice(nextIndex)],
      };
    },
  );

  if (wasInvalidated) {
    queryClient.invalidateQueries({ queryKey, exact: true, refetchType: 'none' });
  }
}

export function getMealItemsMutationKey(mealId: string) {
  return ['meal-items', mealId];
}

export function insertFoodByOrder(foods: Food[], food: Food): Food[] {
  if (foods.some((current) => current.id === food.id)) {
    return foods;
  }

  const nextIndex = foods.findIndex((current) => current.order > food.order);

  if (nextIndex === -1) {
    return [...foods, food];
  }

  return [...foods.slice(0, nextIndex), food, ...foods.slice(nextIndex)];
}

function updateListFoods(
  queryClient: QueryClient,
  mealId: string,
  updateFoods: (foods: Food[]) => Food[],
) {
  queryClient.setQueriesData<MealsService.ListByDayResponse>({ queryKey: ['meals'] }, (data) => (
    data
      ? {
        ...data,
        meals: data.meals.map((meal) => (
          meal.id === mealId ? { ...meal, foods: updateFoods(meal.foods) } : meal
        )),
      }
      : data
  ));
}

export async function updateMealFoodsInCache(
  queryClient: QueryClient,
  mealId: string,
  updateFoods: (foods: Food[]) => Food[],
) {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: ['meal', mealId] }),
    queryClient.cancelQueries({ queryKey: ['meals'] }),
  ]);

  queryClient.setQueryData<MealItem>(['meal', mealId], (meal) => (
    meal ? { ...meal, foods: updateFoods(meal.foods) } : meal
  ));

  updateListFoods(queryClient, mealId, updateFoods);
}

export async function syncMealAfterItemsMutation(
  queryClient: QueryClient,
  mealId: string,
  meal: MealItem | undefined,
) {
  if (queryClient.isMutating({ mutationKey: getMealItemsMutationKey(mealId) }) > 1) {
    return;
  }

  if (meal) {
    queryClient.setQueryData<MealItem>(['meal', mealId], meal);
  }

  await queryClient.invalidateQueries({ queryKey: ['meal', mealId] });

  if (queryClient.isMutating({ mutationKey: getMealItemsMutationKey(mealId) }) > 1) {
    return;
  }

  const currentMeal = queryClient.getQueryData<MealItem>(['meal', mealId]);

  if (currentMeal) {
    updateListFoods(queryClient, mealId, () => currentMeal.foods);
  }
}
