import { ValueOf } from '@/app/utils/ValueOf';

export type Food = {
  name: string;
  quantity: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  source?: FoodSource;
}

export const FoodSource = {
  INITIAL: 'INITIAL',
  ADDED: 'ADDED',
} as const;

export type FoodSource = ValueOf<typeof FoodSource>;
