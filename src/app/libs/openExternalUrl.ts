import { toast } from '@/app/libs/sonner';
import { Linking } from 'react-native';

export async function openExternalUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    toast.error('Não foi possível abrir o link. Tente de novo.');
  }
}
