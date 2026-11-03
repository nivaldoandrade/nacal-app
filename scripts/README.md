# Scripts

## generate-icons.py

Gera todos os ícones e a arte de splash do app a partir de duas fontes PNG.

### Fontes (input)

| Arquivo | O que é |
| --- | --- |
| `assets/icon-source.png` | Arte completa do ícone (fundo incluso, ≥1024×1024). |
| `assets/icon-source-cutout.png` | Só o logo recortado, com alpha (transparência). |

### Como rodar

```bash
python3 scripts/generate-icons.py
```

Requer Pillow (`pip install pillow` se não estiver no ambiente). O script
regenera e sobrescreve:

- `assets/` — `icon.png`, `favicon.png`, `splash-icon.png`, `android-icon-{foreground,background,monochrome}.png`
- `public/` — `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `splash-icon.png`
- `/tmp/preview-android-icon.png` — preview do ícone Android final
- Imprime no terminal o `bg_hex` amostrado da arte (usado no `app.json`)

### Trocando o ícone (passo a passo)

1. Exportar as duas fontes novas no design e substituir em `assets/`
   (`icon-source.png` e `icon-source-cutout.png`).
2. Rodar `python3 scripts/generate-icons.py`.
3. Se a cor de fundo mudou, atualizar o `bg_hex` (impresso pelo script) em:
   - `app.json` → `expo.android.adaptiveIcon.backgroundColor`,
     `expo.web.backgroundColor` e o `backgroundColor` do plugin
     `expo-splash-screen`
   - `public/manifest.json` → `background_color`
   - `public/index.html` → `#pwa-splash { background }`
4. Regenerar os ícones nativos (pastas `ios/`/`android/` são gitignored):
   `npx expo prebuild --clean`
5. Atualizar o export web: `yarn export:web`
6. Verificar: ícone na home (iOS e Android), splash nativa, favicon no
   navegador e PWA instalada.

## check-web-env.mjs

Valida as variáveis `EXPO_PUBLIC_*` antes do build web de produção.
Falha se faltar alguma variável, se uma URL não usar HTTPS ou se apontar para
localhost, LAN, `nafoodiary`, `execute-api` ou `nivaldoandrade.dev.br`.

```bash
node scripts/check-web-env.mjs
```

O `deploy-prod.mjs` executa esse check antes de `yarn export:web --clear`.

## deploy-prod.mjs

Deploy de produção (`yarn deploy`): injeta as envs públicas de produção, roda o
`check-web-env.mjs`, gera o `dist/` e publica no Cloudflare Workers com
`wrangler deploy` (Worker `nacal-app`, domínio `app.nacal.app`).

## fix-web-assets.mjs

Roda automaticamente depois do `yarn export:web` (`postexport:web`). Move
`dist/assets/node_modules` para `dist/assets/vendor` e reescreve as referências
nos arquivos de texto do build, para que o build publicado não tenha caminhos
com `node_modules`.
