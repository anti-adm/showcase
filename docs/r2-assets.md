# R2 asset delivery

Recommended production setup for SOFIN assets:

1. Create a Cloudflare R2 bucket, for example `sofin-assets`.
2. Connect it to a custom domain from the R2 bucket settings, for example `assets.sofin.uz`.
3. Keep `r2.dev` disabled for production traffic.
4. Upload the same folder structure that exists under `public`, for example `/images`, `/backgrounds`, `/media`, `/models`, `/textures`, and `/logo`.
5. Set object metadata for immutable, versioned uploads:
   `Cache-Control: public, max-age=31536000, immutable`.
6. Use versioned filenames when replacing assets, for example `kefir-25-900.v2.webp`, then update the product data.
7. Set deployment env vars:
   `NEXT_PUBLIC_ASSET_BASE_URL=https://assets.sofin.uz`
   `NEXT_PUBLIC_IMAGE_CDN=cloudflare`

With `NEXT_PUBLIC_IMAGE_CDN=cloudflare`, `next/image` emits Cloudflare Image Transformation URLs like:

```text
https://assets.sofin.uz/cdn-cgi/image/width=640,quality=75,format=auto/images/products/example.webp
```

For local development, leave both env vars unset and the site will continue using files from `public`.

Before uploading, run:

```bash
node scripts/audit-assets.mjs
```

The current asset folder needs cleanup before final migration:

- Several files have misleading extensions, for example `.webp` files that are actually PNG/JPEG payloads.
- Several product originals are 2362-6240 px wide and 3-5 MB each.
- Some legacy product paths still exist only through aliases or fallbacks.

Target export sizes:

- Catalog/product cards: AVIF/WebP, transparent if needed, 700-900 px long side, usually under 120 KB.
- Product detail hero: AVIF/WebP, 1200-1600 px long side, usually under 250 KB.
- Full-screen backgrounds: AVIF/WebP, desktop 1920 px wide and mobile 1080 px wide.
- 3D models: Draco or Meshopt compressed GLB, lazy-loaded after the section becomes visible.
