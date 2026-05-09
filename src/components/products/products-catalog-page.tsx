"use client";

import {useMemo, useState} from "react";
import {motion} from "framer-motion";
import {ArrowRight, Sparkles} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  getProductImage,
  products,
  type ProductCategory,
  type ProductItem
} from "./products-data";

type Locale = "uz" | "ru" | "en";

type ProductCardProps = {
  locale: Locale;
  product: ProductItem;
  index: number;
};

const categoryOrder: ProductCategory[] = [
  "all",
  "milk",
  "kefir",
  "yogurt",
  "ayran",
  "qatiq",
  "cream",
  "tvorog",
  "cheese"
];

const cardVariants = {
  hidden: {opacity: 0, y: 26, filter: "blur(12px)"},
  visible: {opacity: 1, y: 0, filter: "blur(0px)"}
};

function ProductCard({locale, product, index}: ProductCardProps) {
  const image = getProductImage(product);

  return (
    <motion.article
      variants={cardVariants}
      transition={{
        duration: 0.56,
        delay: Math.min(index * 0.025, 0.18),
        ease: [0.22, 1, 0.36, 1]
      }}
      className="h-full"
    >
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="group relative flex h-full min-h-[242px] flex-col overflow-hidden rounded-[22px] border border-white/50 bg-white/34 p-2 shadow-[0_18px_54px_rgba(44,78,120,0.08)] backdrop-blur-[14px] transition duration-500 hover:-translate-y-1 hover:bg-white/46 hover:shadow-[0_24px_70px_rgba(44,78,120,0.13)] sm:min-h-[305px] sm:rounded-[24px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.9),transparent_34%),radial-gradient(circle_at_92%_0%,rgba(255,225,188,0.34),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.34),transparent_54%)]" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70" />

        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(228,237,248,0.50))] sm:rounded-[22px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.85),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(205,183,153,0.16),transparent_38%)]" />
          <div className="relative aspect-[4/5] w-full max-w-[174px] transition duration-700 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.035] sm:max-w-[210px]">
            <Image
              src={image}
              alt={product.title[locale]}
              fill
              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 44vw"
              className="scale-[1.12] rounded-[18px] object-cover drop-shadow-[0_22px_24px_rgba(44,78,120,0.12)] transition duration-700 ease-out group-hover:scale-[1.18]"
              priority={index < 4}
            />
          </div>
        </div>

        <div className="relative mt-2 rounded-[18px] border border-white/48 bg-white/48 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl sm:rounded-[20px] sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
            <span className="rounded-full bg-[#2b211c]/[0.06] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#6f6257] sm:px-3 sm:text-[10px] sm:tracking-[0.22em]">
              SOFIN
            </span>
            <span className="truncate text-[10px] font-medium text-[#8b7b6d] sm:text-xs">{product.weight[locale]}</span>
          </div>

          <h2 className="line-clamp-2 min-h-[2.35rem] text-[13px] font-semibold leading-[1.3] tracking-[-0.03em] text-slate-900 sm:min-h-[2.45rem] sm:text-[14px] sm:leading-[1.32]">
            {product.title[locale]}
          </h2>
          <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-600 sm:text-xs sm:leading-5">
            {product.subtitle[locale]}
          </p>

          <div className="mt-3 flex items-center justify-between sm:mt-4">
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-[#9a8978] sm:text-xs sm:tracking-[0.2em]">
              {product.fatPercent ?? product.netWeight ?? product.badge}
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-[var(--brand-primary)] text-white shadow-[0_14px_28px_rgba(12,58,106,0.16)] transition duration-300 group-hover:translate-x-1 sm:h-9 sm:w-9">
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
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_50%,#d1dcea_100%)]" />
      <div className="absolute inset-0 -z-20 hidden sm:block">
        <Image
          src="/images/products.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-40"
        />
      </div>
      <div className="absolute inset-0 -z-20 sm:hidden">
        <Image
          src="/images/products-m.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-36"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(237,244,252,0.28)_0%,rgba(218,231,246,0.42)_52%,rgba(207,222,239,0.56)_100%)] backdrop-blur-[4px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_4%,rgba(255,255,255,0.5),transparent_30%),radial-gradient(circle_at_88%_2%,rgba(192,218,255,0.2),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(44,78,120,0.08),transparent_42%)]" />

      <section className="mx-auto max-w-[1580px] px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 24, filter: "blur(10px)"}}
          animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
          transition={{duration: 0.72, ease: [0.22, 1, 0.36, 1]}}
          className="rounded-[36px] border border-white/35 bg-white/[0.10] p-4 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[12px] sm:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-[1010px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/58 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6d5d50] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Sparkles className="h-3.5 w-3.5 text-[#4b3d34]" />
              {t("eyebrow")}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.055em] text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            {t("description") ? (
              <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-slate-700 lg:text-lg">
                {t("description")}
              </p>
            ) : null}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {transition: {staggerChildren: 0.035, delayChildren: 0.12}}
              }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              {categories.map((category) => {
                const active = activeCategory === category.key;

                return (
                  <motion.button
                    key={category.key}
                    variants={cardVariants}
                    transition={{duration: 0.42, ease: [0.22, 1, 0.36, 1]}}
                    type="button"
                    onClick={() => setActiveCategory(category.key)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-300 sm:px-5 ${
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-[0_16px_34px_rgba(12,58,106,0.16)]"
                        : "border-white/45 bg-white/48 text-slate-700 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[var(--brand-primary)]"
                    }`}
                  >
                    {category.label}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {transition: {staggerChildren: 0.035, delayChildren: 0.08}}
            }}
            className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.slug}
                index={index}
                locale={locale}
                product={product}
              />
            ))}
          </motion.div>

          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{opacity: 0, y: 18}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.45}}
              className="mt-10 rounded-[24px] border border-white/48 bg-white/48 px-6 py-10 text-center text-[#66594e]"
            >
              {t("empty")}
            </motion.div>
          ) : null}
        </motion.div>
      </section>
    </main>
  );
}
