import { AccountsService } from '@/app/services/AccountsService';
import { useQuery } from '@tanstack/react-query';

interface IUseAccountParams {
  enabled?: boolean;
}

export function useAccount({ enabled = true }: IUseAccountParams = {}) {
  const { data, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => AccountsService.me(),
    enabled: enabled,
    staleTime: Infinity,
  });

  const subscription = data?.subscription ?? null;
  const mealQuota = data?.mealQuota ?? null;

  return {
    account: data?.isOnboarded ? data : null,
    subscription,
    mealQuota,
    plan: subscription?.plan ?? 'FREE',
    isPro: (subscription?.plan ?? 'FREE') === 'PRO',
    trialEndsAt: subscription?.trialEndsAt ?? null,
    loadAccount: refetch,
  };
};
