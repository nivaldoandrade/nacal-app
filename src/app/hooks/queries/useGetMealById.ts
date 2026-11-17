import { MealsService } from '@/app/services/MealsService';
import { MealStatus } from '@/app/types/Meal';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const PROCESSING_STATUSES = new Set<MealStatus>([
  MealStatus.UPLOADING,
  MealStatus.QUEUED,
  MealStatus.PROCESSING,
]);

const FAST_POLLING_INTERVAL_MS = 2_000;
const FAST_POLLING_WINDOW_MS = 20_000;
const MAX_POLLING_INTERVAL_MS = 10_000;
const POLLING_BACKOFF_FACTOR = 1.5;
const POLLING_TIMEOUT_MS = 180_000;

function getPollingInterval(elapsedMs: number): number {
  if (elapsedMs < FAST_POLLING_WINDOW_MS) {
    return FAST_POLLING_INTERVAL_MS;
  }

  let interval = FAST_POLLING_INTERVAL_MS;
  let scheduledAt = FAST_POLLING_WINDOW_MS;

  while (interval < MAX_POLLING_INTERVAL_MS) {
    interval = Math.min(interval * POLLING_BACKOFF_FACTOR, MAX_POLLING_INTERVAL_MS);

    if (scheduledAt + interval > elapsedMs) {
      return interval;
    }

    scheduledAt += interval;
  }

  return MAX_POLLING_INTERVAL_MS;
}

export function useGetMealById(mealId?: string, pollingStartedAt?: number) {
  const [timedOutMealId, setTimedOutMealId] = useState<string | null>(null);
  const isPollingTimedOut = !!mealId && timedOutMealId === mealId;

  const { data: meal, isLoading, refetch } = useQuery({
    queryKey: ['meal', mealId],
    enabled: !!mealId,
    queryFn: () => {
      if (!mealId) {
        return;
      }

      return MealsService.getById(mealId);
    },
    staleTime: Infinity,
    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (!status || !PROCESSING_STATUSES.has(status) || isPollingTimedOut) {
        return false;
      }

      const elapsedMs = pollingStartedAt ? Date.now() - pollingStartedAt : 0;

      if (elapsedMs >= POLLING_TIMEOUT_MS) {
        return false;
      }

      return getPollingInterval(elapsedMs);
    },
  });

  const isProcessing = !!(meal && PROCESSING_STATUSES.has(meal.status));

  useEffect(() => {
    if (!mealId || !pollingStartedAt || !isProcessing) {
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      const { data } = await refetch();

      if (cancelled || (data && !PROCESSING_STATUSES.has(data.status))) {
        return;
      }

      setTimedOutMealId(mealId);
    }, Math.max(pollingStartedAt + POLLING_TIMEOUT_MS - Date.now(), 0));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [mealId, pollingStartedAt, isProcessing, refetch]);

  return {
    meal,
    isLoading,
    isProcessing,
    isPollingTimedOut: isPollingTimedOut && isProcessing,
  };
}
