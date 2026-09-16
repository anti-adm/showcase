import {pageMetadata} from "@/lib/metadata";
import ProductsCatalogPage from "@/components/products/products-catalog-page";

export default function ProductsRoute() {
  return <ProductsCatalogPage />;
}
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "products");
}
