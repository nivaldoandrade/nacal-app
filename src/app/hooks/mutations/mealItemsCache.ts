import { MealsService } from '@/app/services/MealsService';
import { Food } from '@/app/types/Food';
import { MealItem } from '@/app/types/Meal';
import { QueryClient } from '@tanstack/react-query';

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
