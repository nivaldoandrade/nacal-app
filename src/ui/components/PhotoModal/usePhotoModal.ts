import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { insertMealIntoDayList } from '@/app/hooks/mutations/mealItemsCache';
import { useCreateMeal } from '@/app/hooks/mutations/useCreateMeal';
import { useGetMealById } from '@/app/hooks/queries/useGetMealById';
import { getMealRejectionMessage } from '@/app/libs/getMealRejectionMessage';
import { toast } from '@/app/libs/sonner';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { MealStatus } from '@/app/types/Meal';
import type { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { MODAL_TOASTER_ID } from '@/ui/components/ModalWrapper';
import { PhotoActionType } from '@/ui/components/PhotoModal';
import type { ICameraCaptureRef } from '@/ui/components/PhotoModal/components/CameraCapture/CameraCapture.types';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { toLocalIsoDate } from '@/app/utils/toLocalIsoDate';

interface IUsePhotoModalParams {
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
}

export function usePhotoModal({ onRequestClose }: IUsePhotoModalParams) {
  const [photoActionType, setPhotoActionType] = useState<PhotoActionType>('takePhoto');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ICameraCaptureRef>(null);
  const isCapturingRef = useRef(false);
  const rejectedMealIdRef = useRef<string | null>(null);
  const failedMealIdRef = useRef<string | null>(null);
  const timedOutMealIdRef = useRef<string | null>(null);

  const queryClient = useQueryClient();
  const { navigate, addListener } = useNavigation<AppStackNavigatorProps>();

  const {
    createMeal,
    mealId,
    uploadedAt,
    isPending,
    reset: resetCreateMeal,
  } = useCreateMeal();
  const { meal, isLoading, isProcessing, isPollingTimedOut } = useGetMealById(mealId, uploadedAt);

  useEffect(() => {
    if (!meal) {
      return;
    }

    if (meal.status === MealStatus.REJECTED) {
      if (rejectedMealIdRef.current === meal.id) {
        return;
      }

      rejectedMealIdRef.current = meal.id;
      toast.info(getMealRejectionMessage(meal.rejectionReason, meal.inputFileType), {
        toasterId: MODAL_TOASTER_ID,
      });
      queryClient.removeQueries({ queryKey: ['meal', meal.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      resetCreateMeal();
      setPhotoActionType('takePhoto');
      setPhotoUri(null);
      setDescription('');
      return;
    }

    if (meal.status === MealStatus.FAILED) {
      if (failedMealIdRef.current === meal.id) {
        return;
      }

      failedMealIdRef.current = meal.id;
      toast.error('Ocorreu um erro ao tentar processar sua refeição. Tente novamente!', {
        toasterId: MODAL_TOASTER_ID,
      });
      queryClient.removeQueries({ queryKey: ['meal', meal.id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      resetCreateMeal();
      setPhotoActionType('takePhoto');
      setPhotoUri(null);
      setDescription('');
      return;
    }

    if (meal.status === MealStatus.SUCCESS) {
      const unsubscribe = addListener('transitionEnd', ({ data }) => {
        unsubscribe();
        onRequestClose('fade');
      });

      navigate('MealDetails', { mealId: meal.id });
      if (Platform.OS === 'web') {
        unsubscribe();
        onRequestClose('fade');
      }

      insertMealIntoDayList(queryClient, meal);
    }

  }, [addListener, meal, navigate, onRequestClose, queryClient, resetCreateMeal]);

  useEffect(() => {
    if (!isPollingTimedOut || !meal || timedOutMealIdRef.current === meal.id) {
      return;
    }

    timedOutMealIdRef.current = meal.id;
    toast.info('Sua refeição está demorando mais que o normal. Ela vai aparecer na sua lista assim que ficar pronta.');
    queryClient.invalidateQueries({ queryKey: ['meal', meal.id], refetchType: 'none' });
    queryClient.invalidateQueries({
      queryKey: ['meals', toLocalIsoDate(meal.createdAt)],
      refetchType: 'none',
    });
    onRequestClose('fade');
  }, [isPollingTimedOut, meal, onRequestClose, queryClient]);

  async function handleSend() {
    if (!photoUri) {
      return;
    }

    try {
      await createMeal({ fileOrUri: photoUri, description });
    } catch (error) {
      console.error(error);

      const code = getApiErrorCode(error);

      if (code === ErrorCode.DAILY_MEAL_LIMIT_REACHED) {
        onRequestClose('fade');
        toast.info(getErrorMessage(code));
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        return;
      }

      if (code === ErrorCode.FREE_QUOTA_EXCEEDED) {
        onRequestClose('fade');
        toast.error(getErrorMessage(code));
        navigate('Plans');
        return;
      }

      if (code === ErrorCode.RATE_LIMIT_EXCEEDED) {
        toast.info(getErrorMessage(code), {
          toasterId: MODAL_TOASTER_ID,
        });
        return;
      }

      toast.error('Ocorreu um erro ao criar a sua refeição. Tente novamente!', {
        toasterId: MODAL_TOASTER_ID,
      });
    }
  }

  function handleTryAgain() {
    setPhotoActionType('takePhoto');
    setPhotoUri(null);
    setDescription('');
  }

  async function handleTakePicture() {
    if (!cameraRef.current || isCapturingRef.current) {
      return;
    }

    isCapturingRef.current = true;
    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      setPhotoActionType('reviewing');
    } catch {
      toast.error('Não conseguimos tirar a foto. Tente novamente.', {
        toasterId: MODAL_TOASTER_ID,
      });
    } finally {
      isCapturingRef.current = false;
      setIsCapturing(false);
    }
  }

  const isCreateMealLoaderVisible =
    isPending ||
    isLoading ||
    isProcessing ||
    meal?.status === MealStatus.SUCCESS;

  return {
    isCreateMealLoaderVisible,
    photoActionType,
    permission,
    photoUri,
    description,
    isCapturing,
    cameraRef,
    requestPermission,
    handleTakePicture,
    handleTryAgain,
    handleSend,
    setDescription,
  };
}
