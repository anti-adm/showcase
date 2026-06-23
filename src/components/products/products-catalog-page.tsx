"use client";

import {useMemo, useState} from "react";
import {motion, useReducedMotion} from "framer-motion";
import {ArrowRight, Sparkles} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {assetUrl} from "@/lib/assets";
import {
  getProductImage,
  listedProducts,
  type ProductCategory,
  type ProductItem
} from "./products-data";
import {getProductDisplayTitle} from "./product-title";

type Locale = "uz" | "ru" | "en";

type ProductCardProps = {
  locale: Locale;
  product: ProductItem;
  index: number;
  reducedMotion: boolean;
};

const categoryOrder: ProductCategory[] = [
  "all",
  "milk",
  "kefir",
  "yogurt",
  "qatiq",
  "cream",
  "tvorog",
  "cheese"
];

const cardVariants = {
  hidden: {opacity: 0, y: 18},
  visible: {opacity: 1, y: 0}
};

function getProductMeasure(product: ProductItem, locale: Locale) {
  return product.netWeight ?? product.weight[locale].replace(/^[^:]+:\s*/, "");
}

function ProductCard({locale, product, index, reducedMotion}: ProductCardProps) {
  const image = getProductImage(product);
  const title = getProductDisplayTitle(product.title[locale]);
  const measure = getProductMeasure(product, locale);

  return (
    <motion.article
      variants={cardVariants}
      initial={reducedMotion ? false : "hidden"}
      whileInView={reducedMotion ? undefined : "visible"}
      viewport={{once: true, amount: 0.14, margin: "60px 0px"}}
      transition={{
        duration: reducedMotion ? 0 : 0.5,
        delay: reducedMotion ? 0 : Math.min((index % 10) * 0.022, 0.15),
        ease: [0.22, 1, 0.36, 1]
      }}
      className="product-card-shell h-full"
    >
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group relative flex h-full min-h-[252px] flex-col overflow-hidden rounded-[22px] border border-white/60 bg-white/38 p-2 shadow-[0_18px_54px_rgba(44,78,120,0.09)] transition-[background-color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white/90 hover:bg-white/54 hover:shadow-[0_24px_70px_rgba(44,78,120,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:min-h-[315px] sm:rounded-[24px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_92%_0%,rgba(255,225,188,0.30),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.36),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/76" />

        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[18px] border border-white/70 bg-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] sm:rounded-[22px]">
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-white/80 bg-white/88 px-2.5 py-1 text-[9px] font-semibold tracking-[0.12em] text-slate-600 shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
            {measure}
          </span>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.96),transparent_34%)]" />
          <div className="relative aspect-[4/5] w-full max-w-[168px] overflow-hidden rounded-[16px] bg-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.035] sm:max-w-[210px] sm:rounded-[18px]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 19vw, (min-width: 768px) 28vw, 45vw"
              className="scale-[1.06] object-contain p-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.11] sm:p-2"
              priority={index < 4}
            />
          </div>
        </div>

        <div className="relative mt-2 flex min-h-[118px] flex-col rounded-[18px] border border-white/58 bg-white/58 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.80)] sm:min-h-[132px] sm:rounded-[20px] sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
            <span className="rounded-full bg-[#2b211c]/[0.06] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#6f6257] sm:px-3 sm:text-[10px] sm:tracking-[0.22em]">
              SOFIN
            </span>
            {product.fatPercent ? (
              <span className="shrink-0 rounded-full bg-[#eef5ef] px-2 py-1 text-[9px] font-semibold text-[#47735b] sm:text-[10px]">
                {product.fatPercent}
              </span>
            ) : null}
          </div>

          <h2 className="line-clamp-2 min-h-[2.35rem] text-[13px] font-semibold leading-[1.3] text-slate-950 sm:min-h-[2.45rem] sm:text-[14px] sm:leading-[1.32]">
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-600 sm:text-xs sm:leading-5">
            {product.subtitle[locale]}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-[#9a8978] sm:text-xs sm:tracking-[0.2em]">
              {product.badge}
            </span>
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/70 bg-[var(--brand-primary)] text-white shadow-[0_14px_28px_rgba(12,58,106,0.16)] transition-transform duration-300 group-hover:translate-x-1 sm:h-9 sm:w-9">
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ProductsCatalogPage() {
  const t = useTranslations("ProductsCatalogPage");
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const reducedMotion = useReducedMotion() ?? false;

  const categories = useMemo(
    () =>
      categoryOrder.map((key) => ({
        key,
        label: t(`filters.${key}`)
      })),
    [t]
  );

  const filteredProducts = useMemo(
    () =>
      activeCategory === "all"
        ? listedProducts
        : listedProducts.filter((product) => product.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="relative overflow-x-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_50%,#d1dcea_100%)]" />
      <div className="absolute inset-0 -z-20 hidden sm:block">
        <Image
          src={assetUrl("/images/products.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-38"
        />
      </div>
      <div className="absolute inset-0 -z-20 sm:hidden">
        <Image
          src={assetUrl("/images/products-m.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-34"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(237,244,252,0.30)_0%,rgba(218,231,246,0.44)_52%,rgba(207,222,239,0.58)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_4%,rgba(255,255,255,0.52),transparent_30%),radial-gradient(circle_at_88%_2%,rgba(192,218,255,0.20),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(44,78,120,0.08),transparent_42%)]" />

      <section className="mx-auto max-w-[1580px] px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : {opacity: 0, y: 18}}
          animate={reducedMotion ? undefined : {opacity: 1, y: 0}}
          transition={{duration: 0.66, ease: [0.22, 1, 0.36, 1]}}
          className="rounded-[36px] border border-white/42 bg-white/[0.18] p-4 shadow-[0_24px_80px_rgba(44,78,120,0.11)] sm:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-[1010px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/62 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6d5d50] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Sparkles className="h-3.5 w-3.5 text-[#4b3d34]" />
              {t("eyebrow")}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            {t("description") ? (
              <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-slate-700 lg:text-lg">
                {t("description")}
              </p>
            ) : null}

            <div className="product-filter-scroll -mx-4 mt-8 flex snap-x items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
              {categories.map((category) => {
                const active = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveCategory(category.key)}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background-color,border-color,color,box-shadow,transform] duration-300 sm:px-5 ${
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-[0_16px_34px_rgba(12,58,106,0.16)]"
                        : "border-white/54 bg-white/58 text-slate-700 hover:-translate-y-0.5 hover:bg-white/76 hover:text-[var(--brand-primary)]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeCategory}
            initial={reducedMotion ? false : {opacity: 0, y: 10}}
            animate={reducedMotion ? undefined : {opacity: 1, y: 0}}
            transition={{duration: 0.36, ease: [0.22, 1, 0.36, 1]}}
            className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={`${product.slug}-${index}`}
                index={index}
                locale={locale}
                product={product}
                reducedMotion={reducedMotion}
              />
            ))}
          </motion.div>

          {filteredProducts.length === 0 ? (
            <motion.div
              initial={reducedMotion ? false : {opacity: 0, y: 14}}
              animate={reducedMotion ? undefined : {opacity: 1, y: 0}}
              transition={{duration: 0.36}}
              className="mt-10 rounded-[24px] border border-white/58 bg-white/58 px-6 py-10 text-center text-[#66594e]"
            >
              {t("empty")}
            </motion.div>
          ) : null}
        </motion.div>
      </section>
    </main>
  );
}
