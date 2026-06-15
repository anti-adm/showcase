import type {ImageLoaderProps} from "next/image";

const rawAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim();
const assetBaseUrl = rawAssetBaseUrl ? rawAssetBaseUrl.replace(/\/+$/, "") : "";

export default function cloudflareImageLoader({
  src,
  width,
  quality
}: ImageLoaderProps) {
  const options = [`width=${width}`, `quality=${quality ?? 75}`, "format=auto"];
  const normalizedSrc = normalizeSource(src);

  if (!assetBaseUrl) {
    return normalizedSrc;
  }

  const assetUrl = new URL(assetBaseUrl);
  const sourceUrl = new URL(normalizedSrc, assetUrl.origin);

  if (sourceUrl.origin === assetUrl.origin) {
    return `${assetUrl.origin}/cdn-cgi/image/${options.join(",")}${sourceUrl.pathname}${sourceUrl.search}`;
  }

  return `${assetUrl.origin}/cdn-cgi/image/${options.join(",")}/${sourceUrl.href}`;
}

function normalizeSource(src: string) {
  if (src.startsWith("//")) return `https:${src}`;
  return src;
}
