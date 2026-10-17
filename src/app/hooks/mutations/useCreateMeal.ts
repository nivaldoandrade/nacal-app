import { getFileInfo } from '@/app/libs/getFileInfo';
import { MealsService } from '@/app/services/MealsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCalendars } from 'expo-localization';

function getDeviceTimeZone(): string | undefined {
  try {
    const timeZone = getCalendars()[0]?.timeZone;

    if (timeZone) {
      return timeZone;
    }
  } catch {
    // expo-localization unavailable fall back to Intl below.
  }

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

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
        timeZone: getDeviceTimeZone(),
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
