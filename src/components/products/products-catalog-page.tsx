"use client";

import {ArrowRight, Search, SlidersHorizontal, X} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useSearchParams} from "next/navigation";
import {useState} from "react";
import Image from "@/components/shared/adaptive-image";
import Link from "next/link";
import {formatMeasure} from "@/lib/product-format";
import {getProductImage, listedProducts, type ProductCategory, type ProductItem} from "./products-data";
import {getProductDisplayTitle} from "./product-title";
import productImages from "@/data/product-images.json";

export type Locale = "uz" | "ru" | "en";
const categoryOrder: ProductCategory[] = ["all", "kefir", "ayran", "yogurt", "qatiq", "cream", "tvorog", "cheese"];

export function ProductCard({product, locale, priority = false, heading = "h2"}: {
  product: ProductItem; locale: Locale; priority?: boolean; heading?: "h2" | "h3";
}) {
  const title = getProductDisplayTitle(product.title[locale]);
  const measure = formatMeasure(product.netWeight ?? product.weight[locale].replace(/^[^:]+:\s*/, ""), locale);
  const image = (productImages as Record<string, string>)[product.slug] ?? getProductImage(product);
  const Heading = heading;
  return (
    <article className="product-card-shell catalog-card">
      <Link href={`/${locale}/products/${product.slug}`} className="catalog-card-link">
        <div className="catalog-card-image">
          <Image src={image} alt={title} fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, (min-width: 360px) 46vw, 90vw" priority={priority} className="object-contain" />
        </div>
        <div className="catalog-card-copy">
          <div className="catalog-card-meta"><span>{measure}</span>{product.fatPercent && <span>{product.fatPercent}</span>}</div>
          <Heading>{title}</Heading>
          <p>{product.subtitle[locale]}</p>
          <span className="catalog-card-action">{locale === "ru" ? "Подробнее" : locale === "en" ? "View product" : "Batafsil"}<ArrowRight size={18} aria-hidden="true" /></span>
        </div>
      </Link>
    </article>
  );
}

export default function ProductsCatalogPage() {
  const t = useTranslations("ProductsCatalogPage");
  const ui = useTranslations("CatalogExtras");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") as ProductCategory;
  const activeCategory = categoryOrder.includes(category) ? category : "all";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filtered = listedProducts.filter((product) =>
    (activeCategory === "all" || product.category === activeCategory) &&
    `${product.title[locale]} ${product.subtitle[locale]} ${product.netWeight ?? ""}`.toLocaleLowerCase(locale).includes(normalizedQuery)
  );
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || (key === "category" && value === "all")) next.delete(key); else next.set(key, value);
    window.history.replaceState(null, "", `${pathname}${next.size ? `?${next}` : ""}`);
  }
  function reset() {
    const next = new URLSearchParams(params.toString()); next.delete("category"); next.delete("q");
    window.history.replaceState(null, "", `${pathname}${next.size ? `?${next}` : ""}`);
  }
  return (
    <main className="catalog-page page-content">
      <div className="content-container">
        <div className="catalog-heading">
          <span className="eyebrow">SOFIN / {t("eyebrow")}</span>
          <h1 className="page-title">{t("title")}</h1>
          <p className="page-intro">{ui("intro")}</p>
        </div>
        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search size={20} aria-hidden="true" />
            <span className="sr-only">{ui("search")}</span>
            <input type="search" value={query} onChange={(e) => update("q", e.target.value)} placeholder={ui("search")} maxLength={120} />
          </label>
          <button className="button-secondary catalog-filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(!filtersOpen)} type="button">
            <SlidersHorizontal size={18} aria-hidden="true" />{ui("filters")}
          </button>
        </div>
        <div id="catalog-filters" className={`catalog-filters ${filtersOpen ? "is-open" : ""}`}>
          {categoryOrder.map((key) => <button key={key} type="button" aria-pressed={key === activeCategory} className="filter-chip" onClick={() => {update("category", key); setFiltersOpen(false);}}>{t(`filters.${key}`)}</button>)}
        </div>
        <div className="catalog-results-line">
          <p role="status" aria-live="polite" aria-atomic="true">{ui("count", {count: filtered.length})}</p>
          {(query || activeCategory !== "all") && <button type="button" onClick={reset} className="text-button"><X size={16} aria-hidden="true" />{ui("reset")}</button>}
        </div>
        {filtered.length ? <div className="catalog-grid">{filtered.map((product, index) => <ProductCard key={product.slug} product={product} locale={locale} priority={index < 4} />)}</div> :
          <div className="catalog-empty"><Search size={32} aria-hidden="true" /><h2>{ui("emptyTitle")}</h2><p>{ui("emptyDescription")}</p><button type="button" className="button-primary" onClick={reset}>{ui("reset")}</button></div>}
      </div>
    </main>
  );
}
