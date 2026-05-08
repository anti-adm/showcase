"use client";

import { useEffect, useRef, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { useLocale } from "next-intl";
import { IntroClusterStage } from "@/components/intro-cluster-stage";
import { IntroTextLayer } from "@/components/intro-text-layer";
import {
  SLIDE_BACKGROUND_CONTROLS,
  getStepDurationMs,
  type ShowcaseStep,
} from "@/lib/showcase-controls";

const WHEEL_THRESHOLD = 18;
const TOUCH_THRESHOLD = 46;
const MOBILE_QUERY = "(max-width: 640px)";
const COLLECTION_SLIDE_COUNT = 8;
const COLLECTION_OUTRO_STAGE = COLLECTION_SLIDE_COUNT + 2;
const COLLECTION_NAVIGATION_LOCK_MS = 720;
const SHOWCASE_UNMOUNT_AFTER_COLLECTION_MS = 1120;

type Locale = "uz" | "ru" | "en";

const COLLECTION_FINAL_TEXT_CONTROLS = {
  desktop: {
    x: "0px",
    y: "0px",
    maxWidth: "1600px",
  },
  mobile: {
    x: "0px",
    y: "24px",
    maxWidth: "330px",
  },
} as const;

const collectionSerif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

type AnimatedStep = Exclude<ShowcaseStep, 0>;
type ProgressKey = `step${AnimatedStep}`;
type ProgressState = Record<ProgressKey, number>;

const INITIAL_PROGRESS: ProgressState = {
  step1: 0,
  step2: 0,
  step3: 0,
  step4: 0,
  step5: 0,
  step6: 0,
  step7: 0,
  step8: 0,
  step9: 0,
};

const PROGRESS_KEYS = Object.keys(INITIAL_PROGRESS) as ProgressKey[];

type Palette = {
  base: string;
  glow1: string;
  glow2: string;
  glow3: string;
  milk: string;
};

const MILK_STEPS = new Set([1, 3, 4, 6]);
const PRELOAD_TEXTURE_FLAVORS = [
  "ananas",
  "banan",
  "malina",
  "olcha",
  "ormon-meva",
  "oulupnay",
  "oulupnay-banan",
  "shaftoli",
] as const;
const PRELOAD_IMAGE_ASSETS = [
  "/media/logotip.png",
  "/media/down.png",
  "/media/slide1.png",
  ...SLIDE_BACKGROUND_CONTROLS.layers.flatMap((layer) => [
    layer.src,
    layer.src.replace(/(\.[a-z]+)$/i, "-m$1"),
  ]),
  ...PRELOAD_TEXTURE_FLAVORS.flatMap((flavor) => [
    `/textures/products/${flavor}-side.jpg`,
    `/textures/products/${flavor}-lid.jpg`,
  ]),
];
const PRELOAD_FETCH_ASSETS = ["/models/products/base-cup.glb"];

export function YogurtsShowcasePage() {
  const locale = normalizeLocale(useLocale());
  const pageCopy = YOGURTS_PAGE_TRANSLATIONS[locale];
  const [step, setStep] = useState<ShowcaseStep>(0);
  const [progressState, setProgressState] = useState<ProgressState>(INITIAL_PROGRESS);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isMobile, setIsMobile] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [collectionStage, setCollectionStage] = useState(0);
  const [showcaseSceneMounted, setShowcaseSceneMounted] = useState(true);

  const {
    step1: step1Progress,
    step2: step2Progress,
    step3: step3Progress,
    step4: step4Progress,
    step5: step5Progress,
    step6: step6Progress,
    step7: step7Progress,
    step8: step8Progress,
    step9: step9Progress,
  } = progressState;
  const collectionActive = collectionStage > 0;

  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const collectionLockTimerRef = useRef<number | null>(null);
  const showcaseUnmountTimerRef = useRef<number | null>(null);
  const stepRef = useRef(step);
  const isMobileRef = useRef(false);
  const preloadingRef = useRef(true);
  const collectionStageRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const progressRef = useRef<ProgressState>(INITIAL_PROGRESS);

  useEffect(() => {
    let cancelled = false;
    const imageAssets = Array.from(new Set(PRELOAD_IMAGE_ASSETS));
    const fetchAssets = Array.from(new Set(PRELOAD_FETCH_ASSETS));
    const total = imageAssets.length + fetchAssets.length;
    let completed = 0;

    const markDone = () => {
      completed += 1;
      if (!cancelled) setPreloadProgress(Math.min(1, completed / Math.max(1, total)));
    };

    const preloadAll = async () => {
      const minIntro = wait(1450);
      const tasks = [
        ...imageAssets.map((src) => preloadImage(src).finally(markDone)),
        ...fetchAssets.map((src) => preloadFetch(src).finally(markDone)),
      ];

      await Promise.allSettled([...tasks, minIntro]);

      if (cancelled) return;
      setPreloadProgress(1);
      window.setTimeout(() => {
        if (cancelled) return;
        preloadingRef.current = false;
        setIsPreloading(false);
      }, 340);
    };

    preloadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const syncIsMobile = () => {
      isMobileRef.current = query.matches;
      setIsMobile(query.matches);
    };

    syncIsMobile();
    query.addEventListener("change", syncIsMobile);

    return () => query.removeEventListener("change", syncIsMobile);
  }, []);

  useEffect(() => {
    const preventTouchBounce = (event: TouchEvent) => {
      if (event.touches.length > 1) return;
      if (isMobileRef.current && collectionStageRef.current > 0) return;
      event.preventDefault();
    };

    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";

    window.addEventListener("touchmove", preventTouchBounce, { passive: false });

    return () => {
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.overflow = "";

      window.removeEventListener("touchmove", preventTouchBounce);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (collectionLockTimerRef.current) window.clearTimeout(collectionLockTimerRef.current);
      if (showcaseUnmountTimerRef.current) window.clearTimeout(showcaseUnmountTimerRef.current);
    };
  }, []);

  const resetToTop = () => {
    if (runningRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    collectionStageRef.current = 0;
    setShowcaseSceneMounted(true);
    setCollectionStage(0);

    const from = { ...progressRef.current };
    const start = performance.now();
    const duration = 1150;

    runningRef.current = true;
    setDirection("backward");
    setStep(0);
    stepRef.current = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(t);
      const nextProgress = { ...progressRef.current };

      PROGRESS_KEYS.forEach((key) => {
        nextProgress[key] = from[key] * (1 - eased);
      });

      progressRef.current = nextProgress;
      setProgressState(nextProgress);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      runningRef.current = false;
      rafRef.current = null;
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    collectionStageRef.current = collectionStage;
  }, [collectionStage]);

  useEffect(() => {
    if (showcaseUnmountTimerRef.current) {
      window.clearTimeout(showcaseUnmountTimerRef.current);
      showcaseUnmountTimerRef.current = null;
    }

    if (!collectionActive) return;

    showcaseUnmountTimerRef.current = window.setTimeout(() => {
      setShowcaseSceneMounted(false);
      showcaseUnmountTimerRef.current = null;
    }, SHOWCASE_UNMOUNT_AFTER_COLLECTION_MS);

    return () => {
      if (showcaseUnmountTimerRef.current) {
        window.clearTimeout(showcaseUnmountTimerRef.current);
        showcaseUnmountTimerRef.current = null;
      }
    };
  }, [collectionActive]);

  useEffect(() => {
    const commitProgressState = (nextProgress: ProgressState) => {
      const previous = progressRef.current;
      const hasChanged = PROGRESS_KEYS.some(
        (key) => Math.abs(previous[key] - nextProgress[key]) > 0.0005
      );

      if (!hasChanged) return false;

      progressRef.current = nextProgress;
      setProgressState(nextProgress);
      return true;
    };

    const setProgress = (key: ProgressKey, value: number) => {
      const currentValue = progressRef.current[key];
      if (Math.abs(currentValue - value) <= 0.0005) return false;

      const nextProgress = {
        ...progressRef.current,
        [key]: value,
      };

      return commitProgressState(nextProgress);
    };

    const run = (
      key: ProgressKey,
      duration: number,
      from: number,
      to: number,
      onDone?: () => void
    ) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (Math.abs(from - to) <= 0.0005) {
        setProgress(key, to);
        runningRef.current = false;
        rafRef.current = null;
        onDone?.();
        return;
      }

      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = easeInOutCubic(t);
        const next = from + (to - from) * eased;

        setProgress(key, next);

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        runningRef.current = false;
        rafRef.current = null;
        onDone?.();
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const lockNavigationForCollection = () => {
      runningRef.current = true;

      if (collectionLockTimerRef.current) {
        window.clearTimeout(collectionLockTimerRef.current);
      }

      collectionLockTimerRef.current = window.setTimeout(() => {
        runningRef.current = false;
        collectionLockTimerRef.current = null;
      }, COLLECTION_NAVIGATION_LOCK_MS);
    };

    const navigate = (intent: "next" | "previous") => {
      if (preloadingRef.current) return;
      if (runningRef.current) return;

      const currentStep = stepRef.current;
      const currentCollectionStage = collectionStageRef.current;

      if (currentCollectionStage > 0) {
        if (isMobileRef.current) return;

        if (intent === "next") {
          const nextStage = Math.min(COLLECTION_OUTRO_STAGE, currentCollectionStage + 1);
          if (nextStage === currentCollectionStage) return;

          collectionStageRef.current = nextStage;
          setCollectionStage(nextStage);
          lockNavigationForCollection();
          return;
        }

        const previousStage = currentCollectionStage - 1;

        collectionStageRef.current = previousStage;
        if (previousStage === 0) setShowcaseSceneMounted(true);
        setCollectionStage(previousStage);
        lockNavigationForCollection();
        return;
      }

      if (intent === "next") {
        setDirection("forward");

        if (currentStep === 9 && progressRef.current.step9 >= 0.999) {
          collectionStageRef.current = 1;
          setCollectionStage(1);
          lockNavigationForCollection();
          return;
        }

        if (currentStep < 9) {
          runningRef.current = true;
          const next = getNextStep(currentStep, isMobileRef.current);
          setStep(next);
          stepRef.current = next;

          run(
            `step${next}` as ProgressKey,
            getStepDurationMs(next),
            progressRef.current[`step${next}` as ProgressKey],
            1
          );
        }

        return;
      }

      setDirection("backward");

      if (currentStep > 0) {
        runningRef.current = true;

        run(
          `step${currentStep}` as ProgressKey,
          getStepDurationMs(currentStep),
          progressRef.current[`step${currentStep}` as ProgressKey],
          0,
          () => {
            const prev = getPreviousStep(currentStep, isMobileRef.current);
            setStep(prev);
            stepRef.current = prev;
          }
        );
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      event.preventDefault();

      navigate(event.deltaY > 0 ? "next" : "previous");
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchStartYRef.current = event.touches[0].clientY;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isMobileRef.current && collectionStageRef.current > 0) return;

      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY === null || endY === undefined) return;

      const deltaY = startY - endY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      event.preventDefault();
      navigate(deltaY > 0 ? "next" : "previous");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isTypingTarget(event.target)) return;

      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        navigate("next");
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        navigate("previous");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const paletteBase: Palette = {
    base: "#f6efe8",
    glow1: "#ffeae1",
    glow2: "#ffe2ec",
    glow3: "#fdf3dc",
    milk: "#fffdf8",
  };

  const paletteMalina: Palette = {
    base: "#f6e2ea",
    glow1: "#ffd6e2",
    glow2: "#ffc4d6",
    glow3: "#ffeaf2",
    milk: "#fff7fb",
  };

  const paletteAnanas: Palette = {
    base: "#f7efd2",
    glow1: "#fff0b8",
    glow2: "#ffe59a",
    glow3: "#fff8df",
    milk: "#fffcef",
  };

  const paletteBanan: Palette = {
    base: "#f7efd8",
    glow1: "#fff3c8",
    glow2: "#ffe8b1",
    glow3: "#fff8e2",
    milk: "#fffdf1",
  };

  const paletteOlcha: Palette = {
    base: "#f5e0e3",
    glow1: "#ffd2d9",
    glow2: "#ffc0cb",
    glow3: "#ffe7eb",
    milk: "#fff8f9",
  };

  const paletteOrmon: Palette = {
    base: "#f0dcea",
    glow1: "#d8edc7",
    glow2: "#c9e4b3",
    glow3: "#eef6e3",
    milk: "#fbfff7",
  };

  const paletteOulupnay: Palette = {
    base: "#f7e3ea",
    glow1: "#ffd4e0",
    glow2: "#ffc4d6",
    glow3: "#ffe8f0",
    milk: "#fff8fb",
  };

  const paletteShaftoli: Palette = {
    base: "#f7e7dd",
    glow1: "#ffd9c7",
    glow2: "#ffc8b1",
    glow3: "#fff0e5",
    milk: "#fffaf6",
  };

  const paletteStrawberryBanan: Palette = {
    base: "#e4f4f4",
    glow1: "#c8f7f4",
    glow2: "#ffe3b0",
    glow3: "#ffd7df",
    milk: "#fffdf5",
  };

  const mixPalette = (a: Palette, b: Palette, t: number): Palette => ({
    base: mixColors(a.base, b.base, t),
    glow1: mixColors(a.glow1, b.glow1, t),
    glow2: mixColors(a.glow2, b.glow2, t),
    glow3: mixColors(a.glow3, b.glow3, t),
    milk: mixColors(a.milk, b.milk, t),
  });

  const t1 = easeInOutSoft(step1Progress);
  const t2 = easeInOutSoft(step2Progress);
  const t3 = easeInOutSoft(step3Progress);
  const t4 = easeInOutSoft(step4Progress);
  const t5 = easeInOutSoft(step5Progress);
  const t6 = easeInOutSoft(step6Progress);
  const t7 = easeInOutSoft(step7Progress);
  const t8 = easeInOutSoft(step8Progress);
  const t9 = easeInOutSoft(step9Progress);

  const palette =
    step >= 9
      ? mixPalette(paletteShaftoli, paletteStrawberryBanan, t9)
      : step >= 8
        ? mixPalette(paletteOulupnay, paletteShaftoli, t8)
        : step >= 7
          ? mixPalette(paletteOrmon, paletteOulupnay, t7)
          : step >= 6
            ? mixPalette(paletteOlcha, paletteOrmon, t6)
            : step >= 5
              ? mixPalette(paletteBanan, paletteOlcha, t5)
              : step >= 4
                ? mixPalette(paletteAnanas, paletteBanan, t4)
                : step >= 3
                  ? mixPalette(paletteMalina, paletteAnanas, t3)
                  : step >= 2
                    ? mixPalette(paletteMalina, paletteMalina, t2)
                    : step >= 1
                      ? mixPalette(paletteBase, paletteMalina, t1)
                      : paletteBase;

  const background = buildBackground(palette, {
    step,
    step1Progress,
    step2Progress,
    step3Progress,
    step4Progress,
    step5Progress,
    step6Progress,
    step7Progress,
    step8Progress,
    step9Progress,
  });

  const backgroundTransition = SLIDE_BACKGROUND_CONTROLS.transition;
  const backgroundProgress = getCurrentBackgroundProgress(step, {
    step1: t1,
    step2: t2,
    step3: t3,
    step4: t4,
    step5: t5,
    step6: t6,
    step7: t7,
    step8: t8,
    step9: t9,
  });
  const backgroundLayers = SLIDE_BACKGROUND_CONTROLS.layers.map((layer) => {
    const presence = getSlideBackgroundPresence(layer.steps, {
      step,
      progress: backgroundProgress,
    });
    const easedPresence = easeInOutSoft(presence);

    return {
      ...layer,
      src: getResponsiveBackgroundSrc(layer.src, isMobile),
      presence,
      opacity: presence * (layer.maxOpacity ?? backgroundTransition.maxOpacity),
      scale: lerp(
        isMobile ? 1.028 : backgroundTransition.scaleFrom,
        isMobile ? 1.006 : backgroundTransition.scaleTo,
        easedPresence
      ),
      shiftX: lerp(isMobile ? 0 : backgroundTransition.shiftXFromVw, 0, easedPresence),
      shiftY: lerp(isMobile ? -4.4 : backgroundTransition.shiftYFromVh, 0, easedPresence),
    };
  });
  const backgroundVeilOpacity =
    backgroundLayers.reduce((max, layer) => Math.max(max, layer.presence), 0) *
    backgroundTransition.veilOpacity;

  const milkActive = MILK_STEPS.has(step);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: palette.base,
        overscrollBehavior: "none",
        touchAction: collectionActive && isMobile ? "auto" : "none",
      }}
    >
      {showcaseSceneMounted ? (
        <div
          className="absolute inset-0 transition-[transform,opacity] duration-980"
          style={{
            transform: collectionActive
              ? "translate3d(0,-108vh,0) scale(0.99)"
              : "translate3d(0,0,0) scale(1)",
            opacity: collectionActive ? 0 : 1,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="absolute inset-0" style={{ background }} />

          {backgroundLayers.map((layer, index) => (
            <div
              key={layer.src}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 will-change-transform"
              style={{
                zIndex: index + 1,
                backgroundImage: `url("${layer.src}")`,
                backgroundPosition: layer.position ?? "center center",
                backgroundSize: layer.size ?? "cover",
                opacity: layer.opacity,
                transform: `translate3d(${layer.shiftX}vw, ${layer.shiftY}vh, 0) scale(${layer.scale})`,
                transformOrigin: "center",
                transition:
                  "opacity 1900ms cubic-bezier(0.16, 1, 0.3, 1), transform 2400ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-9"
            style={{
              background: `
                radial-gradient(circle at 54% 46%, rgba(255, 255, 255, 0.24), transparent 42%),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 250, 235, 0.24) 54%, rgba(255, 255, 255, 0.16))
              `,
              opacity: backgroundVeilOpacity,
              transition: "opacity 1900ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          <div className="pointer-events-none absolute inset-0 z-10">
            <div
              className={`absolute left-1/2 top-[58%] h-[48vh] w-[120vw] -translate-x-1/2 rounded-[999px] transition-opacity duration-2200 ${
                milkActive ? "opacity-80" : "opacity-0"
              }`}
              style={{
                background: `radial-gradient(circle at 40% 40%, ${rgbaFromHex(
                  palette.milk,
                  0.68
                )}, ${rgbaFromHex(palette.milk, 0.14)} 55%, transparent 72%)`,
                filter: "blur(10px)",
              }}
            />
          </div>

          <IntroClusterStage
            step={step}
            step1Progress={step1Progress}
            step2Progress={step2Progress}
            step3Progress={step3Progress}
            step4Progress={step4Progress}
            step5Progress={step5Progress}
            step6Progress={step6Progress}
            step7Progress={step7Progress}
            step8Progress={step8Progress}
            step9Progress={step9Progress}
            direction={direction}
            isMobile={isMobile}
          />

          <IntroTextLayer
            step={step}
            step1Progress={step1Progress}
            step2Progress={step2Progress}
            step3Progress={step3Progress}
            step4Progress={step4Progress}
            step5Progress={step5Progress}
            step6Progress={step6Progress}
            step7Progress={step7Progress}
            step8Progress={step8Progress}
            step9Progress={step9Progress}
            isMobile={isMobile}
          />
        </div>
      ) : null}

      <CollectionExperience
        stage={collectionStage}
        isMobile={isMobile}
        copy={pageCopy.collection}
      />

      <button
        type="button"
        aria-label={pageCopy.backToTop}
        onClick={resetToTop}
        className={`fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-[#2f241f]/88 text-2xl leading-none text-white shadow-[0_18px_42px_rgba(47,36,31,0.22)] backdrop-blur-xl transition duration-500 hover:bg-[#3a2c24] sm:right-6 ${
          step > 0 && !collectionActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
        }`}
        style={{
          ...(isMobile
            ? { bottom: "calc(env(safe-area-inset-bottom) + 1rem)" }
            : { bottom: "calc(env(safe-area-inset-bottom) + 1rem)" }),
        }}
      >
        ↑
      </button>

      <SofinPreloader
        visible={isPreloading}
        progress={preloadProgress}
        label={pageCopy.preloader}
      />
    </main>
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.closest("input, textarea, select, button, a, [contenteditable='true']")
  );
}

function getNextStep(currentStep: ShowcaseStep, isMobile: boolean): ShowcaseStep {
  if (isMobile && currentStep === 1) return 3;
  return Math.min(9, currentStep + 1) as ShowcaseStep;
}

function getPreviousStep(currentStep: ShowcaseStep, isMobile: boolean): ShowcaseStep {
  if (isMobile && currentStep === 3) return 1;
  return Math.max(0, currentStep - 1) as ShowcaseStep;
}

type CollectionCopy = {
  heading: string;
  subheading: string;
  finalText: string;
  slides: Array<{eyebrow: string; title: string; text: string}>;
};

const YOGURTS_PAGE_TRANSLATIONS: Record<
  Locale,
  {backToTop: string; preloader: string; collection: CollectionCopy}
> = {
  ru: {
    backToTop: "Вернуться к началу",
    preloader: "Подготавливаем сцену",
    collection: {
      heading: "SOFIN",
      subheading: "Наша коллекция натуральных йогуртов собственного производства",
      finalText: "Попробуйте наши йогурты от компании SOFIN",
      slides: [
        {eyebrow: "01 / Натуральная основа", title: "Мягкий вкус на каждый день", text: "Йогурты SOFIN созданы для спокойного, чистого десертного настроения без лишней тяжести."},
        {eyebrow: "02 / Фруктовая линия", title: "Яркие вкусы фруктов", text: "Ананас, банан, ягоды и персик раскрываются мягко, с деликатной сливочной базой."},
        {eyebrow: "03 / Собственное производство", title: "Контроль в каждой детали", text: "Мы бережно собираем коллекцию вкусов, чтобы каждый стаканчик ощущался цельным и узнаваемым."},
        {eyebrow: "04 / Нежная текстура", title: "Кремовая плотность", text: "Гладкая структура делает вкус более бархатным и приятным с первой ложки."},
        {eyebrow: "05 / Ягодный характер", title: "Свежесть и мягкая кислинка", text: "Ягодные варианты добавляют выразительность, сохраняя десертную нежность SOFIN."},
        {eyebrow: "06 / Лёгкая подача", title: "Для завтрака и паузы", text: "Формат удобно вписывается в быстрый день, спокойный вечер и маленький сладкий перерыв."},
        {eyebrow: "07 / Баланс вкуса", title: "Сладость без перегруза", text: "Фруктовые ноты звучат аккуратно, поддерживая чистый молочный вкус."},
        {eyebrow: "08 / Коллекция SOFIN", title: "Выберите свой вкус", text: "Каждый вариант раскрывает отдельное настроение, но вся линейка остается единой и мягкой."}
      ]
    }
  },
  uz: {
    backToTop: "Boshiga qaytish",
    preloader: "Sahna tayyorlanmoqda",
    collection: {
      heading: "SOFIN",
      subheading: "O‘z ishlab chiqarishimizdagi tabiiy yogurtlar kolleksiyasi",
      finalText: "SOFIN kompaniyasining yogurtlarini tatib ko‘ring",
      slides: [
        {eyebrow: "01 / Tabiiy asos", title: "Har kun uchun mayin ta’m", text: "SOFIN yogurtlari osoyishta, toza desert kayfiyati uchun yaratilgan."},
        {eyebrow: "02 / Mevali yo‘nalish", title: "Yorqin meva ta’mlari", text: "Ananas, banan, rezavorlar va shaftoli nozik qaymoqli asosda yumshoq ochiladi."},
        {eyebrow: "03 / O‘z ishlab chiqarish", title: "Har detalda nazorat", text: "Har bir stakan yaxlit va tanish sezilishi uchun ta’mlar kolleksiyasini ehtiyotkorlik bilan yig‘amiz."},
        {eyebrow: "04 / Nozik tekstura", title: "Kremli zichlik", text: "Silliq tuzilma ta’mni birinchi qoshiqdanoq baxmal va yoqimli qiladi."},
        {eyebrow: "05 / Rezavor xarakter", title: "Yangilik va mayin nordonlik", text: "Rezavor variantlar ifodalilik qo‘shadi, SOFIN desert yumshoqligini saqlab qoladi."},
        {eyebrow: "06 / Yengil taqdim", title: "Nonushta va tanaffus uchun", text: "Format tez kun, sokin kech va kichik shirin tanaffusga oson mos keladi."},
        {eyebrow: "07 / Ta’m balansi", title: "Ortiqcha bo‘lmagan shirinlik", text: "Mevali notalar toza sut ta’mini qo‘llab, sokin va aniq eshitiladi."},
        {eyebrow: "08 / SOFIN kolleksiyasi", title: "O‘z ta’mingizni tanlang", text: "Har bir variant alohida kayfiyat ochadi, lekin butun liniya yagona va mayin qoladi."}
      ]
    }
  },
  en: {
    backToTop: "Back to top",
    preloader: "Preparing the scene",
    collection: {
      heading: "SOFIN",
      subheading: "Our collection of natural yogurts made in-house",
      finalText: "Try SOFIN yogurts from our company",
      slides: [
        {eyebrow: "01 / Natural base", title: "Soft taste for every day", text: "SOFIN yogurts are made for a calm, clean dessert mood without heaviness."},
        {eyebrow: "02 / Fruit line", title: "Bright fruit flavors", text: "Pineapple, banana, berries and peach open softly over a delicate creamy base."},
        {eyebrow: "03 / Own production", title: "Control in every detail", text: "We carefully build the flavor collection so every cup feels whole and recognizable."},
        {eyebrow: "04 / Tender texture", title: "Creamy density", text: "A smooth structure makes the taste more velvety and pleasant from the first spoon."},
        {eyebrow: "05 / Berry character", title: "Freshness and soft tartness", text: "Berry flavors add expression while keeping SOFIN’s dessert softness."},
        {eyebrow: "06 / Easy serving", title: "For breakfast and a pause", text: "The format fits a quick day, a calm evening and a small sweet break."},
        {eyebrow: "07 / Taste balance", title: "Sweetness without overload", text: "Fruit notes stay gentle while supporting the clean dairy taste."},
        {eyebrow: "08 / SOFIN collection", title: "Choose your flavor", text: "Each option reveals its own mood, while the whole line remains unified and soft."}
      ]
    }
  }
};

function CollectionExperience({
  stage,
  isMobile,
  copy
}: {
  stage: number;
  isMobile: boolean;
  copy: CollectionCopy;
}) {
  const active = stage > 0;
  const outroVisible = stage >= COLLECTION_OUTRO_STAGE;
  const headingVisible = active && !outroVisible;
  const slideStage = Math.max(0, Math.min(COLLECTION_SLIDE_COUNT - 1, stage - 2));
  const finalTextControls = isMobile
    ? COLLECTION_FINAL_TEXT_CONTROLS.mobile
    : COLLECTION_FINAL_TEXT_CONTROLS.desktop;
  const imageShift = active
    ? Math.min(100, stage <= 1 ? 0 : stage >= COLLECTION_OUTRO_STAGE ? 100 : 10 + slideStage * 10.5)
    : 0;
  const carouselShift = stage <= 1 ? 0 : -slideStage * 24;

  if (isMobile) {
    return (
      <section
        aria-hidden={!active}
        data-collection-stage={stage}
        className={`absolute inset-0 z-40 overflow-y-auto overflow-x-hidden bg-[#e9f5fa] overscroll-contain transition-opacity duration-500 ${
          active ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: active ? "pan-x pan-y" : "none",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: 'url("/media/down.png")',
            transform: active ? "scale(1.006)" : "scale(1.025)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(244,250,251,0.28),rgba(244,250,251,0.08)_42%,rgba(244,250,251,0.22)_100%)]" />

        <div className="relative z-10 flex min-h-[220vh] flex-col px-5 pb-14 pt-28">
          <header className="mx-auto flex max-w-190 flex-col items-center text-center">
            <p
              className={`${collectionSerif.className} text-[clamp(2.4rem,16vw,4.7rem)] font-semibold uppercase leading-[0.9] text-[#241a16]/92`}
            >
              {copy.heading}
            </p>
            <p className="mt-3 max-w-190 -translate-y-0.5 text-[clamp(1rem,4.3vw,1.18rem)] font-medium leading-snug text-[#3e3029]/72">
              {copy.subheading}
            </p>
          </header>

          <div
            className="mt-11 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-5"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              touchAction: "pan-x pan-y",
            }}
          >
            {copy.slides.map((slide, index) => (
              <article
                key={`${slide.eyebrow}-mobile-${index}`}
                className="relative h-[62vh] min-h-[460px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-lg shadow-[0_22px_58px_rgba(38,30,24,0.18)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: 'url("/media/slide1.png")' }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,24,19,0.72),rgba(34,24,19,0.22)_54%,rgba(34,24,19,0.06)),linear-gradient(180deg,transparent_42%,rgba(242,138,39,0.72))]" />
                <div className="absolute bottom-6 left-5 max-w-[82%] text-left text-white">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.08em] opacity-80">
                    {slide.eyebrow}
                  </p>
                  <h2 className="text-[clamp(1.65rem,8vw,2.2rem)] font-black uppercase leading-[0.98]">
                    {slide.title}
                  </h2>
                  <p className="mt-4 text-sm font-medium leading-relaxed opacity-90">
                    {slide.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-auto flex min-h-[70vh] items-center justify-center px-2 py-16 text-center">
            <h2
              className={`${collectionSerif.className} text-[clamp(2.05rem,10vw,3.8rem)] font-semibold leading-[1.07] text-[#251b17] drop-shadow-[0_16px_48px_rgba(255,255,255,0.4)]`}
              style={{
                maxWidth: finalTextControls.maxWidth,
                transform: `translate3d(${finalTextControls.x}, ${finalTextControls.y}, 0)`,
              }}
            >
              {copy.finalText}
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-hidden={!active}
      data-collection-stage={stage}
      className={`absolute inset-0 z-40 overflow-hidden bg-[#e9f5fa] transition-opacity duration-500 ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-[background-position,transform] duration-820"
        style={{
          backgroundImage: 'url("/media/down.png")',
          backgroundPosition: `center ${imageShift}%`,
          transform: active ? "scale(1.006)" : "scale(1.025)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,250,251,0.34),rgba(244,250,251,0.12)_42%,rgba(244,250,251,0.28)_100%)]" />

      <div
        className="absolute inset-x-0 top-[12vh] z-30 flex flex-col items-center px-5 text-center transition-[transform,opacity,filter] duration-620"
        style={{
          transform:
            stage <= 1 ? "translate3d(0,0,0)" : "translate3d(0,-1.2vh,0) scale(0.94)",
          opacity: headingVisible ? 1 : 0,
          filter: headingVisible ? "blur(0px)" : "blur(10px)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <p
          className={`${collectionSerif.className} text-[clamp(2.45rem,7.2vw,6rem)] font-semibold uppercase leading-[0.9] text-[#241a16]/92`}
        >
          {copy.heading}
        </p>
        <p className="mt-3 max-w-190 -translate-y-0.5 text-[clamp(1rem,1.8vw,1.36rem)] font-medium text-[#3e3029]/72">
          {copy.subheading}
        </p>
      </div>

      <div
        className="absolute bottom-[4vh] left-0 z-20 flex gap-[clamp(1rem,2vw,2rem)] px-[clamp(1rem,5vw,4.5rem)] transition-[transform,opacity,filter] duration-620"
        style={{
          transform: `translate3d(${carouselShift}vw, ${outroVisible ? "12vh" : "0"}, 0)`,
          opacity: outroVisible ? 0 : 1,
          filter: outroVisible ? "blur(12px)" : "blur(0px)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {copy.slides.map((slide, index) => {
          const focused = stage >= 2 && index === slideStage;

          return (
            <article
              key={`${slide.eyebrow}-${index}`}
              className="relative h-[min(62vh,620px)] w-[min(72vw,440px)] shrink-0 overflow-hidden rounded-lg shadow-[0_28px_80px_rgba(38,30,24,0.2)] transition-[transform,opacity,filter] duration-520"
              style={{
                transform: focused ? "translateY(-4vh) scale(1.035)" : "translateY(0) scale(1)",
                opacity: stage <= 1 || focused ? 1 : 0.58,
                filter: focused || stage <= 1 ? "blur(0px)" : "blur(1.2px)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("/media/slide1.png")' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,24,19,0.74),rgba(34,24,19,0.28)_44%,rgba(34,24,19,0.08)),linear-gradient(180deg,transparent_45%,rgba(242,138,39,0.72))]" />
              <div className="absolute bottom-7 left-6 max-w-[78%] text-left text-white">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] opacity-80">
                  {slide.eyebrow}
                </p>
                <h2 className="text-[clamp(1.55rem,3vw,2.45rem)] font-black uppercase leading-[0.98]">
                  {slide.title}
                </h2>
                <p className="mt-4 text-sm font-medium leading-relaxed opacity-90">
                  {slide.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div
        className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-center px-6 text-center transition-[opacity,transform,filter] duration-760"
        style={{
          opacity: outroVisible ? 1 : 0,
          transform: outroVisible
            ? `translate3d(${finalTextControls.x}, calc(-50% + ${finalTextControls.y}), 0)`
            : `translate3d(${finalTextControls.x}, calc(-38% + ${finalTextControls.y}), 0)`,
          filter: outroVisible ? "blur(0px)" : "blur(16px)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <h2
          className={`${collectionSerif.className} max-w-235 text-center text-[clamp(2.05rem,4.7vw,4.45rem)] font-semibold leading-[1.05] text-[#251b17] drop-shadow-[0_16px_50px_rgba(255,255,255,0.45)]`}
          style={{ maxWidth: finalTextControls.maxWidth }}
        >
          {copy.finalText}
        </h2>
      </div>
    </section>
  );
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}

function SofinPreloader({
  visible,
  progress,
  label
}: {
  visible: boolean;
  progress: number;
  label: string;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-90 flex items-center justify-center overflow-hidden transition-[opacity,filter] duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0 blur-sm"
      }`}
    >
      <div
        className="absolute inset-0 scale-[1.04] bg-cover bg-center"
        style={{
          backgroundImage: 'url("/backgrounds/main-background.png")',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.52),rgba(255,244,230,0.68)_42%,rgba(246,226,210,0.86)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[3px]" />

      <div className="relative flex w-[min(82vw,360px)] flex-col items-center">
        <div className="sofin-loader-orbit relative flex h-40 w-40 items-center justify-center rounded-4xl border border-white/62 bg-[linear-gradient(145deg,rgba(255,255,255,0.58),rgba(255,246,236,0.24))] shadow-[0_28px_90px_rgba(78,49,31,0.18)] backdrop-blur-2xl sm:h-48 sm:w-48">
          <div className="absolute inset-[-18%] rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(255,255,255,0.72),transparent_42%,rgba(198,145,92,0.2),transparent_72%)] opacity-80 blur-xl" />
          <div
            className="sofin-loader-logo relative h-[74%] w-[74%] bg-contain bg-center bg-no-repeat opacity-95 drop-shadow-[0_18px_30px_rgba(54,36,25,0.22)]"
            style={{
              backgroundImage: 'url("/media/logotip.png")',
            }}
          />
        </div>

        <div className="mt-7 h-px w-full overflow-hidden rounded-full bg-white/52">
          <div
            className="h-full rounded-full bg-[#3b2d26] transition-[width] duration-300"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <p className="mt-4 text-center text-[11px] font-semibold uppercase text-[#5e4d42]/70">
          {label}
        </p>
      </div>
    </div>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function preloadFetch(src: string) {
  return fetch(src, { cache: "force-cache" }).then((response) => {
    if (!response.ok) throw new Error(`Failed to preload ${src}`);
    return response.arrayBuffer();
  });
}

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => {
      const decode = image.decode?.();

      if (!decode) {
        resolve();
        return;
      }

      decode.then(resolve).catch(resolve);
    };
    image.onerror = () => reject(new Error(`Failed to preload ${src}`));
    image.src = src;
  });
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutSoft(t: number) {
  return t * t * (3 - 2 * t);
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function getCurrentBackgroundProgress(
  step: ShowcaseStep,
  progress: Record<ProgressKey, number>
) {
  if (step === 0) return 1;

  return progress[`step${step}` as ProgressKey] ?? 1;
}

function getSlideBackgroundPresence(
  layerSteps: readonly ShowcaseStep[],
  progress: {
    step: ShowcaseStep;
    progress: number;
  }
) {
  if (progress.step === 0) return layerSteps.includes(0) ? 1 : 0;

  const previousStep = (progress.step - 1) as ShowcaseStep;
  const belongsToCurrent = layerSteps.includes(progress.step);
  const belongsToPrevious = layerSteps.includes(previousStep);

  if (belongsToCurrent && belongsToPrevious) return 1;
  if (belongsToCurrent) return progress.progress;
  if (belongsToPrevious) return 1 - progress.progress;

  return 0;
}

function getResponsiveBackgroundSrc(src: string, isMobile: boolean) {
  if (!isMobile) return src;

  return src.replace(/(\.[a-z]+)$/i, "-m$1");
}

function hexToRgb(hex: string) {
  const value = parseInt(hex.replace("#", ""), 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (value: number) => Math.round(value).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(a: string, b: string, t: number) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);

  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
}

function rgbaFromHex(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildBackground(
  palette: Palette,
  progress: {
    step: number;
    step1Progress: number;
    step2Progress: number;
    step3Progress: number;
    step4Progress: number;
    step5Progress: number;
    step6Progress: number;
    step7Progress: number;
    step8Progress: number;
    step9Progress: number;
  }
) {
  const scenePulse =
    progress.step === 0
      ? 0
      : progress.step === 1
        ? progress.step1Progress
        : progress.step === 2
          ? progress.step2Progress
          : progress.step === 3
            ? progress.step3Progress
            : progress.step === 4
              ? progress.step4Progress
              : progress.step === 5
                ? progress.step5Progress
                : progress.step === 6
                  ? progress.step6Progress
                  : progress.step === 7
                    ? progress.step7Progress
                    : progress.step === 8
                      ? progress.step8Progress
                      : progress.step9Progress;

  const pulse = easeInOutSoft(scenePulse);

  const glow1Alpha = 0.48 + pulse * 0.16;
  const glow2Alpha = 0.36 + pulse * 0.12;
  const glow3Alpha = 0.28 + pulse * 0.1;

  return `
    radial-gradient(circle at 50% 34%, ${rgbaFromHex(palette.glow1, glow1Alpha)}, transparent 34%),
    radial-gradient(circle at 22% 76%, ${rgbaFromHex(palette.glow2, glow2Alpha)}, transparent 38%),
    radial-gradient(circle at 80% 22%, ${rgbaFromHex(palette.glow3, glow3Alpha)}, transparent 30%),
    radial-gradient(circle at 50% 58%, ${rgbaFromHex(palette.milk, 0.08 + pulse * 0.06)}, transparent 44%),
    linear-gradient(180deg, ${rgbaFromHex(palette.base, 0.98)}, ${rgbaFromHex(palette.base, 0.92)})
  `;
}
