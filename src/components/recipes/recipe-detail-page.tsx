"use client";

import {useLocale, useTranslations} from "next-intl";
import Image from "@/components/shared/adaptive-image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft, Clock3, Flame} from "lucide-react";
import {assetUrl} from "@/lib/assets";
import {recipes} from "./recipes-data";

export default function RecipeDetailPage({slug}: {slug: string}) {
  const t = useTranslations("RecipesPage");
  const locale = useLocale() as "uz" | "ru" | "en";
  const recipe = recipes.find(item => item.slug === slug);
  if (!recipe) notFound();
  const nutrition = [{label: t("detail.nutrition.calories"), value: `${recipe.calories} ${locale === "ru" ? "ккал" : "kcal"}`}, {label: t("detail.nutrition.protein"), value: recipe.protein}, {label: t("detail.nutrition.fat"), value: recipe.fat}, {label: t("detail.nutrition.carbs"), value: recipe.carbs}];
  return <main className="recipe-page page-content"><div className="content-container">
    <Link href={`/${locale}/recipes`} className="text-button recipe-back"><ArrowLeft size={18} aria-hidden="true" />{t("detail.back")}</Link>
    <div className="recipe-detail-layout">
      <header className="recipe-heading"><h1 className="page-title">{recipe.title[locale]}</h1><p className="page-intro">{recipe.description[locale]}</p><div className="recipe-card-meta"><span><Clock3 size={18} aria-hidden="true" />{recipe.prepTime[locale]}</span><span><Flame size={18} aria-hidden="true" />{recipe.calories} {locale === "ru" ? "ккал" : "kcal"}</span></div><p className="recipe-servings">{t("detail.servings")}: {recipe.servings[locale]} · {t("detail.totalWeight")}: {recipe.totalWeight[locale]}</p></header>
      <div className="recipe-cover"><Image src={assetUrl(recipe.image)} alt={recipe.title[locale]} fill priority sizes="(min-width: 1024px) 600px, 90vw" className="object-cover" /></div>
      <section className="recipe-ingredients product-info-panel"><h2>{t("detail.ingredients")}</h2><dl className="recipe-ingredient-list">{recipe.ingredients[locale].map(item => <div key={`${item.name}-${item.amount}`}><dt>{item.name}</dt><dd>{item.amount}</dd></div>)}</dl><dl className="recipe-nutrition">{nutrition.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></section>
      <section className="recipe-steps product-info-panel"><h2>{t("detail.steps")}</h2><ol>{recipe.steps[locale].map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span><p>{step}</p></li>)}</ol></section>
    </div>
  </div></main>;
}
