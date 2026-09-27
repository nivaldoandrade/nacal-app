---
name: NaCal
description: Controle sua dieta de forma simples — friendly macro tracking with photo and voice logging.
colors:
  spring-lime: "#bef264"
  lime-bright: "#e8fb86"
  lime-leaf: "#a2e635"
  lime-fern: "#64a30d"
  fern-deep: "#1a2e05"
  fern-ink: "#022c22"
  cloud: "#ffffff"
  mist-100: "#fafafa"
  mist-200: "#f4f4f5"
  mist-300: "#f3f4f6"
  fog-400: "#e4e4e7"
  fog-500: "#d9d9d9"
  fog-600: "#a1a1aa"
  fog-700: "#71717a"
  ink: "#18181b"
  ink-soft: "#1e293b"
  ink-strong: "#09090b"
  leaf-tint: "rgba(101, 163, 13, 0.1)"
  leaf-hint: "rgba(101, 163, 13, 0.05)"
  cloud-wash: "rgba(255, 255, 255, 0.4)"
  calorie-tomato: "#e76e50"
  protein-teal: "#2a9d90"
  carbs-honey: "#e8c468"
  fats-carrot: "#f4a462"
  sprout-success: "#10b981"
  danger-red: "#ef4444"
typography:
  display:
    fontFamily: "Host Grotesk"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: "32px"
    letterSpacing: "-0.32px"
  headline:
    fontFamily: "Host Grotesk"
    fontSize: "30px"
    fontWeight: 500
  title:
    fontFamily: "Host Grotesk"
    fontSize: "24px"
    fontWeight: 600
  subtitle:
    fontFamily: "Host Grotesk"
    fontSize: "18px"
    fontWeight: 400
  body:
    fontFamily: "Host Grotesk"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "Host Grotesk"
    fontSize: "14px"
    fontWeight: 500
  caption:
    fontFamily: "Host Grotesk"
    fontSize: "12px"
    fontWeight: 300
rounded:
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  card: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.spring-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
  button-primary-disabled:
    backgroundColor: "{colors.spring-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
    opacity: 0.5
  button-secondary:
    backgroundColor: "{colors.mist-300}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
  button-neutral:
    backgroundColor: "{colors.leaf-hint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
    height: "52px"
  button-pill:
    backgroundColor: "{colors.spring-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 30px"
    height: "52px"
  button-icon:
    backgroundColor: "{colors.spring-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    width: "48px"
    height: "48px"
  input:
    backgroundColor: "{colors.cloud}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px"
    height: "52px"
  radio-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  radio-item-selected:
    backgroundColor: "{colors.leaf-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.cloud}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  avatar:
    backgroundColor: "{colors.spring-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    width: "48px"
    height: "48px"
  fab:
    backgroundColor: "{colors.spring-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    width: "48px"
    height: "48px"
  progress-track:
    backgroundColor: "{colors.mist-200}"
    height: "4px"
  progress-fill:
    backgroundColor: "{colors.lime-fern}"
    height: "4px"
---

# Design System: NaCal

## Overview

**Creative North Star: "The Fresh Plate"**

NaCal is a food diary that refuses to feel like medicine. It trades the clinical precision of calorie counters for the ease of a friendly meal table: airy, garden-fresh surfaces in cloud white and soft mist, energized by a single bright lime accent, with every corner gently rounded. Screens breathe — spacing is generous, nothing crowds, and one glance is enough to understand the day. The aesthetic philosophy is fresh-squeezed optimism: optimistic without shouting, friendly without silliness, reassuring in flawless Brazilian Portuguese.

The system is a study in rationed color. Most of the interface is quiet: white panels on misty grays separated by hairline borders, tonal wells instead of shadows. Color arrives deliberately — spring lime for the single moment of action, four macro hues only where nutrition data is shown, and deep fern ink for the moments of ceremony (offer-your-plan, capture-your-meal) where the app asks the user to pause and trust it. Depth comes from stillness and tonal layering, not elevation.

**Key Characteristics:**
- Airy and optimistic: cloud-white panels over a lime-bright wash, generous spacing, nothing crowded.
- Soft geometry: every corner rounded (10–24px), pill hero CTAs, circular icon wells and recording rings.
- Tonal, not shadowy: depth from mist/fog wells and 1px borders; shadows only on floating actions.
- Reassuring, friendly br-PT voice throughout ("Você pode inserir uma estimativa", "Só usada no momento da foto").
- The MacroRainbow as signature: four colored arcs make daily progress legible at a glance.

## Colors

Botanical, garden-fresh: the palette reads like clean produce on a white plate — quiet neutrals, one bright lime, and four data hues reserved for macros.

