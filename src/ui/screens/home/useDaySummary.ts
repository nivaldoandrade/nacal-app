import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { useMemo } from 'react';

export function useDaySummary() {
  const { meals } = useHomeContext();

  return useMemo(() => {
    const result = meals.flatMap(meal => meal.foods).reduce((acc, item) => {
      acc.calories += item.calories;
      acc.proteins += item.proteins;
      acc.carbohydrates += item.carbohydrates;
      acc.fats += item.fats;

      return acc;
    }, {
      calories: 0,
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
    });

    return {
      calories: Math.round(result.calories),
      proteins: parseFloat(result.proteins.toFixed(1)),
      carbohydrates: parseFloat(result.carbohydrates.toFixed(1)),
      fats: parseFloat(result.fats.toFixed(1)),
    };
  }, [meals]);
}
