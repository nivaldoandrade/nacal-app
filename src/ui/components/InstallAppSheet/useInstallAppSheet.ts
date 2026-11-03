import { usePwaInstall } from '@/app/hooks/usePwaInstall';
import { IInstallAppSheet, InstallAppSheetSource } from '@/ui/components/InstallAppSheet/IInstallAppSheet';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useImperativeHandle, useRef } from 'react';

interface IUseInstallAppSheet {
  ref: React.Ref<IInstallAppSheet>;
  source: InstallAppSheetSource;
}

export function useInstallAppSheet({ ref, source }: IUseInstallAppSheet) {
  const { bottom } = useSafeAreaInsets();
  const { platform, canPromptNatively, isInstalling, install, snooze } = usePwaInstall();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // Instalou pelo botão: fechar o sheet não deve gravar snooze.
  const installedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    open() {
      installedRef.current = false;
      bottomSheetModalRef.current?.present();
    },
  }), []);

  const handleDismiss = useCallback(() => {
    if (source === 'auto' && !installedRef.current) {
      snooze();
    }
  }, [snooze, source]);

  const handleLater = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleInstall = useCallback(async () => {
    const result = await install();

    if (result === 'accepted') {
      installedRef.current = true;
      bottomSheetModalRef.current?.dismiss();
    }
  }, [install]);

  return {
    bottom,
    bottomSheetModalRef,
    platform,
    canPromptNatively,
    isInstalling,
    handleDismiss,
    handleLater,
    handleInstall,
  };
}
