"use client";

import {useMemo} from "react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import {
  ArrowLeft,
  Beef,
  Clock3,
  CookingPot,
  Flame,
  Salad,
  Scale,
  Wheat
} from "lucide-react";
import {assetUrl} from "@/lib/assets";
import {recipes} from "./recipes-data";

const easeCurve = [0.22, 1, 0.36, 1] as const;

export default function RecipeDetailPage({slug}: {slug: string}) {
  const t = useTranslations("RecipesPage");
  const locale = useLocale() as "uz" | "ru" | "en";

  const recipe = useMemo(
    () => recipes.find((item) => item.slug === slug) ?? recipes[0],
    [slug]
  );

  const ingredients = recipe.ingredients[locale];
  const steps = recipe.steps[locale];

  const nutrition = [
    {
      label: t("detail.nutrition.calories"),
      value: `${recipe.calories} kcal`,
      icon: Flame
    },
    {
      label: t("detail.nutrition.protein"),
      value: recipe.protein,
      icon: Beef
    },
    {
      label: t("detail.nutrition.fat"),
      value: recipe.fat,
      icon: Salad
    },
    {
      label: t("detail.nutrition.carbs"),
      value: recipe.carbs,
      icon: Wheat
    },
    {
      label: t("detail.nutrition.weight"),
      value: recipe.totalWeight[locale],
      icon: Scale
    },
    {
      label: t("detail.nutrition.time"),
      value: recipe.prepTime[locale],
      icon: Clock3
    }
  ];

  return (
    <main className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#dbe5f1_0%,#d4dfec_52%,#ccd9e8_100%)]" />

      <div className="absolute inset-0 -z-20">
        <Image
          src={assetUrl("/images/recipes/recipes-bg.webp")}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-[0.34]"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(219,229,241,0.42)_0%,rgba(212,223,236,0.50)_52%,rgba(204,217,232,0.60)_100%),radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_40%)] backdrop-blur-[3px]" />

      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[36px] border border-white/38 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[10px] sm:p-7 lg:p-8">
          <motion.div
            initial={{opacity: 0, y: 28, filter: "blur(10px)"}}
            animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
            transition={{duration: 0.8, ease: easeCurve}}
            className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-700"
          >
            <Link
              href={`/${locale}/recipes`}
              className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/78 px-4 py-2 text-[var(--brand-primary)] shadow-[0_8px_24px_rgba(10,32,71,0.05)] transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("detail.back")}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
            <motion.div
              initial={{opacity: 0, y: 34, filter: "blur(10px)"}}
              animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
              transition={{duration: 0.8, delay: 0.05, ease: easeCurve}}
              className="rounded-[32px] border border-white/42 bg-white/[0.20] p-5 shadow-[0_20px_60px_rgba(44,78,120,0.10)] backdrop-blur-[12px]"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-white/45 bg-white/72 shadow-[0_14px_34px_rgba(10,32,71,0.08)]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={assetUrl(recipe.image)}
                    alt={recipe.title[locale]}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_45%,rgba(10,32,71,0.06)_100%)]" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {nutrition.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/45 bg-white/76 p-4 shadow-[0_8px_22px_rgba(10,32,71,0.05)]"
                    >
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(12,58,106,0.08)] text-[var(--brand-primary)]">
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      <div className="mt-3 text-sm text-slate-500">
                        {item.label}
                      </div>
                      <div className="mt-1 text-lg font-semibold text-[var(--brand-primary)]">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.section
                initial={{opacity: 0, y: 34, filter: "blur(10px)"}}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                transition={{duration: 0.8, delay: 0.1, ease: easeCurve}}
                className="rounded-[32px] border border-white/42 bg-white/[0.20] p-6 shadow-[0_20px_60px_rgba(44,78,120,0.10)] backdrop-blur-[12px] sm:p-7"
              >
                <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
                  {recipe.title[locale]}
                </h1>

                <p className="mt-3 text-sm uppercase tracking-[0.22em] text-slate-500 sm:text-base">
                  {recipe.subtitle[locale]}
                </p>

                <p className="mt-6 max-w-[760px] text-pretty text-base leading-8 text-slate-800 sm:text-lg">
                  {recipe.description[locale]}
                </p>

                <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-800">
                  <div className="rounded-full border border-white/42 bg-white/82 px-4 py-2 shadow-[0_6px_18px_rgba(10,32,71,0.04)]">
                    {t("detail.servings")}: {recipe.servings[locale]}
                  </div>
                  <div className="rounded-full border border-white/42 bg-white/82 px-4 py-2 shadow-[0_6px_18px_rgba(10,32,71,0.04)]">
                    {t("detail.totalWeight")}: {recipe.totalWeight[locale]}
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{opacity: 0, y: 34, filter: "blur(10px)"}}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                transition={{duration: 0.8, delay: 0.16, ease: easeCurve}}
                className="rounded-[32px] border border-white/42 bg-white/[0.20] p-6 shadow-[0_20px_60px_rgba(44,78,120,0.10)] backdrop-blur-[12px] sm:p-7"
              >
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)] sm:text-4xl">
                  {t("detail.ingredients")}
                </h2>

                <div className="mt-6 space-y-3">
                  {ingredients.map((item) => (
                    <div
                      key={`${item.name}-${item.amount}`}
                      className="flex items-end gap-3 text-[15px] text-slate-800 sm:text-base"
                    >
                      <span className="shrink-0">{item.name}</span>
                      <span className="flex-1 border-b border-dotted border-slate-400/70" />
                      <span className="shrink-0 font-medium text-[var(--brand-primary)]">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{opacity: 0, y: 34, filter: "blur(10px)"}}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                transition={{duration: 0.8, delay: 0.22, ease: easeCurve}}
                className="rounded-[32px] border border-white/42 bg-white/[0.20] p-6 shadow-[0_20px_60px_rgba(44,78,120,0.10)] backdrop-blur-[12px] sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/82 text-[var(--brand-primary)] shadow-[0_8px_20px_rgba(10,32,71,0.05)]">
                    <CookingPot className="h-5 w-5" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)] sm:text-4xl">
                    {t("detail.steps")}
                  </h2>
                </div>

                <div className="mt-6 space-y-5">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className="grid grid-cols-[56px_1fr] gap-4 rounded-[24px] border border-white/42 bg-white/72 p-4 shadow-[0_10px_24px_rgba(10,32,71,0.05)] sm:grid-cols-[72px_1fr] sm:p-5"
                    >
                      <div className="text-center text-4xl font-semibold leading-none tracking-[-0.06em] text-[var(--brand-primary)] sm:text-5xl">
                        {index + 1}
                      </div>
                      <p className="text-[15px] leading-8 text-slate-800 sm:text-base">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
