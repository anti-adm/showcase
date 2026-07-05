"use client";

import {useEffect, useMemo, useRef, useState} from "react";
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
import Link from "next/link";
import Image from "next/image";
import {useLocale} from "next-intl";

import {getHeroScenes, type HeroScene} from "@/data/home/hero-scenes";
import {assetUrl} from "@/lib/assets";
import {cn} from "@/lib/utils";
import HeroSnapController from "./hero-snap-controller";

type Locale = "uz" | "ru" | "en";

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
const MOBILE_YOGURT_IMAGE = "/images/products/yogurt120/qulupnay120.webp";

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
                className="hidden object-cover sm:block"
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
                    : "mx-auto grid w-full max-w-[1380px] items-center gap-8 px-4 pb-[max(1.3rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-14 sm:pt-36 lg:px-12 xl:gap-12",
                  index === 2
                    ? "lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.72fr)]"
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
                        index === 2 && "lg:max-w-[920px]"
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
                          className="mb-4 inline-flex rounded-full border border-[#315b89]/18 bg-white/42 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--brand-primary)] shadow-[0_12px_34px_rgba(25,68,112,0.08)] backdrop-blur-2xl"
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
                          "max-w-[1080px] text-balance font-semibold leading-[1.06] tracking-[-0.045em] text-[var(--brand-primary)]",
                          index === 2
                            ? "max-w-[860px] leading-[1.06] text-[clamp(2rem,8.8vw,2.85rem)] sm:text-[clamp(2.55rem,5.7vw,3.45rem)] lg:text-[clamp(2.7rem,3vw,3.22rem)]"
                            : "text-[clamp(2.35rem,8.4vw,3.05rem)] sm:text-[clamp(2.8rem,5vw,3.7rem)] lg:text-[clamp(3rem,3.35vw,3.65rem)]"
                        )}
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

                      {index !== 2 ? (
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

                {index === 2 ? (
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
                        className="ml-auto w-full max-w-[520px]"
                      >
                        <YogurtsPreviewCard />
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
  const titleWidth =
    scene.tone === "yogurts"
      ? "max-w-[86%]"
      : scene.tone === "trust"
        ? "max-w-[70%]"
        : scene.tone === "products"
          ? "max-w-[96%]"
          : "max-w-full";
  const titleClass =
    scene.tone === "brand"
      ? "font-[family:var(--font-display)] text-[clamp(2rem,8.75vw,2.62rem)] font-semibold"
      : scene.tone === "yogurts"
        ? "font-[family:var(--font-display)] text-[clamp(1.82rem,7.55vw,2.22rem)] font-semibold"
        : scene.tone === "trust"
          ? "text-[clamp(1.82rem,7.65vw,2.3rem)] font-semibold"
          : "text-[clamp(1.82rem,7.65vw,2.3rem)] font-semibold";
  const isDecorated = scene.tone === "yogurts" || scene.tone === "trust";

  return (
    <div className="-mx-1 pb-[max(0.52rem,env(safe-area-inset-bottom))]">
      <div className="relative px-4 pb-3.5 pt-[1.25rem] text-[var(--brand-primary)]">
        <MobileCardShape />
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_96%_4%,rgba(255,244,224,0.44),transparent_26%),radial-gradient(circle_at_0%_0%,rgba(213,235,255,0.34),transparent_31%),linear-gradient(145deg,rgba(255,255,255,0.20),rgba(255,255,255,0)_62%)]" />
        <MobileCardVisual tone={scene.tone} />

        <div className="relative z-10">
          {scene.eyebrow ? (
            <div className="mb-3 inline-flex rounded-full border border-[#315b89]/16 bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--brand-primary)] shadow-[0_8px_20px_rgba(25,68,112,0.05),inset_0_1px_0_rgba(255,255,255,0.92)]">
              {scene.eyebrow}
            </div>
          ) : null}

          <h2
            className={cn(
              "whitespace-pre-line text-balance leading-[0.96] tracking-[-0.045em]",
              titleClass,
              titleWidth
            )}
          >
            {scene.title}
          </h2>

          <div className="mt-2.5 h-0.5 w-11 rounded-full bg-[#69aeea]" />

          <p
            className={cn(
              "mt-3 text-pretty text-[12.5px] font-medium leading-[1.45] text-[#244d7c]",
              scene.tone === "trust" ? "max-w-[72%]" : "max-w-full",
              scene.tone === "yogurts" && "max-w-[72%]"
            )}
          >
            {scene.description}
          </p>

          {scene.features?.length ? (
            <div
              className={cn(
                "mt-3.5 grid grid-cols-3 overflow-hidden border border-[#d9e4f1]/78 bg-white/76 shadow-[0_12px_28px_rgba(25,68,112,0.08),inset_0_1px_0_rgba(255,255,255,0.92)]",
                isDecorated ? "rounded-[18px]" : "rounded-[20px]"
              )}
            >
              {scene.features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.label}
                    className={cn(
                      "flex min-h-[70px] flex-col items-center justify-center gap-1 px-1.5 py-2 text-center",
                      index > 0 && "border-l border-[#315b89]/10"
                    )}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--brand-primary)] shadow-[0_8px_18px_rgba(25,68,112,0.08)]">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.72} />
                    </span>
                    <span className="text-[10.5px] font-semibold leading-[1.14] text-[#244d7c]">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}

          <Link
            href={scene.href}
            className="group mt-3.5 flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full bg-[var(--brand-primary)] px-5 text-[14px] font-semibold text-white shadow-[0_18px_42px_rgba(0,58,117,0.22)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            {scene.cta}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {scene.note ? (
            <div className="mt-2.5 flex items-center justify-center gap-2 text-center text-[10.5px] font-medium text-[#7892b5]">
              <Leaf className="h-3.5 w-3.5" strokeWidth={1.7} />
              <span>{scene.note}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MobileCardShape() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_24px_54px_rgba(25,68,112,0.16)]"
      preserveAspectRatio="none"
      viewBox="0 0 360 430"
    >
      <path
        d="M26 7C10 8 1 22 1 39V389C1 411 18 429 40 429H320C342 429 359 411 359 389V38C359 18 344 4 323 8C296 13 291 1 262 1H43C34 1 30 3 26 7Z"
        fill="rgba(255,255,255,0.94)"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="1.5"
      />
      <path
        d="M28 10C11 14 4 25 4 42V386C4 409 22 426 43 426H317C339 426 356 409 356 386V42C356 25 345 14 329 12C296 18 291 5 262 5H44C36 5 31 7 28 10Z"
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
  if (tone === "yogurts") {
    return (
      <div className="pointer-events-none absolute right-[-1.45rem] top-[4.7rem] z-0 h-32 w-32">
        <div className="absolute -inset-2 rotate-[-6deg] rounded-[18px] bg-white/72 shadow-[0_18px_34px_rgba(25,68,112,0.08)]" />
        <Image
          src={MOBILE_YOGURT_IMAGE}
          alt=""
          fill
          sizes="176px"
          className="rotate-[-8deg] object-contain opacity-95 drop-shadow-[0_22px_34px_rgba(25,68,112,0.16)]"
        />
      </div>
    );
  }

  if (tone === "trust") {
    return (
      <div className="pointer-events-none absolute right-[-0.7rem] top-[3.6rem] z-0 h-36 w-36 text-[#74b7ee]">
        <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle,rgba(219,239,255,0.92),rgba(255,255,255,0)_68%)]" />
        <div className="absolute inset-x-0 top-16 h-20 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.88),rgba(255,255,255,0)_70%)] blur-[1px]" />
        <ShieldCheck className="absolute right-7 top-7 h-20 w-20 drop-shadow-[0_18px_28px_rgba(68,145,212,0.24)]" strokeWidth={1.35} />
      </div>
    );
  }

  return null;
}

