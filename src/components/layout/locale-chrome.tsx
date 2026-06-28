"use client";

import {usePathname, useSearchParams} from "next/navigation";
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
  const searchParams = useSearchParams();
  const isYogurtsPage = pathname === "/yogurts" || pathname.endsWith("/yogurts");
  const isBottleShowcase = isYogurtsPage && searchParams.get("showcase") === "bottles";
  const isShowcasePage =
    pathname === "/showcase" ||
    pathname.endsWith("/showcase") ||
    isYogurtsPage;

  if (isShowcasePage) {
    return (
      <>
        {isBottleShowcase ? null : <SiteHeader />}
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
