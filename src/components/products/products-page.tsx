"use client";

import {useMemo, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
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

type GalleryImage = {
  src: string;
  alt: string;
};

type NutritionItem = {
  label: string;
  value: string;
  icon: React.ComponentType<{className?: string}>;
};

export default function ProductsPage() {
  const t = useTranslations("ProductsPage");
  const locale = useLocale();

  const gallery = useMemo<GalleryImage[]>(
    () => [
      {
        src: "/images/products/mozarella1.jpg",
        alt: t("product.gallery.alt1")
      },
      {
        src: "/images/products/mozarella2.jpg",
        alt: t("product.gallery.alt2")
      }
    ],
    [t]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nutrition: NutritionItem[] = [
    {
      label: t("product.nutrition.energy"),
      value: "204 K / 854 Kkal",
      icon: Flame
    },
    {
      label: t("product.nutrition.fat"),
      value: "20 g",
      icon: Droplets
    },
    {
      label: t("product.nutrition.protein"),
      value: "2,8 g",
      icon: ShieldCheck
    },
    {
      label: t("product.nutrition.carbs"),
      value: "3,2 g",
      icon: Wheat
    }
  ];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <main className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_28%),linear-gradient(180deg,#edf4fc_0%,#dae7f6_52%,#cfdeef_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[url('/images/hero/hero2.jpeg')] bg-cover bg-center opacity-[0.12]" />
      <div className="absolute inset-0 -z-10 backdrop-blur-[24px]" />

      <section className="mx-auto max-w-[1380px] px-5 pb-10 sm:px-8 lg:px-10">
        <div className="rounded-[34px] border border-white/35 bg-white/32 p-5 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[24px] sm:p-7 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href={`/${locale}`} className="transition hover:text-slate-900">
              {t("breadcrumbs.home")}
            </Link>
            <span>›</span>
            <span>{t("breadcrumbs.catalog")}</span>
            <span>›</span>
            <span className="font-medium text-emerald-600">
              {t("product.title")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1fr)] lg:gap-12">
            <div className="flex flex-col">
              <div className="group relative overflow-hidden rounded-[30px] border border-white/40 bg-white/38 p-4 shadow-[0_20px_70px_rgba(44,78,120,0.08)] backdrop-blur-[20px] sm:p-6">
                <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[460px]">
                  <Image
                    src={gallery[activeImage].src}
                    alt={gallery[activeImage].alt}
                    fill={false}
                    width={520}
                    height={700}
                    className="h-auto max-h-[440px] w-auto object-contain transition duration-500 group-hover:scale-[1.02] sm:max-h-[520px]"
                    priority
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-white/70 text-slate-700 backdrop-blur-xl transition hover:bg-white"
                  aria-label={t("gallery.open")}
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prevImage}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/45 text-slate-700 backdrop-blur-xl transition hover:bg-white"
                  aria-label={t("gallery.prev")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="grid flex-1 grid-cols-2 gap-3">
                  {gallery.map((item, index) => {
                    const active = index === activeImage;

                    return (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`overflow-hidden rounded-[20px] border p-2 transition ${
                          active
                            ? "border-emerald-500 bg-white/70 shadow-[0_12px_30px_rgba(16,185,129,0.12)]"
                            : "border-white/30 bg-white/35 hover:bg-white/55"
                        }`}
                        aria-label={`${t("gallery.open")} ${index + 1}`}
                      >
                        <div className="relative h-[92px] overflow-hidden rounded-[14px] bg-white/50">
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={nextImage}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/45 text-slate-700 backdrop-blur-xl transition hover:bg-white"
                  aria-label={t("gallery.next")}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="rounded-[30px] border border-white/40 bg-white/35 p-6 shadow-[0_20px_70px_rgba(44,78,120,0.08)] backdrop-blur-[20px] sm:p-7 lg:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-700">
                      {t("product.badge")}
                    </div>

                    <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-emerald-600 sm:text-5xl lg:text-6xl">
                      {t("product.title")}
                    </h1>

                    <p className="mt-3 max-w-[520px] text-sm uppercase tracking-[0.22em] text-slate-500 sm:text-base">
                      {t("product.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {nutrition.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-[22px] border border-white/38 bg-white/42 p-4 backdrop-blur-xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <div className="text-sm text-slate-500">
                              {item.label}
                            </div>
                            <div className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[24px] border border-white/38 bg-white/42 p-5 backdrop-blur-xl">
                  <div className="mb-4 text-sm font-medium text-slate-500">
                    {t("product.nutrition.per100g")}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Clock3 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">
                          {t("product.storage.title")}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {t("product.storage.value")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Package2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">
                          {t("product.packaging.title")}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {t("product.packaging.value")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">
                          {t("product.weight.title")}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">
                          {t("product.weight.value")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-[26px] border border-white/38 bg-white/42 p-5 backdrop-blur-xl sm:p-6">
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-emerald-600 sm:text-4xl">
                    {t("product.compositionTitle")}
                  </h2>

                  <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8">
                    <p>{t("product.composition")}</p>
                    <p>{t("product.storageText")}</p>
                    <p>{t("product.productionDateText")}</p>
                    <p>{t("product.manufacturer")}</p>
                    <p>{t("product.address")}</p>
                    <p>{t("product.openedText")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
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

          <div className="relative flex h-[82vh] w-full max-w-[1100px] items-center justify-center">
            <Image
              src={gallery[activeImage].src}
              alt={gallery[activeImage].alt}
              fill
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t("gallery.next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </main>
  );
}