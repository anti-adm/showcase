"use client";

import Image from "next/image";
import Link from "next/link";
import {Mail, Phone, Send} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {assetUrl} from "@/lib/assets";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === "/";
  const navItems = [
    {href: `/${locale}`, label: nav("home")},
    {href: `/${locale}/products`, label: nav("products")},
    {href: `/${locale}/yogurts`, label: nav("yogurts")},
    {href: `/${locale}/company`, label: nav("company")},
    {href: `/${locale}/recipes`, label: nav("recipes")},
    {href: `/${locale}/contacts`, label: nav("contacts")}
  ];
  const contactItems = [
    {href: "tel:+998712003636", label: t("phone"), icon: Phone},
    {href: "mailto:hello@sofin.uz", label: t("email"), icon: Mail},
    {href: "https://t.me/sofinuz", label: "Telegram", icon: Send}
  ];

  return (
    <footer className={`relative overflow-hidden ${isHome ? "bg-[#15253a] pb-8 pt-20 sm:pt-24" : "container-shell pb-6 pt-8 sm:pb-8 sm:pt-10"}`}>
      {isHome ? (
        <>
          <div
            className="absolute inset-x-0 top-0 h-16 bg-[length:100%_100%] bg-top bg-no-repeat sm:h-20"
            style={{backgroundImage: `url("${assetUrl("/images/milk-wave.svg")}")`}}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(168,215,255,0.22),transparent_30%),radial-gradient(circle_at_84%_0%,rgba(255,255,255,0.16),transparent_34%)]" />
        </>
      ) : null}
      <div className={isHome ? "container-shell relative z-10" : ""}>
      <div className="rounded-[30px] border border-white/44 bg-[#e8f1fb]/72 px-5 py-6 shadow-[0_22px_70px_rgba(10,32,71,0.10)] backdrop-blur-2xl sm:px-7 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.12fr_0.86fr] lg:items-stretch">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]">
                <Image
                  src={assetUrl("/logo/sofin-logo.webp")}
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

            <div className="grid gap-2 sm:grid-cols-3 lg:mt-auto lg:grid-cols-1">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/42 bg-white/30 px-3.5 py-2.5 text-sm font-medium text-[var(--text-soft)] shadow-[0_10px_26px_rgba(10,32,71,0.05)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/52 hover:text-[var(--text)]"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/50 text-[var(--text)] transition group-hover:bg-white/72">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[26px] border border-white/34 bg-white/24 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
              {t("navigation")}
            </div>

            <nav className="mt-auto grid grid-cols-2 gap-x-8 gap-y-5 rounded-[24px] bg-white/12 px-4 py-4 text-sm font-semibold text-[var(--text-soft)] sm:grid-cols-3 sm:px-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-1 py-1 transition hover:translate-x-1 hover:text-[var(--text)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex h-full flex-col rounded-[26px] border border-white/34 bg-white/24 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
              {t("contacts")}
            </div>

            <div className="mt-auto space-y-2 text-sm leading-7 text-[var(--text-soft)]">
              <p>{t("address")}</p>
              <p>{t("phone")}</p>
              <p>{t("email")}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
