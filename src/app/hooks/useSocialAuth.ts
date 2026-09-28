import { ApiError, ErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { AuthTokenManager } from '@/app/libs/AuthTokenManager';
import { toast } from '@/app/libs/sonner';
import { AuthService } from '@/app/services/AuthService';
import { isAxiosError } from 'axios';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

const DISCOVERY = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize`,
};

interface IUseSocialAuthParams {
  onSuccess: (response: AuthService.SignInWithSocial['response']) => Promise<unknown>;
}

export function useSocialAuth({ onSuccess }: IUseSocialAuthParams) {
  const [isLoading, setIsLoading] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, , promptAsync] = AuthSession.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    extraParams: {
      identity_provider: 'Google',
      prompt: 'select_account',
    },
  }, DISCOVERY);

  const signInWithGoogle = useCallback(async () => {
    if (!request || !request.codeVerifier) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        return;
      }

      const response = await AuthService.signInWithSocial({
        code: result.params.code,
        codeVerifier: request.codeVerifier,
        redirectUri,
      });

      await onSuccess(response);
    } catch (error) {
      if (isAxiosError<ApiError>(error)) {
        if (error.response?.data.error.code === ErrorCode.INVALID_GRANT) {
          await AuthTokenManager.remove();
        }

        toast.error(getErrorMessage(error.response?.data.error.code));
        return;
      }

      toast.error(getErrorMessage());
    } finally {
      setIsLoading(false);
    }
  }, [request, promptAsync, redirectUri, onSuccess]);

  return {
    signInWithGoogle,
    isLoading,
  };
}
