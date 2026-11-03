import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { usePwaInstall } from '@/app/hooks/usePwaInstall';
import { useState } from 'react';

export function useFirstRunModals() {
  const { isSignedUp } = useAuth();
  const { subscription } = useAccount();
  const { isInstallable, isReady, isSnoozed } = usePwaInstall();
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);

  const showSummary = isSignedUp && !summaryDismissed;
  const showOffer = isSignedUp && summaryDismissed && !offerDismissed && !subscription;
  // Só depois dos modais de plano, para não empilhar pedidos no primeiro acesso.
  const showInstallTip = isInstallable && isReady && !isSnoozed && !showSummary && !showOffer;

  function dismissSummary() {
    setSummaryDismissed(true);
  }

  function dismissOffer() {
    setOfferDismissed(true);
  }

  return {
    showSummary,
    showOffer,
    showInstallTip,
    dismissSummary,
    dismissOffer,
  };
}