function HeroMainScene({
  scene,
  reducedMotion
}: {
  scene: HeroScene;
  reducedMotion: boolean;
}) {
  const item = {
    hidden: {opacity: 0, y: 22, filter: "blur(10px)"},
    visible: {opacity: 1, y: 0, filter: "blur(0px)"},
    exit: {opacity: 0, y: -12, filter: "blur(8px)"}
  };

  return (
    <motion.div
      key={`content-${scene.id}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.11,
            delayChildren: reducedMotion ? 0 : 0.03
          }
        },
        exit: {
          transition: {
            staggerChildren: 0.03,
            staggerDirection: -1
          }
        }
      }}
      className="flex w-full max-w-[555px] flex-col text-[var(--brand-primary)] max-sm:min-h-[calc(100svh-11rem)]"
    >
      <motion.h1
        variants={{
          hidden: {opacity: 0, y: 26, scale: 0.985, filter: "blur(12px)"},
          visible: {opacity: 1, y: 0, scale: 1, filter: "blur(0px)"},
          exit: {opacity: 0, y: -14, scale: 0.992, filter: "blur(8px)"}
        }}
        transition={{duration: 0.82, ease: [0.22, 1, 0.36, 1]}}
        className="text-[clamp(3.55rem,16vw,4.15rem)] font-semibold leading-[0.92] tracking-[-0.075em] sm:text-[clamp(5.5rem,9vw,8.5rem)] lg:text-[clamp(6.2rem,7.4vw,8.8rem)]"
      >
        {scene.title}
      </motion.h1>

      {scene.subtitle ? (
        <motion.p
          variants={item}
          transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
          className="mt-3 text-[clamp(1.25rem,6vw,1.6rem)] font-medium leading-tight tracking-[-0.045em] sm:mt-8 sm:text-[clamp(2rem,3vw,2.85rem)]"
        >
          {scene.subtitle}
        </motion.p>
      ) : null}

      <motion.div
        variants={item}
        transition={{duration: 0.64, ease: [0.22, 1, 0.36, 1]}}
        className="mt-4 flex max-w-[250px] items-center gap-3 text-[#59799b] sm:mt-8 sm:max-w-[450px] sm:gap-4"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-[#9eb1c8]/62" />
        <Leaf className="h-7 w-7" strokeWidth={1.9} />
        <span className="h-px flex-1 bg-[#9eb1c8]/62" />
      </motion.div>

      <motion.div
        variants={item}
        transition={{duration: 0.72, ease: [0.22, 1, 0.36, 1]}}
        className="mt-auto flex max-w-[535px] items-center gap-4 rounded-[24px] border border-white/60 bg-white/46 p-4 text-[#244d7c] shadow-[0_22px_70px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-[18px] sm:mt-7 sm:gap-6 sm:rounded-[30px] sm:bg-white/38 sm:p-6"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#315b89]/36 bg-white/26 text-[#315b89] sm:h-[74px] sm:w-[74px]">
          <Leaf className="h-8 w-8" strokeWidth={1.8} />
        </span>
        <p className="text-pretty text-sm font-medium leading-7 sm:text-[16px] sm:leading-8">
          {scene.description}
        </p>
      </motion.div>

      {scene.cta ? (
        <motion.div
          variants={item}
          transition={{duration: 0.68, ease: [0.22, 1, 0.36, 1]}}
          className="mt-5 sm:mt-8"
        >
          <Link
            href={scene.cta.href}
            className="group inline-flex min-h-14 items-center gap-4 rounded-full bg-[var(--brand-primary)] px-7 text-sm font-semibold text-white shadow-[0_18px_46px_rgba(0,58,117,0.22)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:min-h-[60px] sm:px-9 sm:text-base"
          >
            {scene.cta.label}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function YogurtsPreviewCard() {
  return (
    <Link
      href="/yogurts"
      className="group relative block min-h-[420px] overflow-hidden rounded-[32px] border border-white/58 bg-white/40 p-5 shadow-[0_24px_70px_rgba(25,68,112,0.14)] outline-none transition duration-500 hover:-translate-y-1 hover:bg-white/52 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.46),transparent_28%),radial-gradient(circle_at_78%_78%,rgba(89,121,155,0.12),transparent_32%)]" />
      <div className="relative h-[380px] overflow-hidden rounded-[26px] border border-white/56 bg-white/28">
        <Image
          src={assetUrl("/backgrounds/main-background.webp")}
          alt=""
          fill
          sizes="520px"
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(245,250,255,0.16)_50%,rgba(245,250,255,0.72)_100%)]" />
      </div>

      <div className="absolute left-8 top-8 rounded-full border border-[#315b89]/18 bg-white/58 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)] backdrop-blur-md">
        SOFIN / Yogurts
      </div>

      <div className="absolute bottom-8 left-8 right-8 rounded-[22px] border border-white/54 bg-white/58 p-4 text-[var(--brand-primary)] backdrop-blur-md">
        <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#59799b]">
          Коллекция
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Перейти к странице йогуртов
        </div>
      </div>
    </Link>
  );
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}
