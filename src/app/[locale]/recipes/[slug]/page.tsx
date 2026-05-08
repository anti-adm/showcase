import RecipeDetailPage from "@/components/recipes/recipe-detail-page";

export default async function RecipeSlugPage({
  params
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return <RecipeDetailPage slug={slug} />;
}