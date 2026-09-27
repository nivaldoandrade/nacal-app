# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Web is the primary surface for validation; iOS and Android native follow if retention proves out. Until then, both web and native must remain functional and converge on the same product.

## Users

People tracking their diet day to day, logging what they eat on the go. Their job: record meals in seconds and see, at a glance, whether today is on track against their plan — without the overhead, rigidity, or guilt-driven tooling of a traditional calorie counter.

## Product Purpose

NaCal lets a person control their diet simply. "Controle sua dieta de forma simples." Success is a user who opens the app, logs a meal with a photo or a voice note, and immediately understands their daily progress against a macro plan generated from a short onboarding.

## Positioning

Simple and friendly where nutrition trackers are rigid and clinical. The core mechanism is frictionless logging: take a photo of the plate or say what you ate, and the backend turns it into foods and macros. A neighboring calorie-counting app could not truthfully copy this — no manual food search, no barcode scanning, no data entry.

## Operating Context

- Brazilian Portuguese user-facing copy throughout.
- Logging happens on the move: photo capture or a voice note capped at 30 seconds.
- Meal processing is asynchronous: the app uploads, then polls status through `UPLOADING → QUEUED → PROCESSING → SUCCESS/FAILED` before showing foods and macros.
- Day-based view: a weekly calendar with today's meals and macro progress vs. goal.
- Auth via Cognito: Google (OAuth2 + PKCE) and email/password; tokens persist in AsyncStorage with silent refresh on 401.
- Files upload via presigned POST (S3-style, base64-encoded signature).

## Capabilities and Constraints

- Seven-step onboarding captures goal, gender, birth date, height, weight, and activity level; the backend derives a personalized daily macro plan (calories, proteins, carbohydrates, fats).
- Home shows a weekly calendar, macro progress (MacroRainbow visualization), and the day's meals with per-food and total macros.
- Meal creation from photo or audio; playback review for audio before sending.
- Meal details screen with total calories and macro breakdown.
- Goals are editable (manual override of the derived plan). Profile is editable (name, birth date, height, weight, gender).
- Camera permission is used only at the moment of capture; the app states this to the user.
- Audio notes capped at 30 seconds.
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