import { MealsService } from '@/app/services/MealsService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toLocalIsoDate } from '@/app/utils/toLocalIsoDate';

export function useListMealByDay(date: Date) {
  const isoDate = toLocalIsoDate(date);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['meals', isoDate],
    queryFn: () => MealsService.listByDay(isoDate),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  return {
    meals: data?.meals ?? [],
    initialLoading: isLoading,
    isLoading: isFetching,
    refetch,
  };
}
