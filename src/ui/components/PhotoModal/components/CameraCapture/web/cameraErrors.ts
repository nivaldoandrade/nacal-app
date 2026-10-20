export const CAMERA_UNAVAILABLE_MESSAGE =
  'A câmera não está disponível no momento. Tente novamente.';

export function getCameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
      case 'SecurityError':
        return 'Para usar a câmera, permita o acesso nas configurações do seu celular e tente novamente.';
      case 'NotFoundError':
      case 'OverconstrainedError':
        return 'Não encontramos uma câmera disponível neste dispositivo.';
      case 'NotReadableError':
        return 'A câmera está em uso por outro aplicativo. Feche o outro aplicativo e tente novamente.';
      default:
        break;
    }
  }

  return 'Não conseguimos acessar a câmera. Tente novamente.';
}
