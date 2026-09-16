import {pageMetadata} from "@/lib/metadata";
import ContactsPage from "@/components/contacts/contacts-page";

export default function Page() {
  return <ContactsPage />;
}
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return pageMetadata(locale, "contacts");
}
