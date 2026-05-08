export type ProductCategory =
  | "all"
  | "milk"
  | "kefir"
  | "yogurt"
  | "cheese"
  | "cream"
  | "ayran"
  | "qatiq"
  | "tvorog";

export type LocalizedText = {
  uz: string;
  ru: string;
  en: string;
};

export type NutritionItem = {
  label: LocalizedText;
  value: string;
};

export type ProductItem = {
  slug: string;
  badge: string;
  category: Exclude<ProductCategory, "all">;
  title: LocalizedText;
  subtitle: LocalizedText;
  weight: LocalizedText;
  image: string;
  gallery: string[];
  accent: string;

  fatPercent?: string;
  netWeight?: string;

  storageValue: LocalizedText;
  packagingValue: LocalizedText;
  formatValue: LocalizedText;

  nutrition: {
    energy: string;
    fat: string;
    protein: string;
    carbs: string;
    extra?: NutritionItem[];
  };

  compositionTitle: LocalizedText;
  composition: LocalizedText;
  storageText: LocalizedText;
  productionDateText: LocalizedText;
  manufacturer: LocalizedText;
  address: LocalizedText;
  openedText: LocalizedText;
};

const manufacturer = {
  uz: "Ishlab chiqaruvchi: «Yangi Asr» F/X.",
  ru: "Производитель: «Yangi Asr» F/X.",
  en: "Manufacturer: «Yangi Asr» F/X."
};

const address = {
  uz: "Manzil: Oʻzbekiston Respublikasi, Navoiy viloyati, Qiziltepa tumani, Gʻoyibon MFY, Navgandi qishlogʻi, 90-uy.",
  ru: "Адрес: Республика Узбекистан, Навоийская область, Кызылтепинский район, Гойибон МФЙ, кишлак Навганди, дом 90.",
  en: "Address: Republic of Uzbekistan, Navoi region, Kyzyltepa district, Gʻoyibon MFY, Navgandi village, house 90."
};

