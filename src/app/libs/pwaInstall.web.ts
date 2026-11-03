import type { InstallPlatform, InstallPromptResult } from './pwaInstall';

export type { InstallPlatform, InstallPromptResult } from './pwaInstall';

interface IBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface INaCalWindow extends Window {
  __nacalInstallPrompt?: IBeforeInstallPromptEvent | null;
}

const STANDALONE_QUERY = '(display-mode: standalone)';
const IN_APP_BROWSER_REGEX = /Instagram|FBAN|FBAV|FB_IAB|Line\/|WhatsApp|TikTok|musical_ly|Snapchat|LinkedInApp/i;

function getWindow(): INaCalWindow | null {
  return typeof window === 'undefined' ? null : (window as INaCalWindow);
}

// Mesma regra do script inline em public/index.html (pwa-zoom-lock).
export function isStandalone(): boolean {
  const win = getWindow();

  if (!win) {
    return false;
  }

  const navigatorStandalone = (win.navigator as Navigator & { standalone?: boolean }).standalone;

  return navigatorStandalone === true || win.matchMedia(STANDALONE_QUERY).matches;
}

export function getInstallPlatform(): InstallPlatform {
  const win = getWindow();

  if (!win) {
    return 'other';
  }

  const ua = win.navigator.userAgent;
  // iPadOS 13+ se apresenta como Mac; o suporte a touch denuncia.
  const isIPadOS = /Macintosh/.test(ua) && win.navigator.maxTouchPoints > 1;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || isIPadOS;

  if (isIOS) {
    if (IN_APP_BROWSER_REGEX.test(ua)) {
      return 'ios-inapp';
    }

    // Chrome, Firefox, Edge e Opera no iOS se identificam com tokens próprios.
    if (/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)) {
      return 'ios-other';
    }

    return 'ios-safari';
  }

  if (/Android/i.test(ua)) {
    return 'android';
  }

  return 'other';
}

export function hasDeferredPrompt(): boolean {
  return !!getWindow()?.__nacalInstallPrompt;
}

export async function promptInstall(): Promise<InstallPromptResult> {
  const win = getWindow();
  const deferredPrompt = win?.__nacalInstallPrompt;

  if (!win || !deferredPrompt) {
    return 'unavailable';
  }

  // O evento só pode ser usado uma vez.
  win.__nacalInstallPrompt = null;

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    return outcome;
  } catch {
    return 'unavailable';
  }
}

export function subscribeInstallState(callback: () => void): () => void {
  const win = getWindow();

  if (!win) {
    return () => {};
  }

  const mediaQuery = win.matchMedia(STANDALONE_QUERY);

  win.addEventListener('nacal:installprompt', callback);
  win.addEventListener('nacal:installed', callback);
  mediaQuery.addEventListener('change', callback);

  return () => {
    win.removeEventListener('nacal:installprompt', callback);
    win.removeEventListener('nacal:installed', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}
