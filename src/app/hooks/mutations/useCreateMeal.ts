import { getFileInfo } from '@/app/libs/getFileInfo';
import { MealsService } from '@/app/services/MealsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateMeal() {
  const queryClient = useQueryClient();

  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: async (fileOrUri: string) => {
      const { filename, mimeType, size, file } = await getFileInfo(fileOrUri);

      return await MealsService.create({
        uri: fileOrUri,
        contentType: mimeType,
        fileSize: size,
        filename,
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
  };
}
