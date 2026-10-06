import { ValueOf } from '@/app/utils/ValueOf';
import { isAxiosError } from 'axios';

export const ErrorCode = {
  VALIDATION: 'VALIDATION',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_GRANT: 'INVALID_GRANT',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  // Billing
  FREE_QUOTA_EXCEEDED: 'FREE_QUOTA_EXCEEDED',
  TRIAL_NOT_AVAILABLE: 'TRIAL_NOT_AVAILABLE',
  BILLING_ERROR: 'BILLING_ERROR',

  // HTTP
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCode = ValueOf<typeof ErrorCode>;

export type ApiError = {
  error: {
    code: ErrorCode
    message: string;
  };
};

export const ApiErrorMessages: Record<ErrorCode, string> = {
  VALIDATION: 'Verifique os campos e tente novamente.',
  EMAIL_ALREADY_IN_USE: 'Este e-mail já está em uso.',
  INVALID_REFRESH_TOKEN: 'Sua sessão expirou. Faça login novamente.',
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  INVALID_GRANT: 'Falha na autenticação. Tente novamente.',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado.',
  FREE_QUOTA_EXCEEDED: 'Você atingiu o limite de refeições do plano Free deste mês. Assine o Pro para continuar sem limites.',
  TRIAL_NOT_AVAILABLE: 'O teste grátis ainda não está disponível para esta conta. Escolha um plano para assinar.',
  BILLING_ERROR: 'Não conseguimos falar com o serviço de pagamento agora. Tente novamente em instantes.',
  BAD_REQUEST: 'Requisição inválida.',
  INTERNAL_SERVER_ERROR: 'Erro interno. Tente novamente mais tarde.',
  RATE_LIMIT_EXCEEDED: 'Aguarde alguns instantes e tente novamente.',
} as const;

export function getErrorMessage(code?: ErrorCode): string {
  console.log(code);
  return (code && ApiErrorMessages[code]) || 'Ocorreu um erro. Tente novamente.';
}

export function getApiErrorCode(error: unknown): ErrorCode | undefined {
  if (!isAxiosError<ApiError>(error)) {
    return undefined;
  }

  return error.response?.data.error.code;
}
