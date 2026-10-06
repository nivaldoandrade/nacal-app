export type PlanId = 'PRO_MONTHLY' | 'PRO_YEARLY';

export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';

export type EffectivePlan = 'FREE' | 'PRO';

export type Subscription = {
  plan: EffectivePlan;
  planId: PlanId;
  status: SubscriptionStatus;
  trialEndsAt: Date | null;
  paidUntil: Date | null;
};

export type MealQuota = {
  used: number;
  limit: number | null;
  remaining: number | null;
};
