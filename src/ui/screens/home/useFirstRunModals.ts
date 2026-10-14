import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { useState } from 'react';

export function useFirstRunModals() {
  const { isSignedUp } = useAuth();
  const { subscription } = useAccount();
  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);

  const showSummary = isSignedUp && !summaryDismissed;
  const showOffer = isSignedUp && summaryDismissed && !offerDismissed && !subscription;

  function dismissSummary() {
    setSummaryDismissed(true);
  }

  function dismissOffer() {
    setOfferDismissed(true);
  }

  return {
    showSummary,
    showOffer,
    dismissSummary,
    dismissOffer,
  };
}
