const rawAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim();

export const assetBaseUrl = rawAssetBaseUrl
  ? rawAssetBaseUrl.replace(/\/+$/, "")
  : "";

export function assetUrl(src: string) {
  if (!assetBaseUrl || isExternalUrl(src) || src.startsWith("data:")) {
    return src;
  }

  return `${assetBaseUrl}${src.startsWith("/") ? src : `/${src}`}`;
}

function isExternalUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//");
}
