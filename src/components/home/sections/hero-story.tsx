"use client";

import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {
  ArrowRight,
  Droplets,
  Heart,
  Leaf,
  Milk,
  ShieldCheck,
  Truck,
  type LucideIcon
} from "lucide-react";
import Image from "next/image";
import {useLocale} from "next-intl";

import {getHeroScenes, type HeroScene} from "@/data/home/hero-scenes";
import {Link} from "@/i18n/navigation";
import {assetUrl} from "@/lib/assets";
import {cn} from "@/lib/utils";
import HeroSnapController from "./hero-snap-controller";

type Locale = "uz" | "ru" | "en";
type SofinWindow = Window & {__sofinPreloaderDone?: boolean};

type MobileHeroTone = "main" | "brand" | "yogurts" | "products" | "trust";

type MobileHeroFeature = {
  label: string;
  icon: LucideIcon;
};

type MobileHeroCopy = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  lead?: string;
  description: string;
  cta: string;
  href: string;
  note?: string;
  tone: MobileHeroTone;
  features?: MobileHeroFeature[];
};

const MOBILE_HERO_BACKGROUND = "/images/home/mobile-hero-products.png";
const PRELOADER_DONE_EVENT = "sofin-preloader-done";

const MAIN_HERO_BACKGROUND = {
  desktop: "/images/main-hero-4k.png",
  mobile: MOBILE_HERO_BACKGROUND
};

