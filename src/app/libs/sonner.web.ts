import { createElement } from 'react';
import { Toaster as SonnerToaster, ToasterProps } from 'sonner';

export * from 'sonner';

// Precisa continuar .web.ts (sem JSX): o Metro resolve por extensão e, com
// .web.tsx, encontraria sonner.ts antes e o web usaria o sonner-native.

// O sonner usa offset fixo (16px no mobile) e ignora a safe area. No PWA
// instalado (viewport-fit=cover) o toast ficava atrás do indicador de home.
// Mesmo mínimo de 24px do useSafeAreaInsets no web.
const OFFSET = {
  bottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 16px))',
  top: 'max(16px, calc(env(safe-area-inset-top, 0px) + 16px))',
};

// Por padrão, bottom-center só fecha arrastando para baixo, o que concorre
// com o gesto do sistema na borda da tela. As laterais ficam liberadas também.
const SWIPE_DIRECTIONS: ToasterProps['swipeDirections'] = ['bottom', 'left', 'right'];

export function Toaster(props: ToasterProps) {
  return createElement(SonnerToaster, {
    offset: OFFSET,
    mobileOffset: OFFSET,
    swipeDirections: SWIPE_DIRECTIONS,
    ...props,
  });
}
