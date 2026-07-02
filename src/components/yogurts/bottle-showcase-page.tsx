"use client";

import {Suspense, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode} from "react";
import {Canvas, useFrame, useLoader, useThree} from "@react-three/fiber";
import {Environment, PerspectiveCamera, useGLTF} from "@react-three/drei";
import {
  ArrowRight,
  Baby,
  Cherry,
  ChevronUp,
  Citrus,
  Droplet,
  Grape,
  Leaf,
  Milk,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import {useLocale} from "next-intl";
import * as THREE from "three";
import styles from "./bottle-showcase.module.css";

type Locale = "uz" | "ru" | "en";
type FlavorKey =
  | "ananas"
  | "banan"
  | "ormon-meva"
  | "malina"
  | "olcha"
  | "shaftoli"
  | "qulupnay-banan"
  | "qulupnay";

type BottleFlavor = {
  key: FlavorKey;
  texture: string;
  tint: string;
  background: string;
  mobileBackground: string;
  title: string;
  headline: string;
  description: string;
};

type BottleCopy = {
  title: string;
  headline: string;
  description: string;
};

type HeroIntroCopy = {
  eyebrow: string;
  title: [string, string];
  description: string;
  primaryCta: string;
  badgeLabel: string;
  categories: string[];
  features: Array<{title: string; text: string}>;
};

type EndingSlide = {
  src: string;
  title: string;
  text: string;
};

const MODEL_PATH = "/models/New product/yogurtchalar yangi2.glb?v=20260630";
const HERO_BACKGROUND = "/sofin-yogur-pics/background-bottles.png";
const HERO_BACKGROUND_MOBILE = "/sofin-yogur-pics/background-bottles-m.png";
const INTRO_TRANSITION_MS = 2200;
const FLAVOR_TRANSITION_MS = 2200;
const WHEEL_THRESHOLD = 18;
const TOUCH_THRESHOLD = 44;
const ENDING_NAVIGATION_LOCK_MS = 560;
const BOTTLE_FRONT_ROTATION = -0.04;
const BOTTLE_FRONT_RX = 0.02;
const MOBILE_ASPECT_MAX = 0.72;
const DESKTOP_FLAVOR_PLACEMENTS = [
  "center",
  "left",
  "right",
  "left",
  "right",
  "left",
  "center",
  "left"
] satisfies ActiveBottlePlacement[];

const BOTTLE_FLAVORS = [
  {
    key: "ananas",
    texture: "/textures/products2/YOGURT_BOTTLE_ANANAS.webp",
    tint: "#f7dc8f",
    background: "/backgrounds2/pineapple.webp",
    mobileBackground: "/backgrounds2/ananas-m.webp",
    title: "Ananas",
    headline: "Tropik yumshoqlik",
    description: "Quyoshli ananas ta'mi va mayin yogurt teksturasi har kuni yengil, toza va yorqin kayfiyat beradi."
  },
  {
    key: "banan",
    texture: "/textures/products2/YOGURT_BOTTLE_BANAN.webp",
    tint: "#f3d779",
    background: "/backgrounds2/banan.webp",
    mobileBackground: "/backgrounds2/banan-m.webp",
    title: "Banan",
    headline: "Mayin va kremli",
    description: "Banan ta'mi silliq yogurt asosida ochiladi: shirinligi sokin, tuzilishi esa yumshoq va ichimlikka qulay."
  },
  {
    key: "ormon-meva",
    texture: "/textures/products2/YOGURT_BOTTLE_ORMON_MEVA.webp",
    tint: "#bda0d9",
    background: "/backgrounds2/ormov-meva.webp",
    mobileBackground: "/backgrounds2/ormon-meva-m.webp",
    title: "O'rmon meva",
    headline: "Mevali assortiment",
    description: "O'rmon mevalari aralashmasi yogurtga chuqurroq, salqin va boy ta'm beradi."
  },
  {
    key: "malina",
    texture: "/textures/products2/YOGURT_BOTTLE_MALINA.webp",
    tint: "#ef9fbd",
    background: "/backgrounds2/malina.webp",
    mobileBackground: "/backgrounds2/malina-m.webp",
    title: "Malina",
    headline: "Berry fresh",
    description: "Malinaning nozik nordon-shirin ohangi yogurtga tiniq mevali xarakter va jonli rang beradi."
  },
  {
    key: "olcha",
    texture: "/textures/products2/YOGURT_BOTTLE_OLCHA.webp",
    tint: "#f19aae",
    background: "/backgrounds2/olcha.webp",
    mobileBackground: "/backgrounds2/olcha-m.webp",
    title: "Olcha",
    headline: "Yorqin mevali ta'm",
    description: "Olchaning to'yingan ta'mi silliq sutli asos bilan balansda turadi: aniq, shirali va esda qoladigan."
  },
  {
    key: "shaftoli",
    texture: "/textures/products2/YOGURT_BOTTLE_SHAFTOLI.webp",
    tint: "#efb089",
    background: "/backgrounds2/peach.webp",
    mobileBackground: "/backgrounds2/peach-m.webp",
    title: "Shaftoli",
    headline: "Iliq mevali kayfiyat",
    description: "Shaftoli ta'mi ichimlikka iliq, baxmaldek yumshoq va tabiiy mevali ohang beradi."
  },
  {
    key: "qulupnay-banan",
    texture: "/textures/products2/YOGURT_BOTTLE_QULUPNAY_BANAN.webp",
    tint: "#f0c891",
    background: "/backgrounds2/strawberry-banan.webp",
    mobileBackground: "/backgrounds2/strawberry-banan-m.webp",
    title: "Qulupnay banan",
    headline: "Ikki ta'm balansi",
    description: "Qulupnayning yorqinligi va bananning kremli yumshoqligi bitta sokin, shirin duetga yig'iladi."
  },
  {
    key: "qulupnay",
    texture: "/textures/products2/YOGURT_BOTTLE_QULUPNAY.webp",
    tint: "#f3a2bd",
    background: "/backgrounds2/strawberry.webp",
    mobileBackground: "/backgrounds2/strawberry-m.webp",
    title: "Qulupnay",
    headline: "Klassik shirinlik",
    description: "Qulupnayli yogurt - tanish, yumshoq va ishonchli ta'm: silliq ichiladi, tez yoqadi."
  }
] satisfies BottleFlavor[];

const FLAVOR_PRODUCT_SLUGS: Record<FlavorKey, string> = {
  ananas: "yogurt-pineapple-270",
  banan: "yogurt-banana-270",
  "ormon-meva": "yogurt-forest-270",
  malina: "yogurt-raspberry-270",
  olcha: "yogurt-cherry",
  shaftoli: "yogurt-peach-270",
  "qulupnay-banan": "yogurt-strawberry-banana-270",
  qulupnay: "yogurt-strawberry-270"
};

const ENDING_BACKGROUND = "/sofin-yogur-pics/back-yogurt.webp";
const ENDING_SLIDES = [
  {
    src: "/sofin-yogur-pics/first-slide.webp",
    title: "Har bir ta'm o'z sahnasida",
    text: "Mevali chiziq yumshoq sutli asos bilan birlashib, yengil va tabiiy kayfiyat beradi."
  },
  {
    src: "/sofin-yogur-pics/second-slide.webp",
    title: "Ichishga qulay format",
    text: "Yogurtchalar kun davomida tez, toza va sokin pauza uchun tayyorlangan."
  },
  {
    src: "/sofin-yogur-pics/3-slide.webp",
    title: "Mevalar yorqin ochiladi",
    text: "Har bir rang o'z ta'mini ko'rsatadi, umumiy ritm esa sokin va tartibli qoladi."
  },
  {
    src: "/sofin-yogur-pics/4-slide.webp",
    title: "Mayin sutli asos",
    text: "Tuzilishi silliq, ta'mi esa ortiqcha og'irliksiz, kundalik tanlovga mos."
  },
  {
    src: "/sofin-yogur-pics/5-slide.webp",
    title: "Bitta line, turli kayfiyat",
    text: "Ananasdan qulupnaygacha bo'lgan assortiment sahifani jonli kolleksiyaga aylantiradi."
  },
  {
    src: "/sofin-yogur-pics/6-slide.webp",
    title: "Yangi yogurtchalar",
    text: "3D sahnadan keyin mahsulot fotosuratlari kolleksiyani yakunlaydi."
  }
] satisfies EndingSlide[];
const ENDING_LAST_STAGE = ENDING_SLIDES.length + 1;

const HERO_CATEGORY_ITEMS = [
  {icon: Milk, active: true},
  {icon: Cherry},
  {icon: Leaf},
  {icon: Milk},
  {icon: Baby}
] satisfies Array<{icon: LucideIcon; active?: boolean}>;

const HERO_FEATURES = [
  {icon: Leaf},
  {icon: ShieldCheck},
  {icon: Droplet},
  {icon: Milk}
] satisfies Array<{icon: LucideIcon}>;

const HERO_INTRO_TRANSLATIONS: Record<Locale, HeroIntroCopy> = {
  uz: {
    eyebrow: "TABIATDAN - SIZ UCHUN",
    title: ["Sof ta'm.", "Tabiiy foyda."],
    description:
      "SOFIN yogurtlari - tabiiy mevalar, sifatli sut va yog'urt madaniyati uyg'unligidan yaratilgan. Har kuni uchun mazali va foydali tanlov.",
    primaryCta: "Mahsulotlarni ko'rish",
    badgeLabel: "TABIIY TARKIB",
    categories: ["Barcha yogurtlar", "Mevali yogurtlar", "Bio yogurtlar", "Ichimlik yogurtlar", "Bolalar uchun"],
    features: [
      {title: "Tabiiy ingredientlar", text: "Faqat eng sifatli sut va tabiiy mevalar."},
      {title: "Foydali va yengil", text: "Teri uchun foydali probiotiklar va past yog' miqdori."},
      {title: "Sifat kafolati", text: "Zamonaviy texnologiya va qat'iy nazorat."},
      {title: "Har kuni uchun", text: "Mazali ta'm va qulay qadoqlash."}
    ]
  },
  ru: {
    eyebrow: "ОТ ПРИРОДЫ - ДЛЯ ВАС",
    title: ["Чистый вкус.", "Натуральная польза."],
    description:
      "Йогурты SOFIN созданы из натуральных фруктов, качественного молока и живой йогуртовой культуры. Вкусный и полезный выбор на каждый день.",
    primaryCta: "Смотреть продукты",
    badgeLabel: "НАТУРАЛЬНЫЙ СОСТАВ",
    categories: ["Все йогурты", "Фруктовые йогурты", "Bio йогурты", "Питьевые йогурты", "Для детей"],
    features: [
      {title: "Натуральные ингредиенты", text: "Только качественное молоко и натуральные фрукты."},
      {title: "Легкий и полезный", text: "Пробиотики и мягкий вкус на каждый день."},
      {title: "Гарантия качества", text: "Современная технология и строгий контроль."},
      {title: "На каждый день", text: "Удобная упаковка и приятный вкус."}
    ]
  },
  en: {
    eyebrow: "FROM NATURE - FOR YOU",
    title: ["Pure taste.", "Natural benefit."],
    description:
      "SOFIN yogurts are made with natural fruit, quality milk and live yogurt cultures. A tasty and wholesome choice for every day.",
    primaryCta: "View products",
    badgeLabel: "NATURAL INGREDIENTS",
    categories: ["All yogurts", "Fruit yogurts", "Bio yogurts", "Drinkable yogurts", "For kids"],
    features: [
      {title: "Natural ingredients", text: "Only quality milk and natural fruit."},
      {title: "Light and wholesome", text: "Probiotics and a gentle everyday taste."},
      {title: "Quality guarantee", text: "Modern technology and strict control."},
      {title: "For every day", text: "Convenient packaging and a pleasant taste."}
    ]
  }
};

const BOTTLE_FLAVOR_TRANSLATIONS: Record<Locale, Record<FlavorKey, BottleCopy>> = {
  uz: {
    ananas: {
      title: "Ananas",
      headline: "Tropik yumshoqlik",
      description: "Quyoshli ananas ta'mi va mayin yogurt teksturasi har kuni yengil, toza va yorqin kayfiyat beradi."
    },
    banan: {
      title: "Banan",
      headline: "Mayin va kremli",
      description: "Banan ta'mi silliq yogurt asosida ochiladi: shirinligi sokin, tuzilishi esa yumshoq va ichimlikka qulay."
    },
    "ormon-meva": {
      title: "O'rmon meva",
      headline: "Mevali assortiment",
      description: "O'rmon mevalari aralashmasi yogurtga chuqurroq, salqin va boy ta'm beradi."
    },
    malina: {
      title: "Malina",
      headline: "Berry fresh",
      description: "Malinaning nozik nordon-shirin ohangi yogurtga tiniq mevali xarakter va jonli rang beradi."
    },
    olcha: {
      title: "Olcha",
      headline: "Yorqin mevali ta'm",
      description: "Olchaning to'yingan ta'mi silliq sutli asos bilan balansda turadi: aniq, shirali va esda qoladigan."
    },
    shaftoli: {
      title: "Shaftoli",
      headline: "Iliq mevali kayfiyat",
      description: "Shaftoli ta'mi ichimlikka iliq, baxmaldek yumshoq va tabiiy mevali ohang beradi."
    },
    "qulupnay-banan": {
      title: "Qulupnay banan",
      headline: "Ikki ta'm balansi",
      description: "Qulupnayning yorqinligi va bananning kremli yumshoqligi bitta sokin, shirin duetga yig'iladi."
    },
    qulupnay: {
      title: "Qulupnay",
      headline: "Klassik shirinlik",
      description: "Qulupnayli yogurt - tanish, yumshoq va ishonchli ta'm: silliq ichiladi, tez yoqadi."
    }
  },
  ru: {
    ananas: {
      title: "Ананас",
      headline: "Тропическая мягкость",
      description: "Солнечный вкус ананаса и нежная текстура йогурта дают легкое, чистое и яркое настроение на каждый день."
    },
    banan: {
      title: "Банан",
      headline: "Мягкий и кремовый",
      description: "Банан раскрывается на гладкой йогуртовой основе: сладость спокойная, а формат удобно пить на ходу."
    },
    "ormon-meva": {
      title: "Лесные ягоды",
      headline: "Ягодный микс",
      description: "Смесь лесных ягод добавляет йогурту более глубокий, прохладный и насыщенный вкус."
    },
    malina: {
      title: "Малина",
      headline: "Свежая ягода",
      description: "Деликатная кисло-сладкая нота малины дает йогурту чистый фруктовый характер и живой цвет."
    },
    olcha: {
      title: "Вишня",
      headline: "Яркий фруктовый вкус",
      description: "Насыщенная вишня держит баланс с мягкой молочной основой: вкус получается сочным и запоминающимся."
    },
    shaftoli: {
      title: "Персик",
      headline: "Теплое фруктовое настроение",
      description: "Персик делает напиток мягким, бархатным и естественно фруктовым без лишней тяжести."
    },
    "qulupnay-banan": {
      title: "Клубника банан",
      headline: "Баланс двух вкусов",
      description: "Яркость клубники и кремовая мягкость банана собираются в спокойный сладкий дуэт."
    },
    qulupnay: {
      title: "Клубника",
      headline: "Классическая сладость",
      description: "Клубничный йогурт - знакомый, мягкий и надежный вкус: легко пьется и быстро нравится."
    }
  },
  en: {
    ananas: {
      title: "Pineapple",
      headline: "Tropical softness",
      description: "Sunny pineapple flavor and a smooth yogurt texture bring a light, clean and bright mood every day."
    },
    banan: {
      title: "Banana",
      headline: "Soft and creamy",
      description: "Banana opens over a smooth yogurt base: gently sweet, creamy and easy to drink."
    },
    "ormon-meva": {
      title: "Forest berry",
      headline: "Berry assortment",
      description: "A blend of forest berries gives the yogurt a deeper, cooler and richer fruit note."
    },
    malina: {
      title: "Raspberry",
      headline: "Berry fresh",
      description: "A delicate sweet-tart raspberry note gives the yogurt a clean fruit character and vivid color."
    },
    olcha: {
      title: "Cherry",
      headline: "Bright fruit taste",
      description: "Rich cherry balances with a smooth dairy base for a juicy, memorable flavor."
    },
    shaftoli: {
      title: "Peach",
      headline: "Warm fruit mood",
      description: "Peach gives the drink a warm, velvety and naturally fruity tone."
    },
    "qulupnay-banan": {
      title: "Strawberry banana",
      headline: "Two-flavor balance",
      description: "Bright strawberry and creamy banana come together in one calm, sweet duet."
    },
    qulupnay: {
      title: "Strawberry",
      headline: "Classic sweetness",
      description: "Strawberry yogurt is familiar, soft and reliable: smooth to drink and easy to love."
    }
  }
};

const BOTTLE_ENDING_TRANSLATIONS: Record<Locale, {
  title: string;
  subtitle: string;
  slides: Array<{title: string; text: string}>;
}> = {
  uz: {
    title: "SOFIN",
    subtitle: "Fermer xo'jaligidan javongacha",
    slides: ENDING_SLIDES.map((slide) => ({title: slide.title, text: slide.text}))
  },
  ru: {
    title: "SOFIN",
    subtitle: "От фермы до полки",
    slides: [
      {title: "Каждый вкус в своей сцене", text: "Фруктовая линия соединяется с мягкой молочной основой и дает легкое натуральное настроение."},
      {title: "Удобный питьевой формат", text: "Йогуртчалар созданы для быстрой, чистой и спокойной паузы в течение дня."},
      {title: "Фрукты раскрываются ярко", text: "Каждый цвет показывает свой вкус, а общий ритм остается аккуратным и спокойным."},
      {title: "Нежная молочная основа", text: "Текстура гладкая, вкус легкий и подходит для ежедневного выбора."},
      {title: "Одна линейка, разные настроения", text: "От ананаса до клубники ассортимент превращает страницу в живую коллекцию."},
      {title: "Новые йогуртчалар", text: "После 3D-сцены продуктовые фотографии мягко завершают коллекцию."}
    ]
  },
  en: {
    title: "SOFIN",
    subtitle: "From farm to shelf",
    slides: [
      {title: "Each flavor has its own scene", text: "The fruit line meets a soft dairy base for a light, natural mood."},
      {title: "Easy drinkable format", text: "Yogurtchalar are made for a quick, clean and calm pause during the day."},
      {title: "Fruit opens brightly", text: "Every color carries its own flavor while the overall rhythm stays calm and ordered."},
      {title: "Soft dairy base", text: "The texture is smooth and the taste stays light enough for an everyday choice."},
      {title: "One line, many moods", text: "From pineapple to strawberry, the assortment turns the page into a living collection."},
      {title: "New yogurtchalar", text: "After the 3D scene, product photos bring the collection to a polished close."}
    ]
  }
};

const PRODUCT_CTA_LABELS: Record<Locale, string> = {
  uz: "Mahsulot kartasi",
  ru: "Перейти к товару",
  en: "View product"
};

type TransitionState = {
  kind: "none" | "intro" | "flavor";
  from: number;
  placement: BottlePlacement;
  to: number;
  progress: number;
  direction: 1 | -1;
  running: boolean;
};

type BottlePlacement = "overview" | ActiveBottlePlacement;
type ActiveBottlePlacement =
  | "center"
  | "right"
  | "left"
  | "upperRight"
  | "upperLeft"
  | "lowerRight"
  | "lowerLeft"
  | "highCenter";
type CopyPlacement = "intro" | "left" | "right" | "lowerLeft";

export function BottleShowcasePage() {
  const locale = normalizeLocale(useLocale());
  const mobileViewport = useIsMobileViewport();
  const [transition, setTransition] = useState<TransitionState>({
    kind: "none",
    from: 0,
    placement: "overview",
    to: 0,
    progress: 1,
    direction: 1,
    running: false
  });

  const transitionRef = useRef(transition);
  const endingStageRef = useRef(0);
  const releasedToFooterRef = useRef(false);
  const endingNavigationLockedRef = useRef(false);
  const endingNavigationTimerRef = useRef<number | null>(null);
  const [endingStage, setEndingStage] = useState(0);
  const [releasedToFooter, setReleasedToFooter] = useState(false);
  const rafRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    transitionRef.current = transition;
  }, [transition]);

  useEffect(() => {
    endingStageRef.current = endingStage;
  }, [endingStage]);

  useEffect(() => {
    releasedToFooterRef.current = releasedToFooter;
  }, [releasedToFooter]);

  useEffect(() => {
    document.documentElement.style.overscrollBehavior = releasedToFooter ? "" : "none";
    document.body.style.overscrollBehavior = releasedToFooter ? "" : "none";
    document.body.style.overflow = releasedToFooter ? "" : "hidden";

    return () => {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.overflow = "";
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (endingNavigationTimerRef.current) window.clearTimeout(endingNavigationTimerRef.current);
    };
  }, [releasedToFooter]);

  useEffect(() => {
    [
      HERO_BACKGROUND,
      HERO_BACKGROUND_MOBILE,
      ENDING_BACKGROUND,
      ...ENDING_SLIDES.map((slide) => slide.src),
      ...BOTTLE_FLAVORS.flatMap((flavor) => [flavor.background, flavor.mobileBackground])
    ].forEach((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
    });
  }, []);

  const lockEndingNavigation = useCallback(() => {
    endingNavigationLockedRef.current = true;

    if (endingNavigationTimerRef.current) {
      window.clearTimeout(endingNavigationTimerRef.current);
    }

    endingNavigationTimerRef.current = window.setTimeout(() => {
      endingNavigationLockedRef.current = false;
      endingNavigationTimerRef.current = null;
    }, ENDING_NAVIGATION_LOCK_MS);
  }, []);

  const setEndingStageLocked = useCallback((stage: number) => {
    endingStageRef.current = stage;
    setEndingStage(stage);
    lockEndingNavigation();
  }, [lockEndingNavigation]);

  const returnToOverview = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    releasedToFooterRef.current = false;
    setReleasedToFooter(false);
    endingStageRef.current = 0;
    setEndingStage(0);

    const next: TransitionState = {
      kind: "none",
      from: 0,
      placement: "overview",
      to: 0,
      progress: 1,
      direction: -1,
      running: false
    };

    transitionRef.current = next;
    setTransition(next);
    lockEndingNavigation();

    window.requestAnimationFrame(() => {
      window.scrollTo({top: 0, behavior: "smooth"});
    });
  }, [lockEndingNavigation]);

  const releaseToFooter = useCallback(() => {
    releasedToFooterRef.current = true;
    setReleasedToFooter(true);
    lockEndingNavigation();
  }, [lockEndingNavigation]);

  const goTo = useCallback((direction: 1 | -1) => {
    if (releasedToFooterRef.current) {
      if (direction < 0 && window.scrollY <= 8) {
        returnToOverview();
      }
      return;
    }

    const current = transitionRef.current;
    if (current.running) return;

    const currentEndingStage = endingStageRef.current;
    if (currentEndingStage > 0) {
      if (endingNavigationLockedRef.current) return;

      if (direction > 0) {
        if (currentEndingStage >= ENDING_LAST_STAGE) {
          releaseToFooter();
          return;
        }

        const nextStage = Math.min(ENDING_LAST_STAGE, currentEndingStage + 1);
        setEndingStageLocked(nextStage);
        return;
      }

      if (currentEndingStage > 1) {
        const previousStage = currentEndingStage - 1;
        setEndingStageLocked(previousStage);
        return;
      }

      setEndingStageLocked(0);
      return;
    }

    const isReturningToOverview =
      current.placement !== "overview" &&
      current.to === 0 &&
      direction < 0;
    const kind = current.placement === "overview" || isReturningToOverview ? "intro" : "flavor";

    if (current.placement === "overview" && direction < 0) return;

    const isLastFlavor =
      current.placement !== "overview" &&
      current.to === BOTTLE_FLAVORS.length - 1 &&
      direction > 0;

    if (isLastFlavor) {
      setEndingStageLocked(1);
      return;
    }

    const from = current.to;
    const to = kind === "intro" ? from : wrapIndex(from + direction);
    const start = performance.now();
    const duration = kind === "intro" ? INTRO_TRANSITION_MS : FLAVOR_TRANSITION_MS;

    transitionRef.current = {
      kind,
      from,
      placement: current.placement,
      to,
      progress: 0,
      direction,
      running: true
    };
    setTransition(transitionRef.current);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const running = progress < 1;
      const next: TransitionState = {
        kind: running ? kind : "none",
        from: running ? from : to,
        placement: running
          ? current.placement
          : kind === "intro"
            ? direction > 0
              ? "center"
              : "overview"
            : getFlavorPlacement(to),
        to,
        progress: running ? progress : 1,
        direction,
        running
      };

      transitionRef.current = next;
      setTransition(next);

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      rafRef.current = null;
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [releaseToFooter, returnToOverview, setEndingStageLocked]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      if (releasedToFooterRef.current) {
        if (event.deltaY < 0 && window.scrollY <= 8) {
          event.preventDefault();
          returnToOverview();
        }
        return;
      }
      event.preventDefault();
      goTo(event.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchStartYRef.current = event.touches[0].clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY === null || endY === undefined) return;

      const deltaY = startY - endY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      if (releasedToFooterRef.current) {
        if (deltaY < 0 && window.scrollY <= 8) {
          event.preventDefault();
          returnToOverview();
        }
        return;
      }

      event.preventDefault();
      goTo(deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (releasedToFooterRef.current) {
        if ((event.key === "ArrowUp" || event.key === "PageUp") && window.scrollY <= 8) {
          event.preventDefault();
          returnToOverview();
        }
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goTo(1);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goTo(-1);
      }
    };

    window.addEventListener("wheel", onWheel, {passive: false});
    window.addEventListener("touchstart", onTouchStart, {passive: true});
    window.addEventListener("touchend", onTouchEnd, {passive: false});
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goTo, returnToOverview]);

  const fromFlavor = BOTTLE_FLAVORS[transition.from];
  const toFlavor = BOTTLE_FLAVORS[transition.to];
  const easedProgress = easeInOutCubic(transition.progress);
  const endingActive = endingStage > 0;
  const introFlavorProgress = getIntroFlavorProgress(transition, easedProgress);
  const introHeroOpacity =
    transition.kind === "intro"
      ? 1 - smoothstep(0.08, 0.64, introFlavorProgress)
      : transition.placement === "overview"
        ? 1
        : 0;
  const showScrollHint = transition.placement === "overview" && !endingActive && !releasedToFooter;
  const showBackToTop = transition.placement !== "overview" || endingActive || releasedToFooter;

  return (
    <main className={`${styles.page} ${releasedToFooter ? styles.page_released : ""}`}>
      <div className={`${styles.showcaseScene} ${endingActive ? styles.showcaseScene_ending : ""}`}>
        <BottleBackground
          from={fromFlavor}
          isMobile={mobileViewport}
          progress={easedProgress}
          to={toFlavor}
          transition={transition}
        />
        <BottleStage transition={transition} />
        <BottleIntroHero locale={locale} onExplore={() => goTo(1)} opacity={introHeroOpacity} />
        <BottleCopyOverlay locale={locale} progress={easedProgress} transition={transition} />
      </div>
      <BottleEndingExperience locale={locale} stage={endingStage} />
      <div
        aria-hidden="true"
        className={`${styles.scrollHint} ${showScrollHint ? "" : styles.scrollHint_hidden}`}
      >
        <span />
        <em>scroll</em>
      </div>
      <button
        aria-label={locale === "ru" ? "Вернуться наверх" : locale === "uz" ? "Yuqoriga qaytish" : "Back to top"}
        className={`${styles.showcaseBackToTop} ${showBackToTop ? styles.showcaseBackToTop_visible : ""}`}
        onClick={returnToOverview}
        type="button"
      >
        <ChevronUp aria-hidden="true" size={22} strokeWidth={2.2} />
      </button>
    </main>
  );
}

