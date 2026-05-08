import ProductDetailPage from "@/components/products/product-detail-page";

export default async function ProductRoute({
  params
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return <ProductDetailPage slug={slug} />;
}