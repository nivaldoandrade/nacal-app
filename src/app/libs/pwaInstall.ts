// Native: o app roda instalado de verdade, então nunca mostra o tutorial de PWA.
// A implementação web fica em pwaInstall.web.ts.

export type InstallPlatform = 'ios-safari' | 'ios-other' | 'ios-inapp' | 'android' | 'other';

export type InstallPromptResult = 'accepted' | 'dismissed' | 'unavailable';

export function isStandalone(): boolean {
  return true;
}

export function getInstallPlatform(): InstallPlatform {
  return 'other';
}

export function hasDeferredPrompt(): boolean {
  return false;
}

export async function promptInstall(): Promise<InstallPromptResult> {
  return 'unavailable';
}

export function subscribeInstallState(_callback: () => void): () => void {
  return () => {};
}
