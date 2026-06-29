"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type RefObject
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {getProductImage, type ProductItem} from "@/components/products/products-data";
import {getProductDisplayTitle} from "@/components/products/product-title";
import type {RecipeItem} from "@/components/recipes/recipes-data";
import {assetUrl} from "@/lib/assets";

// ---------------------------------------------------------------------------
// Types & copy
// ---------------------------------------------------------------------------

type Locale = "uz" | "ru" | "en";

type HomeScrollShowcaseProps = {
  locale: Locale;
  products: ProductItem[];
  recipes: RecipeItem[];
};

const HOME_SCROLL_COPY: Record<
  Locale,
  {
    productsEyebrow: string;
    productsTitle: string;
    recipesEyebrow: string;
    recipesTitle: string;
    openCard: string;
  }
> = {
  ru: {
    productsEyebrow: "",
    productsTitle: "Продукты для спокойного ежедневного выбора",
    recipesEyebrow: "",
    recipesTitle: "Идеи для завтрака, десертов и мягких семейных пауз",
    openCard: "Подробнее"
  },
  uz: {
    productsEyebrow: "",
    productsTitle: "Har kungi sokin tanlov uchun mahsulotlar",
    recipesEyebrow: "",
    recipesTitle: "Nonushta, desert va oilaviy lahzalar uchun g'oyalar",
    openCard: "Batafsil"
  },
  en: {
    productsEyebrow: "",
    productsTitle: "Products for calm everyday choice",
    recipesEyebrow: "",
    recipesTitle: "Ideas for breakfast, desserts and soft family pauses",
    openCard: "Learn more"
  }
};

type HomeScrollCopy = (typeof HOME_SCROLL_COPY)[Locale];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DESKTOP_MIN_WIDTH = 900;
const WHEEL_THRESHOLD = 14;
const SCENE_LOCK_MS = 760;

const DESKTOP_CARD_WIDTH_PX = 420;
const MOBILE_CARD_WIDTH_PX = 360;
const CARD_GAP_PX = 28;

const CARD_WIDTH_CLASS =
  "w-[min(84vw,360px)] sm:w-[min(46vw,430px)] md:w-[420px]";

const ACTIVE_SPRING = {stiffness: 90, damping: 26, mass: 0.65};
const SCENE_SPRING = {stiffness: 85, damping: 26, mass: 0.8};

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

