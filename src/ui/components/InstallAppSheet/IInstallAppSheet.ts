export interface IInstallAppSheet {
  open: () => void;
}

// 'auto': aberto sozinho na Home; fechar conta como "agora não" (snooze).
// 'manual': aberto pelo Perfil; fechar não grava nada.
export type InstallAppSheetSource = 'auto' | 'manual';
