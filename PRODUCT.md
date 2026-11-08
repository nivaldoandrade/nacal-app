# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Web is the primary surface for validation; iOS and Android native follow if retention proves out. Until then, both web and native must remain functional and converge on the same product.

## Users

People tracking their diet day to day, logging what they eat on the go. Their job: record meals in seconds and see, at a glance, whether today is on track against their plan — without the overhead, rigidity, or guilt-driven tooling of a traditional calorie counter.

## Product Purpose

NaCal lets a person control their diet simply. "Controle sua dieta de forma simples." Success is a user who opens the app, logs a meal with a photo, a voice note, or a short sentence, and immediately understands their daily progress against a macro plan generated from a short onboarding.

## Positioning

Simple and friendly where nutrition trackers are rigid and clinical. The core mechanism is frictionless logging: take a photo of the plate, say what you ate, or type it in one sentence, and the backend turns it into foods and macros. A neighboring calorie-counting app could not truthfully copy this — no manual food search, no barcode scanning, no data entry beyond a single sentence.

## Operating Context

- Brazilian Portuguese user-facing copy throughout.
- Logging happens on the move: photo capture, a voice note capped at 30 seconds, or a short text (up to 500 characters) when neither fits.
- Photo and audio processing is asynchronous: the app uploads, then polls status through `UPLOADING → QUEUED → PROCESSING → SUCCESS/FAILED` before showing foods and macros. A text meal is processed synchronously and comes back ready.
- Day-based view: a weekly calendar with today's meals and macro progress vs. goal.
- Auth via Cognito: Google (OAuth2 + PKCE) and email/password; tokens persist in AsyncStorage with silent refresh on 401.
- Files upload via presigned POST (S3-style, base64-encoded signature).
- Monetization: Free plan with 20 AI meals/month; Pro plan (R$ 9.99/month or R$ 99.90/year) unlocks unlimited meals. Checkout runs on the hosted Asaas page — web redirects in the same tab, native uses `openAuthSessionAsync` — and activation arrives via webhook, reflected through `GET /me`.

## Capabilities and Constraints

- Seven-step onboarding captures goal, gender, birth date, height, weight, and activity level; the backend derives a personalized daily macro plan (calories, proteins, carbohydrates, fats).
- Home shows a weekly calendar, macro progress (MacroRainbow visualization), and the day's meals with per-food and total macros.
- Meal creation from photo, audio, or text; playback review for audio before sending. Text ("Texto" in the create sheet) takes one sentence of up to 500 characters ("no almoço comi arroz, feijão e um bife"); the meal comes back ready, counts toward the monthly quota only when foods are found, and is logged at the time it is sent ("no almoço" only sets the meal name and icon). After taking the photo, an optional free-text note ("Quer contar algum detalhe?", up to 300 characters) lets the user add what the photo doesn't show (a drink in an opaque cup, hidden ingredients, quantities, which meal it was).
- Meal details screen with total calories and macro breakdown. "Adicionar item" lets the user complete a processed meal with a short text ("um copo de coca 350ml"); the AI identifies only the new items and they are appended to the meal. Available in the first 24 hours, up to 5 times per meal; it doesn't consume quota but is blocked for Free users with no quota left. When a photo shows something the AI can't identify (opaque cup, closed package, covered container), the meal details show a gentle hint ("Tinha algo no copo?") that opens "Adicionar item"; it disappears after the first addition or when the 24h window closes. Each item can be removed right away, with an "Desfazer" (undo) toast; removing the only item asks to delete the whole meal instead. "Excluir refeição" deletes the meal after a confirmation, with no undo and no quota refund. Adjusting an item's quantity is not available yet.
- Goals are editable (manual override of the derived plan). Profile is editable (name, birth date, height, weight, gender).
- Camera permission is used only at the moment of capture; the app states this to the user.
- Audio notes capped at 30 seconds.
- Free plan: 20 AI meals per calendar month (backend-enforced; the 403 `FREE_QUOTA_EXCEEDED` response routes the user to the Plans screen). Pro plan: unlimited meals.
- Plans screen: Free vs Pro comparison, 7-day free trial with no card (one per account), monthly/yearly checkout, next-charge status, and cancellation (trial downgrades immediately; paid keeps access until `paidUntil`).
- Subscription state (`plan`, `status`, `trialEndsAt`, `paidUntil`) and `mealQuota` are read from `GET /me`; the Plans screen revalidates on focus.
- App is Expo SDK 57 / React Native 0.86, React Navigation 7, TanStack Query (staleTime Infinity), react-hook-form + zod, axios, Expo camera/audio/video/auth-session, Host Grotesk font, react-native-svg.
- Both web and native builds must remain functional and feature-parity (Platform.OS-branched code exists for date picker, video, toasts, file handling).
- Undecided: none beyond the platform sequencing above.

## Brand Commitments

- Name and wordmark: **NaCal** (wordmark + lime accent stroke; white on dark surfaces, fern on light).
- Typography: Host Grotesk (300/400/500/600).
- Palette: lime accent family, neutral grays, black/white, macro support colors (tomato = calories, teal = proteins, yellow = carbs, orange = fats).
- Voice: friendly, simple, and reassuring br-PT ("Você pode inserir uma estimativa", "Só usada no momento da foto").
- Light interface style.

## Evidence on Hand

- Onboarding and welcome copy ("Controle sua dieta de forma simples"), onboarding step strings, empty-state copy.
- Assets: meal-processing animation (`chicken-leg.mp4`), app icon, splash icon.
- No real user data, testimonials, case studies, or press. Future work must not fabricate these.

## Product Principles

1. Simple over rigid: the app adapts to a casual daily habit, not a clinical regimen.
2. Frictionless logging: a meal is one glance and a few taps (or a sentence), never a data-entry chore.
3. Instant visual feedback: progress against macros is legible in one view (MacroRainbow).
4. Privacy at the moment of capture: camera and audio are used only when the user is logging, and the user is told so.
5. Friendly, reassuring voice: encourage, don't judge.