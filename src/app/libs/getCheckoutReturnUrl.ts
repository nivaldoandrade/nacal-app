import { env } from '@/app/config/env';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

export function getCheckoutReturnUrl(): string {
  if (env.EXPO_PUBLIC_WEB_URL) {
    const base = env.EXPO_PUBLIC_WEB_URL.replace(/\/+$/, '');
    return `${base}/billing/return`;
  }

  if (Platform.OS === 'web') {
    return `${window.location.origin}/billing/return`;
  }

  return AuthSession.makeRedirectUri({ path: 'billing/return' });
}
