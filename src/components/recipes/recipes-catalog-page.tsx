"use client";

import {motion} from "framer-motion";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {ArrowRight, ChefHat, Clock3, Flame, Sparkles} from "lucide-react";
import {assetUrl} from "@/lib/assets";
import {recipes} from "./recipes-data";

const easeCurve = [0.22, 1, 0.36, 1] as const;

export default function RecipesCatalogPage() {
  const t = useTranslations("RecipesPage");
  const locale = useLocale() as "uz" | "ru" | "en";

  return (
    <main className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#dbe5f1_0%,#d4dfec_50%,#ccd9e8_100%)]" />

      <div className="absolute inset-0 -z-20">
        <Image
          src={assetUrl("/images/recipes/recipes-bg.webp")}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-[0.34]"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(219,229,241,0.44)_0%,rgba(212,223,236,0.52)_52%,rgba(204,217,232,0.62)_100%),radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%)] backdrop-blur-[3px]" />

      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[36px] border border-white/35 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[10px] sm:p-7 lg:p-8">
          <motion.div
            initial={{opacity: 0, y: 28, filter: "blur(10px)"}}
            animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
            transition={{duration: 0.8, ease: easeCurve}}
            className="mx-auto max-w-[900px] text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(12,58,106,0.14)] bg-white/72 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("catalog.badge")}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] text-[var(--brand-primary)] drop-shadow-[0_1px_0_rgba(255,255,255,0.55)] sm:text-5xl lg:text-6xl">
              {t("catalog.title")}
            </h1>

            <p className="mx-auto mt-5 max-w-[760px] text-pretty text-base leading-8 text-slate-800 sm:text-lg">
              {t("catalog.description")}
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe, index) => (
              <motion.article
                key={recipe.slug}
                initial={{opacity: 0, y: 34, filter: "blur(10px)"}}
                whileInView={{opacity: 1, y: 0, filter: "blur(0px)"}}
                viewport={{once: true, amount: 0.2}}
                transition={{
                  duration: 0.75,
                  delay: index * 0.04,
                  ease: easeCurve
                }}
                className="group overflow-hidden rounded-[30px] border border-white/40 bg-white/[0.18] shadow-[0_18px_60px_rgba(44,78,120,0.10)] backdrop-blur-[12px]"
              >
                <div className="p-4 sm:p-5">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/78 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--brand-primary)]">
                    <ChefHat className="h-3.5 w-3.5" />
                    {t("catalog.cardBadge")}
                  </div>

                  <div className="relative overflow-hidden rounded-[24px] border border-white/40 bg-white/30">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={assetUrl(recipe.image)}
                        alt={recipe.title[locale]}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 bg-[rgba(12,58,106,0.90)] px-5 py-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-balance text-xl font-semibold leading-8 tracking-[-0.03em]">
                        {recipe.title[locale]}
                      </h2>

                      <p className="mt-2 text-sm text-white/78">
                        {recipe.subtitle[locale]}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/88">
                        <span className="inline-flex items-center gap-1.5">
                          <Flame className="h-4 w-4" />
                          {recipe.calories} kcal
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-4 w-4" />
                          {recipe.prepTime[locale]}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/${locale}/recipes/${recipe.slug}`}
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20"
                      aria-label={recipe.title[locale]}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
