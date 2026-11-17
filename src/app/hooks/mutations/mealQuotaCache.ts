import { AccountsService } from '@/app/services/AccountsService';
import { MealsService } from '@/app/services/MealsService';
import { QueryClient } from '@tanstack/react-query';

export function updateMealQuotaInCache(queryClient: QueryClient, usage: MealsService.MealQuotaUsage) {
  const { mealQuota, dailyMealQuota = null } = usage;
  const account = queryClient.getQueryData<AccountsService.Me>(['accounts']);

  if (!account) {
    return;
  }

  const isProUsage = dailyMealQuota !== null;
  const isProAccount = account.subscription?.plan === 'PRO';

  if (!mealQuota || isProUsage !== isProAccount) {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    return;
  }

  queryClient.setQueryData<AccountsService.Me>(['accounts'], { ...account, mealQuota, dailyMealQuota });
}
