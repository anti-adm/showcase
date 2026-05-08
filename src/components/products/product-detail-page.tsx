"use client";

import {useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  Expand,
  Flame,
  Leaf,
  Package2,
  ShieldCheck,
  Wheat,
  X
} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {getProductGallery, products} from "./products-data";

type Locale = "uz" | "ru" | "en";

export default function ProductDetailPage({slug}: {slug: string}) {
  const t = useTranslations("ProductsPage");
  const locale = useLocale() as Locale;

  const product = products.find((item) => item.slug === slug) ?? products[0];

  const gallery = useMemo(
    () =>
      getProductGallery(product).map((src, index) => ({
        src,
        alt:
          index === 0
            ? `${product.title[locale]} 1`
            : `${product.title[locale]} ${index + 1}`
      })),
    [product, locale]
  );

  const [imageState, setImageState] = useState({slug, activeImage: 0});
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage =
    imageState.slug === slug ? Math.min(imageState.activeImage, gallery.length - 1) : 0;

  const nutrition = [
    {
      label: t("product.nutrition.energy"),
      value: product.nutrition.energy,
      icon: Flame
    },
    {
      label: t("product.nutrition.fat"),
      value: product.nutrition.fat,
      icon: Droplets
    },
    {
      label: t("product.nutrition.protein"),
      value: product.nutrition.protein,
      icon: ShieldCheck
    },
    {
      label: t("product.nutrition.carbs"),
      value: product.nutrition.carbs,
      icon: Wheat
    }
  ];

  const detailItems = [
    {
      title: t("product.storage.title"),
      value: product.storageValue[locale],
      icon: Clock3
    },
    {
      title: t("product.packaging.title"),
      value: product.packagingValue[locale],
      icon: Package2
    },
    {
      title: t("product.weight.title"),
      value: product.formatValue[locale],
      icon: Leaf
    }
  ];

  const nextImage = () => {
    setImageState((prev) => ({
      slug,
      activeImage:
        prev.slug === slug ? (prev.activeImage + 1) % gallery.length : 1 % gallery.length
    }));
  };

  const prevImage = () => {
    setImageState((prev) => ({
      slug,
      activeImage:
        prev.slug === slug
          ? (prev.activeImage - 1 + gallery.length) % gallery.length
          : gallery.length - 1
    }));
  };

  return (
    <main className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#f2ece2_0%,#ece4d8_50%,#e4dacd_100%)]" />
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/Carta.png"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(245,239,229,0.8)_0%,rgba(237,228,215,0.9)_52%,rgba(226,216,203,0.94)_100%)] backdrop-blur-[10px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.68),transparent_30%),radial-gradient(circle_at_86%_4%,rgba(229,204,170,0.26),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(68,50,36,0.08),transparent_42%)]" />

      <section className="mx-auto max-w-[1420px] px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#776b60]">
          <Link href={`/${locale}`} className="transition hover:text-[#2e241f]">
            {t("breadcrumbs.home")}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/products`}
            className="transition hover:text-[#2e241f]"
          >
            {t("breadcrumbs.catalog")}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#2e241f]">{product.title[locale]}</span>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.12fr)] lg:gap-10">
          <motion.aside
            initial={{opacity: 0, x: -20, filter: "blur(10px)"}}
            animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
            transition={{duration: 0.68, ease: [0.22, 1, 0.36, 1]}}
            className="lg:sticky lg:top-28"
          >
            <div className="relative overflow-hidden rounded-[38px] border border-white/58 bg-white/26 p-3 shadow-[0_28px_90px_rgba(67,54,39,0.1)] backdrop-blur-[22px] sm:p-4">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.78),transparent_34%),radial-gradient(circle_at_86%_90%,rgba(209,183,148,0.18),transparent_36%)]" />

              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,236,225,0.58))] px-4 py-8 sm:min-h-[520px] lg:min-h-[calc(100vh-220px)] lg:max-h-[720px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(79,60,42,0.12),transparent_36%)]" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={gallery[activeImage].src}
                    initial={{opacity: 0, y: 16, scale: 0.965, filter: "blur(10px)"}}
                    animate={{opacity: 1, y: 0, scale: 1, filter: "blur(0px)"}}
                    exit={{opacity: 0, y: -8, scale: 0.985, filter: "blur(7px)"}}
                    transition={{duration: 0.46, ease: [0.22, 1, 0.36, 1]}}
                    className="relative aspect-square w-full max-w-[620px]"
                  >
                    <Image
                      src={gallery[activeImage].src}
                      alt={gallery[activeImage].alt}
                      fill
                      sizes="(min-width: 1024px) 44vw, 92vw"
                      className="scale-[1.08] object-cover drop-shadow-[0_32px_34px_rgba(67,54,39,0.18)]"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/62 bg-white/68 text-[#2e241f] shadow-[0_14px_30px_rgba(67,54,39,0.1)] backdrop-blur-xl transition hover:bg-white"
                aria-label={t("gallery.open")}
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={prevImage}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/58 bg-white/52 text-[#2e241f] backdrop-blur-xl transition hover:bg-white"
                aria-label={t("gallery.prev")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((item, index) => {
                  const active = index === activeImage;

                  return (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setImageState({slug, activeImage: index})}
                      className={`overflow-hidden rounded-[22px] border p-2 transition duration-300 ${
                        active
                          ? "border-[#2e241f]/28 bg-white/72 shadow-[0_14px_32px_rgba(67,54,39,0.12)]"
                          : "border-white/42 bg-white/36 hover:bg-white/58"
                      }`}
                    >
                      <div className="relative h-[88px] overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(244,236,225,0.56))]">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={nextImage}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/58 bg-white/52 text-[#2e241f] backdrop-blur-xl transition hover:bg-white"
                aria-label={t("gallery.next")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.aside>

          <motion.div
            initial={{opacity: 0, x: 20, filter: "blur(10px)"}}
            animate={{opacity: 1, x: 0, filter: "blur(0px)"}}
            transition={{duration: 0.68, delay: 0.04, ease: [0.22, 1, 0.36, 1]}}
            className="space-y-5"
          >
            <section className="rounded-[36px] border border-white/58 bg-white/34 p-6 shadow-[0_24px_80px_rgba(67,54,39,0.08)] backdrop-blur-[22px] sm:p-8 lg:p-10">
              <div className="mb-4 inline-flex rounded-full border border-white/60 bg-white/58 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6e6258]">
                {t("product.badge")}
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-[#2e241f] sm:text-5xl lg:text-[4rem]">
                {product.title[locale]}
              </h1>

              <p className="mt-4 max-w-[720px] text-sm uppercase tracking-[0.2em] text-[#8b7d70] sm:text-base">
                {product.subtitle[locale]}
              </p>
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {nutrition.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[26px] border border-white/54 bg-white/36 p-5 shadow-[0_16px_44px_rgba(67,54,39,0.06)] backdrop-blur-[18px]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2e241f]/[0.06] text-[#2e241f]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="text-sm text-[#7d7065]">{item.label}</div>
                        <div className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#302823]">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="rounded-[30px] border border-white/54 bg-white/34 p-5 shadow-[0_18px_54px_rgba(67,54,39,0.06)] backdrop-blur-[18px] sm:p-6">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#8a7b6d]">
                {t("product.nutrition.per100g")}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {detailItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="rounded-[22px] bg-white/42 p-4">
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2e241f]/[0.06] text-[#2e241f]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-sm text-[#7d7065]">{item.title}</div>
                      <div className="mt-1 text-lg font-semibold text-[#302823]">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {product.nutrition.extra?.length ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {product.nutrition.extra.map((item) => (
                    <div
                      key={`${item.label[locale]}-${item.value}`}
                      className="rounded-[20px] bg-white/42 px-4 py-3"
                    >
                      <div className="text-sm text-[#7d7065]">{item.label[locale]}</div>
                      <div className="mt-1 text-lg font-semibold text-[#302823]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="rounded-[36px] border border-white/54 bg-white/34 p-6 shadow-[0_24px_70px_rgba(67,54,39,0.07)] backdrop-blur-[20px] sm:p-8">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#2e241f] sm:text-4xl">
                {product.compositionTitle[locale]}
              </h2>

              <div className="mt-6 grid gap-3 text-[15px] leading-7 text-[#5f554e] sm:text-base sm:leading-8">
                {[
                  product.composition[locale],
                  product.storageText[locale],
                  product.productionDateText[locale],
                  product.manufacturer[locale],
                  product.address[locale],
                  product.openedText[locale]
                ].map((text) => (
                  <p
                    key={text}
                    className="rounded-[22px] border border-white/44 bg-white/36 px-5 py-4"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </section>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17110d]/86 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={t("gallery.close")}
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={t("gallery.prev")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.div
              key={gallery[activeImage].src}
              initial={{opacity: 0, scale: 0.97, filter: "blur(8px)"}}
              animate={{opacity: 1, scale: 1, filter: "blur(0px)"}}
              exit={{opacity: 0, scale: 0.985, filter: "blur(6px)"}}
              transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
              className="relative flex h-[82vh] w-full max-w-[1100px] items-center justify-center"
            >
              <Image
                src={gallery[activeImage].src}
                alt={gallery[activeImage].alt}
                fill
                sizes="92vw"
                className="object-contain"
              />
            </motion.div>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={t("gallery.next")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
