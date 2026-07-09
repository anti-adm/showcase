"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Grid2X2,
  Home,
  Mail,
  MapPin,
  Package,
  Phone,
  Send,
  ShoppingBag
} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname} from "next/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === "/";
  const navItems = [
    {href: `/${locale}`, label: nav("home"), icon: Home},
    {href: `/${locale}/products`, label: nav("products"), icon: ShoppingBag},
    {href: `/${locale}/yogurts`, label: nav("yogurts"), icon: Package},
    {href: `/${locale}/company`, label: nav("company"), icon: Building2},
    {href: `/${locale}/recipes`, label: nav("recipes"), icon: BookOpen},
    {href: `/${locale}/contacts`, label: nav("contacts"), icon: Phone}
  ];
  const contactItems = [
    {href: "tel:+998712003636", label: t("phone"), icon: Phone},
    {href: "mailto:hello@sofin.uz", label: t("email"), icon: Mail},
    {href: "https://t.me/sofinuz", label: "Telegram", icon: Send}
  ];

  return (
    <footer
      className={
        isHome
          ? "relative overflow-hidden bg-[linear-gradient(180deg,#edf4fc_0%,#dae7f6_52%,#cfdeef_100%)] pb-8 pt-8 sm:pb-10 sm:pt-10"
          : "container-shell pb-6 pt-8 sm:pb-8 sm:pt-10"
      }
    >
      {isHome ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_30%),radial-gradient(circle_at_16%_78%,rgba(255,255,255,0.34),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 backdrop-blur-[10px]" />
        </>
      ) : null}
      <div className={isHome ? "container-shell relative z-10" : ""}>
      <div className="rounded-[34px] border border-white/62 bg-white/34 px-5 py-6 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[24px] sm:px-7 sm:py-7 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.08fr_0.88fr] lg:items-stretch">
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[20px] bg-white/82 shadow-[0_14px_36px_rgba(25,68,112,0.10)]">
                <Image
                  src="/logo/sofin-logo.webp"
                  alt="SOFIN"
                  width={64}
                  height={64}
                  className="h-14 w-auto object-contain"
                />
              </div>

              <div>
                <div className="text-[clamp(1.45rem,2.1vw,2rem)] font-semibold tracking-[0.28em] text-[var(--text)]">
                  SOFIN
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.34em] text-[var(--muted)]">
                  From farm to shelf
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:mt-auto lg:grid-cols-1">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group inline-flex min-h-[64px] items-center gap-3 rounded-full border border-white/56 bg-white/54 px-4 text-sm font-semibold text-[var(--text-soft)] shadow-[0_12px_30px_rgba(44,78,120,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/74 hover:text-[var(--text)]"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef6ff] text-[var(--brand-primary)] shadow-[0_8px_20px_rgba(44,78,120,0.08)] transition group-hover:bg-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate">{item.label}</span>
                    <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-[#8aa3c4] transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[30px] border border-white/52 bg-white/28 p-5 shadow-[0_18px_60px_rgba(44,78,120,0.07),inset_0_1px_0_rgba(255,255,255,0.66)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/72 text-[var(--brand-primary)] shadow-[0_12px_28px_rgba(44,78,120,0.08)]">
                <Grid2X2 className="h-6 w-6" />
              </span>
              <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--muted)]">
                {t("navigation")}
              </div>
            </div>

            <div className="my-5 h-px bg-[#b9cbe1]/55" />

            <nav className="grid grid-cols-2 gap-x-6 gap-y-7 text-center text-sm font-semibold text-[var(--text-soft)] sm:grid-cols-3">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col items-center gap-3 rounded-[18px] px-2 py-1 transition hover:-translate-y-0.5 hover:text-[var(--text)]"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/74 text-[var(--brand-primary)] shadow-[0_12px_28px_rgba(44,78,120,0.09)] transition group-hover:bg-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex h-full flex-col rounded-[30px] border border-white/52 bg-white/28 p-5 shadow-[0_18px_60px_rgba(44,78,120,0.07),inset_0_1px_0_rgba(255,255,255,0.66)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/72 text-[var(--brand-primary)] shadow-[0_12px_28px_rgba(44,78,120,0.08)]">
                <MapPin className="h-6 w-6" />
              </span>
              <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--muted)]">
                {t("contacts")}
              </div>
            </div>

            <div className="my-5 h-px bg-[#b9cbe1]/55" />

            <div className="space-y-5 text-sm font-semibold leading-7 text-[var(--text-soft)]">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--brand-primary)] shadow-[0_10px_24px_rgba(44,78,120,0.08)]">
                  <MapPin className="h-5 w-5" />
                </span>
                <p>{t("address")}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--brand-primary)] shadow-[0_10px_24px_rgba(44,78,120,0.08)]">
                  <Phone className="h-5 w-5" />
                </span>
                <p>{t("phone")}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--brand-primary)] shadow-[0_10px_24px_rgba(44,78,120,0.08)]">
                  <Mail className="h-5 w-5" />
                </span>
                <p>{t("email")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
