"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useLocale} from "next-intl";
import {usePathname, useRouter} from "next/navigation";
import {BottleShowcasePage} from "@/components/yogurts/bottle-showcase-page";
import {YogurtsShowcasePage} from "@/components/yogurts/yogurts-showcase-page";
import {cn} from "@/lib/utils";

type Locale = "uz" | "ru" | "en";
type ShowcaseMode = "cups" | "bottles";

const HUB_COPY: Record<Locale, Record<ShowcaseMode, string>> = {
  uz: {
    cups: "Stakan yogurtlar",
    bottles: "Yogurtchalar"
  },
  ru: {
    cups: "Стаканчики",
    bottles: "Бутылочки"
  },
  en: {
    cups: "Yogurt cups",
    bottles: "Yogurt bottles"
  }
};

const HUB_INTRO_COPY: Record<Locale, {title: string; subtitle: string}> = {
  uz: {
    title: "Yangi yogurtchalar",
    subtitle: "Ichishga qulay format, yangi ta'mlar va silliq 3D sahna."
  },
  ru: {
    title: "Новые йогуртчалар",
    subtitle: "Питьевой формат, новые вкусы и плавная 3D-сцена."
  },
  en: {
    title: "New yogurtchalar",
    subtitle: "A drinkable format, new flavors and a smooth 3D scene."
  }
};

export function YogurtsHubPage() {
  const locale = normalizeLocale(useLocale());
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<ShowcaseMode>("cups");
  const [introVisible, setIntroVisible] = useState(false);
  const introTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("showcase") === "bottles" ? "bottles" : "cups");
  }, []);

  useEffect(() => () => {
    if (introTimerRef.current) {
      window.clearTimeout(introTimerRef.current);
    }
  }, []);

  const selectMode = useCallback((nextMode: ShowcaseMode) => {
    const changed = nextMode !== mode;

    setMode(nextMode);

    const nextHref = nextMode === "bottles" ? `${pathname}?showcase=bottles` : pathname;
    router.replace(nextHref, {scroll: false});

    if (changed && nextMode === "bottles") {
      setIntroVisible(true);

      if (introTimerRef.current) {
        window.clearTimeout(introTimerRef.current);
      }

      introTimerRef.current = window.setTimeout(() => {
        setIntroVisible(false);
        introTimerRef.current = null;
      }, 1450);
    }
  }, [mode, pathname, router]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f5eadb]">
      <div className="fixed left-1/2 top-[5.9rem] z-[48] -translate-x-1/2 px-3 sm:top-[6.8rem]">
        <div className="flex rounded-full border border-white/45 bg-white/24 p-1 shadow-[0_18px_50px_rgba(18,34,58,0.18)] backdrop-blur-xl">
          {(["cups", "bottles"] as const).map((item) => {
            const active = mode === item;

            return (
              <button
                key={item}
                aria-pressed={active}
                className={cn(
                  "relative min-h-10 rounded-full px-4 text-sm font-semibold transition duration-300 sm:min-w-36 sm:px-6",
                  active
                    ? "bg-white/78 text-[#123661] shadow-[inset_0_1px_0_rgba(255,255,255,0.74),0_10px_24px_rgba(23,50,84,0.16)]"
                    : "text-[#173657]/72 hover:bg-white/30 hover:text-[#123661]"
                )}
                type="button"
                onClick={() => selectMode(item)}
              >
                {HUB_COPY[locale][item]}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "cups" ? <YogurtsShowcasePage /> : <BottleShowcasePage />}

      <AnimatePresence>
        {introVisible ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.24),transparent_36%),linear-gradient(180deg,rgba(15,42,76,0.78),rgba(12,28,48,0.88))] px-6 text-center text-white backdrop-blur-md"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.36, ease: [0.22, 1, 0.36, 1]}}
          >
            <motion.div
              initial={{opacity: 0, y: 24, scale: 0.98, filter: "blur(12px)"}}
              animate={{opacity: 1, y: 0, scale: 1, filter: "blur(0px)"}}
              exit={{opacity: 0, y: -14, scale: 0.99, filter: "blur(10px)"}}
              transition={{duration: 0.72, ease: [0.16, 1, 0.3, 1]}}
              className="max-w-[780px]"
            >
              <div className="mx-auto mb-5 h-px w-32 bg-white/42" />
              <h2 className="text-balance text-[clamp(2.6rem,8vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                {HUB_INTRO_COPY[locale].title}
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-pretty text-base font-medium leading-7 text-white/78 sm:text-xl sm:leading-8">
                {HUB_INTRO_COPY[locale].subtitle}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}
