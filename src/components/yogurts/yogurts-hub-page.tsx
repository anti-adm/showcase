"use client";

import {useCallback, useEffect, useState} from "react";
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

export function YogurtsHubPage() {
  const locale = normalizeLocale(useLocale());
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<ShowcaseMode>("cups");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("showcase") === "bottles" ? "bottles" : "cups");
  }, []);

  const selectMode = useCallback((nextMode: ShowcaseMode) => {
    setMode(nextMode);

    const nextHref = nextMode === "bottles" ? `${pathname}?showcase=bottles` : pathname;
    router.replace(nextHref, {scroll: false});
  }, [pathname, router]);

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
    </div>
  );
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}
