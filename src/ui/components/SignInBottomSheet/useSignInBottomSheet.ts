import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { ApiError, ErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { AuthStackNavigatorProps } from '@/app/navigation/AuthStack';
import { ISignInBottomSheet } from '@/ui/components/SignInBottomSheet/ISignInBottomSheet';
import { signInSchema } from '@/ui/components/SignInBottomSheet/schema';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { isAxiosError } from 'axios';
import { useImperativeHandle, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

interface IUseSignInBottomSheet {
  ref: React.Ref<ISignInBottomSheet>;
  initialEmail?: string;
}

export function useSignInBottomSheet({ ref, initialEmail }: IUseSignInBottomSheet) {
  const { bottom } = useSafeAreaInsets();

  const { signIn } = useAuth();
  const navigation = useNavigation<AuthStackNavigatorProps>();

  const {
    control,
    handleSubmit: RHFHandleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: initialEmail ?? '',
      password: '',
    },
  });

  const passwordInputRef = useRef<TextInput>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => {
    return {
      open() {
        bottomSheetModalRef.current?.present();
      },
    };
  }, []);

  const handleForgotPasswordPress = () => {
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate('ForgotPassword');
  };

  // eslint-disable-next-line react-hooks/refs
  const handleSubmit = RHFHandleSubmit(async (data) => {
    try {
      await signIn(data);
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      if (isAxiosError<ApiError>(error)) {
        const code = error.response?.data.error.code;

        if (code === ErrorCode.EMAIL_NOT_CONFIRMED) {
          bottomSheetModalRef.current?.dismiss();
          navigation.navigate('ConfirmEmail', { email: data.email, codeSent: false });
          return;
        }

        const message = getErrorMessage(code);
        setError('root.api', { message });
      }
    }
  });

  return {
    bottom,
    bottomSheetModalRef,
    passwordInputRef,
    handleSubmit,
    handleForgotPasswordPress,
    control,
    isSubmitting,
    isValid,
    clearErrors,
  };
}