const MOBILE_HERO_COPY: Record<Locale, MobileHeroCopy[]> = {
  ru: [
    {
      title: "SOFIN",
      subtitle: "От фермы — до полки.",
      lead: "Свежие, качественные\nи полезные молочные продукты",
      description:
        "из эко-фермы — с вниманием к безопасности, вкусу и пути каждого продукта.",
      cta: "Наш каталог",
      href: "/products",
      tone: "main"
    },
    {
      eyebrow: "О БРЕНДЕ",
      title: "Свежесть,\nкоторой доверяют",
      description:
        "SOFIN объединяет натуральное сырьё, фермерский подход и современное производство. Мы бережно сохраняем вкус, качество и путь каждого продукта — от фермы до вашей полки.",
      cta: "Узнать больше",
      href: "/company",
      note: "От фермы до полки с заботой о качестве",
      tone: "brand",
      features: [
        {label: "Натуральное молоко", icon: Milk},
        {label: "Контроль качества", icon: ShieldCheck},
        {label: "Быстрая логистика", icon: Truck}
      ]
    },
    {
      eyebrow: "ЙОГУРТЫ",
      title: "Нежные йогурты\nдля каждого дня",
      description:
        "Натуральные ингредиенты, сбалансированный вкус и разнообразие ярких сочетаний — для вашего удовольствия и заботы каждый день.",
      cta: "Смотреть вкусы",
      href: "/yogurts",
      note: "От фермы до полки с заботой о качестве",
      tone: "yogurts",
      features: [
        {label: "Натуральный состав", icon: Leaf},
        {label: "Яркие вкусы", icon: Heart},
        {label: "Удобный формат", icon: Milk}
      ]
    },
    {
      eyebrow: "ПРОДУКЦИЯ",
      title: "Современные\nмолочные продукты\nна каждый день",
      description:
        "Йогурты, кефир, молоко и другие продукты SOFIN создаются с фокусом на свежесть, чистый вкус и удобный формат для ежедневного выбора.",
      cta: "Перейти в каталог",
      href: "/products",
      note: "От фермы до полки с заботой о качестве",
      tone: "products",
      features: [
        {label: "Свежесть каждый день", icon: Droplets},
        {label: "Натуральный состав", icon: Leaf},
        {label: "Удобный формат", icon: Milk}
      ]
    },
    {
      eyebrow: "ДОВЕРИЕ",
      title: "От локального\nпроизводства\nк стабильному\nбренду",
      description:
        "SOFIN выстраивает доверие через стабильное качество, понятный состав и внимательный подход к каждому продукту. Мы соединяем локальное производство, современные стандарты и заботу о вкусе.",
      cta: "Подробнее о бренде",
      href: "/company",
      note: "От фермы до полки — через доверие и качество",
      tone: "trust",
      features: [
        {label: "Контроль качества", icon: ShieldCheck},
        {label: "Проверенное сырьё", icon: Leaf},
        {label: "Стабильный вкус", icon: Milk}
      ]
    }
  ],
  uz: [
    {
      title: "SOFIN",
      subtitle: "Fermadan — javongacha.",
      lead: "Yangi, sifatli\nva foydali sut mahsulotlari",
      description:
        "eko-fermadan — xavfsizlik, ta’m va har bir mahsulot yo‘liga e’tibor bilan.",
      cta: "Bizning katalog",
      href: "/products",
      tone: "main"
    },
    {
      eyebrow: "BREND HAQIDA",
      title: "Ishonch uyg‘otadigan\nyangilik",
      description:
        "SOFIN tabiiy xomashyo, fermerlik yondashuvi va zamonaviy ishlab chiqarishni birlashtiradi. Biz har bir mahsulotning ta’mi, sifati va yo‘lini fermadan javongacha asrab boramiz.",
      cta: "Batafsil",
      href: "/company",
      note: "Fermadan javongacha sifatga e’tibor bilan",
      tone: "brand",
      features: [
        {label: "Tabiiy sut", icon: Milk},
        {label: "Sifat nazorati", icon: ShieldCheck},
        {label: "Tez logistika", icon: Truck}
      ]
    },
    {
      eyebrow: "YOGURTLAR",
      title: "Har kun uchun\nmayin yogurtlar",
      description:
        "Tabiiy ingredientlar, muvozanatli ta’m va yorqin kombinatsiyalar — har kuni zavq va g‘amxo‘rlik uchun.",
      cta: "Ta’mlarni ko‘rish",
      href: "/yogurts",
      note: "Fermadan javongacha sifatga e’tibor bilan",
      tone: "yogurts",
      features: [
        {label: "Tabiiy tarkib", icon: Leaf},
        {label: "Yorqin ta’mlar", icon: Heart},
        {label: "Qulay format", icon: Milk}
      ]
    },
    {
      eyebrow: "MAHSULOTLAR",
      title: "Har kun uchun\nzamonaviy sut\nmahsulotlari",
      description:
        "Yogurt, kefir, sut va boshqa SOFIN mahsulotlari yangilik, toza ta’m va kundalik tanlovga qulay format bilan yaratiladi.",
      cta: "Katalogga o‘tish",
      href: "/products",
      note: "Fermadan javongacha sifatga e’tibor bilan",
      tone: "products",
      features: [
        {label: "Har kun yangilik", icon: Droplets},
        {label: "Tabiiy tarkib", icon: Leaf},
        {label: "Qulay format", icon: Milk}
      ]
    },
    {
      eyebrow: "ISHONCH",
      title: "Mahalliy ishlab\nchiqarishdan\nbarqaror brend sari",
      description:
        "SOFIN barqaror sifat, tushunarli tarkib va har bir mahsulotga e’tibor orqali ishonch yaratadi. Biz mahalliy ishlab chiqarish, zamonaviy standartlar va ta’mga g‘amxo‘rlikni birlashtiramiz.",
      cta: "Brend haqida",
      href: "/company",
      note: "Fermadan javongacha — ishonch va sifat orqali",
      tone: "trust",
      features: [
        {label: "Sifat nazorati", icon: ShieldCheck},
        {label: "Tekshirilgan xomashyo", icon: Leaf},
        {label: "Barqaror ta’m", icon: Milk}
      ]
    }
  ],
  en: [
    {
      title: "SOFIN",
      subtitle: "From farm — to shelf.",
      lead: "Fresh, high-quality\nand wholesome dairy products",
      description:
        "from an eco farm, created with care for safety, taste and every product journey.",
      cta: "Our catalog",
      href: "/products",
      tone: "main"
    },
    {
      eyebrow: "ABOUT THE BRAND",
      title: "Freshness\nyou can trust",
      description:
        "SOFIN brings together natural ingredients, a farm-minded approach and modern production. We preserve taste, quality and every step of the journey from farm to shelf.",
      cta: "Learn more",
      href: "/company",
      note: "From farm to shelf with care for quality",
      tone: "brand",
      features: [
        {label: "Natural milk", icon: Milk},
        {label: "Quality control", icon: ShieldCheck},
        {label: "Fast logistics", icon: Truck}
      ]
    },
    {
      eyebrow: "YOGURTS",
      title: "Gentle yogurts\nfor every day",
      description:
        "Natural ingredients, balanced taste and bright combinations for everyday pleasure and care.",
      cta: "See flavors",
      href: "/yogurts",
      note: "From farm to shelf with care for quality",
      tone: "yogurts",
      features: [
        {label: "Natural blend", icon: Leaf},
        {label: "Bright flavors", icon: Heart},
        {label: "Easy format", icon: Milk}
      ]
    },
    {
      eyebrow: "PRODUCTS",
      title: "Modern dairy\nproducts for\nevery day",
      description:
        "Yogurts, kefir, milk and other SOFIN products are created around freshness, clean taste and convenient everyday formats.",
      cta: "Open catalog",
      href: "/products",
      note: "From farm to shelf with care for quality",
      tone: "products",
      features: [
        {label: "Daily freshness", icon: Droplets},
        {label: "Natural blend", icon: Leaf},
        {label: "Easy format", icon: Milk}
      ]
    },
    {
      eyebrow: "TRUST",
      title: "From local\nproduction to\na stable brand",
      description:
        "SOFIN builds trust through steady quality, clear ingredients and attentive care for every product. We connect local production, modern standards and reliable taste.",
      cta: "About the brand",
      href: "/company",
      note: "From farm to shelf — through trust and quality",
      tone: "trust",
      features: [
        {label: "Quality control", icon: ShieldCheck},
        {label: "Trusted milk", icon: Leaf},
        {label: "Stable taste", icon: Milk}
      ]
    }
  ]
};

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function HeroStory() {
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeScene, setActiveScene] = useState(0);
  const [mobileHeroVisible, setMobileHeroVisible] = useState(true);
  const reducedMotion = useReducedMotionPreference();
  const locale = useLocale();
  const heroScenes = useMemo(() => getHeroScenes(locale), [locale]);
  const mobileHeroScenes = useMemo(
    () => MOBILE_HERO_COPY[normalizeLocale(locale)],
    [locale]
  );

  const backgroundByScene = useMemo(
    () => [
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND
    ],
    []
  );

  useEffect(() => {
    const nodes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = Number(
          (visible.target as HTMLElement).dataset.sceneIndex ?? 0
        );

        setActiveScene(index);
      },
      {
        threshold: [0.42, 0.58, 0.72]
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.getElementById("hero-story-root");
    if (!root) return;

    const update = () => {
      const rect = root.getBoundingClientRect();
      setMobileHeroVisible(rect.top <= 8 && rect.bottom >= window.innerHeight * 0.18);
    };

    update();
    window.addEventListener("scroll", update, {passive: true});
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const snapToScene = (index: number) => {
    const node = sceneRefs.current[index];
    if (!node) return;

    node.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const currentBg = backgroundByScene[activeScene] ?? backgroundByScene[0];
  const currentBgDesktop = assetUrl(currentBg.desktop);
  const currentBgMobile =
    currentBg.mobile === MOBILE_HERO_BACKGROUND
      ? MOBILE_HERO_BACKGROUND
      : assetUrl(currentBg.mobile ?? currentBg.desktop);

  return (
    <section id="hero-story-root" className="relative bg-[#07192d]">
      <HeroSnapController
        rootId="hero-story-root"
        selector="[data-scene-index]"
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07192d]">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${currentBgDesktop}-${currentBgMobile}`}
            initial={{opacity: 0.18, scale: 1.02}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 1.01}}
            transition={{
              duration: reducedMotion ? 0 : 0.72,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <Image
                src={currentBgDesktop}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="hidden scale-[1.01] object-cover blur-[2px] sm:block"
              />
              <Image
                src={currentBgMobile}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-center sm:hidden"
              />
            </div>

            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(245,250,255,0.42)_0%,rgba(245,250,255,0.22)_34%,rgba(245,250,255,0)_66%)] sm:block" />
            <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(237,246,255,0.06)_0%,rgba(237,246,255,0)_54%,rgba(230,240,250,0.14)_100%)] sm:block" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_42%,rgba(244,248,255,0.18)_100%)] sm:hidden" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={cn(
          "pointer-events-none fixed left-4 top-1/2 z-30 -translate-y-1/2",
          activeScene === 0 ? "hidden" : "hidden lg:flex"
        )}
      >
        <div className="rounded-full border border-[#315b89]/18 bg-white/38 px-2.5 py-3 shadow-[0_14px_38px_rgba(25,68,112,0.10)] backdrop-blur-2xl">
          <div className="flex flex-col gap-2.5">
            {heroScenes.map((scene: HeroScene, index: number) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => snapToScene(index)}
                className="pointer-events-auto flex items-center justify-center"
                aria-label={`Go to scene ${index + 1}`}
              >
                <span
                  className={cn(
                    "block h-2.5 w-2.5 rounded-full border transition-all duration-400",
                    activeScene === index
                      ? "scale-110 border-[var(--brand-primary)] bg-[var(--brand-primary)] shadow-[0_0_12px_rgba(0,58,117,0.28)]"
                      : "border-[#315b89]/45 bg-white/24 hover:bg-[#315b89]/18"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileHeroVisible ? (
          <div className="pointer-events-none fixed inset-x-0 top-0 z-20 h-dvh px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-24 sm:hidden">
            <MobileHeroScene
              key={`fixed-mobile-${activeScene}`}
              scene={mobileHeroScenes[activeScene] ?? mobileHeroScenes[0]}
              reducedMotion={reducedMotion}
            />
          </div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-10 h-[500dvh] sm:h-[500svh]">
        {heroScenes.map((scene: HeroScene, index: number) => {
          const isActive = index === activeScene;
          const isYogurtsScene = index === 2;
          const isProductsScene = index === 3;

          return (
            <div
              key={scene.id}
              ref={(node) => {
                sceneRefs.current[index] = node;
              }}
              data-scene-index={index}
              className={cn(
                "relative flex h-[100dvh] items-center sm:h-[100svh]"
              )}
            >
              <div
                className={cn(
                  index === 0
                    ? "mx-auto flex w-full max-w-[1672px] items-stretch px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-24 sm:items-center sm:px-10 sm:pb-12 sm:pt-36 lg:px-14"
                    : "mx-auto grid w-full max-w-[1672px] items-center gap-7 px-4 pb-[max(1.3rem,env(safe-area-inset-bottom))] pt-24 sm:px-10 sm:pb-12 sm:pt-34 lg:px-14 xl:gap-10",
                  isYogurtsScene
                    ? "lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.5fr)]"
                    : isProductsScene
                      ? "pt-24 sm:pt-32 lg:grid-cols-1"
                      : "lg:grid-cols-1"
                )}
              >
                <AnimatePresence>
                  {isActive ? (
                    index === 0 ? (
                      <>
                        <div className="hidden w-full sm:block">
                          <HeroMainScene scene={scene} reducedMotion={reducedMotion} />
                        </div>
                      </>
                    ) : (
                    <>
                    <motion.div
                      key={`content-${scene.id}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: reducedMotion ? 0 : 0.12,
                            delayChildren: reducedMotion ? 0 : 0.04
                          }
                        },
                        exit: {
                          transition: {
                            staggerChildren: 0.03,
                            staggerDirection: -1
                          }
                        }
                      }}
                      className={cn(
                        "hidden max-w-[1080px] sm:block",
                        isYogurtsScene && "lg:max-w-[700px]",
                        isProductsScene && "lg:max-w-[700px] lg:self-center"
                      )}
                    >
                      {scene.eyebrow ? (
                        <motion.div
                          variants={{
                            hidden: {opacity: 0, y: 14, filter: "blur(8px)"},
                            visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                            exit: {opacity: 0, y: -10}
                          }}
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className={cn(
                            "mb-3 inline-flex rounded-full border border-[#315b89]/16 bg-white/46 px-3.5 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--brand-primary)] shadow-[0_10px_26px_rgba(25,68,112,0.06)] backdrop-blur-2xl",
                            isYogurtsScene && "mb-4 bg-white/64 px-4 py-2",
                            isProductsScene && "mb-4 bg-white/66 px-4 py-2 tracking-[0.16em]"
                          )}
                        >
                          {scene.eyebrow}
                        </motion.div>
                      ) : null}

                      <motion.h1
                        variants={{
                          hidden: {opacity: 0, y: 26, scale: 0.982, filter: "blur(14px)"},
                          visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                          exit: {opacity: 0, y: -16, scale: 0.992}
                        }}
                        transition={{
                          duration: 0.86,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className={cn(
                          "max-w-[980px] text-balance font-semibold leading-[0.96] tracking-[0] text-[var(--brand-primary)]",
                          isYogurtsScene
                            ? "max-w-[700px] text-[clamp(2.1rem,5.6vw,2.65rem)] sm:text-[clamp(2.55rem,3.55vw,3.1rem)] lg:text-[clamp(2.65rem,2.95vw,3.35rem)]"
                            : isProductsScene
                              ? "max-w-[720px] text-[clamp(2.05rem,5.4vw,2.6rem)] sm:text-[clamp(2.45rem,3.4vw,3rem)] lg:text-[clamp(2.55rem,2.8vw,3.2rem)]"
                            : "text-[clamp(2.15rem,7vw,2.75rem)] sm:text-[clamp(2.45rem,4vw,3.15rem)] lg:text-[clamp(2.5rem,2.7vw,3.1rem)]"
                        )}
                        style={
                          isYogurtsScene || isProductsScene
                            ? {letterSpacing: 0, lineHeight: 0.98}
                            : undefined
                        }
                      >
                        {scene.title}
                      </motion.h1>

                      {scene.subtitle ? (
                        <motion.p
                          variants={{
                            hidden: {opacity: 0, y: 22, scale: 0.992, filter: "blur(10px)"},
                            visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                            exit: {opacity: 0, y: -10}
                          }}
                          transition={{
                            duration: 0.74,
                            delay: reducedMotion ? 0 : 0.04,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="mt-4 max-w-[540px] text-xl font-medium text-[#244d7c] sm:text-2xl lg:text-[1.85rem]"
                        >
                          {scene.subtitle}
                        </motion.p>
                      ) : null}

                      {isYogurtsScene ? (
                        <YogurtsSceneInfo scene={scene} reducedMotion={reducedMotion} />
                      ) : null}

                      {isProductsScene ? (
                        <ProductsSceneInfo scene={scene} reducedMotion={reducedMotion} />
                      ) : null}

                      {!isYogurtsScene && !isProductsScene ? (
                        <motion.div
                          variants={{
                            hidden: {opacity: 0, y: 28, scale: 0.986, filter: "blur(12px)"},
                            visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                            exit: {opacity: 0, y: -12}
                          }}
                          transition={{
                            duration: 0.82,
                            delay: reducedMotion ? 0 : 0.08,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="mt-7 max-w-[600px] rounded-[28px] border border-white/60 bg-white/44 p-5 shadow-[0_22px_70px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-[24px] sm:p-6"
                        >
                          <p className="text-pretty text-sm leading-7 text-[#244d7c] sm:text-[15px] lg:text-base lg:leading-8">
                            {scene.description}
                          </p>

                          {scene.cta ? (
                            <div className="mt-5">
                              <Link
                                href={scene.cta.href}
                                className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_14px_34px_rgba(0,58,117,0.18)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                              >
                                {scene.cta.label}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </Link>
                            </div>
                          ) : null}
                        </motion.div>
                      ) : null}
                    </motion.div>
                    </>
                    )
                  ) : null}
                </AnimatePresence>

                {isYogurtsScene ? (
                  <div className="relative hidden lg:block">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                      <motion.div
                        key={`visual-${scene.id}`}
                        initial={{
                          opacity: 0,
                          x: 30,
                          scale: 0.98,
                          filter: "blur(14px)"
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          filter: "blur(0px)"
                        }}
                        exit={{
                          opacity: 0,
                          x: 18,
                          scale: 0.98,
                          filter: "blur(12px)"
                        }}
                        transition={{
                          duration: 0.72,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className="ml-auto w-full max-w-[470px]"
                      >
                        <YogurtsPreviewCard scene={scene} />
                      </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-16 bg-[linear-gradient(180deg,rgba(237,246,255,0),rgba(237,246,255,0.16))]" />
    </section>
  );
}

function MobileHeroScene({
  scene,
  reducedMotion
}: {
  scene: MobileHeroCopy;
  reducedMotion: boolean;
}) {
  const isMain = scene.tone === "main";

  return (
    <motion.div
      key={`mobile-${scene.tone}`}
      initial={reducedMotion ? false : {opacity: 0, y: 18, filter: "blur(10px)"}}
      animate={reducedMotion ? undefined : {opacity: 1, y: 0, filter: "blur(0px)"}}
      exit={reducedMotion ? undefined : {opacity: 0, y: -10, filter: "blur(8px)"}}
      transition={{duration: reducedMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1]}}
      className="pointer-events-auto relative flex h-full w-full flex-col justify-end sm:hidden"
    >
      {isMain ? <MobileMainHero scene={scene} /> : <MobileStoryCard scene={scene} />}
    </motion.div>
  );
}

function MobileMainHero({scene}: {scene: MobileHeroCopy}) {
  return (
    <>
      <div className="absolute left-[8vw] right-4 top-[3.8vh]">
        <h1 className="text-[clamp(3.55rem,19.5vw,5rem)] font-semibold leading-[0.86] tracking-[-0.07em] text-[var(--brand-primary)]">
          {scene.title}
        </h1>

        {scene.subtitle ? (
          <div className="mt-2 inline-flex rounded-full border border-white/60 bg-white/75 px-4 py-2 text-[clamp(1.08rem,5.25vw,1.34rem)] font-medium leading-none tracking-[-0.03em] text-[var(--brand-primary)] shadow-[0_14px_36px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-xl">
            {scene.subtitle}
          </div>
        ) : null}
      </div>

      <div className="-mb-3 mx-2 space-y-2.5 pb-[max(0.45rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2.5 rounded-[24px] border border-white/80 bg-white/90 p-3 text-[var(--brand-primary)] shadow-[0_18px_52px_rgba(25,68,112,0.14),inset_0_1px_0_rgba(255,255,255,0.94)] backdrop-blur-xl">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#315b89]/20 bg-white/60 text-[var(--brand-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
            <Leaf className="h-[22px] w-[22px]" strokeWidth={1.8} />
          </span>
          <p className="text-[12px] leading-[1.42] text-[#244d7c]">
            {scene.lead ? (
              <span className="mb-0.5 block whitespace-pre-line text-[14px] font-semibold leading-[1.18] text-[var(--brand-primary)]">
                {scene.lead}
              </span>
            ) : null}
            {scene.description}
          </p>
        </div>

        <Link
          href={scene.href}
          className="group flex min-h-[52px] w-full items-center justify-center gap-4 rounded-full bg-[var(--brand-primary)] px-6 text-[16px] font-semibold text-white shadow-[0_18px_48px_rgba(0,58,117,0.24)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          {scene.cta}
          <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}

function MobileStoryCard({scene}: {scene: MobileHeroCopy}) {
  const isBrand = scene.tone === "brand";
  const isYogurts = scene.tone === "yogurts";
  const isProducts = scene.tone === "products";
  const isTrust = scene.tone === "trust";
  const separatedFeatures = isBrand || isProducts || isTrust;
  const titleWidth =
    isYogurts
      ? "max-w-[72%]"
      : isTrust
        ? "max-w-[77%]"
        : isProducts
          ? "max-w-[96%]"
          : isBrand
            ? "max-w-full"
            : "max-w-full";
  const titleClass =
    isBrand
      ? "font-display text-[clamp(2.08rem,9.25vw,2.58rem)] font-semibold"
      : isYogurts
        ? "font-display text-[clamp(1.72rem,7.15vw,2.08rem)] font-semibold"
        : isTrust
          ? "text-[clamp(1.82rem,7.6vw,2.22rem)] font-semibold"
          : "text-[clamp(2rem,8.2vw,2.42rem)] font-semibold";

  return (
    <div
      className={cn(
        "-mx-1 pb-[max(0.48rem,env(safe-area-inset-bottom))]",
        isBrand && "pb-[max(0.35rem,env(safe-area-inset-bottom))]",
        isYogurts && "pb-[max(0.22rem,env(safe-area-inset-bottom))]"
      )}
    >
      <div
        className={cn(
          "relative px-4 pb-3.5 pt-[1.25rem] text-[var(--brand-primary)]",
          isBrand && "px-5 pb-4 pt-[1.42rem]",
          isYogurts && "px-4 pb-3.5 pt-[1.08rem]",
          isProducts && "px-4 pb-3.5 pt-[1.22rem]",
          isTrust && "px-4 pb-3.5 pt-[1.16rem]"
        )}
      >
        <MobileCardShape tone={scene.tone} />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-white/54 backdrop-blur-[18px]",
            isBrand ? "rounded-[34px]" : "rounded-[32px]"
          )}
          style={{
            backgroundImage:
              "radial-gradient(circle at 96% 4%, rgba(255,244,224,0.38), transparent 28%), radial-gradient(circle at 0% 0%, rgba(213,235,255,0.28), transparent 32%), linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 62%)"
          }}
        />
        <MobileCardVisual tone={scene.tone} />

        <div className="relative z-10">
          {scene.eyebrow ? (
            <div
              className={cn(
                "mb-3 inline-flex rounded-full border border-[#315b89]/16 bg-white/92 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--brand-primary)] shadow-[0_8px_20px_rgba(25,68,112,0.05),inset_0_1px_0_rgba(255,255,255,0.92)]",
                isBrand && "mb-4 px-4 text-[10.5px] tracking-[0.34em]",
                isYogurts && "mb-3 px-3.5 text-[9.5px] tracking-[0.32em]"
              )}
            >
              {scene.eyebrow}
            </div>
          ) : null}

          <h2
            className={cn(
              "whitespace-pre-line text-balance leading-[0.96] tracking-[-0.045em]",
              (isBrand || isYogurts) && "tracking-[-0.03em]",
              titleClass,
              titleWidth
            )}
            style={{
              lineHeight: isBrand || isYogurts ? 0.95 : 1.04,
              ...(isBrand || isYogurts
                ? {fontFamily: "var(--font-display), Georgia, serif"}
                : {})
            }}
          >
            {scene.title}
          </h2>

          <div
            className={cn(
              "mt-2.5 h-0.5 w-11 rounded-full bg-[#69aeea]",
              isBrand && "mt-3 w-12",
              isYogurts && "mt-3 w-12",
              isProducts && "mt-3",
              isTrust && "mt-3"
            )}
          />

          <p
            className={cn(
              "mt-3 text-pretty text-[12.5px] font-medium leading-[1.45] text-[#244d7c]",
              isBrand && "mt-3.5 text-[13.5px] leading-[1.43]",
              isYogurts && "max-w-[72%] text-[12.2px] leading-[1.43]",
              isProducts && "max-w-[92%] text-[12.6px] leading-[1.45]",
              isTrust && "max-w-[69%] text-[10.9px] leading-[1.42]"
            )}
          >
            {scene.description}
          </p>

          {scene.features?.length ? (
            <div
              className={cn(
                "mt-3.5 grid grid-cols-3",
                separatedFeatures
                  ? "gap-1.5"
                  : "overflow-hidden rounded-[18px] border border-[#d9e4f1]/78 bg-white/76 shadow-[0_12px_28px_rgba(25,68,112,0.08),inset_0_1px_0_rgba(255,255,255,0.92)]",
                isBrand && "mt-4.5 gap-1.5",
                isProducts && "mt-3.5 gap-2",
                isTrust && "mt-3.5 gap-1.5"
              )}
            >
              {scene.features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.label}
                    className={cn(
                      "flex min-h-[70px] flex-col items-center justify-center gap-1 px-1.5 py-2 text-center",
                      separatedFeatures &&
                        "rounded-[14px] border border-white/86 bg-white/76 shadow-[0_10px_24px_rgba(25,68,112,0.07),inset_0_1px_0_rgba(255,255,255,0.95)]",
                      !separatedFeatures && index > 0 && "border-l border-[#315b89]/10",
                      isBrand && "min-h-[78px] gap-1.5 px-2 py-2.5",
                      isProducts && "min-h-[78px] rounded-[13px] px-1.5 py-2",
                      isTrust && "min-h-[76px] rounded-[13px] px-1.5 py-2"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--brand-primary)] shadow-[0_8px_18px_rgba(25,68,112,0.08)]",
                        isBrand && "h-10 w-10",
                        (isProducts || isTrust) && "h-9 w-9"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px]",
                          isBrand && "h-6 w-6",
                          (isProducts || isTrust) && "h-[21px] w-[21px]"
                        )}
                        strokeWidth={1.72}
                      />
                    </span>
                    <span
                      className={cn(
                        "text-[10.5px] font-semibold leading-[1.14] text-[#244d7c]",
                        isBrand && "text-[11.4px]",
                        isProducts && "text-[10.2px]",
                        isTrust && "text-[10px]"
                      )}
                    >
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}

          <Link
            href={scene.href}
            className={cn(
              "group mx-auto mt-3.5 flex min-h-[48px] w-[calc(100%-0.5rem)] items-center justify-center gap-3 rounded-full bg-[var(--brand-primary)] px-5 text-[14px] font-semibold text-white shadow-[0_18px_42px_rgba(0,58,117,0.22)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
              isBrand && "mt-4 min-h-[54px] w-[calc(100%-0.25rem)] gap-4 text-[16px]",
              isYogurts && "mt-3 min-h-[46px]",
              isProducts && "mt-3.5",
              isTrust && "mt-3.5"
            )}
          >
            {scene.cta}
            <ArrowRight
              className={cn(
                "h-5 w-5 transition-transform duration-300 group-hover:translate-x-1",
                isBrand && "h-6 w-6",
                isYogurts && "ml-auto"
              )}
            />
          </Link>

          {scene.note ? (
            <div
              className={cn(
                "mt-2.5 flex items-center justify-center gap-2 text-center text-[10.5px] font-medium text-[#7892b5]",
                isYogurts && "mt-2 text-[9.6px]",
                isTrust && "mt-2 text-[9.6px]",
                isProducts && "mt-2 text-[9.8px]"
              )}
            >
              <Leaf className="h-3.5 w-3.5" strokeWidth={1.7} />
              <span>{scene.note}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileCardShape({tone}: {tone: MobileHeroTone}) {
  const isBrand = tone === "brand";
  const isYogurts = tone === "yogurts";
  const isTrust = tone === "trust";
  const outerPath = isBrand
    ? "M28 18C14 18 2 31 2 48V386C2 410 20 428 44 428H318C342 428 358 411 358 386V48C358 27 342 15 322 20C292 28 287 7 256 8H46C37 8 31 12 28 18Z"
    : isYogurts
      ? "M25 11C10 11 1 24 1 41V389C1 411 18 429 40 429H319C342 429 359 412 359 389V42C359 22 344 9 323 13C289 21 283 0 250 2H44C35 2 29 6 25 11Z"
      : isTrust
        ? "M25 12C10 12 1 25 1 42V389C1 411 18 429 40 429H320C342 429 359 411 359 389V42C359 20 344 8 323 13C296 18 292 5 266 6H44C35 6 29 9 25 12Z"
        : "M24 10C10 10 1 23 1 39V389C1 411 18 429 40 429H320C342 429 359 411 359 389V40C359 20 345 8 325 12C296 18 292 5 264 5H44C35 5 29 7 24 10Z";
  const innerPath = isBrand
    ? "M31 21C16 23 5 34 5 51V383C5 406 23 424 45 424H315C338 424 355 407 355 383V52C355 34 345 23 329 23C296 33 288 13 257 13H47C39 13 34 16 31 21Z"
    : isYogurts
      ? "M28 14C13 17 4 28 4 44V386C4 409 22 426 43 426H316C339 426 356 409 356 386V45C356 28 346 18 329 17C290 27 283 6 251 7H45C37 7 31 10 28 14Z"
      : isTrust
        ? "M28 15C13 17 4 28 4 45V386C4 409 22 426 43 426H317C339 426 356 409 356 386V45C356 28 346 18 330 17C298 24 292 11 266 11H45C37 11 31 13 28 15Z"
        : "M27 13C13 16 4 27 4 43V386C4 409 22 426 43 426H317C339 426 356 409 356 386V44C356 27 346 17 330 16C296 22 291 10 264 10H45C37 10 31 11 27 13Z";

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_24px_54px_rgba(25,68,112,0.16)]"
      preserveAspectRatio="none"
      viewBox="0 0 360 430"
    >
      <path
        d={outerPath}
        fill={isYogurts || isTrust ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.94)"}
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="1.5"
      />
      <path
        d={innerPath}
        fill="url(#mobile-card-glow)"
      />
      <defs>
        <linearGradient id="mobile-card-glow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="0.58" stopColor="rgba(255,255,255,0)" />
          <stop offset="1" stopColor="rgba(235,244,255,0.18)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MobileCardVisual({tone}: {tone: MobileHeroTone}) {
  if (tone === "trust") {
    return (
      <div className="pointer-events-none absolute right-[-0.3rem] top-[3.9rem] z-0 h-40 w-40 text-[#74b7ee]">
        <div className="absolute right-0 top-8 h-28 w-32 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92),rgba(255,255,255,0)_72%)] blur-[1px]" />
        <div className="absolute right-7 top-7 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(219,239,255,0.92),rgba(255,255,255,0)_68%)]" />
        <ShieldCheck className="absolute right-8 top-8 h-20 w-20 drop-shadow-[0_18px_28px_rgba(68,145,212,0.24)]" strokeWidth={1.35} />
      </div>
    );
  }

  return null;
}

function YogurtsSceneInfo({
  scene,
  reducedMotion
}: {
  scene: HeroScene;
  reducedMotion: boolean;
}) {
  const highlights = scene.highlights ?? [];
  const highlightIcons = [Milk, Heart, Leaf];

  return (
    <motion.div
      variants={{
        hidden: {opacity: 0, y: 24, scale: 0.986, filter: "blur(12px)"},
        visible: {opacity: 1, y: 0, scale: 1, filter: "blur(0px)"},
        exit: {opacity: 0, y: -12, scale: 0.992, filter: "blur(8px)"}
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.78,
        delay: reducedMotion ? 0 : 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="mt-4 max-w-[580px] rounded-[22px] border border-white/68 bg-white/50 p-4 text-[#244d7c] shadow-[0_18px_48px_rgba(25,68,112,0.09),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-[22px] lg:p-4"
    >
      <p className="text-pretty text-[14px] font-medium leading-6 lg:text-[15px] lg:leading-6">
        {scene.description}
      </p>

      {highlights.length ? (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {highlights.map((highlight, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];

            return (
              <div
                key={highlight}
                className="flex min-h-[58px] flex-col justify-between rounded-[14px] border border-[#315b89]/10 bg-white/56 px-3 py-2.5 text-[var(--brand-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.76)]"
              >
                <Icon className="h-[17px] w-[17px] text-[#4779aa]" strokeWidth={1.8} />
                <span className="text-[11px] font-semibold leading-[1.16]">
                  {highlight}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      {scene.cta ? (
        <Link
          href={scene.cta.href}
          className="group mt-4 inline-flex min-h-[46px] items-center gap-3 rounded-full bg-[var(--brand-primary)] px-5 text-[13px] font-semibold text-white shadow-[0_14px_32px_rgba(0,58,117,0.18)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          {scene.cta.label}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </motion.div>
  );
}

function ProductsSceneInfo({
  scene,
  reducedMotion
}: {
  scene: HeroScene;
  reducedMotion: boolean;
}) {
  const highlights = scene.highlights ?? [];
  const highlightIcons = [Milk, Droplets, Leaf];

  return (
    <motion.div
      variants={{
        hidden: {opacity: 0, y: 24, scale: 0.986, filter: "blur(12px)"},
        visible: {opacity: 1, y: 0, scale: 1, filter: "blur(0px)"},
        exit: {opacity: 0, y: -12, scale: 0.992, filter: "blur(8px)"}
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.78,
        delay: reducedMotion ? 0 : 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="mt-4 max-w-[640px] rounded-[22px] border border-white/70 bg-white/50 p-4 text-[#244d7c] shadow-[0_18px_48px_rgba(25,68,112,0.09),inset_0_1px_0_rgba(255,255,255,0.84)] backdrop-blur-[22px] lg:p-4"
    >
      <p className="max-w-[580px] text-pretty text-[14px] font-medium leading-6 lg:text-[15px] lg:leading-6">
        {scene.description}
      </p>

      {highlights.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {highlights.slice(0, 3).map((highlight, index) => {
            const Icon = highlightIcons[index % highlightIcons.length];

            return (
              <span
                key={highlight}
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#315b89]/10 bg-white/60 px-3 text-[11px] font-semibold text-[var(--brand-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]"
              >
                <Icon className="h-4 w-4 text-[#4779aa]" strokeWidth={1.85} />
                {highlight}
              </span>
            );
          })}
        </div>
      ) : null}

      {scene.cta ? (
        <Link
          href={scene.cta.href}
          className="group mt-4 inline-flex min-h-[46px] items-center gap-3 rounded-full bg-[var(--brand-primary)] px-5 text-[13px] font-semibold text-white shadow-[0_14px_32px_rgba(0,58,117,0.18)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
          {scene.cta.label}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </motion.div>
  );
}

function HeroMainScene({
  scene,
  reducedMotion
}: {
  scene: HeroScene;
  reducedMotion: boolean;
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const [introOffset, setIntroOffset] = useState({x: 0, y: 0, ready: false});
  const [introReleased, setIntroReleased] = useState(false);
  const animationReady = reducedMotion || (introOffset.ready && introReleased);
  const flightDuration = reducedMotion ? 0 : 2.08;
  const revealDelay = reducedMotion ? 0 : 1.76;
  const revealHidden = {
    opacity: 0,
    y: 24,
    scale: 0.986,
    filter: "blur(12px)"
  };
  const revealVisible = {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)"
  };

  useEffect(() => {
    if (reducedMotion) {
      setIntroReleased(true);
      return;
    }

    const sofinWindow = window as SofinWindow;
    let releaseFrame: number | undefined;
    let fallbackTimer: number | undefined;

    const releaseIntro = () => {
      if (releaseFrame) return;

      releaseFrame = window.requestAnimationFrame(() => {
        setIntroReleased(true);
      });
    };

    if (sofinWindow.__sofinPreloaderDone) {
      releaseIntro();
    } else {
      window.addEventListener(PRELOADER_DONE_EVENT, releaseIntro, {once: true});
      fallbackTimer = window.setTimeout(releaseIntro, 1500);
    }

    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, releaseIntro);

      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (releaseFrame) window.cancelAnimationFrame(releaseFrame);
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) {
      setIntroOffset({x: 0, y: 0, ready: true});
      return;
    }

    const measureIntro = () => {
      const shell = shellRef.current;
      const intro = introRef.current;
      if (!shell || !intro) return;

      const shellRect = shell.getBoundingClientRect();
      const introRect = intro.getBoundingClientRect();
      const centeredLeft = window.innerWidth / 2 - introRect.width / 2;
      const centeredTop = window.innerHeight / 2 - introRect.height / 2;
      const horizontalOffset = Math.max(0, centeredLeft - shellRect.left);
      const verticalOffset = Math.max(
        0,
        Math.min(centeredTop - introRect.top, window.innerHeight * 0.22)
      );

      setIntroOffset((current) => {
        const sameX = Math.abs(current.x - horizontalOffset) < 0.5;
        const sameY = Math.abs(current.y - verticalOffset) < 0.5;

        if (current.ready && sameX && sameY) return current;

        return {
          x: horizontalOffset,
          y: verticalOffset,
          ready: true
        };
      });
    };

    const frame = window.requestAnimationFrame(measureIntro);
    window.addEventListener("resize", measureIntro);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureIntro);
    };
  }, [reducedMotion]);

  return (
    <motion.div
      key={`content-${scene.id}`}
      ref={shellRef}
      initial={false}
      exit={{opacity: 0, y: -12, filter: "blur(8px)"}}
      transition={{duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1]}}
      className="flex w-full max-w-[555px] flex-col text-[var(--brand-primary)] max-sm:min-h-[calc(100svh-11rem)]"
    >
      <motion.div
        ref={introRef}
        initial={false}
        animate={
          reducedMotion
            ? {opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)"}
            : animationReady
              ? {
                  opacity: [0, 1, 1, 1],
                  x: [introOffset.x, introOffset.x * 0.98, 0, 0],
                  y: [introOffset.y, introOffset.y * 0.96, 0, 0],
                  scale: [0.88, 1.025, 1, 1],
                  filter: ["blur(18px)", "blur(0px)", "blur(0px)", "blur(0px)"]
                }
              : {
                  opacity: 0,
                  x: introOffset.x,
                  y: introOffset.y,
                  scale: 0.88,
                  filter: "blur(18px)"
                }
        }
        transition={{
          duration: flightDuration,
          times: [0, 0.22, 0.8, 1],
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative w-fit max-w-full will-change-transform"
      >
        <motion.div
          aria-hidden="true"
          className="absolute -inset-x-8 -inset-y-5 -z-10 rounded-[42px] border border-white/48 bg-white/34 shadow-[0_24px_80px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[18px] sm:-inset-x-12 sm:-inset-y-7"
          initial={false}
          animate={
            animationReady
              ? {opacity: [0, 0.84, 0.38, 0], scale: [0.84, 1.06, 0.96, 0.74]}
              : {opacity: 0, scale: 0.86}
          }
          transition={{
            duration: reducedMotion ? 0 : 1.72,
            times: [0, 0.28, 0.72, 1],
            ease: [0.16, 1, 0.3, 1]
          }}
        />

        {!reducedMotion
          ? [
              "left-[6%] top-[-8%] h-3 w-3",
              "right-[18%] top-[0%] h-4 w-4",
              "left-[34%] bottom-[-10%] h-2.5 w-2.5",
              "right-[6%] bottom-[12%] h-3.5 w-3.5"
            ].map((bubbleClass, index) => (
              <motion.span
                key={bubbleClass}
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute z-10 rounded-full border border-white/72 bg-white/55 shadow-[0_8px_22px_rgba(25,68,112,0.12)]",
                  bubbleClass
                )}
                initial={false}
                animate={
                  animationReady
                    ? {
                        opacity: [0, 0.72, 0],
                        scale: [0.46, 1, 0.38],
                        x: [0, index % 2 === 0 ? -34 : 34, index % 2 === 0 ? -58 : 54],
                        y: [0, -24 - index * 5, -46 - index * 7]
                      }
                    : {opacity: 0, scale: 0.4, x: 0, y: 0}
                }
                transition={{
                  duration: 1.28,
                  delay: 0.2 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
              />
            ))
          : null}

        <motion.h1
          initial={false}
          animate={
            reducedMotion
              ? {opacity: 1, y: 0, filter: "blur(0px)"}
              : animationReady
                ? {
                    opacity: [0, 1, 1],
                    y: [16, 0, 0],
                    filter: ["blur(14px)", "blur(0px)", "blur(0px)"]
                  }
                : {opacity: 0, y: 16, filter: "blur(14px)"}
          }
          transition={{
            duration: reducedMotion ? 0 : 0.92,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-[clamp(3.15rem,14vw,3.85rem)] font-semibold leading-[0.92] tracking-[-0.06em] sm:text-[clamp(4.8rem,7.4vw,7.25rem)] lg:text-[clamp(5.1rem,6vw,7.35rem)]"
        >
          {scene.title}
        </motion.h1>

        {scene.subtitle ? (
          <motion.p
            initial={false}
            animate={
              reducedMotion
                ? {opacity: 1, y: 0, filter: "blur(0px)"}
                : animationReady
                  ? {
                      opacity: [0, 1, 1],
                      y: [12, 0, 0],
                      filter: ["blur(10px)", "blur(0px)", "blur(0px)"]
                    }
                  : {opacity: 0, y: 12, filter: "blur(10px)"}
            }
            transition={{
              duration: reducedMotion ? 0 : 0.78,
              delay: reducedMotion ? 0 : 0.16,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mt-3 text-[clamp(1.18rem,5.4vw,1.5rem)] font-medium leading-tight tracking-[-0.025em] sm:mt-6 sm:text-[clamp(1.65rem,2.35vw,2.2rem)]"
          >
            {scene.subtitle}
          </motion.p>
        ) : null}
      </motion.div>

      <motion.div
        initial={false}
        animate={animationReady ? revealVisible : revealHidden}
        transition={{
          duration: reducedMotion ? 0 : 0.64,
          delay: revealDelay,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="mt-4 flex max-w-[230px] items-center gap-3 text-[#59799b] sm:mt-6 sm:max-w-[390px] sm:gap-4"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-[#9eb1c8]/62" />
        <Leaf className="h-7 w-7" strokeWidth={1.9} />
        <span className="h-px flex-1 bg-[#9eb1c8]/62" />
      </motion.div>

      <motion.div
        initial={false}
        animate={animationReady ? revealVisible : revealHidden}
        transition={{
          duration: reducedMotion ? 0 : 0.74,
          delay: revealDelay + 0.14,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="mt-auto flex max-w-[500px] items-center gap-4 rounded-[22px] border border-white/60 bg-white/44 p-4 text-[#244d7c] shadow-[0_18px_52px_rgba(25,68,112,0.1),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-[18px] sm:mt-6 sm:gap-5 sm:p-5"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#315b89]/32 bg-white/26 text-[#315b89] sm:h-16 sm:w-16">
          <Leaf className="h-7 w-7" strokeWidth={1.8} />
        </span>
        <p className="text-pretty text-sm font-medium leading-6 sm:text-[15px] sm:leading-7">
          {scene.description}
        </p>
      </motion.div>

      {scene.cta ? (
        <motion.div
          initial={false}
          animate={animationReady ? revealVisible : revealHidden}
          transition={{
            duration: reducedMotion ? 0 : 0.68,
            delay: revealDelay + 0.28,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="mt-5 sm:mt-6"
        >
          <Link
            href={scene.cta.href}
            className="group inline-flex min-h-[50px] items-center gap-3 rounded-full bg-[var(--brand-primary)] px-6 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,58,117,0.2)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:min-h-[54px] sm:px-7"
          >
            {scene.cta.label}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function YogurtsPreviewCard({scene}: {scene: HeroScene}) {
  const highlights = scene.highlights ?? [];
  const href = scene.cta?.href ?? "/yogurts";

  return (
    <Link
      href={href}
      className="group relative block min-h-[420px] overflow-hidden rounded-[28px] border border-white/72 bg-white/32 p-3 shadow-[0_24px_64px_rgba(25,68,112,0.14),inset_0_1px_0_rgba(255,255,255,0.84)] outline-none backdrop-blur-[22px] transition duration-500 hover:-translate-y-1 hover:bg-white/42 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.84),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(249,219,194,0.34),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08))]" />

      <div className="relative h-[396px] overflow-hidden rounded-[24px] border border-white/64 bg-[#f5f9fd]/42">
        <Image
          src={assetUrl("/sofin-yogur-pics/first-slide.webp")}
          alt=""
          fill
          sizes="470px"
          className="object-cover object-[56%_50%] transition duration-700 group-hover:scale-[1.035]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.08)_42%,rgba(244,248,252,0.94)_100%)]" />

        <div className="absolute bottom-4 left-4 right-4 text-[var(--brand-primary)]">
          {highlights.length ? (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {highlights.slice(0, 3).map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-white/68 bg-white/68 px-2.5 py-1 text-[10px] font-semibold shadow-[0_8px_18px_rgba(25,68,112,0.05)] backdrop-blur-xl"
                >
                  {highlight}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-5">
            <div>
              <div className="max-w-[300px] text-[clamp(1.25rem,1.75vw,1.6rem)] font-semibold leading-[1.04] tracking-[0]">
                {scene.cta?.label ?? "Open yogurts"}
              </div>
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-[0_14px_28px_rgba(0,58,117,0.2)] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}