function BottleIntroHero({
  locale,
  onExplore,
  opacity
}: {
  locale: Locale;
  onExplore: () => void;
  opacity: number;
}) {
  const normalizedOpacity = Math.max(0, Math.min(1, opacity));
  const hidden = normalizedOpacity <= 0.01;
  const copy = HERO_INTRO_TRANSLATIONS[locale];

  return (
    <section
      aria-hidden={hidden}
      className={styles.introHero}
      data-locale={locale}
      style={{
        opacity: normalizedOpacity,
        pointerEvents: hidden ? "none" : "auto",
        transform: `translate3d(0, ${lerp(0, -12, 1 - normalizedOpacity).toFixed(2)}px, 0)`
      }}
    >
      <div className={styles.introCopy}>
        <div className={styles.introEyebrow}>
          <Leaf aria-hidden="true" size={20} />
          <span>{copy.eyebrow}</span>
          <i aria-hidden="true" />
        </div>

        <h1>
          <span>{copy.title[0]}</span>
          <span>{copy.title[1]}</span>
        </h1>

        <p>{copy.description}</p>

        <div className={styles.introActions}>
          <button className={styles.introPrimaryAction} type="button" onClick={onExplore}>
            <span>{copy.primaryCta}</span>
            <ArrowRight aria-hidden="true" size={20} strokeWidth={2.6} />
          </button>
        </div>

        <div className={styles.introCategories}>
          <h2>{locale === "en" ? "Yogurt types" : "Виды йогуртов"}</h2>
          <div>
            {HERO_CATEGORY_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const label = copy.categories[index] ?? copy.categories[0];

              return (
                <button
                  key={label}
                  aria-pressed={item.active ? "true" : "false"}
                  className={item.active ? styles.introCategoryActive : undefined}
                  type="button"
                >
                  <Icon aria-hidden="true" size={32} strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.introBadge}>
        <strong>100%</strong>
        <span>{copy.badgeLabel}</span>
        <Leaf aria-hidden="true" size={20} strokeWidth={2.2} />
      </div>

      <div className={styles.introFruitIcons}>
        <Citrus aria-hidden="true" />
        <Grape aria-hidden="true" />
      </div>

      <div className={styles.introFeatures}>
        {HERO_FEATURES.map((item, index) => {
          const Icon = item.icon;
          const feature = copy.features[index] ?? copy.features[0];

          return (
            <article key={feature.title}>
              <span>
                <Icon aria-hidden="true" size={42} strokeWidth={1.8} />
              </span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BottleEndingExperience({
  locale,
  stage
}: {
  locale: Locale;
  stage: number;
}) {
  const active = stage > 0;
  const copy = BOTTLE_ENDING_TRANSLATIONS[locale];
  const slideStage = Math.max(0, Math.min(ENDING_SLIDES.length - 1, stage - 2));
  const imageShift = active ? Math.min(100, stage <= 1 ? 0 : 12 + slideStage * 11.5) : 0;
  const carouselShift = stage <= 1 ? 0 : -slideStage * 25.5;

  return (
    <section
      aria-hidden={!active}
      className={`${styles.ending} ${active ? styles.ending_active : ""}`}
      data-ending-stage={stage}
    >
      <div
        className={styles.endingBackground}
        style={{
          backgroundImage: `url("${ENDING_BACKGROUND}")`,
          backgroundPosition: `center ${imageShift}%`
        }}
      />
      <div className={styles.endingVeil} />

      <div
        className={styles.endingHeading}
        style={{
          opacity: active ? 1 : 0,
          transform:
            stage <= 1
              ? "translate3d(-50%,0,0)"
              : "translate3d(-50%,-1.4vh,0) scale(0.95)"
        }}
      >
        <h2>{copy.title}</h2>
        <span>{copy.subtitle}</span>
      </div>

      <div
        className={styles.endingCarousel}
        style={{
          transform: `translate3d(${carouselShift}vw, 0, 0)`
        }}
      >
        {ENDING_SLIDES.map((slide, index) => {
          const focused = stage >= 2 && index === slideStage;
          const slideCopy = copy.slides[index] ?? slide;

          return (
            <article
              key={slide.src}
              className={`${styles.endingSlide} ${focused ? styles.endingSlide_focused : ""}`}
              style={{
                opacity: stage <= 1 || focused ? 1 : 0.58,
                transform: focused ? "translate3d(0,-4.2vh,0) scale(1.035)" : "translate3d(0,0,0) scale(1)",
                filter: focused || stage <= 1 ? "blur(0px)" : "blur(1.2px)"
              }}
            >
              <div
                className={styles.endingSlideImage}
                style={{backgroundImage: `url("${slide.src}")`}}
              />
              <div className={styles.endingSlideShade} />
              <div className={styles.endingSlideCopy}>
                <h3>{slideCopy.title}</h3>
                <span>{slideCopy.text}</span>
              </div>
            </article>
          );
        })}
      </div>

    </section>
  );
}

function BottleCopyOverlay({
  locale,
  progress,
  transition
}: {
  locale: Locale;
  progress: number;
  transition: TransitionState;
}) {
  const isOverview = transition.placement === "overview" && transition.kind !== "intro";
  const fromFlavor = BOTTLE_FLAVORS[transition.from];
  const toFlavor = BOTTLE_FLAVORS[transition.to];
  const introFlavorProgress = getIntroFlavorProgress(transition, progress);
  const fromCopyPlacement = getCopyPlacement(getActivePlacement(transition.placement));
  const toCopyPlacement = getCopyPlacement(getFlavorPlacement(transition.to));
  const stableCopyPlacement =
    transition.kind === "intro" ? getCopyPlacement("center") : getCopyPlacement(getActivePlacement(transition.placement));
  const introFlavorOpacity =
    transition.kind === "intro" ? smoothstep(0.62, 0.96, introFlavorProgress) : transition.kind === "none" && !isOverview ? 1 : 0;
  const flavorOutOpacity = transition.kind === "flavor" ? 1 - smoothstep(0.18, 0.5, progress) : 0;
  const flavorInOpacity = transition.kind === "flavor" ? smoothstep(0.54, 0.92, progress) : 0;

  return (
    <section className={styles.copyOverlay} aria-live="polite">
      <CopyCardLayer placement={stableCopyPlacement}>
        <GlassCopyCard
          active={introFlavorOpacity > 0.5}
          copy={getFlavorCopy(toFlavor, locale)}
          productHref={getFlavorProductHref(toFlavor, locale)}
          productLabel={PRODUCT_CTA_LABELS[locale]}
          opacity={introFlavorOpacity}
          tint={toFlavor.tint}
        />
      </CopyCardLayer>

      {transition.kind === "flavor" ? (
        <>
          <CopyCardLayer placement={fromCopyPlacement}>
            <GlassCopyCard
              active={flavorOutOpacity > 0.5}
              copy={getFlavorCopy(fromFlavor, locale)}
              productHref={getFlavorProductHref(fromFlavor, locale)}
              productLabel={PRODUCT_CTA_LABELS[locale]}
              opacity={flavorOutOpacity}
              tint={fromFlavor.tint}
            />
          </CopyCardLayer>

          <CopyCardLayer placement={toCopyPlacement}>
            <GlassCopyCard
              active={flavorInOpacity > 0.5}
              copy={getFlavorCopy(toFlavor, locale)}
              productHref={getFlavorProductHref(toFlavor, locale)}
              productLabel={PRODUCT_CTA_LABELS[locale]}
              opacity={flavorInOpacity}
              tint={toFlavor.tint}
            />
          </CopyCardLayer>
        </>
      ) : null}
    </section>
  );
}

function CopyCardLayer({
  children,
  placement,
}: {
  children: ReactNode;
  placement: CopyPlacement;
}) {
  return <div className={`${styles.copyLayer} ${styles[`copyLayer_${placement}`]}`}>{children}</div>;
}

function GlassCopyCard({
  active,
  copy,
  opacity,
  productHref,
  productLabel,
  tint,
}: {
  active: boolean;
  copy: BottleCopy;
  opacity: number;
  productHref: string;
  productLabel: string;
  tint: string;
}) {
  const safeOpacity = Math.max(0, Math.min(1, opacity));
  const cardStyle = {
    "--flavor-rgb": hexToRgbTriplet(tint),
    "--flavor-tint": tint,
    opacity: safeOpacity,
    transform: `translate3d(0, ${lerp(10, 0, safeOpacity).toFixed(2)}px, 0) scale(${lerp(0.992, 1, safeOpacity).toFixed(4)})`
  } as CSSProperties;

  return (
    <article aria-hidden={!active} className={styles.glassCopy} style={cardStyle}>
      <h1 className={styles.copyTitle}>{copy.title}</h1>
      <p className={styles.copyHeadline}>{copy.headline}</p>
      <p className={styles.copyDescription}>{copy.description}</p>
      <Link className={styles.copyProductLink} href={productHref} tabIndex={active ? 0 : -1}>
        <span>{productLabel}</span>
        <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
      </Link>
    </article>
  );
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => {
      setIsMobile(window.innerWidth / Math.max(1, window.innerHeight) < MOBILE_ASPECT_MAX);
    };

    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update, {passive: true});

    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return isMobile;
}

function getFlavorBackground(flavor: BottleFlavor, isMobile: boolean) {
  return isMobile ? flavor.mobileBackground : flavor.background;
}

function BottleBackground({
  from,
  isMobile,
  progress,
  to,
  transition,
}: {
  from: BottleFlavor;
  isMobile: boolean;
  to: BottleFlavor;
  progress: number;
  transition: TransitionState;
}) {
  const tint = mixHex(from.tint, to.tint, progress);
  const eased = smoothstep(0, 1, progress);
  const fromBackground = getFlavorBackground(from, isMobile);
  const toBackground = getFlavorBackground(to, isMobile);
  const sameBackground = fromBackground === toBackground;
  const introFlavorProgress = getIntroFlavorProgress(transition, progress);
  const heroBackgroundOpacity =
    transition.kind === "intro"
      ? 1 - smoothstep(0.2, 0.92, introFlavorProgress)
      : transition.placement === "overview"
        ? 1
        : 0;
  const flavorBackgroundOpacity = transition.kind === "intro" ? smoothstep(0.18, 1, introFlavorProgress) : 1;
  const backgroundLayers = sameBackground
    ? [{src: toBackground, opacity: 1, scale: 1.012, shiftX: 0, shiftY: 0}]
    : [
        {src: fromBackground, opacity: 1 - eased, scale: lerp(1.018, 1.03, eased), shiftX: lerp(0, -1.2, eased), shiftY: lerp(0, -0.6, eased)},
        {src: toBackground, opacity: eased, scale: lerp(1.035, 1.012, eased), shiftX: lerp(1.2, 0, eased), shiftY: lerp(0.8, 0, eased)}
      ];

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <div
        className={styles.backdropGradient}
        style={{
          background: `radial-gradient(circle at 48% 38%, rgba(255,255,255,0.3), transparent 32%), radial-gradient(circle at 56% 80%, ${hexToRgba(tint, 0.24)}, transparent 38%), linear-gradient(180deg, #f8e8d9 0%, #f0d4ba 100%)`
        }}
      />
      <div
        className={`${styles.backgroundLayer} ${styles.heroBackgroundLayer}`}
        style={{
          zIndex: 4,
          backgroundImage: `url("${isMobile ? HERO_BACKGROUND_MOBILE : HERO_BACKGROUND}")`,
          opacity: heroBackgroundOpacity,
          transform: `scale(${lerp(1, 1.018, 1 - heroBackgroundOpacity)})`
        }}
      />
      {backgroundLayers.map((layer, index) => (
        <div
          key={layer.src}
          className={styles.backgroundLayer}
          style={{
            zIndex: index + 1,
            backgroundImage: `url("${layer.src}")`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            opacity: layer.opacity * flavorBackgroundOpacity,
            transform: `translate3d(${layer.shiftX}vw, ${layer.shiftY}vh, 0) scale(${layer.scale})`
          }}
        />
      ))}
      <div className={styles.backgroundVeil} />
      <div className={styles.backdropGlow} />
    </div>
  );
}

function BottleStage({transition}: {transition: TransitionState}) {
  return (
    <div className={styles.stage}>
      <Canvas
        className={styles.canvas}
        dpr={[1, 1.65]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        onCreated={({gl}) => {
          gl.toneMappingExposure = 0.82;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.08, 7.6]} fov={28} />
        <AnimatedBottleLights transition={transition} />

        <Suspense fallback={<Fallback />}>
          <Environment preset="studio" environmentIntensity={0.34} />
          <AnimatedBottle transition={transition} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function AnimatedBottleLights({transition}: {transition: TransitionState}) {
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const sparkleRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const aspect = state.size.width / Math.max(1, state.size.height);
    const metrics = getBottleSceneMetrics(aspect);
    const activePlacement = getActivePlacementForLight(transition);
    const targetPose = getBottlePlacementPose(metrics, activePlacement);
    const transitionPulse = transition.running ? Math.sin(easeInOutCubic(transition.progress) * Math.PI) : 0;
    const flavorTint = new THREE.Color(BOTTLE_FLAVORS[transition.to].tint);
    const warmWhite = new THREE.Color("#fff8ec");
    const coolFill = new THREE.Color("#e7f0ff");
    const accent = warmWhite.clone().lerp(flavorTint, 0.2 + transitionPulse * 0.18);
    const p = transition.running ? easeInOutCubic(transition.progress) : 1;
    const direction = transition.direction;

    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.damp(hemiRef.current.intensity, 0.62 + transitionPulse * 0.05, 6, delta);
      hemiRef.current.color.lerp(warmWhite, 0.08);
      hemiRef.current.groundColor.lerp(new THREE.Color("#d8b99d"), 0.06);
    }

    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.damp(keyRef.current.intensity, 1.08 + transitionPulse * 0.14, 6, delta);
      keyRef.current.color.lerp(accent, 0.08);
      dampLightPosition(
        keyRef.current,
        -2.7 + targetPose.x * 0.22 + direction * transitionPulse * 0.42,
        4.1 + transitionPulse * 0.24,
        4.6 - transitionPulse * 0.28,
        delta,
        6
      );
    }

    if (fillRef.current) {
      fillRef.current.intensity = THREE.MathUtils.damp(fillRef.current.intensity, 0.34 + transitionPulse * 0.07, 6, delta);
      fillRef.current.color.lerp(coolFill.clone().lerp(flavorTint, 0.12), 0.08);
      dampLightPosition(
        fillRef.current,
        3.2 - targetPose.x * 0.2 - direction * transitionPulse * 0.32,
        2.2 + transitionPulse * 0.16,
        3.0,
        delta,
        6
      );
    }

    if (rimRef.current) {
      rimRef.current.intensity = THREE.MathUtils.damp(rimRef.current.intensity, 0.72 + transitionPulse * 0.2, 7, delta);
      rimRef.current.color.lerp(accent, 0.1);
      dampLightPosition(
        rimRef.current,
        targetPose.x - direction * (1.2 + transitionPulse * 0.38),
        targetPose.y + 0.62 + Math.sin(p * Math.PI) * 0.16,
        2.55,
        delta,
        7
      );
    }

    if (sparkleRef.current) {
      sparkleRef.current.intensity = THREE.MathUtils.damp(sparkleRef.current.intensity, 0.12 + transitionPulse * 0.14, 8, delta);
      sparkleRef.current.color.lerp(warmWhite.clone().lerp(flavorTint, 0.16), 0.12);
      dampLightPosition(
        sparkleRef.current,
        targetPose.x + direction * (0.75 + transitionPulse * 0.22),
        targetPose.y - 0.62 + transitionPulse * 0.14,
        2.15,
        delta,
        8
      );
    }
  });

  return (
    <>
      <hemisphereLight ref={hemiRef} args={["#fff8ec", "#d8b99d", 0.62]} />
      <directionalLight ref={keyRef} color="#fff8ec" intensity={1.08} position={[-2.7, 4.1, 4.6]} />
      <directionalLight ref={fillRef} color="#e7f0ff" intensity={0.34} position={[3.2, 2.2, 3]} />
      <pointLight ref={rimRef} color="#fff5e6" distance={7.5} intensity={0.72} position={[-1.2, 0.26, 2.55]} />
      <pointLight ref={sparkleRef} color="#fff8ec" distance={5} intensity={0.12} position={[0.75, -0.98, 2.15]} />
    </>
  );
}

function AnimatedBottle({transition}: {transition: TransitionState}) {
  const groupRef = useRef<THREE.Group>(null);
  const overviewRefs = useRef<Array<THREE.Group | null>>([]);
  const heroRefs = useRef<Array<THREE.Group | null>>([]);
  const {size} = useThree();
  const renderMobileOverview = size.width / Math.max(1, size.height) < MOBILE_ASPECT_MAX;
  const overviewFlavors = renderMobileOverview ? [] : BOTTLE_FLAVORS;

  const eased = easeInOutCubic(transition.progress);
  const introFlavorProgress = getIntroFlavorProgress(transition, eased);
  const overviewVisible = transition.placement === "overview" || transition.kind === "intro";
  const heroOpacities = BOTTLE_FLAVORS.map((_, index) => getHeroBottleOpacity(index, transition, eased, introFlavorProgress));

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const aspect = state.size.width / Math.max(1, state.size.height);
    const responsiveScale = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(aspect, 0.46, 1.65, 0.92, 1.22),
      0.92,
      1.22
    );
    const metrics = getBottleSceneMetrics(aspect);
    const mobileScene = aspect < MOBILE_ASPECT_MAX;
    const breathTime = state.clock.elapsedTime;

    group.scale.setScalar(responsiveScale);
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    overviewRefs.current.forEach((bottle, index) => {
      if (!bottle) return;
      applyOverviewBottlePose(bottle, {
        aspect,
        breathTime,
        index,
        progress: transition.kind === "intro" ? introFlavorProgress : 0,
        visible: overviewVisible
      });
    });

    heroRefs.current.forEach((bottle, index) => {
      if (!bottle) return;

      const opacity = getHeroBottleOpacity(index, transition, eased, introFlavorProgress);
      if (opacity <= 0.001) {
        bottle.visible = false;
        return;
      }

      applyHeroBottlePose(bottle, {
        delta,
        breathTime,
        metrics,
        mobileScene,
        progress: transition.kind === "intro" ? introFlavorProgress : eased,
        transition
      });
    });
  });

  return (
    <group ref={groupRef}>
      {overviewFlavors.map((flavor, index) => (
        <group
          key={`overview-${flavor.key}`}
          ref={(node) => {
            overviewRefs.current[index] = node;
          }}
        >
          <BottleModel flavor={flavor} opacity={getOverviewBottleOpacity(index, transition, introFlavorProgress)} />
        </group>
      ))}
      {BOTTLE_FLAVORS.map((flavor, index) => (
        <group
          key={`hero-${flavor.key}`}
          ref={(node) => {
            heroRefs.current[index] = node;
          }}
        >
          <BottleModel flavor={flavor} opacity={heroOpacities[index] ?? 0} />
        </group>
      ))}
    </group>
  );
}

type BottlePose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
};

