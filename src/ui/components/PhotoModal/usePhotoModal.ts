import { useCreateMeal } from '@/app/hooks/mutations/useCreateMeal';
import { useGetMealById } from '@/app/hooks/queries/useGetMealById';
import { getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { toast } from '@/app/libs/sonner';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import type { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { PhotoActionType } from '@/ui/components/PhotoModal';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface IUsePhotoModalParams {
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
}

export function usePhotoModal({ onRequestClose }: IUsePhotoModalParams) {
  const [photoActionType, setPhotoActionType] = useState<PhotoActionType>('takePhoto');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const queryClient = useQueryClient();
  const { navigate, addListener } = useNavigation<AppStackNavigatorProps>();

  const { createMeal, mealId, isPending } = useCreateMeal();
  const { meal, isLoading, isProcessing } = useGetMealById(mealId);

  useEffect(() => {
    if (!meal) {
      return;
    }

    if (meal.status === 'FAILED') {
      toast.error('Ocorreu um erro ao tentar processar sua refeição. Tente novamente!');
    }

    if (meal.status === 'SUCCESS') {
      const isoDate = meal.createdAt.toISOString().split('T')[0];

      const unsubscribe = addListener('transitionEnd', ({ data }) => {
        unsubscribe();
        onRequestClose('fade');
      });

      navigate('MealDetails', { mealId: meal.id });
      if (Platform.OS === 'web') {
        unsubscribe();
        onRequestClose('fade');
      }

      queryClient.invalidateQueries({ queryKey: ['meals', isoDate] });
    }

  }, [addListener, meal, navigate, onRequestClose, queryClient]);

  async function handleSend() {
    if (!photoUri) {
      return;
    }

    try {
      await createMeal(photoUri);
    } catch (error) {
      console.error(error);

      if (getApiErrorCode(error) === 'FREE_QUOTA_EXCEEDED') {
        onRequestClose('fade');
        toast.error(getErrorMessage('FREE_QUOTA_EXCEEDED'));
        navigate('Plans');
        return;
      }

      toast.error('Ocorreu um erro ao criar a sua refeição. Tente novamente!');
    }
  }

  function handleTryAgain() {
    setPhotoActionType('takePhoto');
    setPhotoUri(null);
  }

  async function handleTakePicture() {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    setPhotoActionType('reviewing');
  }

  const isCreateMealLoaderVisible =
    isPending ||
    isLoading ||
    isProcessing ||
    meal?.status === 'SUCCESS';

  return {
    isCreateMealLoaderVisible,
    photoActionType,
    permission,
    photoUri,
    cameraRef,
    requestPermission,
    handleTakePicture,
    handleTryAgain,
    handleSend,
  };
}
