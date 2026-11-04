# NaCal — Expo app

Expo SDK 57 / React Native 0.86 / React 19 / TypeScript strict. Expo APIs changed recently — read the versioned docs before writing code: https://docs.expo.dev/versions/v57.0.0/

## Commands

- `yarn` (yarn.lock — do not use npm/pnpm)
- `yarn start` · `yarn ios` · `yarn android` · `yarn web`
- `yarn lint` — the only scripted check (`expo lint`). There is **no test suite and no typecheck script**; run `npx tsc --noEmit` for types.
- Web build local: `yarn export:web` then `yarn serve:web` (output in `dist/`).
- Web production deploy: `yarn deploy` (Cloudflare Worker `nacal-app`, `app.nacal.app`, via Wrangler).

## Architecture

- Two-layer split with path aliases (defined in `tsconfig.json`): `@/app/*` → `src/app/*` (logic) and `@/ui/*` → `src/ui/*` (presentation). Entry: `index.ts` → `@/ui/App`.
- `src/app`: static `Service` subclasses share one axios client (`Service.ts`) with a 401→refresh interceptor; TanStack Query hooks in `hooks/queries` + `hooks/mutations`; `navigation/RootStack.tsx` switches Auth vs App stack on `isSignedIn` / `shouldShowOnboarding`; tokens persist via `AuthTokenManager` (AsyncStorage).
- `src/ui`: screens and components. Convention per feature folder: `index.tsx` + `styles.ts` + optional `use*.ts` hook + `schema.ts` (zod, paired with react-hook-form).
- Data flow: screen → `use*` hook → query/mutation hook → Service → axios. Toasts: import from `@/app/libs/sonner` (platform-split: `sonner` on web, `sonner-native` on native).

## Gotchas

- **patch-package**: `postinstall` aplica `patches/` a cada `yarn`. Hoje há 1 patch — `expo-modules-jsi` remove `SWIFT_RETURNS_RETAINED` dos construtores de `RuntimeScheduler.h` (bug upstream expo/expo#49214; quebrava o build iOS no Xcode 26.3/Swift 6.2 e ainda não tem fix publicado, até 57.1.1). Não remover o script `postinstall` nem editar `node_modules` à mão.
- **Env vars**: `EXPO_PUBLIC_*` are read only through explicit property lists — `src/app/config/env.ts` (zod-parsed) and `useSocialAuth.ts`. Do not parse `process.env` wholesale; Metro must statically inline each var for production web export. Vars documented in `.env.example`.
- **Web + native parity is required** (web is the primary validation surface). `Platform.OS` branches already exist for date picker, toasts, file handling, animations — check them before adding platform-specific code. `DesktopGate` blocks web viewports wider than 480px.
- **Lint rules that differ from defaults** (`eslint.config.js`): interfaces must be `I`-prefixed (`IFoo`), single quotes, semicolons, always-multiline trailing commas, `curly: all`, `eqeqeq`, `no-console: warn`.
- Meal queries use `staleTime: Infinity` (manual refresh/pull-to-refresh is the model); `queryClient` has `retry: false`.
- Meal processing is async (`UPLOADING → QUEUED → PROCESSING → SUCCESS/FAILED`) — poll status, don't block on upload.
- **PWA install tip**: `beforeinstallprompt` is captured by an inline script in `public/index.html` (`window.__nacalInstallPrompt`) and read by `src/app/libs/pwaInstall.web.ts` (native stub reports standalone → never shows). `InstallAppSheet` auto-opens on Home after the plan modals; "Agora não" snoozes it 7 days (`InstallTipStorage`); Profile has a manual entry.
- **iOS PWA translucent status bar** (`public/index.html`): `apple-mobile-web-app-status-bar-style` is `black-translucent` (iOS reads it only at install — older installs stay `default`). The `pwa-zoom-lock` script adds `pwa-translucent` when `env(safe-area-inset-top) > 0` (re-measured after load; it reads 0 at first). iOS 26 bug in this mode: `innerHeight`/`100%` exclude the status bar and `position: fixed` content isn't painted in the bottom ~59pt. Hence `html` is `calc(100% + inset)`, `body` is fixed at `100lvh`, root scroll is pinned to 0 (otherwise touches starting on a `Pressable` scroll the document instead of the list) and `html` has the splash lime as background (covers the gap before React paints). Don't simplify to `height: 100%`/`100lvh` alone — each variant was tested and breaks one case. Validate on a physical iPhone: the simulator's PWA may still be a `default` install.
- `/ios` and `/android` are gitignored generated folders (`expo run:*` regenerates them); `.env` is gitignored.

## Product & design sources of truth

- `PRODUCT.md` — platform, users, capabilities, constraints.
- `DESIGN.md` — tokens, component specs, named rules (macro hues reserved for macros; spring lime is the only accent). UI work should follow these; the `impeccable` skill/command reads them.
- All user-facing copy is **Brazilian Portuguese**, friendly and non-judgmental voice.
- `CLAUDE.md` points here (`@AGENTS.md`) — keep a single source.