const DESKTOP_OVERVIEW_POSES: BottlePose[] = [
  {x: 0.64, y: -0.02, z: 0.3, rx: BOTTLE_FRONT_RX, ry: BOTTLE_FRONT_ROTATION, rz: 0.01, s: 0.76},
  {x: 0.24, y: -0.22, z: 0.04, rx: 0.04, ry: BOTTLE_FRONT_ROTATION, rz: -0.01, s: 0.54},
  {x: 1.16, y: -0.22, z: 0.02, rx: 0.04, ry: BOTTLE_FRONT_ROTATION, rz: 0.012, s: 0.54},
  {x: -0.12, y: -0.25, z: -0.02, rx: 0.04, ry: BOTTLE_FRONT_ROTATION, rz: -0.012, s: 0.5},
  {x: 1.88, y: -0.27, z: -0.08, rx: 0.05, ry: BOTTLE_FRONT_ROTATION, rz: 0.014, s: 0.46},
  {x: -3.2, y: -0.34, z: -0.18, rx: 0.05, ry: BOTTLE_FRONT_ROTATION, rz: -0.018, s: 0.46},
  {x: 1.5, y: -0.25, z: -0.05, rx: 0.05, ry: BOTTLE_FRONT_ROTATION, rz: -0.01, s: 0.48},
  {x: 3.15, y: -0.34, z: -0.18, rx: 0.06, ry: BOTTLE_FRONT_ROTATION, rz: 0.016, s: 0.42}
];

