import {detailMetadata} from "@/lib/metadata";
import {notFound} from "next/navigation";
import {listedProducts} from "@/components/products/products-data";
import ProductDetailPage from "@/components/products/product-detail-page";

export default async function ProductRoute({
  params
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  if (!listedProducts.some((item) => item.slug === slug)) notFound();

  return <ProductDetailPage slug={slug} />;
}
export async function generateMetadata({params}: {params: Promise<{locale: string; slug: string}>}) {
  const {locale, slug} = await params;
  const item = listedProducts.find(item => item.slug === slug);
  if (!item) notFound();
  return detailMetadata(locale, "/products/" + slug, item.title, item.subtitle);
}
