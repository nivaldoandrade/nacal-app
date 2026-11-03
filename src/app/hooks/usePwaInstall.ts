import { InstallTipStorage } from '@/app/libs/InstallTipStorage';
import {
  getInstallPlatform,
  hasDeferredPrompt,
  isStandalone,
  promptInstall,
  subscribeInstallState,
} from '@/app/libs/pwaInstall';
import { toast } from '@/app/libs/sonner';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

function getServerFalse() {
  return false;
}

export function usePwaInstall() {
  const standalone = useSyncExternalStore(subscribeInstallState, isStandalone, getServerFalse);
  const canPromptNatively = useSyncExternalStore(
    subscribeInstallState,
    hasDeferredPrompt,
    getServerFalse,
  );
  const [platform] = useState(getInstallPlatform);
  const [isSnoozed, setIsSnoozed] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const isInstallable = !standalone;

  useEffect(() => {
    if (!isInstallable) {
      return;
    }

    let active = true;

    InstallTipStorage.isSnoozed().then((snoozed) => {
      if (!active) {
        return;
      }

      setIsSnoozed(snoozed);
      setIsReady(true);
    });

    return () => {
      active = false;
    };
  }, [isInstallable]);

  const install = useCallback(async () => {
    setIsInstalling(true);
    const result = await promptInstall();
    setIsInstalling(false);

    if (result === 'accepted') {
      toast.success('Prontinho! O NaCal está na sua tela inicial 🌱');
    }

    return result;
  }, []);

  const snooze = useCallback(() => {
    setIsSnoozed(true);
    InstallTipStorage.snooze();
  }, []);

  return {
    isInstallable,
    isReady,
    isSnoozed,
    platform,
    canPromptNatively,
    isInstalling,
    install,
    snooze,
  };
}
