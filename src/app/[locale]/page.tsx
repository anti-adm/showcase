import HeroStory from "@/components/home/sections/hero-story";
import {HomeScrollShowcase} from "@/components/home/home-scroll-showcase";
import {listedProducts, type ProductItem} from "@/components/products/products-data";
import {recipes} from "@/components/recipes/recipes-data";

type Locale = "uz" | "ru" | "en";

type Props = {
  params: Promise<{locale: string}>;
};

const FEATURED_PRODUCT_SLUGS = [
  "yogurt-raspberry-270",
  "yogurt-raspberry-120",
  "yogurt-peach-120",
  "yogurt-strawberry-banana-270",
  "qaymaq",
  "tvorog-soft-5"
];

export default async function HomePage({params}: Props) {
  const {locale: rawLocale} = await params;
  const locale = normalizeLocale(rawLocale);
  const featuredProducts: ProductItem[] = FEATURED_PRODUCT_SLUGS.flatMap((slug) => {
    const product = listedProducts.find((item) => item.slug === slug);

    return product ? [product] : [];
  });
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