export function HomeScrollShowcase({
  locale,
  products,
  recipes
}: HomeScrollShowcaseProps) {
  const copy = HOME_SCROLL_COPY[locale];

  return (
    <main className="relative z-20 bg-[#d3dfeb]">
      <div className="sticky top-0 z-0 h-svh overflow-hidden">
        <SceneBackdrop />
      </div>
      <div className="relative z-10 -mt-[100svh]">
        <PinnedProductScenes copy={copy} locale={locale} products={products} />
        <PinnedRecipeScenes copy={copy} locale={locale} recipes={recipes} />
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// PinnedProductScenes
// ---------------------------------------------------------------------------

function PinnedProductScenes({
  copy,
  locale,
  products
}: {
  copy: HomeScrollCopy;
  locale: Locale;
  products: ProductItem[];
}) {
  const isDesktop = useIsDesktop();

  if (products.length <= 0) return null;

  return isDesktop ? (
    <DesktopProductScenes copy={copy} locale={locale} products={products} />
  ) : (
    <MobileProductShowcase copy={copy} locale={locale} products={products} />
  );
}

function DesktopProductScenes({
  copy,
  locale,
  products
}: {
  copy: HomeScrollCopy;
  locale: Locale;
  products: ProductItem[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const count = products.length;

  const {
    activeIndex,
    activeMotion,
    sceneProgress,
    isSceneActive,
    xMotion,
    goToIndex
  } = useWheelSceneController({sectionRef, count});

  const EXTRA = 2;
  const totalSlots = count + EXTRA * 2;
  const stripX = useGhostStripX(xMotion, EXTRA);

  const swipeHandlers = useMobileCardSwipe({
    activeIndex,
    count,
    onIndex: goToIndex
  });

  if (count <= 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{height: `${Math.max(count, 1) * 100}svh`}}
    >
      <div className="sticky top-0 z-10 flex h-svh touch-pan-y select-none flex-col items-center overflow-hidden px-4 pb-8 pt-[104px] sm:px-8 sm:pb-10 sm:pt-[112px] lg:px-10 lg:pt-[116px]">
        <ShowcaseHeading
          eyebrow={copy.productsEyebrow}
          title={copy.productsTitle}
          sceneProgress={sceneProgress}
        />

        <div
          className="relative z-10 mt-8 w-screen touch-pan-y overflow-visible lg:mt-10"
          {...swipeHandlers}
        >
          <motion.div
            className="flex will-change-transform"
            style={{
              x: stripX,
              gap: `${CARD_GAP_PX}px`
            }}
          >
            {Array.from({length: totalSlots}).map((_, slot) => {
              const realIndex = mod(slot - EXTRA, count);
              const product = products[realIndex];

              return (
                <ProductSceneCard
                  key={`${slot}-${product.slug}`}
                  product={product}
                  realIndex={realIndex}
                  slotIndex={slot - EXTRA}
                  locale={locale}
                  activeIndex={activeIndex}
                  isSceneActive={isSceneActive}
                  activeMotion={activeMotion}
                  sceneProgress={sceneProgress}
                  openLabel={copy.openCard}
                  onFocusCard={goToIndex}
                />
              );
            })}
          </motion.div>
        </div>

        <ScenePagination
          count={count}
          activeIndex={activeIndex}
          isSceneActive={isSceneActive}
          sceneProgress={sceneProgress}
          onDotClick={goToIndex}
          tone="blue"
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PinnedRecipeScenes
// ---------------------------------------------------------------------------

function PinnedRecipeScenes({
  copy,
  locale,
  recipes
}: {
  copy: HomeScrollCopy;
  locale: Locale;
  recipes: RecipeItem[];
}) {
  const isDesktop = useIsDesktop();

  if (recipes.length <= 0) return null;

  return isDesktop ? (
    <DesktopRecipeScenes copy={copy} locale={locale} recipes={recipes} />
  ) : (
    <MobileRecipeShowcase copy={copy} locale={locale} recipes={recipes} />
  );
}

function DesktopRecipeScenes({
  copy,
  locale,
  recipes
}: {
  copy: HomeScrollCopy;
  locale: Locale;
  recipes: RecipeItem[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const count = recipes.length;

  const {
    activeIndex,
    activeMotion,
    sceneProgress,
    isSceneActive,
    xMotion,
    goToIndex
  } = useWheelSceneController({sectionRef, count});

  const EXTRA = 2;
  const totalSlots = count + EXTRA * 2;
  const stripX = useGhostStripX(xMotion, EXTRA);

  const swipeHandlers = useMobileCardSwipe({
    activeIndex,
    count,
    onIndex: goToIndex
  });

  if (count <= 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{height: `${Math.max(count, 1) * 100}svh`}}
    >
      <div className="sticky top-0 z-10 flex h-svh touch-pan-y select-none flex-col items-center overflow-hidden px-4 pb-8 pt-[104px] sm:px-8 sm:pb-10 sm:pt-[112px] lg:px-10 lg:pt-[116px]">
        <ShowcaseHeading
          eyebrow={copy.recipesEyebrow}
          title={copy.recipesTitle}
          sceneProgress={sceneProgress}
        />

        <div
          className="relative z-10 mt-8 w-screen touch-pan-y overflow-visible lg:mt-10"
          {...swipeHandlers}
        >
          <motion.div
            className="flex will-change-transform"
            style={{
              x: stripX,
              gap: `${CARD_GAP_PX}px`
            }}
          >
            {Array.from({length: totalSlots}).map((_, slot) => {
              const realIndex = mod(slot - EXTRA, count);
              const recipe = recipes[realIndex];

              return (
                <RecipeSceneCard
                  key={`${slot}-${recipe.slug}`}
                  recipe={recipe}
                  realIndex={realIndex}
                  slotIndex={slot - EXTRA}
                  locale={locale}
                  activeIndex={activeIndex}
                  isSceneActive={isSceneActive}
                  activeMotion={activeMotion}
                  sceneProgress={sceneProgress}
                  openLabel={copy.openCard}
                  onFocusCard={goToIndex}
                />
              );
            })}
          </motion.div>
        </div>

        <ScenePagination
          count={count}
          activeIndex={activeIndex}
          isSceneActive={isSceneActive}
          sceneProgress={sceneProgress}
          onDotClick={goToIndex}
          tone="warm"
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MobileShowcases
// ---------------------------------------------------------------------------

function MobileProductShowcase({
  copy,
  locale,
  products
}: {
  copy: HomeScrollCopy;
  locale: Locale;
  products: ProductItem[];
}) {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6">
      <MobileShowcaseHeading eyebrow={copy.productsEyebrow} title={copy.productsTitle} />

      <div className="relative z-10 -mx-4 mt-7 snap-x snap-mandatory overflow-x-auto px-4 pb-4 product-filter-scroll">
        <div className="flex w-max gap-4">
          {products.map((product) => {
            const title = getProductDisplayTitle(product.title[locale]);

            return (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group relative flex h-[430px] w-[82vw] max-w-[330px] shrink-0 snap-center flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_20px_54px_rgba(15,42,76,0.16)]"
              >
                <div className="relative flex flex-1 items-center justify-center bg-[#f6f8fb]">
                  <Image
                    src={getProductImage(product)}
                    alt={title}
                    fill
                    sizes="82vw"
                    className="scale-[1.08] object-contain p-7 transition-transform duration-700 group-hover:scale-[1.13]"
                  />
                </div>

                <div className="relative min-h-[168px] border-t border-slate-100 p-5">
                  <h3 className="line-clamp-2 text-[1.35rem] font-semibold leading-[1.02] text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {product.subtitle[locale]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileRecipeShowcase({
  copy,
  locale,
  recipes
}: {
  copy: HomeScrollCopy;
  locale: Locale;
  recipes: RecipeItem[];
}) {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6">
      <MobileShowcaseHeading eyebrow={copy.recipesEyebrow} title={copy.recipesTitle} />

      <div className="relative z-10 -mx-4 mt-7 snap-x snap-mandatory overflow-x-auto px-4 pb-4 product-filter-scroll">
        <div className="flex w-max gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="group relative h-[430px] w-[82vw] max-w-[330px] shrink-0 snap-center overflow-hidden rounded-[22px] bg-slate-950 shadow-[0_20px_54px_rgba(38,30,24,0.18)]"
            >
              <Image
                src={recipe.image}
                alt={recipe.title[locale]}
                fill
                sizes="82vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,4,0.04),rgba(12,8,4,0.25)_52%,rgba(12,8,4,0.82))]" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/62">
                  {recipe.prepTime[locale]}
                </p>
                <h3 className="mt-2 line-clamp-2 text-[1.45rem] font-black uppercase leading-[0.96]">
                  {recipe.title[locale]}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/80">
                  {recipe.subtitle[locale]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileShowcaseHeading({eyebrow, title}: {eyebrow: string; title: string}) {
  return (
    <div className="relative z-10 mx-auto max-w-[620px] text-center">
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-500/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mx-auto mt-2 text-balance text-[clamp(2rem,10vw,3.4rem)] font-semibold leading-[0.98] text-[var(--brand-primary)]">
        {title}
      </h2>
    </div>
  );
}

function SceneBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#cfdce8]">
      <Image
        src={assetUrl("/images/hero/hero-products.webp")}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="object-cover opacity-95 saturate-[1.08] contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_78%_16%,rgba(91,141,207,0.14),transparent_36%),linear-gradient(180deg,rgba(226,236,247,0.2),rgba(211,224,238,0.1)_42%,rgba(195,211,229,0.2))]" />
      <div className="absolute inset-x-0 bottom-0 h-[32vh] bg-[linear-gradient(180deg,transparent,rgba(210,222,235,0.2)_54%,rgba(207,220,232,0.38))]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook: useGhostStripX
// ---------------------------------------------------------------------------

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop ?? false;
}

function useGhostStripX(
  base: MotionValue<number>,
  extraSlots: number
): MotionValue<number> {
  const out = useMotionValue(-extraSlots * (DESKTOP_CARD_WIDTH_PX + CARD_GAP_PX));

  useEffect(() => {
    const sync = (value = base.get()) => {
      out.set(value - extraSlots * getCardStepPx());
    };

    const handleResize = () => sync();
    const unsubscribe = base.on("change", sync);

    window.addEventListener("resize", handleResize, {passive: true});
    sync();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [base, extraSlots, out]);

  return out;
}

// ---------------------------------------------------------------------------
// useWheelSceneController
// ---------------------------------------------------------------------------

function useWheelSceneController({
  sectionRef,
  count
}: {
  sectionRef: RefObject<HTMLElement | null>;
  count: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSceneActive, setIsSceneActiveState] = useState(false);

  const activeIndexRef = useRef(0);
  const isSceneActiveRef = useRef(false);
  const lockRef = useRef(false);
  const hasEnteredSceneRef = useRef(false);
  const isReleasingRef = useRef(false);

  const rawActive = useMotionValue(0);
  const activeMotion = useSpring(rawActive, ACTIVE_SPRING);

  const rawSceneProgress = useMotionValue(0);
  const sceneProgress = useSpring(rawSceneProgress, SCENE_SPRING);

  const xMotion = useMotionValue(0);

  useEffect(() => {
    xMotion.set(computeX(activeMotion.get()));

    return activeMotion.on("change", (value) => {
      xMotion.set(computeX(value));
    });
  }, [activeMotion, xMotion]);

  const setActive = useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, count - 1));

      activeIndexRef.current = clamped;
      rawActive.set(clamped);
      setActiveIndex(clamped);
    },
    [count, rawActive]
  );

  const setSceneActive = useCallback(
    (value: boolean) => {
      isSceneActiveRef.current = value;
      rawSceneProgress.set(value ? 1 : 0);
      setIsSceneActiveState(value);
    },
    [rawSceneProgress]
  );

  const deactivateScene = useCallback(() => {
    setSceneActive(false);
  }, [setSceneActive]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const section = sectionRef.current;
      if (!section || count <= 0) return;

      const clamped = clamp(index, 0, Math.max(0, count - 1));
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;

      window.scrollTo({
        top: sectionTop + clamped * window.innerHeight,
        behavior
      });
    },
    [count, sectionRef]
  );

  const goToIndex = useCallback(
    (index: number, syncScroll = true) => {
      if (count <= 0) return;

      isReleasingRef.current = false;

      const clamped = clamp(index, 0, Math.max(0, count - 1));

      setSceneActive(true);
      hasEnteredSceneRef.current = true;
      setActive(clamped);

      if (syncScroll && window.innerWidth >= DESKTOP_MIN_WIDTH) {
        scrollToIndex(clamped, "smooth");
      }
    },
    [count, scrollToIndex, setActive, setSceneActive]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || count <= 0) return;

    const isDesktop = () => window.innerWidth >= DESKTOP_MIN_WIDTH;

    const getSectionState = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + sectionHeight;
      const scrollY = window.scrollY;

      const enterY = sectionTop;
      const exitY = sectionBottom - viewportHeight;

      const pinned =
        scrollY >= enterY - 2 &&
        scrollY <= exitY + 2 &&
        sectionHeight > viewportHeight;

      return {
        pinned,
        sectionTop,
        exitY
      };
    };

    const lock = () => {
      lockRef.current = true;

      window.setTimeout(() => {
        lockRef.current = false;
      }, SCENE_LOCK_MS);
    };

    const releaseScene = (direction: 1 | -1) => {
      const state = getSectionState();

      isReleasingRef.current = true;
      hasEnteredSceneRef.current = false;
      deactivateScene();

      window.scrollTo({
        top: direction > 0 ? state.exitY + 16 : state.sectionTop - 16,
        behavior: "smooth"
      });

      window.setTimeout(() => {
        isReleasingRef.current = false;
      }, SCENE_LOCK_MS + 360);
    };

    const handleDirection = (direction: 1 | -1): boolean => {
      if (!isDesktop()) return false;

      const state = getSectionState();

      if (isReleasingRef.current) {
        return false;
      }

      if (!state.pinned) {
        if (isSceneActiveRef.current) {
          deactivateScene();
          hasEnteredSceneRef.current = false;
        }

        return false;
      }

      const current = activeIndexRef.current;
      const maxIndex = Math.max(0, count - 1);

      if (!isSceneActiveRef.current || !hasEnteredSceneRef.current) {
        setSceneActive(true);
        hasEnteredSceneRef.current = true;

        const initialIndex = direction > 0 ? 0 : maxIndex;

        activeIndexRef.current = initialIndex;
        rawActive.set(initialIndex);
        setActiveIndex(initialIndex);
        scrollToIndex(initialIndex, "smooth");

        return true;
      }

      if (direction < 0 && current === 0) {
        releaseScene(-1);
        return true;
      }

      if (direction > 0 && current === maxIndex) {
        releaseScene(1);
        return true;
      }

      if (lockRef.current) return true;

      const next = clamp(current + direction, 0, maxIndex);

      setSceneActive(true);
      setActive(next);
      scrollToIndex(next, "smooth");
      lock();

      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      const direction = event.deltaY > 0 ? 1 : -1;

      if (handleDirection(direction)) {
        event.preventDefault();
      }
    };

    const onScroll = () => {
      const state = getSectionState();

      if (isReleasingRef.current) {
        xMotion.set(computeX(activeMotion.get()));
        return;
      }

      if (state.pinned) {
        if (!isSceneActiveRef.current && window.innerWidth >= DESKTOP_MIN_WIDTH) {
          setSceneActive(true);
        }
      } else if (isSceneActiveRef.current) {
        deactivateScene();
        hasEnteredSceneRef.current = false;
      }

      xMotion.set(computeX(activeMotion.get()));
    };

    window.addEventListener("wheel", onWheel, {passive: false});
    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [
    activeMotion,
    count,
    deactivateScene,
    rawActive,
    scrollToIndex,
    sectionRef,
    setActive,
    setSceneActive,
    xMotion
  ]);

  return {
    activeIndex,
    activeMotion,
    sceneProgress,
    isSceneActive,
    xMotion,
    goToIndex
  };
}

// ---------------------------------------------------------------------------
// useMobileCardSwipe
// ---------------------------------------------------------------------------

function useMobileCardSwipe({
  activeIndex,
  count,
  onIndex
}: {
  activeIndex: number;
  count: number;
  onIndex: (index: number, syncScroll?: boolean) => void;
}) {
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth >= DESKTOP_MIN_WIDTH) return;

    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) return;

      const startX = pointerStartXRef.current;
      const startY = pointerStartYRef.current;

      pointerStartXRef.current = null;
      pointerStartYRef.current = null;

      if (startX === null || startY === null) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      const isHorizontalSwipe =
        Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

      if (!isHorizontalSwipe) return;

      if (deltaX < 0) {
        onIndex(clamp(activeIndex + 1, 0, Math.max(0, count - 1)), false);
      } else {
        onIndex(clamp(activeIndex - 1, 0, Math.max(0, count - 1)), false);
      }
    },
    [activeIndex, count, onIndex]
  );

  const onPointerCancel = useCallback(() => {
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
  }, []);

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel
  };
}

