import { Service } from '@/app/services/Service';
import { Food } from '@/app/types/Food';
import { MealItem } from '@/app/types/Meal';

export class MealsService extends Service {

  static async listByDay(date: string): Promise<MealsService.ListByDayResponse> {

    const { data } = await this.client.get<MealsService.ListByDayResponse>(
      'meals',
      {
        params: {
          date,
        },
      },
    );

    return data;
  }

  static async getById(mealId: string): Promise<MealsService.GetByIdResponse> {
    const { data } = await this.client.get<MealsService.GetByIdResponse>(
      `meals/${mealId}`,
    );

    return {
      ...data,
      createdAt: new Date(data.createdAt),
    };
  }

  static async addItems(
    params: MealsService.AddItems['params'],
  ): Promise<MealsService.AddItems['response']> {
    const { data } = await this.client.post<MealsService.AddItems['rawResponse']>(
      `meals/${params.mealId}/items`,
      {
        text: params.text,
      },
    );

    return {
      ...data,
      meal: {
        ...data.meal,
        createdAt: new Date(data.meal.createdAt),
      },
    };
  }

  static async create(
    params: MealsService.Create['params'],
  ): Promise<MealsService.Create['response']> {

    const { data } = await this.client.post<MealsService.Create['rawResponse']>(
      'create-meal',
      {
        contentType: params.contentType,
        fileSize: params.fileSize,
        timeZone: params.timeZone,
        description: params.description,
      },
    );

    await this.uploadPresignedPOST({
      uploadSignature: data.uploadSignature,
      file: params.file ? params.file : {
        name: params.filename!,
        type: params.contentType,
        uri: params.uri,
      },
    });

    return {
      mealId: data.mealId,
    };
  }

}

export namespace MealsService {

  export type ListByDayResponse = {
    meals: {
      id: string;
      name: string;
      icon: string;
      foods: Food[];
      createdAt: string;
      timeZone?: string;
    }[]
  };

  export type Create = {
    params: {
      uri: string;
      filename: string | undefined;
      contentType: string;
      fileSize: number;
      timeZone: string | undefined;
      description?: string;
      file: File | undefined
    },

    rawResponse: {
      mealId: string;
      uploadSignature: string;
    }

    response: Omit<MealsService.Create['rawResponse'], 'uploadSignature'>;
  }

  export type GetByIdResponse = MealItem;

  export type AddItems = {
    params: {
      mealId: string;
      text: string;
    };

    rawResponse: {
      meal: Omit<MealItem, 'createdAt'> & { createdAt: string };
      addedFoods: Food[];
      skippedFoodsCount: number;
      unidentifiedFoodsCount: number;
    };

    response: {
      meal: MealItem;
      addedFoods: Food[];
      skippedFoodsCount: number;
      unidentifiedFoodsCount: number;
    };
  }
}
