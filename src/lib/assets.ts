const rawAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim();
const useRemoteAssetsInDev = process.env.NEXT_PUBLIC_USE_REMOTE_ASSETS === "true";
const shouldUseRemoteAssets = process.env.NODE_ENV === "production" || useRemoteAssetsInDev;

export const assetBaseUrl = rawAssetBaseUrl && shouldUseRemoteAssets
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
