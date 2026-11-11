import { Subscription } from '@/app/types/Subscription';
import { daysUntil } from '@/ui/utils/daysUntil';

export const YEARLY_EXPIRY_NOTICE_DAYS = 30;
export const YEARLY_EXPIRY_URGENT_DAYS = 7;
export const YEARLY_EXPIRED_NOTICE_DAYS = 7;

export type YearlyExpiry = {
  state: 'EXPIRING' | 'EXPIRED';
  daysLeft: number;
  daysOverdue: number;
  isUrgent: boolean;
  paidUntil: Date;
};

export function getYearlyExpiry(subscription: Subscription | null, now: Date): YearlyExpiry | null {
  if (!subscription?.paidUntil || subscription.status !== 'ACTIVE' || subscription.planId !== 'PRO_YEARLY') {
    return null;
  }

  const { paidUntil } = subscription;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const lastDay = new Date(paidUntil.getFullYear(), paidUntil.getMonth(), paidUntil.getDate()).getTime();

  if (today > lastDay) {
    const daysOverdue = Math.round((today - lastDay) / 86_400_000);

    return { state: 'EXPIRED', daysLeft: 0, daysOverdue, isUrgent: true, paidUntil };
  }

  const daysLeft = daysUntil(paidUntil, now);

  if (daysLeft > YEARLY_EXPIRY_NOTICE_DAYS) {
    return null;
  }

  return {
    state: 'EXPIRING',
    daysLeft,
    daysOverdue: 0,
    isUrgent: daysLeft <= YEARLY_EXPIRY_URGENT_DAYS,
    paidUntil,
  };
}

export function formatYearlyExpiryCountdown(daysLeft: number): string {
  if (daysLeft <= 0) {
    return 'vence hoje';
  }

  return `vence em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`;
}
