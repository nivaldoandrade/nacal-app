import { getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useCancelSubscription } from '@/app/hooks/mutations/useCancelSubscription';
import { useCreateCheckout } from '@/app/hooks/mutations/useCreateCheckout';
import { useStartTrial } from '@/app/hooks/mutations/useStartTrial';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { useGetPlans } from '@/app/hooks/queries/useGetPlans';
import { getCheckoutReturnUrl } from '@/app/libs/getCheckoutReturnUrl';
import { queryClient } from '@/app/libs/queryClient';
import { toast } from '@/app/libs/sonner';
import { PlanId, Subscription } from '@/app/types/Subscription';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { daysUntil } from '@/ui/utils/daysUntil';
import { formatPrice } from '@/ui/utils/formatPrice';
import { useFocusEffect } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export type PlanStatus =
  | 'FREE'
  | 'TRIAL'
  | 'TRIAL_EXPIRED'
  | 'ACTIVE'
  | 'GRACE'
  | 'PAST_DUE'
  | 'EXPIRED';

const CHECKOUT_PENDING_KEY = 'nacal:checkout:pending';
const CHECKOUT_PENDING_MAX_AGE_MS = 30 * 60_000;
const POLL_MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 2500;

function derivePlanStatus(subscription: Subscription | null, now: number): PlanStatus {
  if (!subscription) {
    return 'FREE';
  }

  switch (subscription.status) {
    case 'TRIALING':
      return (subscription.trialEndsAt?.getTime() ?? 0) > now ? 'TRIAL' : 'TRIAL_EXPIRED';
    case 'ACTIVE':
      return 'ACTIVE';
    case 'PAST_DUE':
      return (subscription.paidUntil?.getTime() ?? 0) > now ? 'PAST_DUE' : 'EXPIRED';
    case 'CANCELED':
      return (subscription.paidUntil?.getTime() ?? 0) > now ? 'GRACE' : 'EXPIRED';
    default:
      return 'EXPIRED';
  }
}

function notifyError(error: unknown) {
  console.error(error);
  toast.error(getErrorMessage(getApiErrorCode(error)));
}

