"use client";

import Image from "next/image";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");
  const locale = useLocale();

  return (
    <footer className="container-shell pb-6 pt-8 sm:pb-8 sm:pt-10">
      <div className="soft-card rounded-[28px] px-5 py-6 sm:px-7 lg:px-8">
        <div className="grid gap-7 md:grid-cols-[1fr_0.8fr] lg:grid-cols-[1.1fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
                <Image
                  src="/logo/sofin-logo.png"
                  alt="SOFIN"
                  width={40}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div>
                <div className="text-xl font-semibold tracking-[0.22em] text-[var(--text)]">
                  SOFIN
                </div>
                <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
                  From farm to shelf
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
              {t("navigation")}
            </div>

            <nav className="mt-4 grid grid-cols-2 gap-2 text-sm text-[var(--text-soft)] sm:flex sm:flex-col sm:gap-2.5">
              <Link href={`/${locale}`} className="transition hover:text-[var(--text)]">
                {nav("home")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="transition hover:text-[var(--text)]"
              >
                {nav("products")}
              </Link>
              <Link
                href={`/${locale}/yogurts`}
                className="transition hover:text-[var(--text)]"
              >
                {nav("yogurts")}
              </Link>
              <Link
                href={`/${locale}/company`}
                className="transition hover:text-[var(--text)]"
              >
                {nav("company")}
              </Link>
              <Link
                href={`/${locale}/recipes`}
                className="transition hover:text-[var(--text)]"
              >
                {nav("recipes")}
              </Link>
              <Link
                href={`/${locale}/contacts`}
                className="transition hover:text-[var(--text)]"
              >
                {nav("contacts")}
              </Link>
            </nav>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
              {t("contacts")}
            </div>

            <div className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
              <p>{t("address")}</p>
              <p>{t("phone")}</p>
              <p>{t("email")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
