import { BillingService } from '@/app/services/BillingService';
import { queryClient } from '@/app/libs/queryClient';
import { useMutation } from '@tanstack/react-query';

export function useStartTrial() {

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => BillingService.startTrial(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    startTrial: mutateAsync,
    isPending,
  };
}
