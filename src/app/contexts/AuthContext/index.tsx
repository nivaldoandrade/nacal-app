import { ErrorCode, getApiErrorCode } from '@/app/errors/apiErrors';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { AuthTokenManager } from '@/app/libs/AuthTokenManager';
import { queryClient } from '@/app/libs/queryClient';
import { AccountsService } from '@/app/services/AccountsService';
import { AuthService } from '@/app/services/AuthService';
import { Service } from '@/app/services/Service';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface IAuthContext {
  shouldShowOnboarding: boolean;
  isSignedIn: boolean;
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

interface IAuthProvider {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProvider) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [firstRunAfterConfirmationEmail, setFirstRunAfterConfirmationEmail] = useState<string | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [pendingSignUp, setPendingSignUp] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const { loadAccount } = useAccount({ enabled: false });

  const signOut = useCallback(async () => {
    Service.removeAuthorizationToken();
    Service.removeInterceptorId();
    AuthTokenManager.remove();
    queryClient.clear();
    setIsSignedIn(false);
    setIsSignedUp(false);
    setFirstRunAfterConfirmationEmail(null);
    setShouldShowOnboarding(false);
    setPendingSignUp(null);
  }, []);

  const setupAuth = useCallback(async (accessToken: string): Promise<boolean> => {

    Service.setAuthorizationToken(accessToken);
    Service.setupRefreshInterceptor(async () => {
      try {
        const storedTokens = await AuthTokenManager.get();

        if (!storedTokens) {
          throw new Error('No tokens available.');
        }

        const newTokens = await AuthService.refreshToken({
          refreshToken: storedTokens.refreshToken,
        });

        await AuthTokenManager.save(newTokens);
        Service.setAuthorizationToken(newTokens.accessToken);
      } catch (error) {
        await signOut();
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

    const newTokens = await AuthService.refreshToken({
      refreshToken: storedTokens.refreshToken,
    });

    await AuthTokenManager.save(newTokens);
    await setupAuth(newTokens.accessToken);

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

  useEffect(() => {
    async function getTokens() {
      try {
        const tokens = await AuthTokenManager.get();

        if (!tokens) {
          return;
        }

        await setupAuth(tokens.accessToken);

      } catch {
        await signOut();
      } finally {
        setAppIsReady(true);
      }
    }

    getTokens();
  }, [setupAuth, signOut]);

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
