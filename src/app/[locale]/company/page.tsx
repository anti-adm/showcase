import {pageMetadata} from "@/lib/metadata";
import CompanyPage from "@/components/company/company-page";

export default function Page() {
  return <CompanyPage />;
}
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "company");
}
