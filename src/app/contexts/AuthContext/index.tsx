import { ErrorCode, getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { AuthTokenManager } from '@/app/libs/AuthTokenManager';
import { queryClient } from '@/app/libs/queryClient';
import { toast } from '@/app/libs/sonner';
import { AccountsService } from '@/app/services/AccountsService';
import { AuthService } from '@/app/services/AuthService';
import { Service } from '@/app/services/Service';
import { isAxiosError } from 'axios';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface IAuthContext {
  shouldShowOnboarding: boolean;
  isSignedIn: boolean;
  sessionRestoreFailed: boolean;
  isRestoringSession: boolean;
  retrySessionRestore: () => Promise<void>;
  isSignedUp: boolean;
  hasPendingSignUp: boolean;
  /** Email whose password is cached for the confirmation step, if any. */
  pendingSignUpEmail: string | null;
  signIn: (params: AuthService.SignIn['params']) => Promise<void>;
  signUp: (params: AuthService.SignUp['params']) => Promise<AuthService.SignUp['response']>;
  confirmPendingSignUp: (params: IConfirmPendingSignUpParams) => Promise<IConfirmPendingSignUpResult>;
  signOut: () => Promise<void>;
  signInWithSocial: (response: AuthService.SignInWithSocial['response']) => Promise<boolean>;
  completeOnboarding: (profile: Omit<AccountsService.CompleteOnboardingParams, 'accessToken'>) => Promise<void>;
  completeSocialOnboarding: (response: AuthService.SignInWithSocial['response'], profile: Omit<AccountsService.CompleteOnboardingParams, 'accessToken'>) => Promise<void>;
}

interface IConfirmPendingSignUpParams {
  email: string;
  confirmationCode: string;
  /** Required when no password is cached for this email (e.g. after reopening the app). */
  password?: string;
}

interface IConfirmPendingSignUpResult {
  signedIn: boolean;
  isOnboarded: boolean;
  passwordResetRequired: boolean;
}

export const AuthContext = createContext({} as IAuthContext);

function isSessionRejected(error: unknown) {
  if (!isAxiosError(error) || !error.response) {
    return false;
  }

  const { status } = error.response;

  return status === 401 || status === 400;
}

function isTransientFailure(error: unknown) {
  if (!isAxiosError(error)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  const { status } = error.response;

  return status === 429 || status >= 500;
}

interface IAuthProvider {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProvider) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [firstRunAfterConfirmationEmail, setFirstRunAfterConfirmationEmail] = useState<string | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [sessionRestoreFailed, setSessionRestoreFailed] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [pendingSignUp, setPendingSignUp] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { loadAccount } = useAccount({ enabled: false });
  const sessionGenerationRef = useRef(0);

  const signOut = useCallback(async () => {
    sessionGenerationRef.current += 1;
    Service.removeAuthorizationToken();
    Service.removeInterceptorId();
    await AuthTokenManager.remove();
    queryClient.clear();
    setIsSignedIn(false);
    setIsSignedUp(false);
    setFirstRunAfterConfirmationEmail(null);
    setShouldShowOnboarding(false);
    setPendingSignUp(null);
    setSessionRestoreFailed(false);
  }, []);

  const setupAuth = useCallback(async (accessToken: string): Promise<boolean> => {

    const sessionGeneration = sessionGenerationRef.current;

    Service.setAuthorizationToken(accessToken);
    Service.setupRefreshInterceptor(async (failedAccessToken) => {
      if (sessionGeneration !== sessionGenerationRef.current) {
        throw new Error('Request from a previous session.');
      }

      const storedTokens = await AuthTokenManager.get();

      if (!storedTokens) {
        await signOut();
        throw new Error('No tokens available.');
      }

      if (failedAccessToken && storedTokens.accessToken !== failedAccessToken) {
        Service.setAuthorizationToken(storedTokens.accessToken);
        return storedTokens.accessToken;
      }

      try {
        const newTokens = await AuthService.refreshToken({
          refreshToken: storedTokens.refreshToken,
        });

        if (sessionGeneration !== sessionGenerationRef.current || !await AuthTokenManager.get()) {
          throw new Error('Signed out during token refresh.');
        }

        await AuthTokenManager.save(newTokens);
        Service.setAuthorizationToken(newTokens.accessToken);

        return newTokens.accessToken;
      } catch (error) {
        if (isSessionRejected(error)) {
          toast.error(getErrorMessage(ErrorCode.INVALID_REFRESH_TOKEN), { id: 'session-expired' });
          await signOut();
        }

        throw error;
      }
    });

    const { data: account } = await loadAccount({ throwOnError: true });
    setIsSignedIn(true);

    const isOnboarded = account?.isOnboarded ?? false;
    setShouldShowOnboarding(!isOnboarded);

    return isOnboarded;
  }, [loadAccount, signOut]);

  const signInWithSocial = useCallback(
    async (response: AuthService.SignInWithSocial['response']): Promise<boolean> => {
      const { accessToken, refreshToken } = response;
      await AuthTokenManager.save({ accessToken, refreshToken });
      setPendingSignUp(null);

      return setupAuth(response.accessToken);
    }, [setupAuth]);

  const completeOnboarding = useCallback(async (profile: Omit<AccountsService.CompleteOnboardingParams, 'accessToken'>) => {
    const storedTokens = await AuthTokenManager.get();

    if (!storedTokens) {
      throw new Error('No tokens available.');
    }

    await AccountsService.completeOnboarding({
      ...profile,
      accessToken: storedTokens.accessToken,
    }).catch(async (error) => {
      if (getApiErrorCode(error) === ErrorCode.INVALID_GRANT) {
        await AuthTokenManager.remove();
      }

      throw error;
    });

    await setupAuth(storedTokens.accessToken);

    setIsSignedUp(true);
  }, [setupAuth]);

  const completeSocialOnboarding = useCallback(
    async (
      response: AuthService.SignInWithSocial['response'],
      profile: Omit<AccountsService.CompleteOnboardingParams, 'accessToken'>,
    ) => {
      await AuthTokenManager.save({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      await completeOnboarding(profile);
    }, [completeOnboarding]);

  const signIn = useCallback(async (payload: AuthService.SignIn['params']) => {
    let response: AuthService.SignIn['response'];

    try {
      response = await AuthService.signIn(payload);
    } catch (error) {
      if (getApiErrorCode(error) === ErrorCode.EMAIL_NOT_CONFIRMED) {
        // The confirmation step needs the password to prove who chose it. If this one
        // is wrong, the API replaces it on confirmation and the user resets it by email.
        setPendingSignUp({
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
        });
      }

      throw error;
    }

    await AuthTokenManager.save(response);
    setPendingSignUp(null);
    await setupAuth(response.accessToken);

    const normalizedEmail = payload.email.trim().toLowerCase();

    if (firstRunAfterConfirmationEmail === normalizedEmail) {
      setIsSignedUp(true);
      setFirstRunAfterConfirmationEmail(null);
    }
  }, [firstRunAfterConfirmationEmail, setupAuth]);

  const signUp = useCallback(async (payload: AuthService.SignUp['params']) => {
    const response = await AuthService.signUp(payload);

    setPendingSignUp({
      email: payload.account.email.trim().toLowerCase(),
      password: payload.account.password,
    });

    return response;
  }, []);

  const confirmPendingSignUp = useCallback(async (
    { email, confirmationCode, password: typedPassword }: IConfirmPendingSignUpParams,
  ): Promise<IConfirmPendingSignUpResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const cachedPassword = pendingSignUp?.email === normalizedEmail ? pendingSignUp.password : undefined;
    const password = cachedPassword ?? typedPassword;

    if (!password) {
      throw new Error('Password is required to confirm the sign-up.');
    }

    const { passwordResetRequired } = await AuthService.confirmSignUp({
      email: normalizedEmail,
      confirmationCode,
      password,
    });

    if (passwordResetRequired) {
      setPendingSignUp(null);
      setFirstRunAfterConfirmationEmail(normalizedEmail);
      return { signedIn: false, isOnboarded: false, passwordResetRequired: true };
    }

    try {
      const tokens = await AuthService.signIn({
        email: normalizedEmail,
        password,
      });

      await AuthTokenManager.save(tokens);
      const isOnboarded = await setupAuth(tokens.accessToken);

      setPendingSignUp(null);
      setFirstRunAfterConfirmationEmail(null);

      if (isOnboarded) {
        setIsSignedUp(true);
      }

      return { signedIn: true, isOnboarded, passwordResetRequired: false };
    } catch (error) {
      if (getApiErrorCode(error) === ErrorCode.INVALID_CREDENTIALS) {
        setPendingSignUp(null);
        setFirstRunAfterConfirmationEmail(normalizedEmail);
        return { signedIn: false, isOnboarded: false, passwordResetRequired: false };
      }

      throw error;
    }
  }, [pendingSignUp, setupAuth]);

  const restoreSession = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await AuthTokenManager.get();

      if (!tokens) {
        await signOut();
        return false;
      }

      await setupAuth(tokens.accessToken);
      setSessionRestoreFailed(false);
      return false;
    } catch (error) {
      if (isTransientFailure(error) && await AuthTokenManager.get()) {
        setSessionRestoreFailed(true);
        return true;
      }

      await signOut();
      return false;
    }
  }, [setupAuth, signOut]);

  const retrySessionRestore = useCallback(async () => {
    setIsRestoringSession(true);

    try {
      const failed = await restoreSession();

      if (failed) {
        toast.error('Ainda não conseguimos conectar. Tente de novo em instantes.', { id: 'connection-retry' });
      }
    } finally {
      setIsRestoringSession(false);
    }
  }, [restoreSession]);

  useEffect(() => {
    async function bootstrap() {
      try {
        await restoreSession();
      } finally {
        setAppIsReady(true);
      }
    }

    bootstrap();
  }, [restoreSession]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.getElementById('pwa-splash')?.remove();
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      shouldShowOnboarding,
      isSignedIn,
      sessionRestoreFailed,
      isRestoringSession,
      retrySessionRestore,
      isSignedUp,
      hasPendingSignUp: pendingSignUp !== null,
      pendingSignUpEmail: pendingSignUp?.email ?? null,
      signIn,
      signUp,
      confirmPendingSignUp,
      signOut,
      signInWithSocial,
      completeOnboarding,
      completeSocialOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
