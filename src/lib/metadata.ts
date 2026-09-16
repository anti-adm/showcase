import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import {hasLocale} from "next-intl";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];
function alternates(locale: string, path: string): Metadata["alternates"] {
  // Canonicals are emitted only for a configured public origin.
  if (!process.env.NEXT_PUBLIC_SITE_URL) return undefined;
  return {canonical: `/${locale}${path}`, languages: Object.fromEntries(routing.locales.map(lang => [lang, `/${lang}${path}`]))};
}
export async function pageMetadata(locale: string, page: "home" | "products" | "yogurts" | "company" | "recipes" | "contacts"): Promise<Metadata> {
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  return {title, description, alternates: alternates(locale, page === "home" ? "" : `/${page}`), openGraph: {title, description, locale, type: "website", siteName: "SOFIN"}};
}
export function detailMetadata(locale: string, path: string, titles: Record<Locale, string>, descriptions: Record<Locale, string>): Metadata {
  if (!hasLocale(routing.locales, locale)) notFound();
  const title = `${titles[locale]} — SOFIN`;
  const description = descriptions[locale];
  return {title, description, alternates: alternates(locale, path), openGraph: {title, description, locale, type: "website", siteName: "SOFIN"}};
}
