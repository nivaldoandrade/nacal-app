import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { toast } from '@/app/libs/sonner';
import type { AuthStackNavigatorProps } from '@/app/navigation/AuthStack';
import { AuthService } from '@/app/services/AuthService';
import { ConfirmEmailSchema, createConfirmEmailSchema } from '@/ui/screens/confirmEmail/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface IUseConfirmEmail {
  email: string;
  codeSent: boolean;
}

const RESEND_COOLDOWN_SECONDS = 30;

export function useConfirmEmail({ email, codeSent }: IUseConfirmEmail) {
  const { confirmPendingSignUp, pendingSignUpEmail } = useAuth();
  const navigation = useNavigation<AuthStackNavigatorProps>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordResetRequired, setPasswordResetRequired] = useState(false);
  // Captured once: the cached password is cleared during confirmation and the field must not
  // pop up mid-submit.
  const [requiresPassword] = useState(() => pendingSignUpEmail !== email.trim().toLowerCase());
  const schema = useMemo(() => createConfirmEmailSchema(requiresPassword), [requiresPassword]);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const isResendingRef = useRef(false);
  const autoResendForEmailRef = useRef<string | null>(null);

  const {
    control,
    handleSubmit: RHFHandleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, isValid },
  } = useForm<ConfirmEmailSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      confirmationCode: '',
      password: '',
    },
  });

  const handleSubmit = RHFHandleSubmit(async (data) => {
    try {
      const result = await confirmPendingSignUp({
        email,
        confirmationCode: data.confirmationCode,
        password: data.password || undefined,
      });

      if (result.passwordResetRequired) {
        setPasswordResetRequired(true);
        setIsSuccess(true);
        return;
      }

      if (result.signedIn && !result.isOnboarded) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'OnboardingIntro' }],
        });
        return;
      }

      if (!result.signedIn) {
        setIsSuccess(true);
      }
    } catch (error) {
      const code = getApiErrorCode(error);

      if (
        code === ErrorCode.INVALID_CONFIRMATION_CODE
        || code === ErrorCode.BAD_REQUEST
      ) {
        setError('confirmationCode', {
          type: 'api',
          message: getErrorMessage(ErrorCode.INVALID_CONFIRMATION_CODE),
        });
      } else {
        setError('root.api', { message: getErrorMessage(code) });
      }
    }
  });

  useEffect(() => {
    if (resendCountdown <= 0 || isResending) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCountdown((seconds) => seconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown, isResending]);

  const sendConfirmationCode = useCallback(async (mode: 'auto' | 'manual') => {
    if (isResendingRef.current) {
      return;
    }

    isResendingRef.current = true;

    if (mode === 'manual') {
      setIsResending(true);
    }

    try {
      await AuthService.resendConfirmationCode({ email });
      setResendCountdown(RESEND_COOLDOWN_SECONDS);

      if (mode === 'manual') {
        toast.success('Novo código enviado para o seu e-mail');
      }
    } catch (error) {
      setResendCountdown(0);
      toast.error(getErrorMessage(getApiErrorCode(error)));
    } finally {
      isResendingRef.current = false;

      if (mode === 'manual') {
        setIsResending(false);
      }
    }
  }, [email]);

  useEffect(() => {
    if (codeSent || autoResendForEmailRef.current === email) {
      return;
    }

    autoResendForEmailRef.current = email;
    void sendConfirmationCode('auto');
  }, [codeSent, email, sendConfirmationCode]);

  const handleResendCode = async () => {
    if (resendCountdown > 0 || isResending) {
      return;
    }

    await sendConfirmationCode('manual');
  };

  const canResend = resendCountdown === 0 && !isResending;

  return {
    control,
    handleSubmit,
    handleResendCode,
    clearErrors,
    isSubmitting,
    isValid,
    isSuccess,
    passwordResetRequired,
    requiresPassword,
    resendCountdown,
    isResending,
    canResend,
  };
}
