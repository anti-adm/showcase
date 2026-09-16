import {detailMetadata} from "@/lib/metadata";
import {notFound} from "next/navigation";
import {recipes} from "@/components/recipes/recipes-data";
import RecipeDetailPage from "@/components/recipes/recipe-detail-page";

export default async function RecipeSlugPage({
  params
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  if (!recipes.some((item) => item.slug === slug)) notFound();

  return <RecipeDetailPage slug={slug} />;
}
export async function generateMetadata({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  const item = recipes.find(item => item.slug === slug);
  if (!item) notFound();
  return detailMetadata(locale, "/recipes/" + slug, item.title, item.description);
}