// ---------------------------------------------------------------------------
// computeX
// ---------------------------------------------------------------------------

function computeX(activeIndexValue: number): number {
  if (typeof window === "undefined") return 0;

  const cardWidth = getCardWidthPx();
  const cardStep = getCardStepPx();

  return window.innerWidth / 2 - cardWidth / 2 - activeIndexValue * cardStep;
}

function getCardWidthPx(): number {
  if (typeof window === "undefined") return DESKTOP_CARD_WIDTH_PX;

  const viewportWidth = window.innerWidth;

  if (viewportWidth < 640) {
    return Math.min(viewportWidth * 0.84, MOBILE_CARD_WIDTH_PX);
  }

  if (viewportWidth < 768) {
    return Math.min(viewportWidth * 0.46, 430);
  }

  return DESKTOP_CARD_WIDTH_PX;
}

function getCardStepPx(): number {
  return getCardWidthPx() + CARD_GAP_PX;
}

// ---------------------------------------------------------------------------
// ShowcaseHeading
// ---------------------------------------------------------------------------

function ShowcaseHeading({
  eyebrow,
  title,
  sceneProgress
}: {
  eyebrow: string;
  title: string;
  sceneProgress: MotionValue<number>;
}) {
  const y = useTransform(sceneProgress, [0, 1], [0, -8]);
  const scale = useTransform(sceneProgress, [0, 1], [1, 0.99]);
  const opacity = useTransform(sceneProgress, [0, 1], [1, 0.96]);

  return (
    <motion.div
      className="relative z-10 mx-auto mb-5 w-full text-center will-change-transform sm:mb-7"
      style={{
        maxWidth: "1480px",
        y,
        scale,
        opacity
      }}
    >
      {eyebrow ? (
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.40em] text-slate-500/80">
          {eyebrow}
        </p>
      ) : null}

      <h2
        className="mx-auto mt-2 text-balance text-[clamp(2rem,3.45vw,3.45rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
        style={{maxWidth: "960px", color: "var(--brand-primary)"}}
      >
        {title}
      </h2>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ScenePagination
// ---------------------------------------------------------------------------

function ScenePagination({
  count,
  activeIndex,
  isSceneActive,
  sceneProgress,
  onDotClick,
  tone
}: {
  count: number;
  activeIndex: number;
  isSceneActive: boolean;
  sceneProgress: MotionValue<number>;
  onDotClick: (index: number) => void;
  tone: "blue" | "warm";
}) {
  const activeColor = tone === "blue" ? "#2563eb" : "#d97706";
  const y = useTransform(sceneProgress, [0, 1], [10, 0]);
  const opacity = useTransform(sceneProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="relative z-10 mt-6 flex items-center justify-center gap-[10px] sm:mt-7"
      style={{
        opacity,
        y,
        pointerEvents: isSceneActive ? "auto" : "none"
      }}
    >
      {Array.from({length: count}).map((_, index) => (
        <button
          key={index}
          aria-label={`Go to card ${index + 1}`}
          onClick={() => onDotClick(index)}
          className="flex items-center justify-center"
          style={{width: 30, height: 14}}
        >
          <motion.span
            className="block rounded-full"
            animate={{
              width: index === activeIndex ? 24 : 7,
              height: 7,
              backgroundColor:
                index === activeIndex ? activeColor : "rgba(30,41,59,0.25)"
            }}
            transition={{type: "spring", stiffness: 320, damping: 30}}
          />
        </button>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ProductSceneCard
// ---------------------------------------------------------------------------

function ProductSceneCard({
  product,
  realIndex,
  slotIndex,
  locale,
  activeIndex,
  isSceneActive,
  activeMotion,
  sceneProgress,
  openLabel,
  onFocusCard
}: {
  product: ProductItem;
  realIndex: number;
  slotIndex: number;
  locale: Locale;
  activeIndex: number;
  isSceneActive: boolean;
  activeMotion: MotionValue<number>;
  sceneProgress: MotionValue<number>;
  openLabel: string;
  onFocusCard: (index: number) => void;
}) {
  const activity = useCardActivity(activeMotion, slotIndex);
  const visual = useSceneCardVisuals({activity, sceneProgress});
  const isActive = realIndex === activeIndex && slotIndex === activeIndex;
  const title = getProductDisplayTitle(product.title[locale]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isSceneActive || !isActive) {
      event.preventDefault();
      onFocusCard(realIndex);
    }
  };

  return (
    <motion.article
      className={`relative h-[min(50vh,470px)] ${CARD_WIDTH_CLASS} shrink-0 transform-gpu will-change-transform sm:h-[min(54vh,510px)] lg:h-[min(56vh,540px)]`}
      style={{
        opacity: visual.opacity,
        scale: visual.scale,
        y: visual.y,
        transformOrigin: "center bottom",
        zIndex: isActive ? 30 : Math.max(1, 18 - Math.abs(slotIndex - activeIndex) * 3)
      }}
    >
      <ActiveCardGlow visual={visual} tone="blue" />

      <Link
        href={`/products/${product.slug}`}
        onClick={handleClick}
        className="group relative block h-full overflow-hidden rounded-[24px] bg-white/92 shadow-[0_26px_70px_rgba(15,32,56,0.18),0_6px_18px_rgba(15,23,42,0.10)] [backface-visibility:hidden] [transform:translateZ(0)]"
        style={{clipPath: "inset(0 round 24px)"}}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_48%,#e6edf5_100%)]">
          <Image
            src={getProductImage(product, realIndex)}
            alt={title}
            fill
            sizes="(min-width: 900px) 420px, (min-width: 640px) 46vw, 84vw"
            className="object-contain p-9 transition duration-700 group-hover:scale-[1.04]"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,19,34,0)_0%,rgba(10,19,34,0)_38%,rgba(10,19,34,0.26)_66%,rgba(10,19,34,0.82)_100%)]" />

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-7"
          style={{y: visual.contentY}}
        >
          <h3 className="max-w-[94%] text-[clamp(1.35rem,2.3vw,2.1rem)] font-black uppercase leading-[0.97] tracking-[-0.035em]">
            {title}
          </h3>

          <p className="mt-3 line-clamp-2 max-w-[90%] text-[13px] font-medium leading-relaxed text-white/80">
            {product.subtitle[locale]}
          </p>

          <motion.span
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
            style={{
              opacity: visual.ctaOpacity,
              y: visual.ctaY,
              display: "inline-flex"
            }}
          >
            {openLabel}

            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5h6M5.5 2l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px] ring-[1.5px] ring-white/58"
          style={{opacity: visual.ringOpacity}}
        />
      </Link>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// RecipeSceneCard
// ---------------------------------------------------------------------------

function RecipeSceneCard({
  recipe,
  realIndex,
  slotIndex,
  locale,
  activeIndex,
  isSceneActive,
  activeMotion,
  sceneProgress,
  openLabel,
  onFocusCard
}: {
  recipe: RecipeItem;
  realIndex: number;
  slotIndex: number;
  locale: Locale;
  activeIndex: number;
  isSceneActive: boolean;
  activeMotion: MotionValue<number>;
  sceneProgress: MotionValue<number>;
  openLabel: string;
  onFocusCard: (index: number) => void;
}) {
  const activity = useCardActivity(activeMotion, slotIndex);
  const visual = useSceneCardVisuals({activity, sceneProgress});
  const isActive = realIndex === activeIndex && slotIndex === activeIndex;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isSceneActive || !isActive) {
      event.preventDefault();
      onFocusCard(realIndex);
    }
  };

  return (
    <motion.article
      className={`relative h-[min(50vh,470px)] ${CARD_WIDTH_CLASS} shrink-0 transform-gpu will-change-transform sm:h-[min(54vh,510px)] lg:h-[min(56vh,540px)]`}
      style={{
        opacity: visual.opacity,
        scale: visual.scale,
        y: visual.y,
        transformOrigin: "center bottom",
        zIndex: isActive ? 30 : Math.max(1, 18 - Math.abs(slotIndex - activeIndex) * 3)
      }}
    >
      <ActiveCardGlow visual={visual} tone="warm" />

      <Link
        href={`/recipes/${recipe.slug}`}
        onClick={handleClick}
        className="group relative block h-full overflow-hidden rounded-[24px] bg-slate-950 shadow-[0_26px_70px_rgba(35,24,16,0.2),0_6px_18px_rgba(15,23,42,0.10)] [backface-visibility:hidden] [transform:translateZ(0)]"
        style={{clipPath: "inset(0 round 24px)"}}
      >
        <div className="absolute inset-0">
          <Image
            src={recipe.image}
            alt={recipe.title[locale]}
            fill
            sizes="(min-width: 900px) 420px, (min-width: 640px) 46vw, 84vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,4,0.06)_0%,rgba(12,8,4,0.12)_44%,rgba(12,8,4,0.38)_68%,rgba(12,8,4,0.82)_100%)]" />

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-7"
          style={{y: visual.contentY}}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
            {recipe.prepTime[locale]}
          </p>

          <h3 className="max-w-[94%] text-[clamp(1.45rem,2.6vw,2.25rem)] font-black uppercase leading-[0.97] tracking-[-0.035em]">
            {recipe.title[locale]}
          </h3>

          <p className="mt-3 line-clamp-2 max-w-[90%] text-[13px] font-medium leading-relaxed text-white/80">
            {recipe.subtitle[locale]}
          </p>

          <motion.span
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
            style={{
              opacity: visual.ctaOpacity,
              y: visual.ctaY,
              display: "inline-flex"
            }}
          >
            {openLabel}

            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5h6M5.5 2l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px] ring-[1.5px] ring-white/50"
          style={{opacity: visual.ringOpacity}}
        />
      </Link>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function ActiveCardGlow({
  visual,
  tone
}: {
  visual: ReturnType<typeof useSceneCardVisuals>;
  tone: "blue" | "warm";
}) {
  const bg =
    tone === "blue"
      ? "radial-gradient(ellipse at 50% -10%, rgba(99,162,255,0.6) 0%, rgba(59,130,246,0.22) 50%, transparent 75%)"
      : "radial-gradient(ellipse at 50% -10%, rgba(251,191,90,0.6) 0%, rgba(217,119,6,0.22) 50%, transparent 75%)";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-4 rounded-[30px] blur-2xl"
      style={{background: bg, opacity: visual.glowOpacity}}
    />
  );
}

function useSceneCardVisuals({
  activity,
  sceneProgress
}: {
  activity: ReturnType<typeof useCardActivity>;
  sceneProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    [activity.opacity, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeOpacity, scene] = values as [number, number];

      return lerp(1, activeOpacity, scene);
    }
  );

  const scale = useTransform(
    [activity.scale, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeScale, scene] = values as [number, number];

      return lerp(1, activeScale, scene);
    }
  );

  const y = useTransform(
    [activity.y, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeY, scene] = values as [number, number];

      return lerp(0, activeY, scene);
    }
  );

  const glowOpacity = useTransform(
    [activity.glowOpacity, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeGlow, scene] = values as [number, number];

      return activeGlow * scene;
    }
  );

  const ringOpacity = useTransform(
    [activity.ringOpacity, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeRing, scene] = values as [number, number];

      return activeRing * scene;
    }
  );

  const ctaOpacity = useTransform(
    [activity.ctaOpacity, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeCta, scene] = values as [number, number];

      return activeCta * scene;
    }
  );

  const ctaY = useTransform(
    [activity.ctaY, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeCtaY, scene] = values as [number, number];

      return lerp(6, activeCtaY, scene);
    }
  );

  const contentY = useTransform(
    [activity.contentY, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeContentY, scene] = values as [number, number];

      return lerp(0, activeContentY, scene);
    }
  );

  return {
    opacity,
    scale,
    y,
    glowOpacity,
    ringOpacity,
    ctaOpacity,
    ctaY,
    contentY
  };
}

