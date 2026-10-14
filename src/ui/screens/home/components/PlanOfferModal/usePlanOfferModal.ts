import { getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useStartTrial } from '@/app/hooks/mutations/useStartTrial';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { useGetPlans } from '@/app/hooks/queries/useGetPlans';
import { toast } from '@/app/libs/sonner';

interface IUsePlanOfferModalParams {
  onDismiss: () => void;
}

export function usePlanOfferModal({ onDismiss }: IUsePlanOfferModalParams) {
  const { mealQuota } = useAccount();
  const {
    data: plansData,
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
  } = useGetPlans();
  const { startTrial, isPending: isStartingTrial } = useStartTrial();

  const plans = plansData?.plans ?? [];
  const monthlyPlan = plans.find((plan) => plan.cycle === 'MONTHLY');
  const proFeatures = monthlyPlan?.features ?? plans[0]?.features ?? [];
  const trialDays = monthlyPlan?.trialDays ?? null;
  const freeFeature = `${mealQuota?.limit ?? 20} refeições AI por mês`;

  async function handleStartTrial() {
    try {
      await startTrial();
      toast.success('Trial de 7 dias ativado. Aproveite o Pro!');
      onDismiss();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(getApiErrorCode(error)));
    }
  }

  return {
    isLoadingPlans,
    isErrorPlans,
    freeFeature,
    proFeatures,
    trialDays,
    isStartingTrial,
    handleStartTrial,
    handleKeepFree: onDismiss,
  };
}
