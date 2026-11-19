import { Gender } from '@/app/types/Gender';
import * as z from 'zod';

const requiredMeasurement = (msg: string) => (
  z.string(msg).min(1, msg).transform((v) => Number(v))
);

export const profileSchema = z.object({
  name: z.string()
    .min(1, 'Informe o seu nome.')
    .max(20, 'No máximo 20 caracteres'),
  birthDate: z.date(),
  height: requiredMeasurement('Informe a sua altura.'),
  weight: requiredMeasurement('Informe o seu peso.'),
  gender: z.enum(Gender),
});

export type ProfileSchema = z.input<typeof profileSchema>;
