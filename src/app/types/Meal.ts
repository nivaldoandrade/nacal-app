import { Food } from '@/app/types/Food';
import { ValueOf } from '@/app/utils/ValueOf';

export type Meal = {
  id: string;
  name: string;
  icon: string;
  foods: Food[];
  createdAt: string;
}

export type MealItem = {
  id: string;
  status: MealStatus;
  rejectionReason: RejectionReason | null;
  inputFileType: MealInput;
  inputFileUrl: string | null;
  name: string;
  icon: string;
  foods: Food[];
  createdAt: Date;
}

export const MealStatus = {
  UPLOADING: 'UPLOADING',
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
} as const;

export type MealStatus = ValueOf<typeof MealStatus>;

export const RejectionReason = {
  NOT_A_MEAL: 'NOT_A_MEAL',
  NO_FOOD_DETECTED: 'NO_FOOD_DETECTED',
  INVALID_FILE: 'INVALID_FILE',
} as const;

export type RejectionReason = ValueOf<typeof RejectionReason>;

export const MealInput = {
  PICTURE: 'PICTURE',
  AUDIO: 'AUDIO',
} as const;

export type MealInput = ValueOf<typeof MealInput>;
