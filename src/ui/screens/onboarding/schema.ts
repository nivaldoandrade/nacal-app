import { ActivityLevel } from '@/app/types/ActivityLevel';
import { Gender } from '@/app/types/Gender';
import { Goal } from '@/app/types/Goal';
import * as z from 'zod';

export const onboardingSchema = z.object({
  acceptedTerms: z.boolean().refine((value) => value, {
    error: 'Aceite os Termos de Uso e a Política de Privacidade para continuar.',
  }),
  profile: z.object({
    name: z.string()
      .min(1, 'Informe o seu nome.')
      .max(20, 'No máximo 20 caracteres'),
    goal: z.enum(Goal, { error: 'Selecione pelo menos 1 opção.' }),
    gender: z.enum(Gender),
    height: z.string().min(1, 'Informe a sua altura.').transform((v) => Number(v)),
    weight: z.string().min(1, 'Informe o seu peso.').transform((v) => Number(v)),
    activityLevel: z.enum(ActivityLevel),
    birthDate: z.date().transform((v) => v.toISOString().split('T')[0]),
  }),
  account: z.object({
    email: z.email('Informe o seu email.'),
    password: z.string().min(8, 'Pelo menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirme sua senha.'),
  }).refine(({ password, confirmPassword }) =>
    password === confirmPassword,
    {
      error: 'As senhas não correspondem.',
      path: ['confirmPassword'],
    },
  ),
});

export type OnboardingSchema = z.input<typeof onboardingSchema>;

export type OnboardingSchemaOutput = z.output<typeof onboardingSchema>;
