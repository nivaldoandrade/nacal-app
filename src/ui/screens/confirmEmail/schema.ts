import * as z from 'zod';

export function createConfirmEmailSchema(requiresPassword: boolean) {
  return z.object({
    confirmationCode: z.string()
      .trim()
      .length(6, 'Informe o código de 6 dígitos.'),
    password: requiresPassword
      ? z.string().min(1, 'Informe a senha que você criou no cadastro.')
      : z.string().optional(),
  });
}

export type ConfirmEmailSchema = z.input<ReturnType<typeof createConfirmEmailSchema>>;
