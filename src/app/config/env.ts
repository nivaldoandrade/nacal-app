import * as z from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_COGNITO_DOMAIN: z.url(),
  EXPO_PUBLIC_COGNITO_CLIENT_ID: z.string().min(1),
  EXPO_PUBLIC_WEB_URL: z.url().optional(),
});

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_COGNITO_DOMAIN: process.env.EXPO_PUBLIC_COGNITO_DOMAIN,
  EXPO_PUBLIC_COGNITO_CLIENT_ID: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  EXPO_PUBLIC_WEB_URL: process.env.EXPO_PUBLIC_WEB_URL || undefined,
});
