import HeroStory from "@/components/home/sections/hero-story";
import {HomeScrollShowcase} from "@/components/home/home-scroll-showcase";
import {products} from "@/components/products/products-data";
import {recipes} from "@/components/recipes/recipes-data";

type Locale = "uz" | "ru" | "en";

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale: rawLocale} = await params;
  const locale = normalizeLocale(rawLocale);
  const featuredProducts = products.slice(0, 6);
  const featuredRecipes = recipes;

  return (
    <>
      <HeroStory />
      <HomeScrollShowcase
        locale={locale}
        products={featuredProducts}
        recipes={featuredRecipes}
      />
    </>
  );
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}
