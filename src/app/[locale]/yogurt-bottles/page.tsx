import {redirect} from "next/navigation";

export default async function YogurtBottlesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  redirect(`/${locale}/yogurts?showcase=bottles`);
}