### Primary
- **Spring Lime** (`#bef264`): the one "act now" accent. Primary buttons, the FAB, avatars, icon buttons, and the logo's accent stroke. It is the most saturated color in the system and used sparingly.
- **Lime Bright** (`#e8fb86`): the atmospheric wash of the home screen and the selected day in the week calendar. Softer than spring lime, used for surfaces rather than actions.
- **Lime Leaf** (`#a2e635`): press/interaction luster for spring-lime surfaces.
- **Lime Fern** (`#64a30d`): state color — selected radio borders, progress fill, secondary green text links.
- **Leaf Tint** (`rgba(101,163,13,0.1)`) and **Leaf Hint** (`rgba(101,163,13,0.05)`): the lime wash family — selections and tinted wells step from hint (neutral buttons over white) up to tint (selected tiles).
- **Fern Deep** (`#1a2e05`) and **Fern Ink** (`#022c22`): the brand's dark greens — full-screen dark moments (plan summary, camera privacy badge, loader logo on cloud).

### Neutral
- **Cloud** (`#ffffff`): the dominant surface — content panels, cards, inputs, meals list.
- **Mist** (`#fafafa`/`#f4f4f5`/`#f3f4f6`): deepens by step. Mist-100 lines inner wells (macro summary boxes, unit chips); Mist-200 fills icon wells, avatar fallbacks, and progress tracks; Mist-300 fills secondary buttons and quiet borders.
- **Fog** (`#e4e4e7`/`#d9d9d9`/`#a1a1aa`/`#71717a`): Fog-400 is the hairline border vocabulary (inputs, cards, dividers); Fog-500 dims future days; Fog-600/700 are muted text on light surfaces.
- **Ink** (`#18181b` body text, `#1e293b` soft, `#09090b` deep): text and the dark meal-detail header. Light surfaces use ink text; dark surfaces use cloud with spring-lime highlights.

### Data — Macros (reserved)
- **Calorie Tomato** (`#e76e50`), **Protein Teal** (`#2a9d90`), **Carbs Honey** (`#e8c468`), **Fats Carrot** (`#f4a462`): the MacroRainbow arcs and every macro figure. **Sprout Green** (`#10b981`) for success states, **Danger Red** (`#ef4444`) for errors and destructive states only.

### Named Rules
**The Fresh-Plate Rule.** Spring lime is rationed. Page washes and selections use lime bright or leaf tint; full spring lime is reserved for the one element asking for a tap. Its rarity is the point.
**The White-Panel Rule.** Content lives on cloud. Mist and fog layers define containment; they never compete with content for attention.
**The Macro-Rainbow Rule.** The four macro hues exist to encode calories, protein, carbs, and fats — and nothing else. They must never decorate unrelated UI.

## Typography

**Display Font:** Host Grotesk (300 Light, 400 Regular, 500 Medium, 600 SemiBold)

**Character:** one friendly grotesque with an open, humanist warmth — approachable where clinical nutrition UI is sterile. Weight and size carry hierarchy; color accents are reserved for data and links. Large centered headings pick up a slight tightened tracking.

### Hierarchy
- **Display** (500, 32px, 32px line, -0.32px tracking): the welcome hero — "Controle sua dieta de forma simples".
- **Headline** (500, 30px): onboarding step titles and the plan-summary headline, centered.
- **Title** (600, 24px, -0.4px tracking): sheet and screen titles ("Cadastre sua refeição", "Suas Metas", "Perfil").
- **Subtitle** (400, 18px): supporting step copy and meal names at rest.
- **Body** (400, 16px): default text — foods, descriptions, values.
- **Label** (500, 14px): field labels, macro names.
- **Caption** (300, 12px): unit captions and film credits-style asides.
- **Uppercase Section Label** (500, 16px, 1.28px tracking, all-caps): section markers such as "REFEIÇÕES".

### Named Rules
**The One-Accent Rule.** Within a paragraph, weight changes carry hierarchy; color highlights are allowed only for macro data and interactive links. Never colorize prose for emphasis.

## Layout

Single-column mobile composition with trusting whitespace. Screen gutters are 20px on list screens and 24px on step/form screens; bottom sheets use 24px horizontal padding. The spacing rhythm steps 4 / 8 / 16 / 24 / 32px.

Onboarding steps are a calm three-part stack: a centered header (title + subtitle) at the top, the interaction content anchored low or centered, and a right-aligned circular arrow button in the footer that advances the flow. The home screen is a full-height lime-bright wash with a cloud-white panel rounding (~16px) at its top edge, so the day feels like a plate set down on a fresh tablecloth. Full-screen dark surfaces (fern ink) render plan summaries and capture flows as deliberate, immersive moments.

## Elevation & Depth

Flat by default. Depth is expressed through tonal layering — mist-100/200 wells and 1px fog borders against cloud — plus inverted dark surfaces (fern ink, ink strong) that act as "deep" panels. Shadows are reserved for things that literally float above content.

### Shadow Vocabulary
- **Fab / Floating action** (`0 4px 5px rgba(0,0,0,0.3)`): the floating + button and other floating actions.
- **Bottom sheet** (raised, `0 5px 16px #000` at strong opacity): sign-in and create-meal sheets lifted over the app.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Cards contain themselves with a hairline border and a tonal well — a shadow only appears for a floating action or a lifted sheet.
**The Scrim Rule.** When a surface recedes under a scrim (welcome CTA), use a dark translucent layer (`rgba(0,0,0,0.4)`) plus backdrop blur — flat coverage, soft separation.

