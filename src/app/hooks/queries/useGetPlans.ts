import { BillingService } from '@/app/services/BillingService';
import { useQuery } from '@tanstack/react-query';

export function useGetPlans() {
  return useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => BillingService.plans(),
    staleTime: Infinity,
  });
}
