import { queryClient } from '@/app/libs/queryClient';
import { BillingService } from '@/app/services/BillingService';
import { useMutation } from '@tanstack/react-query';

export function useCancelSubscription() {

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => BillingService.cancel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['billing', 'plans'] });
    },
  });

  return {
    cancelSubscription: mutateAsync,
    isPending,
  };
}
