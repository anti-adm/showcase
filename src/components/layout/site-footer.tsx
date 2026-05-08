"use client";

import Image from "next/image";
import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");
  const locale = useLocale();

  return (
    <footer className="container-shell pb-10 pt-16">
      <div className="soft-card rounded-[36px] px-8 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
                <Image
                  src="/logo/sofin-logo.png"
                  alt="SOFIN"
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div>
                <div className="text-2xl font-semibold tracking-[0.22em] text-[var(--text)]">
                  SOFIN
                </div>
                <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
                  From farm to shelf
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-[420px] text-base leading-8 text-[var(--text-soft)]">
              {t("description")}
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
              {t("navigation")}
            </div>

            <nav className="mt-5 flex flex-col gap-3 text-[var(--text-soft)]">
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

            <div className="mt-5 space-y-3 text-[var(--text-soft)]">
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
