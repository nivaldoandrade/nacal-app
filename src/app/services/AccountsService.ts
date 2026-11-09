import { Service } from '@/app/services/Service';
import { ActivityLevel } from '@/app/types/ActivityLevel';
import { Gender } from '@/app/types/Gender';
import { Goal } from '@/app/types/Goal';
import { MealQuota, Subscription } from '@/app/types/Subscription';

export class AccountsService extends Service {

  static async me(): Promise<AccountsService.Me> {
    const { data } = await this.client.get<AccountsService.MeResponse>('me');

    const subscription: Subscription | null = data.subscription
      ? {
        plan: data.subscription.plan,
        planId: data.subscription.planId,
        status: data.subscription.status,
        trialEndsAt: data.subscription.trialEndsAt
          ? new Date(data.subscription.trialEndsAt)
          : null,
        paidUntil: data.subscription.paidUntil
          ? new Date(data.subscription.paidUntil)
          : null,
      }
      : null;

    const mealQuota = data.mealQuota;
    const dailyMealQuota = data.dailyMealQuota ?? null;

    if (!data.isOnboarded || !data.profile || !data.goal) {
      return {
        isOnboarded: false,
        profile: null,
        goal: null,
        subscription,
        mealQuota,
        dailyMealQuota,
      };
    }

    return {
      isOnboarded: true,
      profile: {
        ...data.profile,
        birthDate: this.parseDateFromAPI(data.profile.birthDate),
      },
      goal: data.goal,
      subscription,
      mealQuota,
      dailyMealQuota,
    };
  }

  static async updateProfile(params: AccountsService.UpdateProfileParams): Promise<void> {
    await this.client.put('profiles', params);
  }

  static async completeOnboarding(params: AccountsService.CompleteOnboardingParams): Promise<void> {
    await this.client.post('auth/complete-onboarding', params);

  }

  private static parseDateFromAPI(dateString: string): Date {
    const date = new Date(dateString);

    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
  };
}

export namespace AccountsService {

  export type MeResponse = {
    isOnboarded: boolean;
    profile: {
      name: string;
      birthDate: string;
      gender: string;
      height: number;
      weight: number;
      goal: Goal;
    } | null;
    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    } | null;
    subscription: {
      plan: 'FREE' | 'PRO';
      planId: Subscription['planId'];
      status: Subscription['status'];
      trialEndsAt?: string;
      paidUntil?: string;
    } | null;
    mealQuota: MealQuota;
    dailyMealQuota?: MealQuota | null;
  };

  export type Me =
    | {
        isOnboarded: false;
        profile: null;
        goal: null;
        subscription: Subscription | null;
        mealQuota: MealQuota;
        dailyMealQuota: MealQuota | null;
      }
    | {
        isOnboarded: true;
        profile: Omit<NonNullable<MeResponse['profile']>, 'birthDate'> & {
          birthDate: Date;
        };
        goal: NonNullable<MeResponse['goal']>;
        subscription: Subscription | null;
        mealQuota: MealQuota;
        dailyMealQuota: MealQuota | null;
      };

  export type UpdateProfileParams = {
    name: string;
    height: number;
    weight: number;
    gender: string;
    birthDate: string;
  };

  export type CompleteOnboardingParams = {
    accessToken: string;
    acceptedTerms: boolean;
    birthDate: string;
    height: number;
    weight: number;
    gender: Gender;
    goal: Goal;
    activityLevel: ActivityLevel;
  };
}
