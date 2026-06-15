import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim();
const cloudflareImageCdn = process.env.NEXT_PUBLIC_IMAGE_CDN === 'cloudflare';

function getAssetRemotePattern() {
  if (!assetBaseUrl) return undefined;

  try {
    const url = new URL(assetBaseUrl);

    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: '/**'
    };
  } catch {
    return undefined;
  }
}

const assetRemotePattern = getAssetRemotePattern();

export default withNextIntl({
  outputFileTracingRoot: path.join(process.cwd()),
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react']
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: assetRemotePattern ? [assetRemotePattern] : [],
    ...(cloudflareImageCdn
      ? {
          loader: 'custom' as const,
          loaderFile: './src/lib/cloudflare-image-loader.ts'
        }
      : {})
  },
  async headers() {
    return [
      {
        source: '/:assetFolder(images|backgrounds|media|models|textures|logo)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800'
          }
        ]
      }
    ];
  }
});