## Shapes

Soft and thoroughly rounded; nothing has a square corner. The form language is generous and steady: inputs at 10px, buttons at 12px (52px tall), cards and selection tiles at 16px, the welcome CTA card at 20px, and full circles for avatars, the FAB, and recording rings. Repeatable 48px wells carry icons — square wells at 12px radius, circular wells at 24px, plan-summary icons at 28px. Small details stay curvilinear: micro-well corners (8px), pill progress tracks (4px tall, fully rounded ends), and pill chips (20px). The one deliberate square family is media: photos and the meal-details macro bar are allowed crisp edges.

### Named Rules
**The Nothing-Square Rule.** Every interactive shape ends rounded. If you can't decide, 12px corners on a 48–52px control.
**The Circle Signature Rule.** Circles mean "me" and "capture": avatars, recording rings, and release points stay perfectly round.

## Components

### Buttons
- **Shape:** 12px corners, min-height 52px, 14px×24px padding; hero CTAs go full pill (50px radius).
- **Primary:** spring lime background, ink text, icon content in a 8px gap. Disabled drops to 50% opacity.
- **Secondary:** mist-300 background, ink text. **Neutral:** leaf-hint background, ink text — the quiet lime wash used for icon buttons inside capture modals and modal close. **Ghost/Text:** transparent with a tinted text link. **Icon buttons:** 48×48 circle-ready square at 12px radius (FAB uses this with its own shadow; onboarding's arrow uses it flat).
- Everything is touch-friendly; there is no small tappable target in the system.

### Inputs / Fields
- **Style:** cloud background, 1px fog-400 border, 10px radius, 14px padding, 52px minimum height, 16px Host Grotesk regular, ink text.
- **Focus:** the border shifts to ink. **Error:** border shifts to danger red. **Disabled:** 50% opacity.
- **Adornments:** a trailing suffix chip (mist-100, 10px radius, e.g. "cm"/"kg") and interior icons; icons dim to 50% when disabled.

### Radio / Selection Tiles
- **Style:** full-width rounded tiles (16px), 1px border (mist-300), 12px×16px padding, leading 48px square icon well (mist-200, 12px radius) with a centered emoji.
- **Selected:** leaf-tint background, lime-fern border, icon well flips to cloud-wash. A horizontal variant (e.g. gender) stacks the emoji above the label, py32, centered.
- Used for goals, gender, activity level, and meal-creation options — the friendliest form of "pick one".

### Cards / Containers
- **Meal card:** cloud panel, 16px radius, 1px fog-400 border, 8px inner padding; a 48px circular icon well (mist-200, emoji food) leads the header row; the macro summary sits in a mist-100 well at 8px radius with 16px padding.
- **Week calendar:** day cells at 10px radius; the selected day fills lime bright. **Divider:** 1px dashed fog-400 separates detail sections.

### Chips
- **Privacy badge:** fern-ink pill (20px radius, 6px×14px padding) with a hairline lime-fern border — "Só usada no momento da foto".

### Navigation & Headers
- **Light screens:** a plain row header — left title, right icon well (48×48), space-between. **Meal details:** inverted header on ink-strong with cloud text. **Bottom sheets** carry their own centered titles in close-set 24px semi-bold.

### Signature Component — The MacroRainbow
The product's visual centerpiece: a semi-circular fan of four concentric rounded-arc tracks (12px strokes, 8px gaps, rounded caps) in calorie tomato, protein teal, carbs honey, and fats carrot. In progress mode each arc rests on a mist-200 track and sweeps to its goal share; the calorie total sits centered inside the fan, and a three-column macro legend (values + units) sits below. Progress is legible even in peripheral vision.

### Motion
- **MacroRainbow sweep:** each arc fills over 1000ms with an ease-in-out dash-offset animation when the day's numbers resolve.
- **Meal-processing loader:** cross-fade in 300ms / out 350ms over a cloud canvas with a looping food animation.
- **Recording:** concentric ring borders expand/pulse while the user narrates a meal.

## Do's and Don'ts

### Do:
- **Do** give every screen air: 20–24px gutters and a 4/8/16/24/32px rhythm.
- **Do** reserve spring lime for the tap-inviting element, use lime bright/leaf tint for washes and selections.
- **Do** keep content on cloud and contain it with mist wells and hairline fog borders.
- **Do** keep touch targets at 48–52px minimum and round every corner (10px minimum).
- **Do** use the four macro hues only to encode calories / protein / carbs / fats.
- **Do** write copy that reassures and never judges ("Você pode inserir uma estimativa").

### Don't:
- **Don't** introduce a second accent color; spring lime is the only voice.
- **Don't** square off corners or use shadows on resting cards.
- **Don't** decorate decorative UI with the macro palette.
- **Don't** use clinical or rigid language — this is "controle sua dieta de forma simples", not a hospital chart.
- **Don't** push content edge-to-edge; sheets and panels always keep their gutters.