export function usePlansScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { subscription, mealQuota, loadAccount } = useAccount();
  const { data: plansData, isLoading, isError, refetch: refetchPlans } = useGetPlans();
  const { startTrial, isPending: isStartingTrial } = useStartTrial();
  const { createCheckout, isPending: isCreatingCheckout } = useCreateCheckout();
  const { cancelSubscription, isPending: isCanceling } = useCancelSubscription();

  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('PRO_MONTHLY');
  const [isConfirming, setIsConfirming] = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const confirmingRef = useRef(false);
  // token de execução do polling: incrementar invalida runs antigos (dismiss/unmount)
  const pollRunRef = useRef(0);

  const needsClock = Boolean(subscription?.trialEndsAt || subscription?.paidUntil);

  const plans = plansData?.plans ?? [];
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const currentPlan = subscription
    ? plans.find((plan) => plan.id === subscription.planId) ?? null
    : null;

  const trialDaysLeft = subscription?.trialEndsAt
    ? daysUntil(subscription.trialEndsAt, new Date(now))
    : null;

  const status = derivePlanStatus(subscription, now);

  const canStartTrial = !subscription;
  const showCycleSelector = status !== 'ACTIVE';
  const showConfirmPanel = isConfirming || awaitingPayment;
  const showCancelAction = status === 'ACTIVE' || status === 'TRIAL';

  const checkoutLabel = (() => {
    const value = selectedPlan ? formatPrice(selectedPlan.price) : '';
    const suffix = selectedPlan
      ? selectedPlan.cycle === 'MONTHLY' ? '/mês' : '/ano'
      : '';
    const price = value ? ` — ${value}${suffix}` : '';

    if (status === 'PAST_DUE') {
      return `Pagar agora${price}`;
    }

    if (status === 'GRACE') {
      return `Assinar novamente${price}`;
    }

    return `Assinar agora${price}`;
  })();

  const runPaymentConfirmation = useCallback(async () => {
    if (confirmingRef.current) {
      return;
    }

    const runId = ++pollRunRef.current;
    confirmingRef.current = true;
    setIsConfirming(true);

    let lastResult: Awaited<ReturnType<typeof loadAccount>> | null = null;

    try {
      for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
        // refetch() não lança em HTTP error — retorna result.error; sem olhar
        // aqui o loop falharia em silêncio com o dado antigo do cache.
        lastResult = await loadAccount();

        if (pollRunRef.current !== runId) {
          return;
        }

        const current = lastResult.data?.subscription ?? null;

        if (current?.status === 'ACTIVE') {
          toast.success('Pagamento confirmado! Seu Pro está ativo.');
          setAwaitingPayment(false);
          setIsConfirming(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

        if (pollRunRef.current !== runId) {
          return;
        }
      }

      setAwaitingPayment(true);
      setIsConfirming(false);

      if (lastResult?.error) {
        toast.error(getErrorMessage(getApiErrorCode(lastResult.error)));
      } else {
        toast('Pagamento ainda em processamento. Você pode verificar novamente quando quiser.');
      }
    } catch (error) {
      if (pollRunRef.current !== runId) {
        return;
      }

      setAwaitingPayment(true);
      setIsConfirming(false);
      notifyError(error);
    } finally {
      if (pollRunRef.current === runId) {
        confirmingRef.current = false;
      }
    }
  }, [loadAccount]);

  // Web (mesma aba — navegador mobile e PWA): o checkout abre por location.assign.
  // A flag em sessionStorage (escrita ao ir embora, mesmo tab) dispara a confirmação
  // uma única vez. Dois gatilhos: mount (retorno = reload fresco) e `pageshow` com
  // persisted — no PWA, o X do Asaas faz history.back() e o bfcache restaura a
  // página SEM re-executar os effects, deixando a flag sem consumo. A API é a fonte
  // da verdade (comprovou ACTIVE → sucesso; senão → painel "Já paguei").
  const tryConsumePendingFlag = useCallback(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return false;
    }

    try {
      const raw = window.sessionStorage.getItem(CHECKOUT_PENDING_KEY);

      if (!raw) {
        return false;
      }

      window.sessionStorage.removeItem(CHECKOUT_PENDING_KEY);

      const timestamp = Number(raw);

      if (!Number.isFinite(timestamp) || Date.now() - timestamp > CHECKOUT_PENDING_MAX_AGE_MS) {
        return false;
      }

      // setState não pode ser síncrono no corpo do effect (lint) — agenda em
      // macrotask; a flag já foi consumida, então é one-shot.
      setTimeout(() => {
        void runPaymentConfirmation();
      }, 0);

      return true;
    } catch {
      // sessionStorage indisponível — o usuário ainda tem o "Já paguei"
      return false;
    }
  }, [runPaymentConfirmation]);

  async function handleStartTrial() {
    try {
      await startTrial();
      toast.success('Trial de 7 dias ativado. Aproveite o Pro!');
    } catch (error) {
      notifyError(error);
    }
  }

  async function handleCheckout() {
    try {
      const returnUrl = getCheckoutReturnUrl();
      const { checkoutUrl } = await createCheckout({ planId: selectedPlanId, returnUrl });

      if (Platform.OS === 'web') {
        // Mesma aba (navegador mobile + PWA): o retorno em /billing/return dá
        // reload e o efeito de boot acima confirma via esta flag.
        try {
          window.sessionStorage.setItem(CHECKOUT_PENDING_KEY, String(Date.now()));
        } catch {
          // sessionStorage indisponível — segue pro checkout mesmo assim
        }

        window.location.assign(checkoutUrl);
        return;
      }

      setAwaitingPayment(true);
      await WebBrowser.openAuthSessionAsync(checkoutUrl, returnUrl);
      await runPaymentConfirmation();
    } catch (error) {
      notifyError(error);
    }
  }

  function handleDismissConfirm() {
    pollRunRef.current += 1;
    confirmingRef.current = false;
    setIsConfirming(false);
    setAwaitingPayment(false);
  }

  async function handleCancel() {
    try {
      const wasTrial = subscription?.status === 'TRIALING';

      await cancelSubscription();
      setShowCancelConfirm(false);
      setAwaitingPayment(false);

      toast.success(
        wasTrial
          ? 'Trial cancelado. Seu plano voltou ao Free.'
          : 'Assinatura cancelada. Você mantém o acesso até a data de vencimento.',
      );
    } catch (error) {
      notifyError(error);
    }
  }

  useEffect(() => {
    if (!needsClock) {
      return;
    }

    // now pode estar velho (tela aberta em FREE): sincroniza ao ligar o relógio
    const syncId = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 60_000);

    return () => {
      clearTimeout(syncId);
      clearInterval(id);
    };
  }, [needsClock]);

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }, []),
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    tryConsumePendingFlag();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        tryConsumePendingFlag();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [tryConsumePendingFlag]);

  useEffect(() => {
    return () => {
      pollRunRef.current += 1;
      confirmingRef.current = false;
    };
  }, []);

  return {
    top,
    bottom,
    plans,
    isLoading,
    isError,
    refetchPlans,
    status,
    subscription,
    mealQuota,
    trialDaysLeft,
    currentPlan,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    canStartTrial,
    showCycleSelector,
    showConfirmPanel,
    showCancelAction,
    showCancelConfirm,
    setShowCancelConfirm,
    isConfirming,
    isStartingTrial,
    isCreatingCheckout,
    isCanceling,
    checkoutLabel,
    handleStartTrial,
    handleCheckout,
    handleDismissConfirm,
    handleCancel,
    runPaymentConfirmation,
  };
}
