import { Service } from '@/app/services/Service';
import { OnboardingSchemaOutput } from '@/ui/screens/onboarding/schema';

export class AuthService extends Service {

  static async signInWithSocial(params: AuthService.SignInWithSocial['params']): Promise<AuthService.SignInWithSocial['response']> {
    const { data } = await this.client.post<AuthService.SignInWithSocial['response']>('auth/oauth/callback', params);

    return data;
  }

  static async signIn(
    params: AuthService.SignIn['params'],
  ): Promise<AuthService.SignIn['response']> {

    const { data } = await this.client.post<AuthService.SignIn['response']>(
      'auth/sign-in',
      params,
    );
    return data;
  }

  static async signUp(
    params: AuthService.SignUp['params'],
  ): Promise<AuthService.SignUp['response']> {
    const { data } = await this.client.post<AuthService.SignUp['response']>(
      'auth/sign-up',
      params,
    );

    return data;
  }

  static async confirmSignUp(
    params: AuthService.ConfirmSignUp['params'],
  ): Promise<AuthService.ConfirmSignUp['response']> {
    const { data } = await this.client.post<AuthService.ConfirmSignUp['response']>('auth/confirm-sign-up', params);

    return data;
  }

  static async resendConfirmationCode(
    params: AuthService.ResendConfirmationCode['params'],
  ): Promise<void> {
    await this.client.post('auth/resend-confirmation-code', params);
  }

  static async refreshToken(
    params: AuthService.RefreshToken['params'],
  ): Promise<AuthService.RefreshToken['response']> {
    const { data } = await this.client.post<AuthService.RefreshToken['response']>(
      'auth/refresh-token',
      params,
    );

    return data;
  }

  static async forgotPassword(
    params: AuthService.ForgotPassword['params'],
  ): Promise<void> {
    await this.client.post(
      'auth/forgot-password',
      params,
    );
  }

  static async confirmationForgotPassword(
    params: AuthService.ConfirmationForgotPassword['params'],
  ): Promise<void> {
    await this.client.post(
      'auth/confirmation-forgot-password',
      params,
    );
  }
}

export namespace AuthService {

  export type SignInWithSocial = {
    params: {
      code: string;
      codeVerifier: string;
      redirectUri: string;
    },

    response: {
      accessToken: string;
      refreshToken: string;
    }
  }

  export type SignIn = {
    params: {
      email: string;
      password: string;
    },
    response: {
      accessToken: string;
      refreshToken: string;
    }
  }

  export type SignUp = {
    params: OnboardingSchemaOutput,
    response: {
      requiresConfirmation: boolean;
      alreadyPending: boolean;
    }
  }

  export type ConfirmSignUp = {
    params: {
      email: string;
      confirmationCode: string;
      password: string;
    },
    response: {
      passwordResetRequired: boolean;
    }
  }

  export type ResendConfirmationCode = {
    params: {
      email: string;
    }
  }

  export type RefreshToken = {
    params: {
      refreshToken: string;
    },
    response: {
      accessToken: string;
      refreshToken: string;
    }
  }

  export type ForgotPassword = {
    params: {
      email: string;
    }
  }

  export type ConfirmationForgotPassword = {
    params: {
      email: string;
      password: string;
      confirmationCode: string;
    }
  }
}
