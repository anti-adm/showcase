# SOFIN Website

Production-oriented Next.js website with Russian, Uzbek and English locales, a product catalog, recipes, contact form and interactive 3D yogurt showcases.

## Local setup

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The development site opens at `http://localhost:3000/ru`.

## Production check

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Playwright uses Chrome and checks desktop and mobile layouts across all three locales. The unit test suite also verifies that literal assets referenced by source code exist in `public`.

## Environment

Copy `.env.example` to `.env.local`. SMTP variables are required for real contact-form delivery. Without them, the API intentionally responds with `503 unavailable` and the rest of the site continues to work.

Remote assets are optional. Keep `NEXT_PUBLIC_USE_REMOTE_ASSETS=false` to serve the checked-in optimized assets. When remote delivery is enabled, set `NEXT_PUBLIC_ASSET_BASE_URL`; set `NEXT_PUBLIC_IMAGE_CDN=cloudflare` only when that base URL is backed by Cloudflare Images.

## Main routes

- `/ru`, `/uz`, `/en` — homepage
- `/{locale}/products` — catalog
- `/{locale}/yogurts` — yogurt cup showcase
- `/{locale}/yogurts?showcase=bottles` — yogurt bottle showcase
- `/{locale}/company`, `/{locale}/recipes`, `/{locale}/contacts`
