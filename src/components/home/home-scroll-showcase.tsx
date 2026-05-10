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
import type {RecipeItem} from "@/components/recipes/recipes-data";

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
    productsEyebrow: "SOFIN / Products",
    productsTitle: "Продукты SOFIN для спокойного ежедневного выбора",
    recipesEyebrow: "SOFIN / Recipes",
    recipesTitle: "Идеи для завтрака, десертов и мягких семейных пауз",
    openCard: "Подробнее"
  },
  uz: {
    productsEyebrow: "SOFIN / Mahsulotlar",
    productsTitle: "Har kungi sokin tanlov uchun SOFIN mahsulotlari",
    recipesEyebrow: "SOFIN / Retseptlar",
    recipesTitle: "Nonushta, desert va oilaviy lahzalar uchun g'oyalar",
    openCard: "Batafsil"
  },
  en: {
    productsEyebrow: "SOFIN / Products",
    productsTitle: "SOFIN products for calm everyday choice",
    recipesEyebrow: "SOFIN / Recipes",
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
    <main className="relative z-20 bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_48%,#d1dcea_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.66),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(185,214,255,0.26),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.36),rgba(255,255,255,0)_38%,rgba(255,255,255,0.18))]" />

      <PinnedProductScenes copy={copy} locale={locale} products={products} />
      <PinnedRecipeScenes copy={copy} locale={locale} recipes={recipes} />
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
          className="relative w-screen touch-pan-y overflow-visible"
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
          className="relative w-screen touch-pan-y overflow-visible"
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
// Hook: useGhostStripX
// ---------------------------------------------------------------------------

function useGhostStripX(
  base: MotionValue<number>,
  extraSlots: number
): MotionValue<number> {
  const out = useMotionValue(base.get() - extraSlots * getCardStepPx());

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

  const xMotion = useMotionValue(computeX(0));

  useEffect(() => {
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
      className="mx-auto mb-5 w-full text-center will-change-transform sm:mb-7"
      style={{
        maxWidth: "1480px",
        y,
        scale,
        opacity
      }}
    >
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.40em] text-slate-500/80">
        {eyebrow}
      </p>

      <h2
        className="mx-auto mt-2 text-balance text-[clamp(2rem,4vw,4rem)] font-semibold leading-[0.98] tracking-[-0.055em]"
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
  const filter = useTransform(sceneProgress, (value) => {
    const blur = lerp(8, 0, value);

    return `blur(${blur.toFixed(2)}px)`;
  });

  return (
    <motion.div
      className="mt-6 flex items-center justify-center gap-[10px] sm:mt-7"
      style={{
        opacity,
        y,
        filter,
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

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isSceneActive || !isActive) {
      event.preventDefault();
      onFocusCard(realIndex);
    }
  };

  return (
    <motion.article
      className={`relative h-[min(50vh,470px)] ${CARD_WIDTH_CLASS} shrink-0 will-change-transform sm:h-[min(54vh,510px)] lg:h-[min(56vh,540px)]`}
      style={{
        opacity: visual.opacity,
        scale: visual.scale,
        y: visual.y
      }}
    >
      <ActiveCardGlow visual={visual} tone="blue" />

      <Link
        href={`/products/${product.slug}`}
        onClick={handleClick}
        className="group relative block h-full overflow-hidden rounded-[22px] shadow-[0_20px_60px_rgba(15,23,42,0.20),0_4px_14px_rgba(15,23,42,0.10)]"
      >
        <motion.div className="absolute inset-0" style={{filter: visual.filter}}>
          <Image
            src={getProductImage(product, realIndex)}
            alt={product.title[locale]}
            fill
            sizes="(min-width: 900px) 420px, (min-width: 640px) 46vw, 84vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,32,0.16)_0%,rgba(8,16,32,0.04)_38%,rgba(8,16,32,0.38)_68%,rgba(8,16,32,0.78)_100%)]" />

        <ActiveCardSheen activity={activity} visual={visual} />

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-7"
          style={{y: visual.contentY}}
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
            SOFIN
          </p>

          <h3 className="max-w-[94%] text-[clamp(1.35rem,2.3vw,2.1rem)] font-black uppercase leading-[0.97] tracking-[-0.035em]">
            {product.title[locale]}
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
          className="pointer-events-none absolute inset-0 rounded-[22px] ring-[1.5px] ring-white/50"
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
      className={`relative h-[min(50vh,470px)] ${CARD_WIDTH_CLASS} shrink-0 will-change-transform sm:h-[min(54vh,510px)] lg:h-[min(56vh,540px)]`}
      style={{
        opacity: visual.opacity,
        scale: visual.scale,
        y: visual.y
      }}
    >
      <ActiveCardGlow visual={visual} tone="warm" />

      <Link
        href={`/recipes/${recipe.slug}`}
        onClick={handleClick}
        className="group relative block h-full overflow-hidden rounded-[22px] shadow-[0_20px_60px_rgba(15,23,42,0.20),0_4px_14px_rgba(15,23,42,0.10)]"
      >
        <motion.div className="absolute inset-0" style={{filter: visual.filter}}>
          <Image
            src={recipe.image}
            alt={recipe.title[locale]}
            fill
            sizes="(min-width: 900px) 420px, (min-width: 640px) 46vw, 84vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,4,0.14)_0%,rgba(12,8,4,0.04)_38%,rgba(12,8,4,0.36)_68%,rgba(12,8,4,0.76)_100%)]" />

        <ActiveCardSheen activity={activity} visual={visual} />

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
          className="pointer-events-none absolute inset-0 rounded-[22px] ring-[1.5px] ring-white/50"
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
      className="pointer-events-none absolute -inset-5 rounded-[30px] blur-3xl"
      style={{background: bg, opacity: visual.glowOpacity}}
    />
  );
}

function ActiveCardSheen({
  activity,
  visual
}: {
  activity: ReturnType<typeof useCardActivity>;
  visual: ReturnType<typeof useSceneCardVisuals>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,transparent_12%,rgba(255,255,255,0.12)_38%,transparent_62%)]"
      style={{
        opacity: visual.sheenOpacity,
        x: activity.sheenX
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// useSceneCardVisuals
// ---------------------------------------------------------------------------

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

  const blur = useTransform(
    [activity.blur, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeBlur, scene] = values as [number, number];

      return lerp(0, activeBlur, scene);
    }
  );

  const brightness = useTransform(
    [activity.brightness, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeBrightness, scene] = values as [number, number];

      return lerp(1, activeBrightness, scene);
    }
  );

  const saturate = useTransform(
    [activity.saturate, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeSaturate, scene] = values as [number, number];

      return lerp(1, activeSaturate, scene);
    }
  );

  const filter = useTransform(
    [blur, brightness, saturate] as MotionValue<number>[],
    (values) => {
      const [blurValue, brightnessValue, saturateValue] = values as [
        number,
        number,
        number
      ];

      return `blur(${blurValue.toFixed(2)}px) brightness(${brightnessValue.toFixed(
        3
      )}) saturate(${saturateValue.toFixed(3)})`;
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

  const sheenOpacity = useTransform(
    [activity.sheenOpacity, sceneProgress] as MotionValue<number>[],
    (values) => {
      const [activeSheen, scene] = values as [number, number];

      return activeSheen * scene;
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
    filter,
    glowOpacity,
    ringOpacity,
    sheenOpacity,
    ctaOpacity,
    ctaY,
    contentY
  };
}

// ---------------------------------------------------------------------------
// useCardActivity
// ---------------------------------------------------------------------------

function useCardActivity(activeMotion: MotionValue<number>, slotIndex: number) {
  const input = [slotIndex - 0.75, slotIndex, slotIndex + 0.75];
  const focus = useTransform(activeMotion, input, [0, 1, 0]);

  const opacity = useTransform(focus, [0, 1], [0.58, 1]);
  const scale = useTransform(focus, [0, 1], [0.94, 1.04]);
  const y = useTransform(focus, [0, 1], [26, -10]);

  const blur = useTransform(focus, [0, 1], [1.15, 0]);
  const brightness = useTransform(focus, [0, 1], [0.82, 1]);
  const saturate = useTransform(focus, [0, 1], [0.86, 1.05]);

  const ringOpacity = useTransform(focus, [0.42, 1], [0, 1]);
  const glowOpacity = useTransform(focus, [0, 0.52, 1], [0, 0.24, 0.86]);
  const sheenOpacity = useTransform(focus, [0.5, 1], [0, 0.62]);
  const sheenX = useTransform(focus, [0, 1], ["-55%", "45%"]);

  const contentY = useTransform(focus, [0, 1], [4, 0]);

  const ctaOpacity = useTransform(focus, [0.62, 1], [0, 1]);
  const ctaY = useTransform(focus, [0.62, 1], [5, 0]);

  return {
    opacity,
    scale,
    y,
    blur,
    brightness,
    saturate,
    ringOpacity,
    glowOpacity,
    sheenOpacity,
    sheenX,
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