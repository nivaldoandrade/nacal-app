import { useCreateMeal } from '@/app/hooks/mutations/useCreateMeal';
import { useGetMealById } from '@/app/hooks/queries/useGetMealById';
import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { getMealRejectionMessage } from '@/app/libs/getMealRejectionMessage';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { toast } from '@/app/libs/sonner';
import { MealStatus } from '@/app/types/Meal';
import { ActionType } from '@/ui/components/AudioModal';
import { CreateMealModalAnimationType } from '@/ui/components/CreateMealModals';
import { MODAL_TOASTER_ID } from '@/ui/components/ModalWrapper';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface IUseAudioModalParams {
  visible: boolean;
  onRequestClose: (animationType?: CreateMealModalAnimationType) => void;
}

export function useAudioModal({ visible, onRequestClose }: IUseAudioModalParams) {
  const [recordingStatus, setRecordingStatus] = useState<ActionType>('startRecord');
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const rejectedMealIdRef = useRef<string | null>(null);

  const queryClient = useQueryClient();
  const { navigate, addListener } = useNavigation<AppStackNavigatorProps>();

  const {
    createMeal,
    mealId,
    isPending,
    reset: resetCreateMeal,
  } = useCreateMeal();
  const { meal, isLoading, isProcessing } = useGetMealById(mealId);

  useEffect(() => {
    if (!visible) {
      return;
    }

    (async () => {

      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        toast.error('Permissão para acessar o microfone foi negada', {
          toasterId: MODAL_TOASTER_ID,
        });
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, [visible]);

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
      setRecordedUri(null);
      setRecordingStatus('startRecord');
      return;
    }

    if (meal.status === MealStatus.FAILED) {
      toast.error('Ocorreu um erro ao tentar processar sua refeição. Tente novamente!', {
        toasterId: MODAL_TOASTER_ID,
      });
    }

    if (meal.status === MealStatus.SUCCESS) {
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

  }, [addListener, meal, navigate, onRequestClose, queryClient, resetCreateMeal]);

  const handleChangeRecordingStatus = useCallback(
    async (actionType: ActionType) => {
      if (actionType === 'recording') {
        try {
          await audioRecorder.prepareToRecordAsync();
          audioRecorder.record();
        } catch {
          toast.error('Permissão para acessar o microfone foi negada', {
            toasterId: MODAL_TOASTER_ID,
          });
          return;
        }
      }

      if (actionType === 'reviewing') {
        await audioRecorder.stop();
        setRecordedUri(audioRecorder.uri);
      }

      setRecordingStatus(actionType);
    }, [audioRecorder]);

  function handleTryAgain() {
    setRecordedUri(null);
    setRecordingStatus('startRecord');
  }

  async function handleSend() {
    if (!recordedUri) {
      return;
    }

    try {
      await createMeal(recordedUri);
    } catch (error) {
      console.error(error);

      const code = getApiErrorCode(error);

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

  const isRecording = recordingStatus === 'recording';

  const isCreateMealLoaderVisible =
    isPending ||
    isLoading ||
    isProcessing ||
    meal?.status === MealStatus.SUCCESS;

  return {
    isCreateMealLoaderVisible,
    isRecording,
    recordingStatus,
    handleTryAgain,
    handleSend,
    handleChangeRecordingStatus,
    recordedUri,
    audioRecorder,
  };
}
