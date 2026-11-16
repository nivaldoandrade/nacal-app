import * as z from 'zod';

export const signInSchema = z.object({
  email: z.email('Informe um email válido.'),
  password: z.string('Informe uma senha.')
    .trim()
    .min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