export const products: ProductItem[] = [
  {
    slug: "yogurt-cherry-270",
    badge: "01",
    category: "yogurt",
    title: {
      uz: "Yogurt. Olcha ta’mi bilan 270 g",
      ru: "Йогурт со вкусом вишни 270 г",
      en: "Cherry Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-cherry-270.jpg",
    gallery: ["/images/products/yogurt-cherry-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {
      uz: "21 kun",
      ru: "21 день",
      en: "21 days"
    },
    packagingValue: {
      uz: "270 g butilka",
      ru: "Бутылка 270 g",
      en: "270 g bottle"
    },
    formatValue: {
      uz: "Olchali yogurt",
      ru: "Йогурт вишня",
      en: "Cherry yogurt"
    },
    nutrition: {
      energy: "—",
      fat: "1,5 g",
      protein: "—",
      carbs: "—"
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Mevali yogurt, olcha ta’mi bilan.",
      ru: "Йогурт с вишневым вкусом.",
      en: "Yogurt with cherry flavor."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.",
      ru: "После открытия употребить в течение 24 часов.",
      en: "Consume within 24 hours after opening."
    }
  },
  {
    slug: "yogurt-cherry-120",
    badge: "02",
    category: "yogurt",
    title: {
      uz: "Yogurt. Olcha ta’mi bilan 120 g",
      ru: "Йогурт со вкусом вишни 120 г",
      en: "Cherry Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-cherry-120.jpg",
    gallery: ["/images/products/yogurt-cherry-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "Olchali yogurt", ru: "Йогурт вишня", en: "Cherry yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, olcha ta’mi bilan.", ru: "Йогурт с вишневым вкусом.", en: "Yogurt with cherry flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-forest-270",
    badge: "03",
    category: "yogurt",
    title: {
      uz: "Yogurt. O‘rmon mevalari ta’mi bilan 270 g",
      ru: "Йогурт со вкусом лесных ягод 270 г",
      en: "Forest Berries Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-forest-270.jpg",
    gallery: ["/images/products/yogurt-forest-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "270 g butilka", ru: "Бутылка 270 g", en: "270 g bottle"},
    formatValue: {uz: "O‘rmon mevali yogurt", ru: "Йогурт лесные ягоды", en: "Forest berries yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, o‘rmon mevalari ta’mi bilan.", ru: "Йогурт со вкусом лесных ягод.", en: "Yogurt with forest berries flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-forest-120",
    badge: "04",
    category: "yogurt",
    title: {
      uz: "Yogurt. O‘rmon mevalari ta’mi bilan 120 g",
      ru: "Йогурт со вкусом лесных ягод 120 г",
      en: "Forest Berries Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-forest-120.jpg",
    gallery: ["/images/products/yogurt-forest-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "O‘rmon mevali yogurt", ru: "Йогурт лесные ягоды", en: "Forest berries yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, o‘rmon mevalari ta’mi bilan.", ru: "Йогурт со вкусом лесных ягод.", en: "Yogurt with forest berries flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-peach-270",
    badge: "05",
    category: "yogurt",
    title: {
      uz: "Yogurt. Shaftoli ta’mi bilan 270 g",
      ru: "Йогурт со вкусом персика 270 г",
      en: "Peach Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-peach-270.jpg",
    gallery: ["/images/products/yogurt-peach-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "270 g butilka", ru: "Бутылка 270 g", en: "270 g bottle"},
    formatValue: {uz: "Shaftolili yogurt", ru: "Йогурт персик", en: "Peach yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, shaftoli ta’mi bilan.", ru: "Йогурт с персиковым вкусом.", en: "Yogurt with peach flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-peach-120",
    badge: "06",
    category: "yogurt",
    title: {
      uz: "Yogurt. Shaftoli ta’mi bilan 120 g",
      ru: "Йогурт со вкусом персика 120 г",
      en: "Peach Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-peach-120.jpg",
    gallery: ["/images/products/yogurt-peach-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "Shaftolili yogurt", ru: "Йогурт персик", en: "Peach yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, shaftoli ta’mi bilan.", ru: "Йогурт с персиковым вкусом.", en: "Yogurt with peach flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-strawberry-270",
    badge: "07",
    category: "yogurt",
    title: {
      uz: "Yogurt. Qulupnay ta’mi bilan 270 g",
      ru: "Йогурт со вкусом клубники 270 г",
      en: "Strawberry Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-strawberry-270.jpg",
    gallery: ["/images/products/yogurt-strawberry-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "270 g butilka", ru: "Бутылка 270 g", en: "270 g bottle"},
    formatValue: {uz: "Qulupnayli yogurt", ru: "Йогурт клубника", en: "Strawberry yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, qulupnay ta’mi bilan.", ru: "Йогурт с клубничным вкусом.", en: "Yogurt with strawberry flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-strawberry-120",
    badge: "08",
    category: "yogurt",
    title: {
      uz: "Yogurt. Qulupnay ta’mi bilan 120 g",
      ru: "Йогурт со вкусом клубники 120 г",
      en: "Strawberry Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-strawberry-120.jpg",
    gallery: ["/images/products/yogurt-strawberry-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "Qulupnayli yogurt", ru: "Йогурт клубника", en: "Strawberry yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, qulupnay ta’mi bilan.", ru: "Йогурт с клубничным вкусом.", en: "Yogurt with strawberry flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-raspberry-270",
    badge: "09",
    category: "yogurt",
    title: {
      uz: "Yogurt. Malina ta’mi bilan 270 g",
      ru: "Йогурт со вкусом малины 270 г",
      en: "Raspberry Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-raspberry-270.jpg",
    gallery: ["/images/products/yogurt-raspberry-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "270 g butilka", ru: "Бутылка 270 g", en: "270 g bottle"},
    formatValue: {uz: "Malinali yogurt", ru: "Йогурт малина", en: "Raspberry yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, malina ta’mi bilan.", ru: "Йогурт с малиновым вкусом.", en: "Yogurt with raspberry flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-raspberry-120",
    badge: "10",
    category: "yogurt",
    title: {
      uz: "Yogurt. Malina ta’mi bilan 120 g",
      ru: "Йогурт со вкусом малины 120 г",
      en: "Raspberry Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-raspberry-120.jpg",
    gallery: ["/images/products/yogurt-raspberry-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "Malinali yogurt", ru: "Йогурт малина", en: "Raspberry yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, malina ta’mi bilan.", ru: "Йогурт с малиновым вкусом.", en: "Yogurt with raspberry flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-banana-270",
    badge: "11",
    category: "yogurt",
    title: {
      uz: "Yogurt. Banan ta’mi bilan 270 g",
      ru: "Йогурт со вкусом банана 270 г",
      en: "Banana Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-banana-270.jpg",
    gallery: ["/images/products/yogurt-banana-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "270 g butilka", ru: "Бутылка 270 g", en: "270 g bottle"},
    formatValue: {uz: "Bananli yogurt", ru: "Йогурт банан", en: "Banana yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, banan ta’mi bilan.", ru: "Йогурт с банановым вкусом.", en: "Yogurt with banana flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-banana-120",
    badge: "12",
    category: "yogurt",
    title: {
      uz: "Yogurt. Banan ta’mi bilan 120 g",
      ru: "Йогурт со вкусом банана 120 г",
      en: "Banana Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-banana-120.jpg",
    gallery: ["/images/products/yogurt-banana-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "Bananli yogurt", ru: "Йогурт банан", en: "Banana yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, banan ta’mi bilan.", ru: "Йогурт с банановым вкусом.", en: "Yogurt with banana flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-pineapple-270",
    badge: "13",
    category: "yogurt",
    title: {
      uz: "Yogurt. Ananas ta’mi bilan 270 g",
      ru: "Йогурт со вкусом ананаса 270 г",
      en: "Pineapple Yogurt 270 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 270 g",
      ru: "Масса нетто: 270 g",
      en: "Net weight: 270 g"
    },
    image: "/images/products/yogurt-pineapple-270.jpg",
    gallery: ["/images/products/yogurt-pineapple-270.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "270 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "270 g butilka", ru: "Бутылка 270 g", en: "270 g bottle"},
    formatValue: {uz: "Ananasli yogurt", ru: "Йогурт ананас", en: "Pineapple yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, ananas ta’mi bilan.", ru: "Йогурт с ананасовым вкусом.", en: "Yogurt with pineapple flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "yogurt-pineapple-120",
    badge: "14",
    category: "yogurt",
    title: {
      uz: "Yogurt. Ananas ta’mi bilan 120 g",
      ru: "Йогурт со вкусом ананаса 120 г",
      en: "Pineapple Yogurt 120 g"
    },
    subtitle: {
      uz: "1,5% yog‘li mevali yogurt",
      ru: "Фруктовый йогурт 1,5%",
      en: "Fruit yogurt 1.5%"
    },
    weight: {
      uz: "Sof massa: 120 g",
      ru: "Масса нетто: 120 g",
      en: "Net weight: 120 g"
    },
    image: "/images/products/yogurt-pineapple-120.jpg",
    gallery: ["/images/products/yogurt-pineapple-120.jpg"],
    accent: "from-[#eef4fa] to-[#e4edf7]",
    fatPercent: "1,5%",
    netWeight: "120 g",
    storageValue: {uz: "21 kun", ru: "21 день", en: "21 days"},
    packagingValue: {uz: "120 g stakan", ru: "Стакан 120 g", en: "120 g cup"},
    formatValue: {uz: "Ananasli yogurt", ru: "Йогурт ананас", en: "Pineapple yogurt"},
    nutrition: {energy: "—", fat: "1,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Mevali yogurt, ananas ta’mi bilan.", ru: "Йогурт с ананасовым вкусом.", en: "Yogurt with pineapple flavor."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "kefir-25-450",
    badge: "15",
    category: "kefir",
    title: {
      uz: "Kefir 2,5% — 450 g",
      ru: "Кефир 2,5% — 450 г",
      en: "Kefir 2.5% — 450 g"
    },
    subtitle: {
      uz: "Tabiiy kefir",
      ru: "Натуральный кефир",
      en: "Natural kefir"
    },
    weight: {
      uz: "Sof massa: 450 g",
      ru: "Масса нетто: 450 g",
      en: "Net weight: 450 g"
    },
    image: "/images/products/kefir-25-450.jpg",
    gallery: ["/images/products/kefir-25-450.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    fatPercent: "2,5%",
    netWeight: "450 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "450 g butilka", ru: "Бутылка 450 g", en: "450 g bottle"},
    formatValue: {uz: "Kefir 2,5%", ru: "Кефир 2,5%", en: "Kefir 2.5%"},
    nutrition: {energy: "—", fat: "2,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Kefir, yog‘ massasi 2,5%.", ru: "Кефир с массовой долей жира 2,5%.", en: "Kefir with 2.5% fat content."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "kefir-25-900",
    badge: "16",
    category: "kefir",
    title: {
      uz: "Kefir 2,5% — 900 g",
      ru: "Кефир 2,5% — 900 г",
      en: "Kefir 2.5% — 900 g"
    },
    subtitle: {
      uz: "Tabiiy kefir",
      ru: "Натуральный кефир",
      en: "Natural kefir"
    },
    weight: {
      uz: "Sof massa: 900 g",
      ru: "Масса нетто: 900 g",
      en: "Net weight: 900 g"
    },
    image: "/images/products/kefir-25-900.jpg",
    gallery: ["/images/products/kefir-25-900.jpg", "/images/products/kefir-25-900-2.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    fatPercent: "2,5%",
    netWeight: "900 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "900 g butilka", ru: "Бутылка 900 g", en: "900 g bottle"},
    formatValue: {uz: "Kefir 2,5%", ru: "Кефир 2,5%", en: "Kefir 2.5%"},
    nutrition: {energy: "—", fat: "2,5 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Kefir, yog‘ massasi 2,5%.", ru: "Кефир с массовой долей жира 2,5%.", en: "Kefir with 2.5% fat content."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "kefir-1-450",
    badge: "17",
    category: "kefir",
    title: {
      uz: "Kefir 1% — 450 g",
      ru: "Кефир 1% — 450 г",
      en: "Kefir 1% — 450 g"
    },
    subtitle: {
      uz: "Tabiiy kefir",
      ru: "Натуральный кефир",
      en: "Natural kefir"
    },
    weight: {
      uz: "Sof massa: 450 g",
      ru: "Масса нетто: 450 g",
      en: "Net weight: 450 g"
    },
    image: "/images/products/kefir-1-450.jpg",
    gallery: ["/images/products/kefir-1-450.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    fatPercent: "1%",
    netWeight: "450 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "450 g butilka", ru: "Бутылка 450 g", en: "450 g bottle"},
    formatValue: {uz: "Kefir 1%", ru: "Кефир 1%", en: "Kefir 1%"},
    nutrition: {energy: "—", fat: "1 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Kefir, yog‘ massasi 1%.", ru: "Кефир с массовой долей жира 1%.", en: "Kefir with 1% fat content."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "kefir-1-900",
    badge: "18",
    category: "kefir",
    title: {
      uz: "Kefir 1% — 900 g",
      ru: "Кефир 1% — 900 г",
      en: "Kefir 1% — 900 g"
    },
    subtitle: {
      uz: "Tabiiy kefir",
      ru: "Натуральный кефир",
      en: "Natural kefir"
    },
    weight: {
      uz: "Sof massa: 900 g",
      ru: "Масса нетто: 900 g",
      en: "Net weight: 900 g"
    },
    image: "/images/products/kefir-1-900.jpg",
    gallery: ["/images/products/kefir-1-900.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    fatPercent: "1%",
    netWeight: "900 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "900 g butilka", ru: "Бутылка 900 g", en: "900 g bottle"},
    formatValue: {uz: "Kefir 1%", ru: "Кефир 1%", en: "Kefir 1%"},
    nutrition: {energy: "—", fat: "1 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Kefir, yog‘ massasi 1%.", ru: "Кефир с массовой долей жира 1%.", en: "Kefir with 1% fat content."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "kefir-32-450",
    badge: "19",
    category: "kefir",
    title: {
      uz: "Kefir 3,2% — 450 g",
      ru: "Кефир 3,2% — 450 г",
      en: "Kefir 3.2% — 450 g"
    },
    subtitle: {
      uz: "Tabiiy kefir",
      ru: "Натуральный кефир",
      en: "Natural kefir"
    },
    weight: {
      uz: "Sof massa: 450 g",
      ru: "Масса нетто: 450 g",
      en: "Net weight: 450 g"
    },
    image: "/images/products/kefir-32-450.jpg",
    gallery: ["/images/products/kefir-32-450.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    fatPercent: "3,2%",
    netWeight: "450 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "450 g butilka", ru: "Бутылка 450 g", en: "450 g bottle"},
    formatValue: {uz: "Kefir 3,2%", ru: "Кефир 3,2%", en: "Kefir 3.2%"},
    nutrition: {energy: "—", fat: "3,2 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Kefir, yog‘ massasi 3,2%.", ru: "Кефир с массовой долей жира 3,2%.", en: "Kefir with 3.2% fat content."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "kefir-32-900",
    badge: "20",
    category: "kefir",
    title: {
      uz: "Kefir 3,2% — 900 g",
      ru: "Кефир 3,2% — 900 г",
      en: "Kefir 3.2% — 900 g"
    },
    subtitle: {
      uz: "Tabiiy kefir",
      ru: "Натуральный кефир",
      en: "Natural kefir"
    },
    weight: {
      uz: "Sof massa: 900 g",
      ru: "Масса нетто: 900 g",
      en: "Net weight: 900 g"
    },
    image: "/images/products/kefir-32-900.jpg",
    gallery: ["/images/products/kefir-32-900.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    fatPercent: "3,2%",
    netWeight: "900 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "900 g butilka", ru: "Бутылка 900 g", en: "900 g bottle"},
    formatValue: {uz: "Kefir 3,2%", ru: "Кефир 3,2%", en: "Kefir 3.2%"},
    nutrition: {energy: "—", fat: "3,2 g", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Kefir, yog‘ massasi 3,2%.", ru: "Кефир с массовой долей жира 3,2%.", en: "Kefir with 3.2% fat content."},
    storageText: {uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.", ru: "Условия хранения: хранить при температуре 4 ± 2°C.", en: "Storage conditions: keep at 4 ± 2°C."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.", ru: "После открытия употребить в течение 24 часов.", en: "Consume within 24 hours after opening."}
  },
  {
    slug: "ayran-basil-900",
    badge: "21",
    category: "ayran",
    title: {
      uz: "Rayhonli ayran — 900 g",
      ru: "Айран со вкусом базилика — 900 г",
      en: "Basil Ayran — 900 g"
    },
    subtitle: {
      uz: "1% yog‘li ayran",
      ru: "Айран 1%",
      en: "Ayran 1%"
    },
    weight: {
      uz: "Sof massa: 900 g",
      ru: "Масса нетто: 900 g",
      en: "Net weight: 900 g"
    },
    image: "/images/products/ayran-basil-900.jpg",
    gallery: ["/images/products/ayran-basil-900.jpg"],
    accent: "from-[#eef2fa] to-[#e7edf8]",
    fatPercent: "1%",
    netWeight: "900 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "900 g butilka", ru: "Бутылка 900 g", en: "900 g bottle"},
    formatValue: {uz: "Rayhonli ayran", ru: "Айран с базиликом", en: "Ayran with basil"},
    nutrition: {
      energy: "24 kkal",
      fat: "1 g",
      protein: "1,1 g",
      carbs: "1,4 g"
    },
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {
      uz: "Me’yorlashtirilgan sut, yodlangan osh tuzi, ichimlik suvi, achitqi.",
      ru: "Нормализованное молоко, йодированная соль, питьевая вода, закваска.",
      en: "Standardized milk, iodized salt, drinking water, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.",
      ru: "После открытия употребить в течение 24 часов.",
      en: "Consume within 24 hours after opening."
    }
  },
  {
    slug: "ayran-basil-450",
    badge: "22",
    category: "ayran",
    title: {
      uz: "Rayhonli ayran — 450 g",
      ru: "Айран со вкусом базилика — 450 г",
      en: "Basil Ayran — 450 g"
    },
    subtitle: {
      uz: "1% yog‘li ayran",
      ru: "Айран 1%",
      en: "Ayran 1%"
    },
    weight: {
      uz: "Sof massa: 450 g",
      ru: "Масса нетто: 450 g",
      en: "Net weight: 450 g"
    },
    image: "/images/products/ayran-basil-450.jpg",
    gallery: ["/images/products/ayran-basil-450.jpg"],
    accent: "from-[#eef2fa] to-[#e7edf8]",
    fatPercent: "1%",
    netWeight: "450 g",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "450 g butilka", ru: "Бутылка 450 g", en: "450 g bottle"},
    formatValue: {uz: "Rayhonli ayran", ru: "Айран с базиликом", en: "Ayran with basil"},
    nutrition: {
      energy: "24 kkal",
      fat: "1 g",
      protein: "1,1 g",
      carbs: "1,4 g"
    },
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {
      uz: "Me’yorlashtirilgan sut, yodlangan osh tuzi, ichimlik suvi, achitqi.",
      ru: "Нормализованное молоко, йодированная соль, питьевая вода, закваска.",
      en: "Standardized milk, iodized salt, drinking water, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.",
      ru: "После открытия употребить в течение 24 часов.",
      en: "Consume within 24 hours after opening."
    }
  },
  {
    slug: "ayran-basil-1000",
    badge: "23",
    category: "ayran",
    title: {
      uz: "Rayhonli ayran — 1 l",
      ru: "Айран со вкусом базилика — 1 л",
      en: "Basil Ayran — 1 l"
    },
    subtitle: {
      uz: "1% yog‘li ayran",
      ru: "Айран 1%",
      en: "Ayran 1%"
    },
    weight: {
      uz: "Sof massa: 1 l",
      ru: "Масса нетто: 1 l",
      en: "Net weight: 1 l"
    },
    image: "/images/products/ayran-basil-1000.jpg",
    gallery: ["/images/products/ayran-basil-1000.jpg"],
    accent: "from-[#eef2fa] to-[#e7edf8]",
    fatPercent: "1%",
    netWeight: "1 l",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "1 l butilka", ru: "Бутылка 1 l", en: "1 l bottle"},
    formatValue: {uz: "Rayhonli ayran", ru: "Айран с базиликом", en: "Ayran with basil"},
    nutrition: {
      energy: "24 kkal",
      fat: "1 g",
      protein: "1,1 g",
      carbs: "1,4 g"
    },
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {
      uz: "Me’yorlashtirilgan sut, yodlangan osh tuzi, ichimlik suvi, achitqi.",
      ru: "Нормализованное молоко, йодированная соль, питьевая вода, закваска.",
      en: "Standardized milk, iodized salt, drinking water, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.",
      ru: "После открытия употребить в течение 24 часов.",
      en: "Consume within 24 hours after opening."
    }
  },
  {
    slug: "ayran-plain-1000",
    badge: "24",
    category: "ayran",
    title: {
      uz: "Ayran — 1 l",
      ru: "Айран — 1 л",
      en: "Ayran — 1 l"
    },
    subtitle: {
      uz: "1% yog‘li ayran",
      ru: "Айран 1%",
      en: "Ayran 1%"
    },
    weight: {
      uz: "Sof massa: 1 l",
      ru: "Масса нетто: 1 l",
      en: "Net weight: 1 l"
    },
    image: "/images/products/ayran-1-1000.jpg",
    gallery: ["/images/products/ayran-1-1000.jpg"],
    accent: "from-[#eef2fa] to-[#e7edf8]",
    fatPercent: "1%",
    netWeight: "1 l",
    storageValue: {uz: "20 kun", ru: "20 дней", en: "20 days"},
    packagingValue: {uz: "1 l butilka", ru: "Бутылка 1 l", en: "1 l bottle"},
    formatValue: {uz: "Ayran", ru: "Айран", en: "Ayran"},
    nutrition: {
      energy: "24 kkal",
      fat: "1 g",
      protein: "1,1 g",
      carbs: "1,4 g"
    },
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {
      uz: "Me’yorlashtirilgan sut, yodlangan osh tuzi, ichimlik suvi, achitqi.",
      ru: "Нормализованное молоко, йодированная соль, питьевая вода, закваска.",
      en: "Standardized milk, iodized salt, drinking water, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.",
      ru: "После открытия употребить в течение 24 часов.",
      en: "Consume within 24 hours after opening."
    }
  },
  {
    slug: "qatiq-3",
    badge: "25",
    category: "qatiq",
    title: {
      uz: "Qatiq 3%",
      ru: "Катык 3%",
      en: "Qatiq 3%"
    },
    subtitle: {
      uz: "Fermentlangan sut mahsuloti",
      ru: "Кисломолочный продукт",
      en: "Fermented dairy product"
    },
    weight: {
      uz: "Qadoq hajmi: ko‘rsatiladi",
      ru: "Объем: уточняется",
      en: "Pack size: to be specified"
    },
    image: "/images/products/qatiq-3.jpg",
    gallery: ["/images/products/qatiq-3.jpg"],
    accent: "from-[#eef4fa] to-[#e5edf6]",
    fatPercent: "3%",
    storageValue: {
      uz: "20 kun",
      ru: "20 дней",
      en: "20 days"
    },
    packagingValue: {
      uz: "Mahsulot kartasiga qo‘shiladi",
      ru: "Будет добавлено в карточку",
      en: "Will be added to the card"
    },
    formatValue: {
      uz: "Qatiq",
      ru: "Катык",
      en: "Qatiq"
    },
    nutrition: {
      energy: "57 kkal",
      fat: "3 g",
      protein: "2,6 g",
      carbs: "4,6 g"
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Me’yorlashtirilgan sut, yodlangan osh tuzi, ichimlik suvi, achitqi.",
      ru: "Нормализованное молоко, йодированная соль, питьевая вода, закваска.",
      en: "Standardized milk, iodized salt, drinking water, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda va havoning nisbiy namligi 70% bo‘lgan sharoitda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C и относительной влажности воздуха 70%.",
      en: "Storage conditions: keep at 4 ± 2°C and 70% relative humidity."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana, yaroqlilik muddati, ST.T va lot raqami qadoqda ko‘rsatilgan.",
      ru: "Дата производства, срок годности, ST.T и номер партии указаны на упаковке.",
      en: "Production date, expiry date, ST.T and lot number are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Saqlash muddati 20 kun. Ochilgandan so‘ng 24 soat davomida iste’mol qilinsin.",
      ru: "Срок хранения 20 дней. После открытия употребить в течение 24 часов.",
      en: "Shelf life is 20 days. Consume within 24 hours after opening."
    }
  },
  {
    slug: "smetana",
    badge: "26",
    category: "cream",
    title: {
      uz: "Smetana",
      ru: "Сметана",
      en: "Smetana"
    },
    subtitle: {
      uz: "Sour Cream",
      ru: "Sour Cream",
      en: "Sour Cream"
    },
    weight: {
      uz: "Qadoq hajmi: ko‘rsatiladi",
      ru: "Объем: уточняется",
      en: "Pack size: to be specified"
    },
    image: "/images/products/smetana.jpg",
    gallery: ["/images/products/smetana.jpg"],
    accent: "from-[#f1f5fa] to-[#e8edf5]",
    storageValue: {
      uz: "21 kun",
      ru: "21 день",
      en: "21 days"
    },
    packagingValue: {
      uz: "Mahsulot kartasiga qo‘shiladi",
      ru: "Будет добавлено в карточку",
      en: "Will be added to the card"
    },
    formatValue: {
      uz: "Smetana",
      ru: "Сметана",
      en: "Smetana"
    },
    nutrition: {
      energy: "204 K / 854 Kkal",
      fat: "20 g",
      protein: "2,8 g",
      carbs: "3,2 g"
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Me’yorlashtirilgan qaymoq, achitqi.",
      ru: "Нормализованные сливки, закваска.",
      en: "Standardized cream, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati idishda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Saqlash muddati 21 kun. Ochilgandan so‘ng 24 soat davomida iste’mol qilinsin.",
      ru: "Срок хранения 21 день. После открытия употребить в течение 24 часов.",
      en: "Shelf life is 21 days. Consume within 24 hours after opening."
    }
  },
  {
    slug: "qaymaq",
    badge: "27",
    category: "cream",
    title: {
      uz: "Qaymaq",
      ru: "Каймак",
      en: "Milk Cream"
    },
    subtitle: {
      uz: "Milk Cream",
      ru: "Milk Cream",
      en: "Milk Cream"
    },
    weight: {
      uz: "Qadoq hajmi: ko‘rsatiladi",
      ru: "Объем: уточняется",
      en: "Pack size: to be specified"
    },
    image: "/images/products/qaymaq.jpg",
    gallery: ["/images/products/qaymaq.jpg"],
    accent: "from-[#f1f5fa] to-[#e8edf5]",
    storageValue: {
      uz: "21 kun",
      ru: "21 день",
      en: "21 days"
    },
    packagingValue: {
      uz: "Mahsulot kartasiga qo‘shiladi",
      ru: "Будет добавлено в карточку",
      en: "Will be added to the card"
    },
    formatValue: {
      uz: "Qaymaq",
      ru: "Каймак",
      en: "Cream"
    },
    nutrition: {
      energy: "425,8 K / 1782 Kkal",
      fat: "45 g",
      protein: "2,3 g",
      carbs: "2,9 g"
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Me’yorlashtirilgan qaymoq.",
      ru: "Нормализованные сливки.",
      en: "Standardized cream."
    },
    storageText: {
      uz: "Saqlash sharoiti: 4 ± 2°C haroratda saqlansin.",
      ru: "Условия хранения: хранить при температуре 4 ± 2°C.",
      en: "Storage conditions: keep at 4 ± 2°C."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati idishda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Saqlash muddati 21 kun. Ochilgandan so‘ng 24 soat ichida iste’mol qilinsin.",
      ru: "Срок хранения 21 день. После открытия употребить в течение 24 часов.",
      en: "Shelf life is 21 days. Consume within 24 hours after opening."
    }
  },
  {
    slug: "mozzarella-big",
    badge: "28",
    category: "cheese",
    title: {
      uz: "Mozzarella 1–2 kg",
      ru: "Mozzarella 1–2 кг",
      en: "Mozzarella 1–2 kg"
    },
    subtitle: {
      uz: "Mozzarella pishlog‘i",
      ru: "Сыр Mozzarella",
      en: "Mozzarella cheese"
    },
    weight: {
      uz: "Sof massa: 1–2 kg",
      ru: "Масса нетто: 1–2 kg",
      en: "Net weight: 1–2 kg"
    },
    image: "/images/products/mozzarella-big.jpg",
    gallery: ["/images/products/mozzarella-big.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    storageValue: {
      uz: "Qadoqda ko‘rsatilgan",
      ru: "Указан на упаковке",
      en: "Indicated on package"
    },
    packagingValue: {
      uz: "Yirik qadoq",
      ru: "Крупная упаковка",
      en: "Large pack"
    },
    formatValue: {
      uz: "Mozzarella",
      ru: "Mozzarella",
      en: "Mozzarella"
    },
    nutrition: {
      energy: "1284 K / 308 Kkal",
      fat: "21,7 g",
      protein: "26,3 g",
      carbs: "2,0 g",
      extra: [
        {
          label: {
            uz: "To‘yingan yog‘",
            ru: "Насыщенные жиры",
            en: "Saturated fat"
          },
          value: "14,1 g"
        },
        {
          label: {
            uz: "Shakar",
            ru: "Сахара",
            en: "Sugars"
          },
          value: "2,0 g"
        },
        {
          label: {
            uz: "Tuz",
            ru: "Соль",
            en: "Salt"
          },
          value: "1,1 g"
        },
        {
          label: {
            uz: "Kalsiy",
            ru: "Кальций",
            en: "Calcium"
          },
          value: "580 mg"
        }
      ]
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Pasterizatsiyalangan sigir suti, pishloq kulturasi, tuz va emulsiya qiluvchi tuzlar, stabilizator, konservant, rang beruvchi modda.",
      ru: "Пастеризованное коровье молоко, сырная культура, соль, эмульгирующие соли, стабилизатор, консервант, краситель.",
      en: "Pasteurized cow milk, cheese culture, salt, emulsifying salts, stabilizer, preservative and coloring agent."
    },
    storageText: {
      uz: "Saqlash sharoiti: +2°C dan +4°C gacha.",
      ru: "Условия хранения: от +2°C до +4°C.",
      en: "Storage conditions: from +2°C to +4°C."
    },
    productionDateText: {
      uz: "Yaroqlilik muddati va lot raqami qadoqda ko‘rsatilgan.",
      ru: "Срок годности и номер партии указаны на упаковке.",
      en: "Expiry date and lot number are indicated on the package."
    },
    manufacturer: {
      uz: "Ishlab chiqaruvchi: “YANGI ASR” FERMER XOʻJALIGI MAHSULOTI.",
      ru: "Производитель: «YANGI ASR» FERMER XOʻJALIGI MAHSULOTI.",
      en: "Manufacturer: “YANGI ASR” FERMER XOʻJALIGI MAHSULOTI."
    },
    address,
    openedText: {
      uz: "Quruq moddada sut yog‘i nisbati kamida 45% ni tashkil qiladi.",
      ru: "Массовая доля жира в сухом веществе не менее 45%.",
      en: "Milk fat in dry matter is at least 45%."
    }
  },
  {
    slug: "mozzarella-400",
    badge: "29",
    category: "cheese",
    title: {
      uz: "Mozzarella 250–400 g",
      ru: "Mozzarella 250–400 г",
      en: "Mozzarella 250–400 g"
    },
    subtitle: {
      uz: "Mozzarella pishlog‘i",
      ru: "Сыр Mozzarella",
      en: "Mozzarella cheese"
    },
    weight: {
      uz: "Sof massa: 250–400 g",
      ru: "Масса нетто: 250–400 g",
      en: "Net weight: 250–400 g"
    },
    image: "/images/products/mozzarella-400.jpg",
    gallery: ["/images/products/mozzarella-400.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    storageValue: {
      uz: "Qadoqda ko‘rsatilgan",
      ru: "Указан на упаковке",
      en: "Indicated on package"
    },
    packagingValue: {
      uz: "Kichik qadoq",
      ru: "Малая упаковка",
      en: "Small pack"
    },
    formatValue: {
      uz: "Mozzarella",
      ru: "Mozzarella",
      en: "Mozzarella"
    },
    nutrition: {
      energy: "1284 K / 308 Kkal",
      fat: "21,7 g",
      protein: "26,3 g",
      carbs: "2,0 g"
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Pasterizatsiyalangan sigir suti, pishloq kulturasi, tuz va emulsiya qiluvchi tuzlar, stabilizator, konservant, rang beruvchi modda.",
      ru: "Пастеризованное коровье молоко, сырная культура, соль, эмульгирующие соли, стабилизатор, консервант, краситель.",
      en: "Pasteurized cow milk, cheese culture, salt, emulsifying salts, stabilizer, preservative and coloring agent."
    },
    storageText: {
      uz: "Saqlash sharoiti: +2°C dan +4°C gacha.",
      ru: "Условия хранения: от +2°C до +4°C.",
      en: "Storage conditions: from +2°C to +4°C."
    },
    productionDateText: {
      uz: "Yaroqlilik muddati va lot raqami qadoqda ko‘rsatilgan.",
      ru: "Срок годности и номер партии указаны на упаковке.",
      en: "Expiry date and lot number are indicated on the package."
    },
    manufacturer: {
      uz: "Ishlab chiqaruvchi: “YANGI ASR” FERMER XOʻJALIGI MAHSULOTI.",
      ru: "Производитель: «YANGI ASR» FERMER XOʻJALIGI MAHSULOTI.",
      en: "Manufacturer: “YANGI ASR” FERMER XOʻJALIGI MAHSULOTI."
    },
    address,
    openedText: {
      uz: "Quruq moddada sut yog‘i nisbati kamida 45% ni tashkil qiladi.",
      ru: "Массовая доля жира в сухом веществе не менее 45%.",
      en: "Milk fat in dry matter is at least 45%."
    }
  },
  {
    slug: "tvorog-soft",
    badge: "30",
    category: "tvorog",
    title: {
      uz: "Yumshoq tvorog",
      ru: "Мягкий творог",
      en: "Soft Cottage Cheese"
    },
    subtitle: {
      uz: "Tvorog mahsuloti",
      ru: "Творожный продукт",
      en: "Cottage cheese product"
    },
    weight: {
      uz: "Sof massa: 200 g",
      ru: "Масса нетто: 200 g",
      en: "Net weight: 200 g"
    },
    image: "/images/products/tvorog-soft.jpg",
    gallery: ["/images/products/tvorog-soft.jpg"],
    accent: "from-[#eef3f9] to-[#e5edf6]",
    storageValue: {
      uz: "Qadoqda ko‘rsatilgan",
      ru: "Указан на упаковке",
      en: "Indicated on package"
    },
    packagingValue: {
      uz: "200 g qadoq",
      ru: "Упаковка 200 g",
      en: "200 g pack"
    },
    formatValue: {
      uz: "Tvorog",
      ru: "Творог",
      en: "Cottage cheese"
    },
    nutrition: {
      energy: "118,3 K / 308 Kkal",
      fat: "5,0 g",
      protein: "18 g",
      carbs: "3,0 g",
      extra: [
        {
          label: {
            uz: "To‘yingan yog‘",
            ru: "Насыщенные жиры",
            en: "Saturated fat"
          },
          value: "3,0 g"
        },
        {
          label: {
            uz: "Shakar",
            ru: "Сахара",
            en: "Sugars"
          },
          value: "3,1 g"
        },
        {
          label: {
            uz: "Tuz",
            ru: "Соль",
            en: "Salt"
          },
          value: "1,1 g"
        },
        {
          label: {
            uz: "Kalsiy",
            ru: "Кальций",
            en: "Calcium"
          },
          value: "150 mg"
        }
      ]
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Pasterizatsiyalangan sut, achitqi.",
      ru: "Пастеризованное молоко, закваска.",
      en: "Pasteurized milk, starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti qadoqda ko‘rsatilgan.",
      ru: "Условия хранения указаны на упаковке.",
      en: "Storage conditions are indicated on the package."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Ochilgandan so‘ng qisqa muddat ichida iste’mol qilinsin.",
      ru: "После открытия употребить в короткий срок.",
      en: "Consume shortly after opening."
    }
  },
  {
    slug: "oxotnichiy-cheese",
    badge: "31",
    category: "cheese",
    title: {
      uz: "Oxotnichiy pishloq",
      ru: "Сыр Oxotnichiy",
      en: "Oxotnichiy Cheese"
    },
    subtitle: {
      uz: "50% yog‘li pishloq",
      ru: "Сыр 50% жирности",
      en: "Cheese 50% fat"
    },
    weight: {
      uz: "Sutning yog‘lik darajasi: 50%",
      ru: "Жирность: 50%",
      en: "Fat content: 50%"
    },
    image: "/images/products/oxotnichiy-cheese.jpg",
    gallery: ["/images/products/oxotnichiy-cheese.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    storageValue: {
      uz: "Qadoqda ko‘rsatilgan",
      ru: "Указан на упаковке",
      en: "Indicated on package"
    },
    packagingValue: {
      uz: "Mahsulot kartasiga qo‘shiladi",
      ru: "Будет добавлено в карточку",
      en: "Will be added to the card"
    },
    formatValue: {
      uz: "Qattiq pishloq",
      ru: "Твердый сыр",
      en: "Hard cheese"
    },
    nutrition: {
      energy: "1563 K / 377 Kkal",
      fat: "31 g",
      protein: "24 g",
      carbs: "0 g",
      extra: [
        {
          label: {
            uz: "To‘yingan yog‘",
            ru: "Насыщенные жиры",
            en: "Saturated fat"
          },
          value: "21 g"
        },
        {
          label: {
            uz: "Shakar",
            ru: "Сахара",
            en: "Sugars"
          },
          value: "0 g"
        },
        {
          label: {
            uz: "Tuz",
            ru: "Соль",
            en: "Salt"
          },
          value: "1,8 g"
        },
        {
          label: {
            uz: "Kalsiy",
            ru: "Кальций",
            en: "Calcium"
          },
          value: "910 mg"
        }
      ]
    },
    compositionTitle: {
      uz: "Tarkibi",
      ru: "Состав",
      en: "Composition"
    },
    composition: {
      uz: "Pasterizatsiyalangan sut, osh tuzi, kalsiy xlorid, tabiiy rang beruvchi, shirdon, ko‘kat achitqi.",
      ru: "Пастеризованное молоко, поваренная соль, хлорид кальция, натуральный краситель, сычужный фермент, закваска.",
      en: "Pasteurized milk, salt, calcium chloride, natural coloring, rennet and starter culture."
    },
    storageText: {
      uz: "Saqlash sharoiti qadoqda ko‘rsatilgan.",
      ru: "Условия хранения указаны на упаковке.",
      en: "Storage conditions are indicated on the package."
    },
    productionDateText: {
      uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.",
      ru: "Дата производства и срок годности указаны на упаковке.",
      en: "Production date and expiry date are indicated on the package."
    },
    manufacturer,
    address,
    openedText: {
      uz: "Sutning yog‘lik darajasi: 50%.",
      ru: "Жирность молока: 50%.",
      en: "Milk fat content: 50%."
    }
  },
  {
    slug: "qiziltepa-cheese-1",
    badge: "32",
    category: "cheese",
    title: {
      uz: "Qiziltepa pishloq",
      ru: "Сыр QIZILTEPA",
      en: "QIZILTEPA Cheese"
    },
    subtitle: {
      uz: "50% yog‘li pishloq",
      ru: "Сыр 50% жирности",
      en: "Cheese 50% fat"
    },
    weight: {
      uz: "Yog‘lik darajasi: 50%",
      ru: "Жирность: 50%",
      en: "Fat content: 50%"
    },
    image: "/images/products/qiziltepa-cheese-1.jpg",
    gallery: ["/images/products/qiziltepa-cheese-1.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    storageValue: {uz: "Qadoqda ko‘rsatilgan", ru: "Указан на упаковке", en: "Indicated on package"},
    packagingValue: {uz: "Mahsulot kartasiga qo‘shiladi", ru: "Будет добавлено в карточку", en: "Will be added to the card"},
    formatValue: {uz: "Pishloq", ru: "Сыр", en: "Cheese"},
    nutrition: {energy: "—", fat: "50%", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Qiziltepa pishlog‘i, 50% yog‘lik darajasi bilan.", ru: "Сыр QIZILTEPA с жирностью 50%.", en: "QIZILTEPA cheese with 50% fat content."},
    storageText: {uz: "Saqlash sharoiti qadoqda ko‘rsatilgan.", ru: "Условия хранения указаны на упаковке.", en: "Storage conditions are indicated on the package."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Mahsulot tafsilotlari keyinroq to‘ldiriladi.", ru: "Подробности по продукту будут добавлены позже.", en: "Detailed product information will be added later."}
  },
  {
    slug: "qiziltepa-cheese-2",
    badge: "33",
    category: "cheese",
    title: {
      uz: "Qiziltepa pishloq",
      ru: "Сыр QIZILTEPA",
      en: "QIZILTEPA Cheese"
    },
    subtitle: {
      uz: "50% yog‘li pishloq",
      ru: "Сыр 50% жирности",
      en: "Cheese 50% fat"
    },
    weight: {
      uz: "Yog‘lik darajasi: 50%",
      ru: "Жирность: 50%",
      en: "Fat content: 50%"
    },
    image: "/images/products/qiziltepa-cheese-2.jpg",
    gallery: ["/images/products/qiziltepa-cheese-2.jpg"],
    accent: "from-[#edf4fa] to-[#e1ebf6]",
    storageValue: {uz: "Qadoqda ko‘rsatilgan", ru: "Указан на упаковке", en: "Indicated on package"},
    packagingValue: {uz: "Mahsulot kartasiga qo‘shiladi", ru: "Будет добавлено в карточку", en: "Will be added to the card"},
    formatValue: {uz: "Pishloq", ru: "Сыр", en: "Cheese"},
    nutrition: {energy: "—", fat: "50%", protein: "—", carbs: "—"},
    compositionTitle: {uz: "Tarkibi", ru: "Состав", en: "Composition"},
    composition: {uz: "Qiziltepa pishlog‘i, 50% yog‘lik darajasi bilan.", ru: "Сыр QIZILTEPA с жирностью 50%.", en: "QIZILTEPA cheese with 50% fat content."},
    storageText: {uz: "Saqlash sharoiti qadoqda ko‘rsatilgan.", ru: "Условия хранения указаны на упаковке.", en: "Storage conditions are indicated on the package."},
    productionDateText: {uz: "Ishlab chiqarilgan sana va yaroqlilik muddati qadoqda ko‘rsatilgan.", ru: "Дата производства и срок годности указаны на упаковке.", en: "Production date and expiry date are indicated on the package."},
    manufacturer,
    address,
    openedText: {uz: "Mahsulot tafsilotlari keyinroq to‘ldiriladi.", ru: "Подробности по продукту будут добавлены позже.", en: "Detailed product information will be added later."}
  }
];

const availableProductImages = new Set([
  "/images/products/ayran-basil-1000.jpg",
  "/images/products/ayran-basil-450.jpg",
  "/images/products/kefir-1-450.jpg",
  "/images/products/kefir-1-900.jp.JPG",
  "/images/products/kefir-25-450.jpg",
  "/images/products/kefir-25-900.jpg",
  "/images/products/kefir-32-450.jpg",
  "/images/products/kefir-32-900.jpg",
  "/images/products/yogurt-cherry-120.jpg",
  "/images/products/yogurt-cherry-270.jpg",
  "/images/products/yogurt-peach-120.jpg",
  "/images/products/yogurt-peach-270.jpg",
  "/images/products/yogurt-pineapple-120.jpg",
  "/images/products/yogurt-pineapple-270.jpg",
  "/images/products/yogurt-raspberry-120.jpg",
  "/images/products/yogurt-raspberry-270.jpg",
  "/images/products/yogurt-strawberry-120.jpg",
  "/images/products/yogurt-strawberry-270.jpg"
]);

const productImageAliases: Record<string, string> = {
  "/images/products/kefir-1-900.jpg": "/images/products/kefir-1-900.jp.JPG",
  "/images/products/kefir-25-900-2.jpg": "/images/products/kefir-25-900.jpg",
  "/images/products/yogurt-forest-270.jpg": "/images/products/yogurt-raspberry-270.jpg",
  "/images/products/yogurt-forest-120.jpg": "/images/products/yogurt-raspberry-120.jpg",
  "/images/products/yogurt-banana-270.jpg": "/images/products/yogurt-pineapple-270.jpg",
  "/images/products/yogurt-banana-120.jpg": "/images/products/yogurt-pineapple-120.jpg",
  "/images/products/ayran-basil-900.jpg": "/images/products/ayran-basil-1000.jpg",
  "/images/products/ayran-1-1000.jpg": "/images/products/ayran-basil-1000.jpg"
};

const fallbackProductImages = [
  "/images/products/yogurt-strawberry-270.jpg",
  "/images/products/yogurt-raspberry-270.jpg",
  "/images/products/yogurt-pineapple-270.jpg",
  "/images/products/yogurt-cherry-270.jpg",
  "/images/products/yogurt-peach-270.jpg",
  "/images/products/kefir-25-900.jpg",
  "/images/products/kefir-32-900.jpg",
  "/images/products/ayran-basil-1000.jpg"
];

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function getProductImage(product: ProductItem, index = 0) {
  const source = product.gallery[index] ?? product.image;
  const aliased = productImageAliases[source] ?? source;

  if (availableProductImages.has(aliased)) return aliased;

  if (product.category === "yogurt") {
    return product.netWeight === "120 g"
      ? "/images/products/yogurt-strawberry-120.jpg"
      : "/images/products/yogurt-strawberry-270.jpg";
  }

  if (product.category === "kefir") return "/images/products/kefir-25-900.jpg";
  if (product.category === "ayran") return "/images/products/ayran-basil-1000.jpg";

  return fallbackProductImages[hashText(product.slug) % fallbackProductImages.length];
}

export function getProductGallery(product: ProductItem) {
  const resolved = product.gallery.map((_, index) => getProductImage(product, index));
  const gallery = Array.from(new Set(resolved));

  return gallery.length ? gallery : [getProductImage(product)];
}
