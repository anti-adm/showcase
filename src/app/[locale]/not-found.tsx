import {getLocale} from "next-intl/server";
import {NotFoundView} from "@/components/shared/not-found-view";

export default async function LocaleNotFound() {
  const locale = await getLocale();

  return <NotFoundView locale={locale} />;
}