const MOBILE_OVERVIEW_POSES: BottlePose[] = [
  {x: 0, y: -0.16, z: 0, rx: BOTTLE_FRONT_RX, ry: BOTTLE_FRONT_ROTATION, rz: 0, s: 0.9},
  {x: -0.68, y: 0.42, z: -0.08, rx: 0.1, ry: 0.42, rz: -0.08, s: 0.38},
  {x: 0.68, y: 0.42, z: -0.08, rx: 0.1, ry: -0.34, rz: 0.08, s: 0.38},
  {x: -0.78, y: -0.2, z: -0.12, rx: 0.14, ry: 0.56, rz: -0.12, s: 0.34},
  {x: 0.78, y: -0.2, z: -0.12, rx: 0.14, ry: -0.52, rz: 0.12, s: 0.34},
  {x: -0.52, y: -0.78, z: -0.16, rx: 0.12, ry: 0.22, rz: 0.07, s: 0.34},
  {x: 0.52, y: -0.78, z: -0.16, rx: 0.12, ry: -0.22, rz: -0.07, s: 0.34},
  {x: 0, y: -1.08, z: -0.2, rx: 0.12, ry: BOTTLE_FRONT_ROTATION, rz: 0, s: 0.32}
];

const DESKTOP_OVERVIEW_SCATTER: BottlePose[] = [
  {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1},
  {x: -1.35, y: 1.0, z: -0.4, rx: -0.52, ry: -0.32, rz: -0.46, s: 1},
  {x: 1.25, y: 1.08, z: -0.42, rx: -0.48, ry: 0.34, rz: 0.44, s: 1},
  {x: -1.62, y: -1.02, z: -0.32, rx: 0.8, ry: -0.42, rz: -0.34, s: 1},
  {x: 1.6, y: -0.96, z: -0.32, rx: 0.76, ry: 0.42, rz: 0.34, s: 1},
  {x: -0.74, y: -1.48, z: -0.3, rx: 0.66, ry: -0.2, rz: 0.42, s: 1},
  {x: 0.74, y: -1.5, z: -0.3, rx: 0.7, ry: 0.22, rz: -0.42, s: 1},
  {x: 0.16, y: -1.82, z: -0.36, rx: 0.86, ry: 0.12, rz: 0.18, s: 1}
];

