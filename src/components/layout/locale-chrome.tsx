"use client";

import {usePathname} from "next/navigation";
import {SiteHeader} from "@/components/layout/site-header";
import {SiteFooter} from "@/components/layout/site-footer";
import {BackToTop} from "@/components/shared/back-to-top";
import {Preloader} from "@/components/home/sections/preloader";

export default function LocaleChrome({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isYogurtsPage = pathname === "/yogurts" || pathname.endsWith("/yogurts");
  const isShowcasePage =
    pathname === "/showcase" ||
    pathname.endsWith("/showcase") ||
    isYogurtsPage;

  if (isShowcasePage) {
    return (
      <>
        <SiteHeader />
        {children}
        {isYogurtsPage ? <SiteFooter /> : null}
      </>
    );
  }

  return (
    <>
      <Preloader />
      <SiteHeader />
      {children}
      <SiteFooter />
      <BackToTop />
    </>
  );
}
