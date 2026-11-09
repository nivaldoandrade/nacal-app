import { ValueOf } from '@/app/utils/ValueOf';
import { isAxiosError } from 'axios';

export const ErrorCode = {
  VALIDATION: 'VALIDATION',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  EMAIL_NOT_CONFIRMED: 'EMAIL_NOT_CONFIRMED',
  INVALID_CONFIRMATION_CODE: 'INVALID_CONFIRMATION_CODE',
  BETA_ACCESS_DENIED: 'BETA_ACCESS_DENIED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  CODE_DELIVERY_FAILED: 'CODE_DELIVERY_FAILED',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_GRANT: 'INVALID_GRANT',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',

  // Meal
  MEAL_NOT_EDITABLE: 'MEAL_NOT_EDITABLE',
  MEAL_ITEM_LIMIT_REACHED: 'MEAL_ITEM_LIMIT_REACHED',
  NO_FOOD_IDENTIFIED: 'NO_FOOD_IDENTIFIED',
  MEAL_LAST_ITEM: 'MEAL_LAST_ITEM',

  // Billing
  FREE_QUOTA_EXCEEDED: 'FREE_QUOTA_EXCEEDED',
  DAILY_MEAL_LIMIT_REACHED: 'DAILY_MEAL_LIMIT_REACHED',
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
  EMAIL_NOT_CONFIRMED: 'Confirme seu e-mail para entrar. Se precisar, reenvie o código.',
  INVALID_CONFIRMATION_CODE: 'Código inválido ou expirado. Tente novamente.',
  BETA_ACCESS_DENIED: 'Este e-mail ainda não está liberado no beta da NaCal.',
  TOO_MANY_ATTEMPTS: 'Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.',
  CODE_DELIVERY_FAILED: 'Não conseguimos enviar o código agora. Tente de novo em instantes.',
  INVALID_REFRESH_TOKEN: 'Sua sessão expirou. Faça login novamente.',
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  INVALID_GRANT: 'Falha na autenticação. Tente novamente.',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado.',
  MEAL_NOT_EDITABLE: 'Essa refeição não pode mais receber itens.',
  MEAL_ITEM_LIMIT_REACHED: 'Essa refeição já recebeu o máximo de itens adicionados.',
  NO_FOOD_IDENTIFIED: 'Não encontrei nenhum alimento nesse texto. Tente descrever de outro jeito.',
  MEAL_LAST_ITEM: 'A refeição precisa ter pelo menos um item.',
  FREE_QUOTA_EXCEEDED: 'Você atingiu o limite de refeições do plano Free deste mês. Assine o Pro para registrar até 20 refeições por dia.',
  DAILY_MEAL_LIMIT_REACHED: 'Você chegou ao limite de 20 refeições de hoje. Amanhã você pode registrar de novo.',
  TRIAL_NOT_AVAILABLE: 'O teste grátis ainda não está disponível para esta conta. Escolha um plano para assinar.',
  BILLING_ERROR: 'Não conseguimos falar com o serviço de pagamento agora. Tente novamente em instantes.',
  BAD_REQUEST: 'Requisição inválida.',
  INTERNAL_SERVER_ERROR: 'Erro interno. Tente novamente mais tarde.',
  RATE_LIMIT_EXCEEDED: 'Aguarde alguns instantes e tente novamente.',
} as const;

export function getErrorMessage(code?: ErrorCode): string {
  return (code && ApiErrorMessages[code]) || 'Ocorreu um erro. Tente novamente.';
}

export function getApiErrorCode(error: unknown): ErrorCode | undefined {
  if (!isAxiosError<ApiError>(error)) {
    return undefined;
  }

  return error.response?.data?.error?.code;
}
