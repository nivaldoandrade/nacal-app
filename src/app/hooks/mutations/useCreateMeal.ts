import { getDeviceTimeZone } from '@/app/libs/getDeviceTimeZone';
import { getFileInfo } from '@/app/libs/getFileInfo';
import { MealsService } from '@/app/services/MealsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ICreateMealParams {
  fileOrUri: string;
  description?: string;
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isPending, reset } = useMutation({
    mutationFn: async ({ fileOrUri, description }: ICreateMealParams) => {
      const { filename, mimeType, size, file, uri } = await getFileInfo(fileOrUri);

      return await MealsService.create({
        uri,
        contentType: mimeType,
        fileSize: size,
        filename,
        timeZone: getDeviceTimeZone(),
        description: description?.trim() || undefined,
        file,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    createMeal: mutateAsync,
    mealId: data?.mealId,
    isPending,
    reset,
  };
}
