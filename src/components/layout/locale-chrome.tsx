"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {MotionConfig} from "framer-motion";
import {useLocale} from "next-intl";
import {SiteHeader} from "@/components/layout/site-header";
import {SiteFooter} from "@/components/layout/site-footer";
import {BackToTop} from "@/components/shared/back-to-top";

export default function LocaleChrome({children}: {children: React.ReactNode}) {
  const locale = useLocale();
  const pathname = usePathname();
  useEffect(() => {document.documentElement.lang = locale;}, [locale]);
  const skip = locale === "ru" ? "Перейти к содержимому" : locale === "en" ? "Skip to content" : "Asosiy mazmunga o'tish";
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">{skip}</a>
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>{children}</div>
      <SiteFooter />
      {!pathname.endsWith("/yogurts") && !pathname.endsWith("/company") && <BackToTop />}
    </MotionConfig>
  );
}
