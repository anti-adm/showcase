"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring
} from "framer-motion";
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
import {assetUrl} from "@/lib/assets";
import {getProductGallery, listedProducts} from "./products-data";
import {getProductDisplayTitle} from "./product-title";

type Locale = "uz" | "ru" | "en";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ProductDetailPage({slug}: {slug: string}) {
  const t = useTranslations("ProductsPage");
  const locale = useLocale() as Locale;
  const reducedMotion = useReducedMotion() ?? false;
  const detailGridRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const photoRailRef = useRef<HTMLElement | null>(null);
  const photoStackRef = useRef<HTMLDivElement | null>(null);
  const rawPhotoRailY = useMotionValue(0);
  const photoRailY = useSpring(rawPhotoRailY, {
    stiffness: 92,
    damping: 26,
    mass: 0.68
  });

  const product = listedProducts.find((item) => item.slug === slug) ?? listedProducts[0];
  const displayTitle = getProductDisplayTitle(product.title[locale]);

  const gallery = useMemo(
    () =>
      getProductGallery(product).map((src, index) => ({
        src,
        alt:
          index === 0
            ? `${displayTitle} 1`
            : `${displayTitle} ${index + 1}`
      })),
    [product, displayTitle]
  );

  const [imageState, setImageState] = useState({slug, activeImage: 0});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [desktopPhotoRail, setDesktopPhotoRail] = useState(false);

  const activeImage =
    imageState.slug === slug ? Math.min(imageState.activeImage, gallery.length - 1) : 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktopRail = () => setDesktopPhotoRail(mediaQuery.matches);

    updateDesktopRail();
    mediaQuery.addEventListener("change", updateDesktopRail);

    return () => mediaQuery.removeEventListener("change", updateDesktopRail);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      rawPhotoRailY.set(0);
      return;
    }

    const updateRail = () => {
      const grid = detailGridRef.current;
      const info = infoRef.current;
      const rail = photoRailRef.current;
      const stack = photoStackRef.current;

      if (!grid || !info || !rail || !stack || window.innerWidth < 1024) {
        rawPhotoRailY.set(0);
        return;
      }

      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const railStyles = window.getComputedStyle(rail);
      const stickyTop = Number.parseFloat(railStyles.top) || 132;
      const gridTop = scrollY + grid.getBoundingClientRect().top;
      const infoBottom = scrollY + info.getBoundingClientRect().bottom;
      const stackHeight = stack.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const infoTravel = Math.max(0, info.getBoundingClientRect().height - stackHeight);
      const maxTravel = clamp(infoTravel * 1.42, 420, 1040);
      const startY = Math.max(0, gridTop - stickyTop);
      const endY = Math.max(startY + 1, infoBottom - viewportHeight + stickyTop + 96);
      const progress = clamp((scrollY - startY) / (endY - startY), 0, 1);

      rawPhotoRailY.set(maxTravel * progress);
    };

    let frame = 0;

    const tick = () => {
      updateRail();
      frame = window.requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(updateRail);

    [detailGridRef.current, infoRef.current, photoRailRef.current, photoStackRef.current]
      .filter(Boolean)
      .forEach((element) => resizeObserver.observe(element as Element));

    frame = window.requestAnimationFrame(tick);

    window.addEventListener("resize", updateRail);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateRail);
    };
  }, [rawPhotoRailY, reducedMotion, slug]);

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
    <main className="relative overflow-x-hidden bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_50%,#d1dcea_100%)] pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_50%,#d1dcea_100%)]" />
      <div className="absolute inset-0 -z-20 hidden sm:block">
        <Image
          src={assetUrl("/images/products.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-38"
        />
      </div>
      <div className="absolute inset-0 -z-20 sm:hidden">
        <Image
          src={assetUrl("/images/products-m.webp")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-34"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(237,244,252,0.34)_0%,rgba(218,231,246,0.48)_52%,rgba(207,222,239,0.64)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.58),transparent_30%),radial-gradient(circle_at_86%_4%,rgba(192,218,255,0.22),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(44,78,120,0.08),transparent_42%)]" />

      <section className="relative mx-auto max-w-[1420px] px-4 pb-24 sm:px-6 lg:px-8">
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
          <span className="font-medium text-[#2e241f]">{displayTitle}</span>
        </div>

        <div
          ref={detailGridRef}
          className="grid items-start gap-7 lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.18fr)] lg:gap-10 lg:pb-[420px]"
        >
          <aside
            ref={photoRailRef}
            className="lg:sticky lg:top-[220px] lg:h-0 lg:self-start"
          >
            <motion.div
              ref={photoStackRef}
              data-product-photo-stack
              style={{y: reducedMotion ? 0 : photoRailY}}
              className="will-change-transform"
            >
              <motion.div
                initial={
                  reducedMotion
                    ? false
                    : {opacity: 0, x: "28vw", scale: 0.76}
                }
                animate={reducedMotion ? undefined : {opacity: 1, x: "0vw", scale: 1}}
                transition={{
                  duration: 1.08,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: {duration: 0.34},
                  scale: {duration: 1.08}
                }}
              >
              <motion.div
                initial={reducedMotion ? false : {borderRadius: "999px"}}
                animate={reducedMotion ? undefined : {borderRadius: "34px"}}
                transition={{duration: 1.02, ease: [0.16, 1, 0.3, 1]}}
                style={{marginTop: desktopPhotoRail ? -176 : undefined}}
                className="relative overflow-hidden rounded-[34px] border border-white/86 bg-white/80 p-3 shadow-[0_26px_70px_rgba(15,42,76,0.13),inset_0_1px_0_rgba(255,255,255,0.95)] sm:p-4"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_84%_100%,rgba(183,213,247,0.22),transparent_36%)]" />
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-[26px] bg-white px-3 py-6 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] sm:min-h-[430px] lg:h-[min(46svh,500px)] lg:min-h-[360px]"
                  aria-label={t("gallery.open")}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(247,250,253,0.86),transparent_38%)]" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={gallery[activeImage].src}
                      initial={reducedMotion ? false : {opacity: 0, y: 18, scale: 0.9}}
                      animate={reducedMotion ? undefined : {opacity: 1, y: 0, scale: 1}}
                      exit={reducedMotion ? undefined : {opacity: 0, y: -8, scale: 0.99}}
                      transition={{duration: 0.62, delay: 0.12, ease: [0.22, 1, 0.36, 1]}}
                      className="relative aspect-square w-full max-w-[540px] overflow-hidden rounded-[24px] bg-white"
                    >
                      <Image
                        src={gallery[activeImage].src}
                        alt={gallery[activeImage].alt}
                        fill
                        sizes="(min-width: 1024px) 44vw, 92vw"
                        className="object-contain p-3 sm:p-5"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[var(--brand-primary)] shadow-[0_14px_30px_rgba(15,42,76,0.12)] transition hover:border-[#aac0d6]"
                  aria-label={t("gallery.open")}
                >
                  <Expand className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div
                initial={reducedMotion ? false : {opacity: 0, y: 12}}
                animate={reducedMotion ? undefined : {opacity: 1, y: 0}}
                transition={{duration: 0.56, delay: 0.62, ease: [0.22, 1, 0.36, 1]}}
                className="mt-3 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={prevImage}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#2e241f] shadow-sm transition hover:border-[#aac0d6]"
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
                        className={`overflow-hidden rounded-lg border p-2 transition duration-300 ${
                          active
                            ? "border-[var(--brand-primary)] bg-white shadow-[0_12px_26px_rgba(15,42,76,0.1)]"
                            : "border-slate-200 bg-white hover:border-[#aac0d6]"
                        }`}
                      >
                        <div className="relative h-[72px] overflow-hidden rounded-md bg-white lg:h-[64px]">
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="120px"
                            className="object-contain p-1"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={nextImage}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[#2e241f] shadow-sm transition hover:border-[#aac0d6]"
                  aria-label={t("gallery.next")}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </motion.div>
              </motion.div>
            </motion.div>
          </aside>

          <motion.div
            ref={infoRef}
            initial={reducedMotion ? false : {opacity: 0, x: 52}}
            animate={reducedMotion ? undefined : {opacity: 1, x: 0}}
            transition={{duration: 0.82, delay: 0.58, ease: [0.16, 1, 0.3, 1]}}
            className="space-y-5"
          >
            <section className="rounded-[30px] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,251,255,0.86))] p-6 shadow-[0_26px_72px_rgba(15,42,76,0.12),inset_0_1px_0_rgba(255,255,255,0.96)] sm:p-8 lg:p-10">
              <div className="mb-4 inline-flex rounded-full border border-[#dce7f2] bg-white/82 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#60708a] shadow-[0_10px_22px_rgba(15,42,76,0.05)]">
                {t("product.badge")}
              </div>

              <h1 className="text-balance text-3xl font-semibold text-[var(--brand-primary)] sm:text-5xl lg:text-[4rem]">
                {displayTitle}
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
                    className="rounded-[22px] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,251,255,0.82))] p-4 shadow-[0_16px_42px_rgba(15,42,76,0.10),inset_0_1px_0_rgba(255,255,255,0.94)] sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf6ef] text-[#47735b] shadow-[inset_0_1px_0_rgba(255,255,255,0.88)]">
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

            <section className="rounded-[26px] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,251,255,0.84))] p-5 shadow-[0_20px_56px_rgba(15,42,76,0.10),inset_0_1px_0_rgba(255,255,255,0.94)] sm:p-6">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#8a7b6d]">
                {t("product.nutrition.per100g")}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {detailItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[20px] border border-white/80 bg-white/68 p-4 shadow-[0_12px_32px_rgba(15,42,76,0.07),inset_0_1px_0_rgba(255,255,255,0.92)]"
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-[#47735b]">
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
                      className="rounded-[18px] border border-white/80 bg-white/68 px-4 py-3 shadow-[0_10px_26px_rgba(15,42,76,0.06),inset_0_1px_0_rgba(255,255,255,0.92)]"
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

            <section
              id="product-composition"
              className="scroll-mt-32 rounded-[30px] border border-white/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,251,255,0.84))] p-5 shadow-[0_24px_66px_rgba(15,42,76,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] sm:p-8"
            >
              <h2 className="text-2xl font-semibold text-[#2e241f] sm:text-4xl">
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
                    className="rounded-[18px] border border-white/86 bg-white/70 px-5 py-4 shadow-[0_12px_32px_rgba(15,42,76,0.07),inset_0_1px_0_rgba(255,255,255,0.92)]"
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
            initial={reducedMotion ? false : {opacity: 0}}
            animate={reducedMotion ? undefined : {opacity: 1}}
            exit={reducedMotion ? undefined : {opacity: 0}}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17110d]/90 p-4"
            onClick={() => setLightboxOpen(false)}
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
              onClick={(event) => {
                event.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={t("gallery.prev")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.div
              key={gallery[activeImage].src}
              initial={reducedMotion ? false : {opacity: 0, scale: 0.98}}
              animate={reducedMotion ? undefined : {opacity: 1, scale: 1}}
              exit={reducedMotion ? undefined : {opacity: 0, scale: 0.99}}
              transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
              className="relative flex h-[82vh] w-full max-w-[1100px] items-center justify-center"
              onClick={(event) => event.stopPropagation()}
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
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
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