const MOBILE_OVERVIEW_SCATTER: BottlePose[] = [
  {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1},
  {x: -0.78, y: 0.86, z: -0.34, rx: -0.42, ry: -0.24, rz: -0.36, s: 1},
  {x: 0.78, y: 0.88, z: -0.34, rx: -0.42, ry: 0.24, rz: 0.36, s: 1},
  {x: -0.9, y: -0.92, z: -0.3, rx: 0.62, ry: -0.24, rz: -0.28, s: 1},
  {x: 0.9, y: -0.92, z: -0.3, rx: 0.62, ry: 0.24, rz: 0.28, s: 1},
  {x: -0.42, y: -1.32, z: -0.28, rx: 0.56, ry: -0.1, rz: 0.28, s: 1},
  {x: 0.42, y: -1.34, z: -0.28, rx: 0.56, ry: 0.1, rz: -0.28, s: 1},
  {x: 0, y: -1.56, z: -0.32, rx: 0.7, ry: 0.08, rz: 0.12, s: 1}
];

type BottleSceneMetrics = {
  centerX: number;
  centerY: number;
  centerZ: number;
  leftX: number;
  rightX: number;
  highY: number;
  lowY: number;
};

function getBottleSceneMetrics(aspect: number): BottleSceneMetrics {
  if (aspect < MOBILE_ASPECT_MAX) {
    return {
      centerX: 0,
      centerY: 0.28,
      centerZ: 0,
      leftX: 0,
      rightX: 0,
      highY: 0.28,
      lowY: 0.28
    };
  }

  const clamped = THREE.MathUtils.clamp(aspect, 0.46, 1.7);
  const sideX = THREE.MathUtils.mapLinear(clamped, 0.72, 1.7, 0.86, 1.52);
  const highY = THREE.MathUtils.mapLinear(clamped, 0.72, 1.7, 0.08, 0.32);
  const lowY = THREE.MathUtils.mapLinear(clamped, 0.72, 1.7, -0.34, -0.46);

  return {
    centerX: 0,
    centerY: -0.36,
    centerZ: 0,
    leftX: -sideX,
    rightX: sideX,
    highY,
    lowY
  };
}

