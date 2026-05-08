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
  const isShowcasePage =
    pathname === "/showcase" ||
    pathname.endsWith("/showcase") ||
    pathname === "/yogurts" ||
    pathname.endsWith("/yogurts");

  if (isShowcasePage) {
    return (
      <>
        <SiteHeader />
        {children}
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
