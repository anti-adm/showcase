# Local checks

Use Node.js 24 and pnpm. Browser tests use installed Google Chrome.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

`test:e2e` starts the production server on port 3212 and tests desktop and mobile
layouts, three locales, search/filter state, locale switching, accessible names
and contrast with axe, gallery focus, menu dismissal, form error states,
invalid URLs, and contact API validation. The desktop project also covers
320/768/1024/1920px widths and every product/recipe URL in every locale.
The browser report is in `playwright-report/index.html`; failure traces and
screenshots are in `test-results`. Both directories are ignored by Git.

The form tests intercept delivery requests. API tests submit only malformed
requests or a honeypot request that exits before SMTP. They do not send email.
Successful SMTP delivery needs a separate authorized test against the deployed
configuration. The process-local request limiter is a backstop; configure an
edge/shared limit for multiple production instances.

Set `NEXT_PUBLIC_SITE_URL` to the verified public origin before the production
build to emit canonical and language alternate URLs. No placeholder domain is
published by default. Remote assets require explicit opt-in; see `r2-assets.md`.

Browser automation does not replace checks on real iOS/Android devices or
extended WebGL testing. Motion-reduced visitors use the standard yogurt page;
the interactive 3D presentation is the default for other visitors. Dedicated tests
assert the original homepage scenes, default 3D rendering and product entrance
animation, so future optimizations cannot silently remove these experiences.