function getBottlePlacementPose(metrics: BottleSceneMetrics, placement: ActiveBottlePlacement): BottlePose {
  const sideScale = 0.96;
  const cornerScale = 0.9;

  switch (placement) {
    case "right":
      return {
        x: metrics.rightX,
        y: metrics.centerY + 0.02,
        z: metrics.centerZ,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: 0.015,
        s: sideScale
      };
    case "left":
      return {
        x: metrics.leftX,
        y: metrics.centerY + 0.02,
        z: metrics.centerZ,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: -0.015,
        s: sideScale
      };
    case "upperRight":
      return {
        x: metrics.rightX * 0.72,
        y: metrics.highY,
        z: metrics.centerZ - 0.08,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: 0.03,
        s: cornerScale
      };
    case "upperLeft":
      return {
        x: metrics.leftX * 0.72,
        y: metrics.highY,
        z: metrics.centerZ - 0.08,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: -0.03,
        s: cornerScale
      };
    case "lowerRight":
      return {
        x: metrics.rightX * 0.76,
        y: metrics.lowY,
        z: metrics.centerZ + 0.04,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: -0.025,
        s: 0.86
      };
    case "lowerLeft":
      return {
        x: metrics.leftX * 0.76,
        y: metrics.lowY,
        z: metrics.centerZ + 0.04,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: 0.025,
        s: 0.86
      };
    case "highCenter":
      return {
        x: metrics.centerX,
        y: metrics.highY + 0.08,
        z: metrics.centerZ - 0.1,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: 0,
        s: 0.9
      };
    case "center":
    default:
      return {
        x: metrics.centerX,
        y: metrics.centerY,
        z: metrics.centerZ,
        rx: BOTTLE_FRONT_RX,
        ry: BOTTLE_FRONT_ROTATION,
        rz: 0,
        s: 1
      };
  }
}

