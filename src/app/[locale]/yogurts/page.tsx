import {pageMetadata} from "@/lib/metadata";
import {YogurtsHubPage} from "@/components/yogurts/yogurts-hub-page";

export default function YogurtsPage() {
  return <YogurtsHubPage />;
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "yogurts");
}
