"use client";

import {AnimatePresence, motion} from "framer-motion";
import {usePrefersReducedMotion} from "@/lib/use-prefers-reduced-motion";
import {useEffect, useRef, useState} from "react";
import {ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Expand, X} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {notFound} from "next/navigation";
import Link from "next/link";
import Image from "@/components/shared/adaptive-image";
import {formatMeasure} from "@/lib/product-format";
import productImages from "@/data/product-images.json";
import {getProductGallery, listedProducts} from "./products-data";
import {getProductDisplayTitle} from "./product-title";

type Locale = "uz" | "ru" | "en";

export default function ProductDetailPage({slug}: {slug: string}) {
  const t = useTranslations("ProductsPage");
  const ui = useTranslations("ProductExtras");
  const locale = useLocale() as Locale;
  const product = listedProducts.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail key={slug} slug={slug} locale={locale} product={product} t={t} ui={ui} />;
}

function ProductDetail({slug, locale, product, t, ui}: {
  slug: string; locale: Locale; product: (typeof listedProducts)[number];
  t: ReturnType<typeof useTranslations<"ProductsPage">>;
  ui: ReturnType<typeof useTranslations<"ProductExtras">>;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const title = getProductDisplayTitle(product.title[locale]);
  const originals = getProductGallery(product);
  const optimized = (productImages as Record<string, string>)[slug];
  const gallery = originals.map((src, index) => index === 0 && optimized ? optimized : src);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const nutrition = [
    {label: t("product.nutrition.energy"), value: product.nutrition.energy},
    {label: t("product.nutrition.fat"), value: product.nutrition.fat},
    {label: t("product.nutrition.protein"), value: product.nutrition.protein},
    {label: t("product.nutrition.carbs"), value: product.nutrition.carbs}
  ];
  const availableNutrition = nutrition.filter((item) => item.value && item.value !== "—");
  const step = (direction: number) => setActive((current) => (current + direction + gallery.length) % gallery.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({preventScroll: true});
    };
  }, [open]);

  return (
    <main className="product-detail page-content">
      <div className="content-container">
        <nav aria-label={ui("breadcrumbs")} className="breadcrumbs">
          <Link href={`/${locale}`}>{t("breadcrumbs.home")}</Link><span aria-hidden="true">/</span>
          <Link href={`/${locale}/products`}>{t("breadcrumbs.catalog")}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
        </nav>
        <div className="product-detail-grid">
          <div className="product-gallery"><div className="product-gallery-entrance">
            <button type="button" className="product-gallery-main" onClick={() => setOpen(true)} aria-label={t("gallery.open")}>
              <AnimatePresence mode="wait" initial={false}><motion.div key={gallery[active]} className="product-gallery-image" initial={reducedMotion ? false : {opacity: 0, y: 18, scale: .9}} animate={{opacity: 1, y: 0, scale: 1}} exit={reducedMotion ? undefined : {opacity: 0, y: -8, scale: .98}} transition={{duration: .62, ease: [.22, 1, .36, 1]}}><Image src={gallery[active]} alt={title} fill sizes="(min-width: 1024px) 520px, 90vw" priority className="object-contain p-6" />
              </motion.div></AnimatePresence><span className="product-expand"><Expand size={20} aria-hidden="true" /></span>
            </button>
            {gallery.length > 1 && <div className="product-thumbnails">
              <button type="button" onClick={() => step(-1)} className="gallery-control" aria-label={t("gallery.prev")}><ChevronLeft aria-hidden="true" /></button>
              <div className="product-thumbnail-list">{gallery.map((src, index) => <button key={src} type="button" aria-label={ui("image", {number: index + 1})} aria-pressed={active === index} onClick={() => setActive(index)}><Image src={src} alt="" width={80} height={88} className="object-contain" /></button>)}</div>
              <button type="button" onClick={() => step(1)} className="gallery-control" aria-label={t("gallery.next")}><ChevronRight aria-hidden="true" /></button>
            </div>}
          </div></div>
          <div className="product-information">
            <div>
              <span className="eyebrow">SOFIN / {formatMeasure(product.netWeight ?? product.weight[locale].replace(/^[^:]+:\s*/, ""), locale)}</span>
              <h1 className="page-title">{title}</h1>
              <p className="page-intro">{product.subtitle[locale]}</p>
            </div>
            <section className="product-info-panel">
              <h2>{t("product.nutrition.per100g")}</h2>
              <dl className="nutrition-list">{availableNutrition.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{formatMeasure(item.value, locale)}</dd></div>)}{product.nutrition.extra?.map((item) => <div key={item.label[locale]}><dt>{item.label[locale]}</dt><dd>{formatMeasure(item.value, locale)}</dd></div>)}</dl>
              {availableNutrition.length < nutrition.length && <p className="product-note">{ui("nutritionNote")}</p>}
            </section>
            <section className="product-info-panel">
              <h2>{ui("details")}</h2>
              <dl className="nutrition-list">{[
                [t("product.storage.title"), product.storageValue[locale]],
                [t("product.packaging.title"), product.packagingValue[locale]],
                [t("product.weight.title"), product.formatValue[locale]]
              ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{formatMeasure(value, locale)}</dd></div>)}</dl>
            </section>
            <section className="product-info-panel" id="product-composition"><h2>{product.compositionTitle[locale]}</h2><p>{product.composition[locale]}</p></section>
            <section className="product-info-panel"><h2>{ui("storage")}</h2><div className="product-storage-copy">{[product.storageText[locale], product.productionDateText[locale], product.openedText[locale], product.manufacturer[locale], product.address[locale]].map((text) => <p key={text}>{text}</p>)}</div></section>
            <div className="product-detail-actions"><Link className="button-secondary" href={`/${locale}/products?category=${product.category}`}><ArrowLeft size={18} aria-hidden="true" />{ui("back")}</Link><Link className="button-primary" href={`/${locale}/contacts`}>{ui("contact")}<ArrowRight size={18} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </div>
      <dialog ref={dialogRef} className="product-dialog" aria-label={title} onClose={() => setOpen(false)} onClick={(event) => {if (event.target === event.currentTarget) setOpen(false);}} onKeyDown={(event) => {
        if (event.key === "Tab") {
          const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
          const first = buttons[0]; const last = buttons.at(-1);
          if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last?.focus();}
          if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus();}
        }
        if (event.key === "ArrowRight") {event.preventDefault(); step(1);} if (event.key === "ArrowLeft") {event.preventDefault(); step(-1);}}}>
        <button ref={closeRef} className="dialog-close gallery-control" type="button" onClick={() => setOpen(false)} aria-label={t("gallery.close")}><X aria-hidden="true" /></button>
        {gallery.length > 1 && <button className="dialog-prev gallery-control" type="button" onClick={() => step(-1)} aria-label={t("gallery.prev")}><ChevronLeft aria-hidden="true" /></button>}
        <div className="dialog-image"><Image src={gallery[active]} alt={`${title} ${active + 1}`} fill sizes="(min-width: 900px) 800px, 90vw" className="object-contain" /></div>
        {gallery.length > 1 && <button className="dialog-next gallery-control" type="button" onClick={() => step(1)} aria-label={t("gallery.next")}><ChevronRight aria-hidden="true" /></button>}
      </dialog>
    </main>
  );
}
