"use client";

import {Component, type ReactNode, useEffect, useState} from "react";
import {usePrefersReducedMotion} from "@/lib/use-prefers-reduced-motion";
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import dynamic from "next/dynamic";
import {ArrowDown, ArrowLeft, ArrowRight, Play} from "lucide-react";
import Link from "next/link";
import Image from "@/components/shared/adaptive-image";
import {ProductCard, type Locale} from "@/components/products/products-catalog-page";
import productImages from "@/data/product-images.json";
import {listedProducts} from "@/components/products/products-data";

const Cups = dynamic(() => import("./yogurts-showcase-page").then((module) => module.YogurtsShowcasePage), {ssr: false, loading: ShowcaseLoading});
const Bottles = dynamic(() => import("./bottle-showcase-page").then((module) => module.BottleShowcasePage), {ssr: false, loading: ShowcaseLoading});
function ShowcaseLoading() {
  const t = useTranslations("YogurtHub");
  return <div className="showcase-loading" role="status"><Image src="/logo/sofin-logo.webp" alt="" width={76} height={76} priority /><p>{t("loading")}</p><span aria-hidden="true" /></div>;
}
type Mode = "cups" | "bottles";

class ShowcaseBoundary extends Component<{children: ReactNode; fallback: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() {return {failed: true};}
  render() {return this.state.failed ? this.props.fallback : this.props.children;}
}

export function YogurtsHubPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("YogurtHub");
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const mode: Mode = params.get("showcase") === "bottles" ? "bottles" : "cups";
  const immersive = params.get("view") !== "static" && !reducedMotion;
  const [ready, setReady] = useState(false);
  useEffect(() => {setReady(true);}, []);
  const products = listedProducts.filter((item) => item.category === "yogurt" && (mode === "cups" ? item.netWeight === "120 g" : item.netWeight !== "120 g"));
  function navigate(nextMode: Mode, interactive = immersive) {
    const next = new URLSearchParams(params.toString());
    if (nextMode === "bottles") next.set("showcase", "bottles"); else next.delete("showcase");
    if (interactive) next.delete("view"); else next.set("view", "static");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, {scroll: false});
  }
  const modePicker = <div className="yogurt-mode-picker" role="group" aria-label={t("format")}>
    {(["cups", "bottles"] as const).map((item) => <button type="button" key={item} aria-pressed={mode === item} onClick={() => navigate(item)}>{t(item)}</button>)}
  </div>;
  const fallback = <div className="showcase-fallback"><h1>{t("fallbackTitle")}</h1><p>{t("fallbackCopy")}</p><button className="button-primary" type="button" onClick={() => navigate(mode, false)}>{t("back")}</button></div>;
  if (!ready && params.get("view") !== "static") return <ShowcaseLoading />;
  if (ready && immersive) return <div className="immersive-hub">
    <div className="immersive-mode-bar">{modePicker}
    <button className="button-secondary immersive-exit" type="button" onClick={() => navigate(mode, false)}><ArrowLeft size={18} aria-hidden="true" /><span>{t("catalog")}</span></button></div>
    <ShowcaseBoundary key={mode} fallback={fallback}>{mode === "cups" ? <Cups /> : <Bottles />}</ShowcaseBoundary>
  </div>;

  return (
    <main className={`yogurt-hub page-content yogurt-hub-${mode}`}>
      <div className="content-container">
        <div className="yogurt-topline"><span className="eyebrow">SOFIN / {t("eyebrow")}</span>{modePicker}</div>
        <section className="yogurt-hero-layout">
          <div className="yogurt-hero-copy">
            <h1>{t(`${mode}Title`)}</h1>
            <p>{t(`${mode}Description`)}</p>
            <div className="yogurt-hero-actions">
              <a className="button-primary" href="#yogurt-flavors">{t("choose")}<ArrowDown size={18} aria-hidden="true" /></a>
              {!reducedMotion && <button type="button" className="button-secondary" onClick={() => navigate(mode, true)}><Play size={16} aria-hidden="true" />{t("animate")}</button>}
            </div>
            <p className="yogurt-format-note">{mode === "cups" ? "120 " : "270 "}{locale === "ru" ? "г" : "g"} · {t("flavorCount", {count: products.length})}</p>
          </div>
          <div className="yogurt-hero-image">
            <Image src={`/images/optimized/${mode}-desktop.webp`} alt="" fill priority sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
            <div className={`yogurt-packshots yogurt-packshots-${mode}`} role="img" aria-label={t(`${mode}Image`)}>{[products[1], products[0], products[2]].filter(Boolean).map((product, index) => <div className={`yogurt-packshot yogurt-packshot-${index}`} key={product.slug}><Image src={(productImages as Record<string, string>)[product.slug]} alt="" fill priority sizes="(min-width: 1024px) 260px, 38vw" className="object-contain" /></div>)}</div>
          </div>
        </section>
        <section className="yogurt-flavors" id="yogurt-flavors">
          <div className="section-heading"><div><span className="eyebrow">{t("eyebrow")}</span><h2>{t("flavorsTitle")}</h2></div><Link className="text-button" href={`/${locale}/products?category=yogurt`}>{t("catalog")}<ArrowRight size={18} aria-hidden="true" /></Link></div>
          <div className="catalog-grid">{products.map((product) => <ProductCard key={product.slug} product={product} locale={locale} heading="h3" />)}</div>
        </section>
      </div>
    </main>
  );
}
