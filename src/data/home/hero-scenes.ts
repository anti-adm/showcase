export type HeroScene = {
  id: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string[];
  cta?: {
    label: string;
    href: string;
  };
  group: "intro" | "production" | "products";
};

type Locale = "uz" | "ru" | "en";

const heroScenesByLocale: Record<Locale, HeroScene[]> = {
  ru: [
  {
    id: 0,
    title: "SOFIN",
    subtitle: "От фермы — до полки.",
    description:
      "Свежие, качественные и полезные молочные продукты из эко-фермы — с вниманием к безопасности, вкусу и пути каждого продукта.",
    cta: {
      label: "Наш каталог",
      href: "/products"
    },
    group: "intro"
  },
  {
    id: 1,
    eyebrow: "ИСТОРИЯ",
    title: "Коротко о SOFIN",
    description:
      "Мы делаем молочные продукты из эко-фермы: чистое сырьё, стабильная логистика и внимание к качеству на каждом этапе. Контролируем свежесть, безопасность и вкус — от производства до полки.",
    cta: {
      label: "О компании",
      href: "/company"
    },
    group: "intro"
  },
  {
    id: 2,
    eyebrow: "ЙОГУРТЫ",
    title: "Нежные йогурты SOFIN для каждого дня",
    description:
      "Откройте линейку натуральных йогуртов SOFIN: мягкая текстура, яркие фруктовые вкусы и удобные форматы для спокойного ежедневного выбора.",
    highlights: ["Натуральное молоко", "Яркие вкусы", "Удобный формат"],
    cta: {
      label: "Открыть йогурты",
      href: "/yogurts"
    },
    group: "intro"
  },
  {
    id: 3,
    eyebrow: "ПРОДУКЦИЯ",
    title: "Современные молочные продукты на каждый день",
    description:
      "Йогурты, кефир, молоко и другие позиции SOFIN создаются с фокусом на свежесть, чистый вкус и удобный формат для ежедневного выбора.",
    highlights: ["Йогурты", "Кефир", "Сливочные продукты"],
    cta: {
      label: "Наш каталог",
      href: "/products"
    },
    group: "production"
  },
  {
    id: 4,
    eyebrow: "ДОВЕРИЕ",
    title: "От локального производства к стабильному бренду",
    description:
      "SOFIN объединяет заботу об исходном сырье, понятное качество и современный подход к продукту — чтобы покупатель каждый раз получал предсказуемо хороший результат.",
    group: "products"
  }
],
  uz: [
    {
      id: 0,
      title: "SOFIN",
      subtitle: "Fermadan — javongacha.",
      description:
        "Eko-fermadan yangi, sifatli va foydali sut mahsulotlari — xavfsizlik, ta’m va har bir mahsulot yo‘liga e’tibor bilan.",
      cta: {
        label: "Bizning katalog",
        href: "/products"
      },
      group: "intro"
    },
    {
      id: 1,
      eyebrow: "TARIX",
      title: "SOFIN haqida qisqacha",
      description:
        "Biz eko-ferma sutidan mahsulot yaratamiz: toza xomashyo, barqaror logistika va har bosqichda sifat nazorati. Yangilik, xavfsizlik va ta’mni ishlab chiqarishdan javongacha kuzatamiz.",
      cta: {
        label: "Kompaniya haqida",
        href: "/company"
      },
      group: "intro"
    },
    {
      id: 2,
      eyebrow: "YOGURTLAR",
      title: "Har kun uchun mayin SOFIN yogurtlari",
      description:
        "SOFIN yogurtlari liniyasini kashf eting: mayin tekstura, yorqin mevali ta’mlar va har kungi sokin tanlov uchun qulay formatlar.",
      highlights: ["Tabiiy sut", "Yorqin ta’mlar", "Qulay format"],
      cta: {
        label: "Yogurtlarni ochish",
        href: "/yogurts"
      },
      group: "intro"
    },
    {
      id: 3,
      eyebrow: "MAHSULOTLAR",
      title: "Har kun uchun zamonaviy sut mahsulotlari",
      description:
        "Yogurt, kefir, sut va boshqa SOFIN mahsulotlari yangilik, toza ta’m va kundalik tanlovga qulay format bilan yaratiladi.",
      highlights: ["Yogurtlar", "Kefir", "Qaymoqli mahsulotlar"],
      cta: {
        label: "Katalogni ochish",
        href: "/products"
      },
      group: "production"
    },
    {
      id: 4,
      eyebrow: "ISHONCH",
      title: "Mahalliy ishlab chiqarishdan barqaror brend sari",
      description:
        "SOFIN xomashyoga g‘amxo‘rlik, tushunarli sifat va zamonaviy yondashuvni birlashtiradi — xaridor har safar ishonchli natija olishi uchun.",
      group: "products"
    }
  ],
  en: [
    {
      id: 0,
      title: "SOFIN",
      subtitle: "From farm — to shelf.",
      description:
        "Fresh, high-quality dairy products from an eco farm, created with care for safety, taste and every step of the product journey.",
      cta: {
        label: "Our catalog",
        href: "/products"
      },
      group: "intro"
    },
    {
      id: 1,
      eyebrow: "STORY",
      title: "SOFIN in brief",
      description:
        "We make dairy products from eco-farm milk: clean raw ingredients, stable logistics and attention to quality at every stage, from production to the shelf.",
      cta: {
        label: "About company",
        href: "/company"
      },
      group: "intro"
    },
    {
      id: 2,
      eyebrow: "YOGURTS",
      title: "Gentle SOFIN yogurts for every day",
      description:
        "Explore SOFIN's natural yogurt line: soft texture, bright fruit flavors and practical formats for an easy everyday choice.",
      highlights: ["Natural milk", "Bright flavors", "Easy format"],
      cta: {
        label: "Open yogurts",
        href: "/yogurts"
      },
      group: "intro"
    },
    {
      id: 3,
      eyebrow: "PRODUCTS",
      title: "Modern dairy products for every day",
      description:
        "Yogurts, kefir, milk and other SOFIN items are created around freshness, clean taste and convenient everyday formats.",
      highlights: ["Yogurts", "Kefir", "Creamy essentials"],
      cta: {
        label: "Open catalog",
        href: "/products"
      },
      group: "production"
    },
    {
      id: 4,
      eyebrow: "TRUST",
      title: "From local production to a stable brand",
      description:
        "SOFIN combines care for raw ingredients, clear quality and a modern product approach so every purchase feels dependable.",
      group: "products"
    }
  ]
};

export const heroScenes = heroScenesByLocale.ru;

export function getHeroScenes(locale: string): HeroScene[] {
  if (locale === "uz" || locale === "ru" || locale === "en") return heroScenesByLocale[locale];
  return heroScenesByLocale.ru;
}
