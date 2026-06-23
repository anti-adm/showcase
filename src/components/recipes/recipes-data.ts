export type SupportedLocale = "uz" | "ru" | "en";

export type RecipeItem = {
  slug: string;
  image: string;
  badge: string;
  title: Record<SupportedLocale, string>;
  subtitle: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  servings: Record<SupportedLocale, string>;
  totalWeight: Record<SupportedLocale, string>;
  prepTime: Record<SupportedLocale, string>;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  ingredients: Record<SupportedLocale, Array<{name: string; amount: string}>>;
  steps: Record<SupportedLocale, string[]>;
};

export const recipes: RecipeItem[] = [
  {
    slug: "syrniki",
    image: "/images/recipes/syrniki.webp",
    badge: "01",
    title: {
      uz: "Syrniki",
      ru: "Сырники",
      en: "Syrniki"
    },
    subtitle: {
      uz: "Tvorogli nonushta",
      ru: "Творожный завтрак",
      en: "Cottage cheese breakfast"
    },
    description: {
      uz: "Yumshoq ichki tuzilma va oltin rang qobiq bilan tayyorlanadigan klassik tvorogli syrniki.",
      ru: "Классические сырники с мягкой серединой и золотистой корочкой.",
      en: "Classic cottage cheese pancakes with a soft center and a golden crust."
    },
    servings: {
      uz: "2–3 porsiya",
      ru: "2–3 порции",
      en: "2–3 servings"
    },
    totalWeight: {
      uz: "Taxm. 420 g",
      ru: "Прим. 420 g",
      en: "Approx. 420 g"
    },
    prepTime: {
      uz: "25 daqiqa",
      ru: "25 минут",
      en: "25 min"
    },
    calories: "214",
    protein: "12 g",
    fat: "9 g",
    carbs: "21 g",
    ingredients: {
      uz: [
        {name: "Tvorog", amount: "300 g"},
        {name: "Tuxum", amount: "1 dona"},
        {name: "Shakar", amount: "25 g"},
        {name: "Un", amount: "50 g"},
        {name: "Vanilin", amount: "1 chimdim"},
        {name: "Qovurish uchun yog‘", amount: "20 g"}
      ],
      ru: [
        {name: "Творог", amount: "300 g"},
        {name: "Яйцо", amount: "1 шт"},
        {name: "Сахар", amount: "25 g"},
        {name: "Мука", amount: "50 g"},
        {name: "Ванилин", amount: "1 щепотка"},
        {name: "Масло для жарки", amount: "20 g"}
      ],
      en: [
        {name: "Cottage cheese", amount: "300 g"},
        {name: "Egg", amount: "1"},
        {name: "Sugar", amount: "25 g"},
        {name: "Flour", amount: "50 g"},
        {name: "Vanilla", amount: "1 pinch"},
        {name: "Oil for frying", amount: "20 g"}
      ]
    },
    steps: {
      uz: [
        "Tvorogni tuxum va shakar bilan bir xil massa bo‘lguncha aralashtiring.",
        "Un va vanilin qo‘shib, yumshoq xamir hosil qiling.",
        "Massadan kichik dumaloq shakllar yasab, biroz un seping.",
        "Tovada ikki tomoni oltin rang bo‘lguncha qovuring.",
        "Issiq holda smetana, asal yoki rezavor bilan torting."
      ],
      ru: [
        "Смешайте творог с яйцом и сахаром до однородной массы.",
        "Добавьте муку и ванилин, замесите мягкое тесто.",
        "Сформируйте небольшие круглые сырники и слегка обваляйте в муке.",
        "Обжарьте на сковороде до золотистой корочки с двух сторон.",
        "Подавайте горячими со сметаной, медом или ягодами."
      ],
      en: [
        "Mix cottage cheese with egg and sugar until smooth.",
        "Add flour and vanilla, then form a soft dough.",
        "Shape small round pancakes and lightly dust with flour.",
        "Pan-fry on both sides until golden.",
        "Serve warm with sour cream, honey or berries."
      ]
    }
  },
  {
    slug: "oladya",
    image: "/images/recipes/oladya.webp",
    badge: "02",
    title: {
      uz: "Sutli o‘ladya",
      ru: "Оладьи на молоке",
      en: "Milk Fritters"
    },
    subtitle: {
      uz: "Yumshoq va baland o‘ladya",
      ru: "Пышные оладьи",
      en: "Soft fluffy fritters"
    },
    description: {
      uz: "Nonushta uchun mos, yumshoq va mayin sutli o‘ladya.",
      ru: "Нежные и пышные оладьи для завтрака.",
      en: "Tender and fluffy milk fritters, perfect for breakfast."
    },
    servings: {
      uz: "3 porsiya",
      ru: "3 порции",
      en: "3 servings"
    },
    totalWeight: {
      uz: "Taxm. 500 g",
      ru: "Прим. 500 g",
      en: "Approx. 500 g"
    },
    prepTime: {
      uz: "30 daqiqa",
      ru: "30 минут",
      en: "30 min"
    },
    calories: "272",
    protein: "7 g",
    fat: "11 g",
    carbs: "36 g",
    ingredients: {
      uz: [
        {name: "Sut", amount: "300 ml"},
        {name: "Un", amount: "250 g"},
        {name: "Tuxum", amount: "2 dona"},
        {name: "Shakar", amount: "30 g"},
        {name: "Soda", amount: "5 g"},
        {name: "Sirka", amount: "5 g"},
        {name: "Tuz", amount: "5 g"},
        {name: "Yog‘", amount: "30 g"}
      ],
      ru: [
        {name: "Молоко", amount: "300 ml"},
        {name: "Мука", amount: "250 g"},
        {name: "Яйца", amount: "2 шт"},
        {name: "Сахар", amount: "30 g"},
        {name: "Сода", amount: "5 g"},
        {name: "Уксус", amount: "5 g"},
        {name: "Соль", amount: "5 g"},
        {name: "Масло", amount: "30 g"}
      ],
      en: [
        {name: "Milk", amount: "300 ml"},
        {name: "Flour", amount: "250 g"},
        {name: "Eggs", amount: "2"},
        {name: "Sugar", amount: "30 g"},
        {name: "Baking soda", amount: "5 g"},
        {name: "Vinegar", amount: "5 g"},
        {name: "Salt", amount: "5 g"},
        {name: "Oil", amount: "30 g"}
      ]
    },
    steps: {
      uz: [
        "Tuxum va shakarni chuqur idishda ko‘pirtiring.",
        "Sutni quying va yaxshilab aralashtiring.",
        "Unni asta-sekin qo‘shing, dona qolmasin.",
        "Soda, sirka va tuzni qo‘shib, xamirni aralashtiring.",
        "Qizigan tovaga yog‘ solib, o‘ladyalarni ikki tomondan pishiring."
      ],
      ru: [
        "Взбейте яйца с сахаром до легкой массы.",
        "Добавьте молоко и хорошо перемешайте.",
        "Постепенно введите муку без комочков.",
        "Добавьте соду, уксус и соль, снова перемешайте.",
        "Жарьте на разогретой сковороде с небольшим количеством масла."
      ],
      en: [
        "Whisk eggs and sugar until light.",
        "Pour in the milk and mix well.",
        "Gradually add flour until smooth.",
        "Add soda, vinegar and salt, then stir again.",
        "Cook on a hot pan with a little oil until golden on both sides."
      ]
    }
  },
  {
    slug: "bliny",
    image: "/images/recipes/bliny.webp",
    badge: "03",
    title: {
      uz: "Yupqa blinlar",
      ru: "Тонкие блины",
      en: "Thin Pancakes"
    },
    subtitle: {
      uz: "Klassik sutli blinlar",
      ru: "Классические блины на молоке",
      en: "Classic milk pancakes"
    },
    description: {
      uz: "Nozik tuzilishga ega, shirin yoki sho‘r qo‘shimchalar bilan mos keladigan universal blinlar.",
      ru: "Тонкие универсальные блины для сладкой и соленой подачи.",
      en: "Versatile thin pancakes for both sweet and savory serving."
    },
    servings: {
      uz: "4 porsiya",
      ru: "4 порции",
      en: "4 servings"
    },
    totalWeight: {
      uz: "Taxm. 620 g",
      ru: "Прим. 620 g",
      en: "Approx. 620 g"
    },
    prepTime: {
      uz: "35 daqiqa",
      ru: "35 минут",
      en: "35 min"
    },
    calories: "198",
    protein: "6 g",
    fat: "7 g",
    carbs: "27 g",
    ingredients: {
      uz: [
        {name: "Sut", amount: "500 ml"},
        {name: "Un", amount: "220 g"},
        {name: "Tuxum", amount: "2 dona"},
        {name: "Shakar", amount: "20 g"},
        {name: "Tuz", amount: "3 g"},
        {name: "O‘simlik yog‘i", amount: "25 ml"}
      ],
      ru: [
        {name: "Молоко", amount: "500 ml"},
        {name: "Мука", amount: "220 g"},
        {name: "Яйца", amount: "2 шт"},
        {name: "Сахар", amount: "20 g"},
        {name: "Соль", amount: "3 g"},
        {name: "Растительное масло", amount: "25 ml"}
      ],
      en: [
        {name: "Milk", amount: "500 ml"},
        {name: "Flour", amount: "220 g"},
        {name: "Eggs", amount: "2"},
        {name: "Sugar", amount: "20 g"},
        {name: "Salt", amount: "3 g"},
        {name: "Vegetable oil", amount: "25 ml"}
      ]
    },
    steps: {
      uz: [
        "Tuxum, shakar va tuzni aralashtiring.",
        "Sutning yarmini qo‘shib, unni sekin kiriting.",
        "Qolgan sut va yog‘ni qo‘shib, suyuq xamir tayyorlang.",
        "Xamirni 10 daqiqa tindiring.",
        "Issiq tovaga yupqa qatlam qilib quying va ikki tomoni pishguncha tayyorlang."
      ],
      ru: [
        "Смешайте яйца, сахар и соль.",
        "Добавьте половину молока и постепенно введите муку.",
        "Влейте оставшееся молоко и масло, сделайте жидкое тесто.",
        "Дайте тесту постоять 10 минут.",
        "Жарьте на горячей сковороде тонкими слоями с двух сторон."
      ],
      en: [
        "Combine eggs, sugar and salt.",
        "Add half of the milk and gradually whisk in the flour.",
        "Pour in the remaining milk and oil to make a thin batter.",
        "Let the batter rest for 10 minutes.",
        "Cook thin pancakes on a hot pan on both sides."
      ]
    }
  },
  {
    slug: "cheesecake-cups",
    image: "/images/recipes/cheesecake-cups.webp",
    badge: "04",
    title: {
      uz: "Tvorogli mini desert",
      ru: "Мини-чизкейк с творогом",
      en: "Mini Cottage Cheesecake"
    },
    subtitle: {
      uz: "Yengil desert",
      ru: "Легкий десерт",
      en: "Light dessert"
    },
    description: {
      uz: "Tvorog, yogurt va rezavor bilan tayyorlanadigan mayin mini desert.",
      ru: "Нежный мини-десерт из творога, йогурта и ягод.",
      en: "A delicate mini dessert made with cottage cheese, yogurt and berries."
    },
    servings: {
      uz: "3–4 porsiya",
      ru: "3–4 порции",
      en: "3–4 servings"
    },
    totalWeight: {
      uz: "Taxm. 380 g",
      ru: "Прим. 380 g",
      en: "Approx. 380 g"
    },
    prepTime: {
      uz: "20 daqiqa + sovitish",
      ru: "20 минут + охлаждение",
      en: "20 min + chill time"
    },
    calories: "186",
    protein: "10 g",
    fat: "8 g",
    carbs: "18 g",
    ingredients: {
      uz: [
        {name: "Tvorog", amount: "200 g"},
        {name: "Tabiiy yogurt", amount: "120 g"},
        {name: "Shakar kukuni", amount: "35 g"},
        {name: "Pechenye maydasi", amount: "60 g"},
        {name: "Sariyog‘", amount: "25 g"},
        {name: "Rezavor", amount: "80 g"}
      ],
      ru: [
        {name: "Творог", amount: "200 g"},
        {name: "Натуральный йогурт", amount: "120 g"},
        {name: "Сахарная пудра", amount: "35 g"},
        {name: "Крошка печенья", amount: "60 g"},
        {name: "Сливочное масло", amount: "25 g"},
        {name: "Ягоды", amount: "80 g"}
      ],
      en: [
        {name: "Cottage cheese", amount: "200 g"},
        {name: "Natural yogurt", amount: "120 g"},
        {name: "Powdered sugar", amount: "35 g"},
        {name: "Cookie crumbs", amount: "60 g"},
        {name: "Butter", amount: "25 g"},
        {name: "Berries", amount: "80 g"}
      ]
    },
    steps: {
      uz: [
        "Pechenye maydasini eritilgan sariyog‘ bilan aralashtiring.",
        "Aralashmani stakan yoki qolip tagiga joylang.",
        "Tvorog, yogurt va shakar kukunini blenderda mayin krem holiga keltiring.",
        "Kremni asos ustiga soling va ustidan rezavor qo‘shing.",
        "Kamida 1 soat sovitib, keyin torting."
      ],
      ru: [
        "Смешайте крошку печенья с растопленным маслом.",
        "Распределите основу по стаканам или формочкам.",
        "Взбейте творог, йогурт и сахарную пудру до кремовой массы.",
        "Выложите крем на основу и добавьте ягоды.",
        "Охладите минимум 1 час и подавайте."
      ],
      en: [
        "Mix cookie crumbs with melted butter.",
        "Press the mixture into glasses or molds.",
        "Blend cottage cheese, yogurt and powdered sugar until creamy.",
        "Spoon the cream over the base and top with berries.",
        "Chill for at least 1 hour before serving."
      ]
    }
  },
  {
    slug: "fruit-milkshake",
    image: "/images/recipes/fruit-milkshake.webp",
    badge: "05",
    title: {
      uz: "Mevali milkshake",
      ru: "Фруктовый милкшейк",
      en: "Fruit Milkshake"
    },
    subtitle: {
      uz: "Sovuq sutli ichimlik",
      ru: "Холодный молочный напиток",
      en: "Cold dairy drink"
    },
    description: {
      uz: "Sut, yogurt va yangi mevalar asosidagi tez va yengil ichimlik.",
      ru: "Быстрый освежающий напиток на основе молока, йогурта и фруктов.",
      en: "A quick refreshing drink made with milk, yogurt and fresh fruit."
    },
    servings: {
      uz: "2 porsiya",
      ru: "2 порции",
      en: "2 servings"
    },
    totalWeight: {
      uz: "Taxm. 500 ml",
      ru: "Прим. 500 ml",
      en: "Approx. 500 ml"
    },
    prepTime: {
      uz: "10 daqiqa",
      ru: "10 минут",
      en: "10 min"
    },
    calories: "154",
    protein: "5 g",
    fat: "4 g",
    carbs: "24 g",
    ingredients: {
      uz: [
        {name: "Sut", amount: "250 ml"},
        {name: "Tabiiy yogurt", amount: "150 g"},
        {name: "Banan", amount: "1 dona"},
        {name: "Qulupnay", amount: "120 g"},
        {name: "Asal", amount: "15 g"},
        {name: "Muz", amount: "ixtiyoriy"}
      ],
      ru: [
        {name: "Молоко", amount: "250 ml"},
        {name: "Натуральный йогурт", amount: "150 g"},
        {name: "Банан", amount: "1 шт"},
        {name: "Клубника", amount: "120 g"},
        {name: "Мед", amount: "15 g"},
        {name: "Лед", amount: "по желанию"}
      ],
      en: [
        {name: "Milk", amount: "250 ml"},
        {name: "Natural yogurt", amount: "150 g"},
        {name: "Banana", amount: "1"},
        {name: "Strawberries", amount: "120 g"},
        {name: "Honey", amount: "15 g"},
        {name: "Ice", amount: "optional"}
      ]
    },
    steps: {
      uz: [
        "Barcha masalliqlarni blenderga soling.",
        "Silliq va bir xil massa bo‘lguncha maydalang.",
        "Zichligi kerak bo‘lsa, biroz ko‘proq sut qo‘shing.",
        "Stakanga quying va darhol torting.",
        "Ustini rezavor yoki yalpiz bilan bezash mumkin."
      ],
      ru: [
        "Сложите все ингредиенты в блендер.",
        "Измельчите до однородной консистенции.",
        "При необходимости добавьте еще немного молока.",
        "Разлейте по стаканам и подавайте сразу.",
        "Можно украсить ягодами или мятой."
      ],
      en: [
        "Place all ingredients into a blender.",
        "Blend until smooth and creamy.",
        "Add a little more milk if needed.",
        "Pour into glasses and serve immediately.",
        "Garnish with berries or mint if desired."
      ]
    }
  }
];