type FlavorFlightRoute = {
  sign: 1 | -1;
  curveX: number;
  lift: number;
  depth: number;
  pitch: number;
  roll: number;
  scale: number;
  settle: number;
};

const FLAVOR_FLIGHT_ROUTES: FlavorFlightRoute[] = [
  {sign: 1, curveX: 0.08, lift: 0.16, depth: 0.08, pitch: 0.018, roll: 0.035, scale: 0.03, settle: 0.016},
  {sign: -1, curveX: 0.12, lift: 0.2, depth: 0.1, pitch: 0.024, roll: 0.045, scale: 0.035, settle: 0.018},
  {sign: 1, curveX: 0.16, lift: 0.22, depth: 0.12, pitch: 0.026, roll: 0.05, scale: 0.038, settle: 0.02},
  {sign: -1, curveX: 0.14, lift: 0.18, depth: 0.1, pitch: 0.022, roll: 0.044, scale: 0.034, settle: 0.018},
  {sign: 1, curveX: 0.1, lift: 0.2, depth: 0.09, pitch: 0.02, roll: 0.038, scale: 0.032, settle: 0.017},
  {sign: -1, curveX: 0.15, lift: 0.24, depth: 0.13, pitch: 0.026, roll: 0.052, scale: 0.04, settle: 0.022},
  {sign: 1, curveX: 0.13, lift: 0.19, depth: 0.1, pitch: 0.022, roll: 0.046, scale: 0.036, settle: 0.019},
  {sign: -1, curveX: 0.09, lift: 0.21, depth: 0.11, pitch: 0.024, roll: 0.04, scale: 0.034, settle: 0.018}
];

function getFlavorPlacement(flavorIndex: number): ActiveBottlePlacement {
  return DESKTOP_FLAVOR_PLACEMENTS[wrapIndex(flavorIndex)] ?? "center";
}

function getActivePlacement(placement: BottlePlacement): ActiveBottlePlacement {
  return placement === "overview" ? "center" : placement;
}

function getActivePlacementForLight(transition: TransitionState): ActiveBottlePlacement {
  if (transition.kind === "flavor") return getFlavorPlacement(transition.to);
  if (transition.kind === "intro") return "center";

  return getActivePlacement(transition.placement);
}

function getFlavorFlightRoute(flavorIndex: number): FlavorFlightRoute {
  return FLAVOR_FLIGHT_ROUTES[wrapIndex(flavorIndex)] ?? FLAVOR_FLIGHT_ROUTES[0];
}

function getFlavorCopy(flavor: BottleFlavor, locale: Locale): BottleCopy {
  return BOTTLE_FLAVOR_TRANSLATIONS[locale][flavor.key] ?? {
    title: flavor.title,
    headline: flavor.headline,
    description: flavor.description
  };
}

function getFlavorProductHref(flavor: BottleFlavor, locale: Locale) {
  return `/${locale}/products/${FLAVOR_PRODUCT_SLUGS[flavor.key]}`;
}

function getIntroFlavorProgress(transition: TransitionState, progress: number) {
  if (transition.kind !== "intro") return progress;
  return transition.direction > 0 ? progress : 1 - progress;
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}

function getCopyPlacement(placement: ActiveBottlePlacement): CopyPlacement {
  switch (placement) {
    case "right":
    case "upperRight":
    case "lowerRight":
      return "left";
    case "left":
    case "upperLeft":
    case "lowerLeft":
      return "right";
    case "highCenter":
      return "lowerLeft";
    case "center":
    default:
      return "left";
  }
}

function getOverviewBottleOpacity(index: number, transition: TransitionState, progress: number) {
  if (index === 5 || index === 7) return 0;

  if (transition.kind !== "intro") {
    return transition.placement === "overview" ? 1 : 0;
  }

  if (index === 0) return 1 - smoothstep(0.84, 1, progress);

  return 1 - smoothstep(0.38, 0.86, progress);
}

function getHeroBottleOpacity(
  index: number,
  transition: TransitionState,
  progress: number,
  introFlavorProgress: number
) {
  if (transition.kind === "flavor") {
    const flavorSwap = smoothstep(0.46, 0.54, progress);

    if (index === transition.from) return 1 - flavorSwap;
    if (index === transition.to) return flavorSwap;
    return 0;
  }

  if (transition.kind === "intro") {
    if (index !== transition.to) return 0;
    return smoothstep(0.78, 1, introFlavorProgress);
  }

  if (transition.placement !== "overview" && index === transition.to) return 1;

  return 0;
}

function applyOverviewBottlePose(
  group: THREE.Group,
  options: {
    aspect: number;
    breathTime: number;
    index: number;
    progress: number;
    visible: boolean;
  }
) {
  const {aspect, breathTime, index, progress, visible} = options;
  const mobileScene = aspect < MOBILE_ASPECT_MAX;
  const start = getOverviewPose(index, aspect);
  const active = index === 0;
  const t = active ? smoothstep(0.08, 1, progress) : smoothstep(0.06, 1, progress);

  if (!visible || (mobileScene && !active)) {
    group.visible = false;
    return;
  }

  group.visible = true;

  if (active) {
    const metrics = getBottleSceneMetrics(aspect);
    const fall = smoothstep(0.08, 1, progress);
    const dropArc = -Math.sin(fall * Math.PI) * 0.18;

    applyBottlePose(group, addBottleBreath({
      x: lerp(start.x, metrics.centerX, t),
      y: lerp(start.y, metrics.centerY, t) + dropArc,
      z: lerp(start.z, metrics.centerZ, t),
      rx: lerp(start.rx, BOTTLE_FRONT_RX, t),
      ry: lerp(start.ry, BOTTLE_FRONT_ROTATION, t),
      rz: lerp(start.rz, 0, t),
      s: lerp(start.s, 1, t)
    }, breathTime, index, mobileScene ? 0.58 : 0.72));
    return;
  }

  const scatter = getOverviewScatter(index, aspect);
  const fly = easeOutCubic(t);

  applyBottlePose(group, addBottleBreath({
    x: start.x + scatter.x * fly,
    y: start.y + scatter.y * fly,
    z: start.z + scatter.z * fly,
    rx: start.rx + scatter.rx * fly,
    ry: start.ry + scatter.ry * fly,
    rz: start.rz + scatter.rz * fly,
    s: start.s * lerp(1, 0.74, fly)
  }, breathTime, index, 0.62));
}

