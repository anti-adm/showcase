import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import LocaleChrome from "@/components/layout/locale-chrome";

import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleChrome>{children}</LocaleChrome>
    </NextIntlClientProvider>
  );
}