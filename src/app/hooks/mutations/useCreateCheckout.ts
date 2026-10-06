import { queryClient } from '@/app/libs/queryClient';
import { BillingService } from '@/app/services/BillingService';
import { useMutation } from '@tanstack/react-query';

export function useCreateCheckout() {

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (params: BillingService.CreateCheckoutParams) => BillingService.createCheckout(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    createCheckout: mutateAsync,
    isPending,
  };
}
