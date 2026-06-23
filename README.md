# SOFIN Premium Website Foundation — Scroll Story Version

This project is a production-oriented homepage foundation for **SOFIN**, built as a premium dairy brand presentation with:

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- next-intl
- Lenis smooth scrolling
- UZ / EN / RU localization
- large full-screen homepage blocks
- scroll-driven hero scenes instead of auto-play

## What changed in this version

This rebuild fixes the main issues from the earlier archive:

- hero scenes now change **by scroll**, not by timer
- homepage uses **large cinematic blocks** below the main hero
- Lenis smooth scrolling is wired in
- language switcher logic was rebuilt
- the provided logo and image assets are already integrated
- routes for Home / Products / Company / Recipes / Contacts remain ready

## Main structure

```text
sofin-site/
├── messages/
│   ├── en.json
│   ├── ru.json
│   └── uz.json
├── public/
│   ├── icons/
│   │   └── favicon.svg
│   ├── images/
│   │   ├── brand/
│   │   ├── hero/
│   │   ├── products/
│   │   └── recipes/
│   └── logo/
│       └── sofin-logo.webp
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── providers/
│   │   └── shared/
│   ├── data/
│   ├── i18n/
│   └── lib/
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── package.json
└── README.md
```

## Install

Use one package manager.

### pnpm

```bash
pnpm install
```

### npm

```bash
npm install
```

## Run locally

### pnpm

```bash
pnpm dev
```

### npm

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Root redirects to:

```text
/uz
```

## Production build

### pnpm

```bash
pnpm build
pnpm start
```

### npm

```bash
npm run build
npm run start
```

## Localization

This project uses `next-intl`.

Locales:
- `uz` — default
- `en`
- `ru`

Important files:
- `src/i18n/routing.ts`
- `src/i18n/navigation.ts`
- `src/i18n/request.ts`
- `middleware.ts`
- `messages/uz.json`
- `messages/en.json`
- `messages/ru.json`

## Where to edit homepage text

Edit these translation files:

```text
/messages/uz.json
/messages/en.json
/messages/ru.json
```

Homepage text is mainly inside:
- `Hero`
- `Panels`
- `Footer`

## Where the hero scene logic is

Main scroll-story component:

```text
/src/components/home/sections/hero-story.tsx
```

This section is sticky and scroll-driven. The active hero scene is calculated from page scroll progress.

## Where Lenis smooth scrolling is connected

```text
/src/components/providers/smooth-scroll-provider.tsx
```

It is mounted in:

```text
/src/app/[locale]/layout.tsx
```

## Where to replace images

Current integrated files are already placed inside `public/`.

### Hero visuals

```text
/public/images/hero/
```

### Product visuals

```text
/public/images/products/
```

### Brand visuals

```text
/public/images/brand/
```

### Logo

```text
/public/logo/sofin-logo.webp
```

If you receive better photos later, replace files with the same names to avoid changing code.

## Where to change the logo rendering

```text
/src/components/shared/logo.tsx
```

## Future pages

Routes already prepared:

- `/uz`
- `/uz/products`
- `/uz/company`
- `/uz/recipes`
- `/uz/contacts`
- same structure for `/en/...` and `/ru/...`

Page shell used for those placeholders:

```text
/src/components/shared/page-shell.tsx
```

## Best files to modify first as a beginner

1. `messages/uz.json`
2. `src/components/home/sections/hero-story.tsx`
3. `src/components/home/sections/large-story-panel.tsx`
4. `src/components/layout/site-header.tsx`
5. `src/components/shared/logo.tsx`

## Notes

- The homepage is now built around a **scroll-changing hero** rather than auto scene switching.
- The large sections below the hero are designed as **big editorial panels**, not small landing-page cards.
- The right-side arrow sends the page back to the top.
- The header stays visible across the whole page.
# showcase
