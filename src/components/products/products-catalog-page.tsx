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
        className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[32px] border border-white/58 bg-[#f8f4ed]/72 p-3 shadow-[0_22px_70px_rgba(65,54,42,0.08)] backdrop-blur-[18px] transition duration-500 hover:-translate-y-1.5 hover:bg-[#fbf7f0]/82 hover:shadow-[0_30px_90px_rgba(65,54,42,0.13)] sm:min-h-[460px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.9),transparent_34%),radial-gradient(circle_at_92%_0%,rgba(255,225,188,0.34),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.34),transparent_54%)]" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70" />

        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(245,238,228,0.62))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.85),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(205,183,153,0.16),transparent_38%)]" />
          <div className="relative aspect-[4/5] w-full max-w-[320px] transition duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.04]">
            <Image
              src={image}
              alt={product.title[locale]}
              fill
              sizes="(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 46vw"
              className="scale-[1.18] object-cover drop-shadow-[0_26px_28px_rgba(67,55,42,0.16)] transition duration-700 ease-out group-hover:scale-[1.26]"
              priority={index < 4}
            />
          </div>
        </div>

        <div className="relative mt-3 rounded-[24px] border border-white/58 bg-white/54 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-full bg-[#2b211c]/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6f6257]">
              SOFIN
            </span>
            <span className="text-xs font-medium text-[#8b7b6d]">{product.weight[locale]}</span>
          </div>

          <h2 className="line-clamp-2 min-h-[3rem] text-[17px] font-semibold leading-6 tracking-[-0.03em] text-[#302823]">
            {product.title[locale]}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#766b61]">
            {product.subtitle[locale]}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#9a8978]">
              {product.fatPercent ?? product.netWeight ?? product.badge}
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-[#2b211c] text-white shadow-[0_14px_28px_rgba(43,33,28,0.18)] transition duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
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
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#f1ece4_0%,#ece5da_48%,#e5ddd1_100%)]" />
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/catolog.png"
          alt=""
          fill
          priority
          className="object-cover opacity-22"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(244,239,230,0.74)_0%,rgba(239,232,220,0.86)_48%,rgba(229,220,207,0.92)_100%)] backdrop-blur-[10px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_4%,rgba(255,255,255,0.66),transparent_30%),radial-gradient(circle_at_88%_2%,rgba(219,198,166,0.28),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(73,55,38,0.08),transparent_42%)]" />

      <section className="mx-auto max-w-[1580px] px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 24, filter: "blur(10px)"}}
          animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
          transition={{duration: 0.72, ease: [0.22, 1, 0.36, 1]}}
          className="rounded-[38px] border border-white/58 bg-white/24 p-4 shadow-[0_28px_90px_rgba(72,58,42,0.08)] backdrop-blur-[22px] sm:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-[1010px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/58 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6d5d50] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Sparkles className="h-3.5 w-3.5 text-[#4b3d34]" />
              {t("eyebrow")}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.055em] text-[#2f2721] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            {t("description") ? (
              <p className="mx-auto mt-5 max-w-[720px] text-base leading-8 text-[#716458] lg:text-lg">
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
                        ? "border-[#2e241f] bg-[#2e241f] text-white shadow-[0_16px_34px_rgba(46,36,31,0.18)]"
                        : "border-white/55 bg-white/52 text-[#66594e] hover:-translate-y-0.5 hover:bg-white/72 hover:text-[#2e241f]"
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
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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
