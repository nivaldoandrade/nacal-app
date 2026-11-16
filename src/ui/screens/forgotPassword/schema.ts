import * as z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Informe um email válido.'),
});

export const resetPasswordSchema = z.object({
  confirmationCode: z.string()
    .length(6, 'Informe o código de 6 dígitos.'),
  password: z.string()
    .trim()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  confirmPassword: z.string()
    .trim()
    .min(8, 'Confirme sua senha.'),
}).refine(({ password, confirmPassword }) =>
  password === confirmPassword,
  {
    error: 'As senhas não correspondem.',
    path: ['confirmPassword'],
  },
);

export type ForgotPasswordSchema = z.input<typeof forgotPasswordSchema>;

export type ResetPasswordSchema = z.input<typeof resetPasswordSchema>;
