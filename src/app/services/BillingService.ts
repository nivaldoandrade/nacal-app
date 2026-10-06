import { Service } from '@/app/services/Service';
import { PlanId, SubscriptionStatus } from '@/app/types/Subscription';

export class BillingService extends Service {

  static async plans(): Promise<BillingService.PlansResponse> {
    const { data } = await this.client.get<BillingService.PlansResponse>('billing/plans');

    return data;
  }

  static async startTrial(): Promise<BillingService.StartTrialResponse> {
    const { data } = await this.client.post<BillingService.StartTrialResponse>('billing/trial');

    return data;
  }

  static async createCheckout(params: BillingService.CreateCheckoutParams): Promise<BillingService.CreateCheckoutResponse> {
    const { data } = await this.client.post<BillingService.CreateCheckoutResponse>('billing/checkout', params);

    return data;
  }

  static async cancel(): Promise<BillingService.CancelResponse> {
    const { data } = await this.client.post<BillingService.CancelResponse>('billing/cancel');

    return data;
  }

}

export namespace BillingService {

  export type Plan = {
    id: PlanId;
    name: string;
    price: number;
    cycle: 'MONTHLY' | 'YEARLY';
    trialDays: number;
    features: string[];
  };

  export type PlansResponse = {
    plans: Plan[];
  };

  export type StartTrialResponse = {
    trialEndsAt: string;
  };

  export type CreateCheckoutParams = {
    planId: PlanId;
    returnUrl: string;
  };

  export type CreateCheckoutResponse = {
    checkoutUrl: string;
    expiresAt: string;
  };

  export type CancelResponse = {
    status: SubscriptionStatus;
  };
}
