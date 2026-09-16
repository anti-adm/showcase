import type {Metadata, Viewport} from "next";
import {inter, playfair} from "@/lib/fonts";
import {getLocale} from "next-intl/server";
import "./globals.css";


export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL ? {metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)} : {}),
  title: "SOFIN",
  description: "SOFIN — sut mahsulotlari. Yogurt, kefir, tvorog va pishloqlar.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SOFIN"
  },
  icons: {
    icon: "/icons/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eef4fb"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
