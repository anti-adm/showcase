import {pageMetadata} from "@/lib/metadata";
import RecipesCatalogPage from "@/components/recipes/recipes-catalog-page";

export default function RecipesPage() {
  return <RecipesCatalogPage />;
}
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "recipes");
}