// ---------------------------------------------------------------------------
// useCardActivity
// ---------------------------------------------------------------------------

function useCardActivity(activeMotion: MotionValue<number>, slotIndex: number) {
  const offset = useTransform(activeMotion, (value) => slotIndex - value);
  const distance = useTransform(offset, (value) => Math.min(Math.abs(value), 2.25));
  const focus = useTransform(distance, [0, 1, 2.25], [1, 0.34, 0]);

  const opacity = useTransform(distance, [0, 1, 2.25], [1, 0.68, 0.38]);
  const scale = useTransform(distance, [0, 1, 2.25], [1.04, 0.88, 0.78]);
  const y = useTransform(distance, [0, 1, 2.25], [-12, 34, 68]);

  const ringOpacity = useTransform(focus, [0.42, 1], [0, 1]);
  const glowOpacity = useTransform(focus, [0, 0.52, 1], [0, 0.18, 0.58]);

  const contentY = useTransform(focus, [0, 1], [4, 0]);

  const ctaOpacity = useTransform(focus, [0.62, 1], [0, 1]);
  const ctaY = useTransform(focus, [0.62, 1], [5, 0]);

  return {
    opacity,
    scale,
    y,
    ringOpacity,
    glowOpacity,
    contentY,
    ctaOpacity,
    ctaY
  };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}
