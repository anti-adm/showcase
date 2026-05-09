"use client";

import {useRef} from "react";
import {motion, useScroll, useTransform} from "framer-motion";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {getProductImage, type ProductItem} from "@/components/products/products-data";
import type {RecipeItem} from "@/components/recipes/recipes-data";

type Locale = "uz" | "ru" | "en";

type HomeScrollShowcaseProps = {
  locale: Locale;
  products: ProductItem[];
  recipes: RecipeItem[];
};

export function HomeScrollShowcase({
  locale,
  products,
  recipes
}: HomeScrollShowcaseProps) {
  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_48%,#d1dcea_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.58),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(185,214,255,0.22),transparent_34%)]" />

      <PinnedProductCarousel locale={locale} products={products} />
      <PinnedRecipeCarousel locale={locale} recipes={recipes} />
    </main>
  );
}

function PinnedProductCarousel({
  locale,
  products
}: {
  locale: Locale;
  products: ProductItem[];
}) {
  const ref = useRef<HTMLElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const x = useTransform(
    scrollYProgress,
    [0.14, 0.88],
    ["0vw", `${-Math.max(0, products.length - 3) * 26}vw`]
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={{height: `calc(${Math.max(products.length, 5)} * 72svh)`}}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto mb-8 w-full max-w-[1480px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-slate-600">
            SOFIN / Products
          </p>
          <h2 className="mx-auto mt-3 max-w-[920px] text-balance text-4xl font-semibold leading-[0.96] tracking-[-0.055em] text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
            Продукты SOFIN для спокойного ежедневного выбора
          </h2>
        </div>

        <motion.div
          className="flex gap-5 will-change-transform lg:gap-7"
          style={{x}}
        >
          {products.map((product, index) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group relative h-[min(62vh,620px)] w-[min(78vw,420px)] shrink-0 overflow-hidden rounded-[16px] shadow-[0_28px_80px_rgba(38,30,24,0.18)] transition duration-500 hover:-translate-y-2 sm:w-[min(44vw,430px)] lg:w-[min(31vw,440px)]"
            >
              <Image
                src={getProductImage(product, index)}
                alt={product.title[locale]}
                fill
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 44vw, 78vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,28,44,0.68),rgba(16,28,44,0.18)_52%,rgba(16,28,44,0.04)),linear-gradient(180deg,transparent_40%,rgba(23,77,158,0.68))]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/78">
                  {String(index + 1).padStart(2, "0")} / SOFIN
                </p>
                <h3 className="max-w-[92%] text-[clamp(1.45rem,2.6vw,2.35rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]">
                  {product.title[locale]}
                </h3>
                <p className="mt-4 line-clamp-2 max-w-[86%] text-sm font-medium leading-relaxed text-white/88">
                  {product.subtitle[locale]}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PinnedRecipeCarousel({
  locale,
  recipes
}: {
  locale: Locale;
  recipes: RecipeItem[];
}) {
  const ref = useRef<HTMLElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const x = useTransform(
    scrollYProgress,
    [0.12, 0.86],
    ["0vw", `${-Math.max(0, recipes.length - 3) * 26}vw`]
  );

  return (
    <section
      ref={ref}
      className="relative"
      style={{height: `calc(${Math.max(recipes.length, 4)} * 72svh)`}}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto mb-8 w-full max-w-[1480px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-slate-600">
            SOFIN / Recipes
          </p>
          <h2 className="mx-auto mt-3 max-w-[920px] text-balance text-4xl font-semibold leading-[0.96] tracking-[-0.055em] text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
            Идеи для завтрака, десертов и мягких семейных пауз
          </h2>
        </div>

        <motion.div
          className="flex gap-5 will-change-transform lg:gap-7"
          style={{x}}
        >
          {recipes.map((recipe, index) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="group relative h-[min(62vh,620px)] w-[min(78vw,420px)] shrink-0 overflow-hidden rounded-[16px] shadow-[0_28px_80px_rgba(38,30,24,0.18)] transition duration-500 hover:-translate-y-2 sm:w-[min(44vw,430px)] lg:w-[min(31vw,440px)]"
            >
              <Image
                src={recipe.image}
                alt={recipe.title[locale]}
                fill
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 44vw, 78vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,24,19,0.74),rgba(34,24,19,0.28)_44%,rgba(34,24,19,0.08)),linear-gradient(180deg,transparent_45%,rgba(242,138,39,0.72))]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/78">
                  {String(index + 1).padStart(2, "0")} / {recipe.prepTime[locale]}
                </p>
                <h3 className="max-w-[92%] text-[clamp(1.55rem,3vw,2.45rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]">
                  {recipe.title[locale]}
                </h3>
                <p className="mt-4 line-clamp-2 max-w-[86%] text-sm font-medium leading-relaxed text-white/88">
                  {recipe.subtitle[locale]}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
