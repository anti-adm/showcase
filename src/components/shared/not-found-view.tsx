"use client";

import {motion} from "framer-motion";
import Link from "next/link";
import {assetUrl} from "@/lib/assets";

type Locale = "uz" | "ru" | "en";

type NotFoundViewProps = {
  locale?: string;
};

const copy: Record<Locale, {title: string; text: string; button: string}> = {
  ru: {
    title: "Ой, кажется мы попали куда-то не туда.",
    text: "Такой страницы не существует.",
    button: "Вернуться на главную страницу"
  },
  uz: {
    title: "Voy, shekilli biz noto‘g‘ri joyga tushib qoldik.",
    text: "Bunday sahifa mavjud emas.",
    button: "Bosh sahifaga qaytish"
  },
  en: {
    title: "Oops, it looks like we wandered somewhere else.",
    text: "This page does not exist.",
    button: "Return to the home page"
  }
};

function normalizeLocale(locale?: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}

export function NotFoundView({locale}: NotFoundViewProps) {
  const activeLocale = normalizeLocale(locale);
  const content = copy[activeLocale];
  const homeHref = `/${activeLocale}`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-28 text-center">
      <div
        className="absolute inset-0 scale-[1.04] bg-cover bg-center"
        style={{backgroundImage: `url("${assetUrl("/backgrounds/main-background.webp")}")`}}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.52),rgba(255,244,230,0.68)_42%,rgba(246,226,210,0.88)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[3px]" />

      <motion.section
        initial={{opacity: 0, y: 24, scale: 0.97, filter: "blur(14px)"}}
        animate={{opacity: 1, y: 0, scale: 1, filter: "blur(0px)"}}
        transition={{duration: 0.82, ease: [0.16, 1, 0.3, 1]}}
        className="liquid-glass-shell relative z-10 flex w-full max-w-[720px] flex-col items-center px-6 py-10 sm:px-10 sm:py-12"
      >
        <div className="liquid-glass-noise" />

        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/62 bg-white/36 shadow-[0_24px_70px_rgba(78,49,31,0.16)] backdrop-blur-2xl sm:h-28 sm:w-28">
          <motion.div
            aria-hidden="true"
            className="absolute inset-[-18%] rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(255,255,255,0.86),transparent_42%,rgba(198,145,92,0.28),transparent_72%)] blur-lg"
            animate={{rotate: 360}}
            transition={{duration: 5.2, ease: "linear", repeat: Infinity}}
          />
          <div
            className="relative h-[68%] w-[68%] bg-contain bg-center bg-no-repeat drop-shadow-[0_14px_24px_rgba(54,36,25,0.22)]"
            style={{backgroundImage: `url("${assetUrl("/media/logotip.webp")}")`}}
          />
        </div>

        <motion.p
          initial={{opacity: 0, y: 14}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.62, delay: 0.16, ease: [0.22, 1, 0.36, 1]}}
          className="relative z-10 mt-8 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7c6557]/86"
        >
          404 / SOFIN
        </motion.p>

        <motion.h1
          initial={{opacity: 0, y: 18, filter: "blur(8px)"}}
          animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
          transition={{duration: 0.72, delay: 0.24, ease: [0.22, 1, 0.36, 1]}}
          className="relative z-10 mt-4 max-w-[620px] text-balance font-display text-[clamp(2.2rem,6vw,4.6rem)] font-semibold leading-[0.98] text-[#2f241f] drop-shadow-[0_10px_26px_rgba(255,255,255,0.28)]"
        >
          {content.title}
        </motion.h1>

        <motion.p
          initial={{opacity: 0, y: 14}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.56, delay: 0.36, ease: [0.22, 1, 0.36, 1]}}
          className="relative z-10 mt-5 text-base font-medium text-[#5e4d42]/90 sm:text-lg"
        >
          {content.text}
        </motion.p>

        <motion.div
          initial={{opacity: 0, y: 14}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.56, delay: 0.46, ease: [0.22, 1, 0.36, 1]}}
          className="relative z-10 mt-8"
        >
          <Link
            href={homeHref}
            className="focus-ring inline-flex rounded-full border border-[#2f241f]/12 bg-[#2f241f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_18px_42px_rgba(47,36,31,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3a2c24]"
          >
            {content.button}
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