function applyHeroBottlePose(
  group: THREE.Group | null,
  options: {
    delta: number;
    breathTime: number;
    metrics: BottleSceneMetrics;
    mobileScene: boolean;
    progress: number;
    transition: TransitionState;
  }
) {
  if (!group) return;

  const {breathTime, delta, metrics, mobileScene, progress, transition} = options;

  if (transition.kind === "intro") {
    const reveal = smoothstep(0.78, 1, progress);
    const target = getBottlePlacementPose(metrics, "center");

    group.visible = reveal > 0.001;
    applyBottlePose(group, addBottleBreath({
      x: target.x,
      y: target.y - 0.03 * (1 - reveal),
      z: target.z,
      rx: target.rx,
      ry: target.ry,
      rz: target.rz,
      s: target.s
    }, breathTime, 0, mobileScene ? 0.64 : 0.78));
    return;
  }

  if (transition.kind === "flavor") {
    group.visible = true;
    applyBottlePose(
      group,
      addBottleBreath(getFlavorFlightPose(
        metrics,
        mobileScene ? "center" : getActivePlacement(transition.placement),
        mobileScene ? "center" : getFlavorPlacement(transition.to),
        progress,
        transition.direction,
        transition.to,
        mobileScene
      ), breathTime, transition.to, mobileScene ? 0.66 : 0.78)
    );
    return;
  }

  const target = addBottleBreath(
    getBottlePlacementPose(metrics, mobileScene ? "center" : getActivePlacement(transition.placement)),
    breathTime,
    transition.to,
    mobileScene ? 0.64 : 0.78
  );

  group.visible = transition.placement !== "overview";
  group.position.x = THREE.MathUtils.damp(group.position.x, target.x, 7.5, delta);
  group.position.y = THREE.MathUtils.damp(group.position.y, target.y, 7.5, delta);
  group.position.z = THREE.MathUtils.damp(group.position.z, target.z, 7.5, delta);
  group.rotation.x = dampAngle(group.rotation.x, target.rx, 7.5, delta);
  group.rotation.y = dampAngle(group.rotation.y, target.ry, 7.5, delta);
  group.rotation.z = dampAngle(group.rotation.z, target.rz, 7.5, delta);
  group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, target.s, 7.5, delta));
}

function getFlavorFlightPose(
  metrics: BottleSceneMetrics,
  placement: ActiveBottlePlacement,
  targetPlacement: ActiveBottlePlacement,
  progress: number,
  direction: 1 | -1,
  flavorIndex: number,
  mobileScene = false
): BottlePose {
  const start = getBottlePlacementPose(metrics, placement);
  const target = getBottlePlacementPose(metrics, targetPlacement);
  const t = smootherstep(0, 1, progress);
  const travel = smootherstep(0.02, 1, t);
  const arc = Math.sin(t * Math.PI);
  const lateSettle = Math.sin(smoothstep(0.76, 1, t) * Math.PI);
  const route = getFlavorFlightRoute(flavorIndex);
  const routeDirection = direction * route.sign;
  const spin = Math.PI * 2 * smootherstep(0.02, 0.98, progress) * direction;

  return {
    x: lerp(start.x, target.x, travel) + (mobileScene ? 0 : arc * route.curveX * routeDirection),
    y: lerp(start.y, target.y, travel) + arc * (mobileScene ? 0.035 : route.lift) - lateSettle * route.settle,
    z: lerp(start.z, target.z, travel) - arc * (mobileScene ? 0.025 : route.depth),
    rx: lerp(start.rx, target.rx, travel) + arc * (mobileScene ? 0.008 : route.pitch),
    ry: BOTTLE_FRONT_ROTATION + spin,
    rz: lerp(start.rz, target.rz, travel) + (mobileScene ? 0 : arc * route.roll * routeDirection),
    s: lerp(start.s, target.s, travel) * (1 + arc * (mobileScene ? 0.012 : route.scale))
  };
}

function applyBottlePose(group: THREE.Group, pose: BottlePose) {
  group.position.set(pose.x, pose.y, pose.z);
  group.rotation.set(pose.rx, pose.ry, pose.rz);
  group.scale.setScalar(pose.s);
}

function addBottleBreath(pose: BottlePose, time: number, index: number, strength = 1): BottlePose {
  const phase = time * 0.82 + index * 0.73;
  const float = Math.sin(phase) * 0.018 * strength;
  const sway = Math.sin(phase * 0.74 + 0.6) * 0.008 * strength;

  return {
    ...pose,
    y: pose.y + float,
    rx: pose.rx + sway * 0.38,
    rz: pose.rz + sway
  };
}

function getOverviewPose(index: number, aspect: number): BottlePose {
  const poses = aspect < MOBILE_ASPECT_MAX ? MOBILE_OVERVIEW_POSES : DESKTOP_OVERVIEW_POSES;

  return poses[index] ?? poses[0];
}

function getOverviewScatter(index: number, aspect: number): BottlePose {
  const scatter = aspect < MOBILE_ASPECT_MAX ? MOBILE_OVERVIEW_SCATTER : DESKTOP_OVERVIEW_SCATTER;

  return scatter[index] ?? scatter[1];
}

function BottleModel({flavor, opacity}: {flavor: BottleFlavor; opacity: number}) {
  const model = useBottleModel(flavor);

  useEffect(() => {
    setModelOpacity(model, opacity);
  }, [model, opacity]);

  return <primitive object={model} />;
}

function useBottleModel(flavor: BottleFlavor) {
  const {scene} = useGLTF(MODEL_PATH);
  const labelTexture = useLoader(THREE.TextureLoader, flavor.texture);

  return useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);
    cloned.position.sub(center);

    const fitScale = 2 / Math.max(size.x, size.y, size.z, 0.001);
    cloned.scale.setScalar(fitScale);

    prepareBottleTexture(labelTexture);

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.frustumCulled = false;
      const meshName = child.name.toLowerCase();
      const sourceMaterial = Array.isArray(child.material) ? child.material[0] : child.material;
      const material = patchBottleMaterial(sourceMaterial);
      const materialName = sourceMaterial.name.toLowerCase();
      const isLabelMesh = materialName.includes("label") || meshName.includes("texture");
      const isCapMesh = meshName.includes("cylinder") || meshName.includes("object028");

      if (isLabelMesh) {
        child.renderOrder = 20;
        material.map = labelTexture;
        material.color = new THREE.Color("#ffffff");
        material.depthWrite = false;
        material.polygonOffset = true;
        material.polygonOffsetFactor = -4;
        material.polygonOffsetUnits = -4;
        material.roughness = 0.68;
        material.metalness = 0.01;
        material.side = THREE.DoubleSide;
      } else if (isCapMesh) {
        child.renderOrder = 4;
        material.map = null;
        material.color = sourceMaterial.color?.clone() ?? new THREE.Color("#173a6f");
        material.roughness = 0.5;
        material.metalness = 0.02;
      } else {
        child.renderOrder = 2;
        material.map = null;
        material.color = new THREE.Color("#f7f4ee");
        material.roughness = 0.76;
        material.metalness = 0.01;
      }

      child.material = material;
    });

    return cloned;
  }, [scene, labelTexture]);
}

function prepareBottleTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = false;
  texture.needsUpdate = true;
}

function patchBottleMaterial(material: THREE.Material) {
  const next = material.clone() as THREE.MeshStandardMaterial;

  next.envMapIntensity = 0.48;
  next.transparent = true;
  next.opacity = 1;
  next.depthWrite = true;

  return next;
}

function setModelOpacity(model: THREE.Object3D, opacity: number) {
  const normalizedOpacity = Math.max(0, Math.min(1, opacity));
  const previousOpacity = model.userData.sofinOpacity as number | undefined;

  if (previousOpacity !== undefined && Math.abs(previousOpacity - normalizedOpacity) < 0.004) {
    return;
  }

  model.userData.sofinOpacity = normalizedOpacity;

  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.visible = normalizedOpacity > 0.002;
    const materials = Array.isArray(child.material) ? child.material : [child.material];

    materials.forEach((material) => {
      const standard = material as THREE.MeshStandardMaterial;
      const isTextureLayer = Boolean(standard.map);
      const nextDepthWrite = isTextureLayer ? false : normalizedOpacity > 0.96;

      standard.transparent = true;
      standard.opacity = normalizedOpacity;

      if (standard.depthWrite !== nextDepthWrite) {
        standard.depthWrite = nextDepthWrite;
        standard.needsUpdate = true;
      }
    });
  });
}

function wrapIndex(index: number) {
  return (index + BOTTLE_FLAVORS.length) % BOTTLE_FLAVORS.length;
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function smootherstep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function dampLightPosition(light: THREE.Light, x: number, y: number, z: number, delta: number, lambda: number) {
  light.position.x = THREE.MathUtils.damp(light.position.x, x, lambda, delta);
  light.position.y = THREE.MathUtils.damp(light.position.y, y, lambda, delta);
  light.position.z = THREE.MathUtils.damp(light.position.z, z, lambda, delta);
}

function dampAngle(current: number, target: number, lambda: number, delta: number) {
  const twoPi = Math.PI * 2;
  let diff = (target - current) % twoPi;

  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;

  return current + diff * (1 - Math.exp(-lambda * delta));
}

function mixHex(from: string, to: string, progress: number) {
  const a = new THREE.Color(from);
  const b = new THREE.Color(to);
  a.lerp(b, progress);
  return `#${a.getHexString()}`;
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function hexToRgba(hex: string, alpha: number) {
  const color = new THREE.Color(hex);
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
}

function hexToRgbTriplet(hex: string) {
  const color = new THREE.Color(hex);
  return `${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}`;
}

function Fallback() {
  return null;
}

if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_PATH);
  BOTTLE_FLAVORS.forEach((flavor) => {
    useLoader.preload(THREE.TextureLoader, flavor.texture);
  });
}
