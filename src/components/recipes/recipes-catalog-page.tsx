"use client";

import {useLocale, useTranslations} from "next-intl";
import Image from "@/components/shared/adaptive-image";
import Link from "next/link";
import {ArrowRight, Clock3, Flame} from "lucide-react";
import {assetUrl} from "@/lib/assets";
import {recipes} from "./recipes-data";

export default function RecipesCatalogPage() {
  const t = useTranslations("RecipesPage");
  const locale = useLocale() as "uz" | "ru" | "en";
  return <main className="recipes-page page-content"><div className="content-container">
    <header><h1 className="page-title">{t("catalog.title")}</h1><p className="page-intro">{t("catalog.description")}</p></header>
    <div className="recipes-grid">{recipes.map((recipe, index) => <article key={recipe.slug}>
      <Link className="recipe-card" href={`/${locale}/recipes/${recipe.slug}`}>
        <div className="recipe-card-image"><Image src={assetUrl(recipe.image)} alt={recipe.title[locale]} fill priority={index < 2} sizes="(min-width: 1100px) 420px, (min-width: 768px) 45vw, 90vw" className="object-cover" /></div>
        <div className="recipe-card-copy"><div className="recipe-card-meta"><span><Clock3 size={16} aria-hidden="true" />{recipe.prepTime[locale]}</span><span><Flame size={16} aria-hidden="true" />{recipe.calories} {locale === "ru" ? "ккал" : "kcal"}</span></div><h2>{recipe.title[locale]}<ArrowRight size={22} aria-hidden="true" /></h2><p>{recipe.subtitle[locale]}</p></div>
      </Link>
    </article>)}</div>
  </div></main>;
}
