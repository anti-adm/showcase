const rawAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim();
// Remote delivery is opt-in: a configured but incomplete bucket must not break the site.
const shouldUseRemoteAssets = Boolean(rawAssetBaseUrl) &&
  process.env.NEXT_PUBLIC_USE_REMOTE_ASSETS === "true";

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
