"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ArrowRight, Leaf} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {useLocale} from "next-intl";

import {getHeroScenes, type HeroScene} from "@/data/home/hero-scenes";
import {assetUrl} from "@/lib/assets";
import {cn} from "@/lib/utils";
import HeroSnapController from "./hero-snap-controller";

const MAIN_HERO_BACKGROUND = {
  desktop: "/images/main-hero-4k.png",
  mobile: "/images/main-hero-m-4k.png"
};

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function HeroStory() {
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeScene, setActiveScene] = useState(0);
  const reducedMotion = useReducedMotionPreference();
  const locale = useLocale();
  const heroScenes = useMemo(() => getHeroScenes(locale), [locale]);

  const backgroundByScene = useMemo(
    () => [
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND,
      MAIN_HERO_BACKGROUND
    ],
    []
  );

  useEffect(() => {
    const nodes = sceneRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const index = Number(
          (visible.target as HTMLElement).dataset.sceneIndex ?? 0
        );

        setActiveScene(index);
      },
      {
        threshold: [0.42, 0.58, 0.72]
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  const snapToScene = (index: number) => {
    const node = sceneRefs.current[index];
    if (!node) return;

    node.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const currentBg = backgroundByScene[activeScene] ?? backgroundByScene[0];
  const currentBgDesktop = assetUrl(currentBg.desktop);
  const currentBgMobile = assetUrl(currentBg.mobile ?? currentBg.desktop);

  return (
    <section id="hero-story-root" className="relative bg-[#07192d]">
      <HeroSnapController
        rootId="hero-story-root"
        selector="[data-scene-index]"
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07192d]">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${currentBgDesktop}-${currentBgMobile}`}
            initial={{opacity: 0.18, scale: 1.02}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 1.01}}
            transition={{
              duration: reducedMotion ? 0 : 0.72,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <Image
                src={currentBgDesktop}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="hidden object-cover sm:block"
              />
              <Image
                src={currentBgMobile}
                alt=""
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover sm:hidden"
              />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.42)_0%,rgba(245,250,255,0.22)_34%,rgba(245,250,255,0)_66%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(237,246,255,0.06)_0%,rgba(237,246,255,0)_54%,rgba(230,240,250,0.14)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_34%,rgba(255,255,255,0.68),transparent_42%),linear-gradient(180deg,rgba(255,250,235,0.18),rgba(255,250,235,0.50)_72%,rgba(255,250,235,0.72))] sm:hidden" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={cn(
          "pointer-events-none fixed left-4 top-1/2 z-30 -translate-y-1/2",
          activeScene === 0 ? "hidden" : "hidden lg:flex"
        )}
      >
        <div className="rounded-full border border-[#315b89]/18 bg-white/38 px-2.5 py-3 shadow-[0_14px_38px_rgba(25,68,112,0.10)] backdrop-blur-2xl">
          <div className="flex flex-col gap-2.5">
            {heroScenes.map((scene: HeroScene, index: number) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => snapToScene(index)}
                className="pointer-events-auto flex items-center justify-center"
                aria-label={`Go to scene ${index + 1}`}
              >
                <span
                  className={cn(
                    "block h-2.5 w-2.5 rounded-full border transition-all duration-400",
                    activeScene === index
                      ? "scale-110 border-[var(--brand-primary)] bg-[var(--brand-primary)] shadow-[0_0_12px_rgba(0,58,117,0.28)]"
                      : "border-[#315b89]/45 bg-white/24 hover:bg-[#315b89]/18"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 h-[500dvh]">
        {heroScenes.map((scene: HeroScene, index: number) => {
          const isActive = index === activeScene;

          return (
            <div
              key={scene.id}
              ref={(node) => {
                sceneRefs.current[index] = node;
              }}
              data-scene-index={index}
              className={cn(
                "relative flex h-[100dvh] items-center"
              )}
            >
              <div
                className={cn(
                  index === 0
                    ? "mx-auto flex w-full max-w-[1672px] items-stretch px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-24 sm:items-center sm:px-10 sm:pb-12 sm:pt-36 lg:px-14"
                    : "mx-auto grid w-full max-w-[1380px] items-center gap-8 px-4 pb-[max(1.3rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-14 sm:pt-36 lg:px-12 xl:gap-12",
                  index === 2
                    ? "lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.72fr)]"
                    : "lg:grid-cols-1"
                )}
              >
                <AnimatePresence mode="wait">
                  {isActive ? (
                    index === 0 ? (
                      <HeroMainScene scene={scene} reducedMotion={reducedMotion} />
                    ) : (
                    <motion.div
                      key={`content-${scene.id}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: reducedMotion ? 0 : 0.12,
                            delayChildren: reducedMotion ? 0 : 0.04
                          }
                        },
                        exit: {
                          transition: {
                            staggerChildren: 0.03,
                            staggerDirection: -1
                          }
                        }
                      }}
                      className={cn(
                        "max-w-[1080px] max-sm:rounded-[28px] max-sm:border max-sm:border-white/58 max-sm:bg-white/48 max-sm:p-4 max-sm:shadow-[0_22px_64px_rgba(25,68,112,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] max-sm:backdrop-blur-[18px]",
                        index === 2 && "lg:max-w-[920px]"
                      )}
                    >
                      {scene.eyebrow ? (
                        <motion.div
                          variants={{
                            hidden: {opacity: 0, y: 14, filter: "blur(8px)"},
                            visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                            exit: {opacity: 0, y: -10}
                          }}
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="mb-3 inline-flex rounded-full border border-[#315b89]/18 bg-white/56 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)] shadow-[0_12px_34px_rgba(25,68,112,0.08)] backdrop-blur-2xl sm:mb-4 sm:px-4 sm:text-[10px] sm:tracking-[0.32em]"
                        >
                          {scene.eyebrow}
                        </motion.div>
                      ) : null}

                      <motion.h1
                        variants={{
                          hidden: {opacity: 0, y: 26, scale: 0.982, filter: "blur(14px)"},
                          visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                          exit: {opacity: 0, y: -16, scale: 0.992}
                        }}
                        transition={{
                          duration: 0.86,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className={cn(
                          "max-w-[1080px] text-balance font-semibold leading-[1.06] tracking-[-0.045em] text-[var(--brand-primary)]",
                          index === 2
                            ? "max-w-[860px] leading-[1.08] text-[clamp(1.75rem,7.4vw,2.28rem)] sm:text-[clamp(2.55rem,5.7vw,3.45rem)] lg:text-[clamp(2.7rem,3vw,3.22rem)]"
                            : "text-[clamp(1.95rem,8.2vw,2.55rem)] sm:text-[clamp(2.8rem,5vw,3.7rem)] lg:text-[clamp(3rem,3.35vw,3.65rem)]"
                        )}
                      >
                        {scene.title}
                      </motion.h1>

                      {scene.subtitle ? (
                        <motion.p
                          variants={{
                            hidden: {opacity: 0, y: 22, scale: 0.992, filter: "blur(10px)"},
                            visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                            exit: {opacity: 0, y: -10}
                          }}
                          transition={{
                            duration: 0.74,
                            delay: reducedMotion ? 0 : 0.04,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="mt-3 max-w-[540px] text-base font-medium text-[#244d7c] sm:mt-4 sm:text-2xl lg:text-[1.85rem]"
                        >
                          {scene.subtitle}
                        </motion.p>
                      ) : null}

                      {index !== 2 ? (
                        <motion.div
                          variants={{
                            hidden: {opacity: 0, y: 28, scale: 0.986, filter: "blur(12px)"},
                            visible: {opacity: 1, y: 0, filter: "blur(0px)"},
                            exit: {opacity: 0, y: -12}
                          }}
                          transition={{
                            duration: 0.82,
                            delay: reducedMotion ? 0 : 0.08,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          className="mt-4 max-w-[600px] rounded-[22px] border border-white/60 bg-white/54 p-4 shadow-[0_22px_70px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-[24px] sm:mt-7 sm:rounded-[28px] sm:bg-white/44 sm:p-6"
                        >
                          <p className="text-pretty text-[13px] leading-6 text-[#244d7c] sm:text-[15px] sm:leading-7 lg:text-base lg:leading-8">
                            {scene.description}
                          </p>

                          {scene.cta ? (
                            <div className="mt-5">
                              <Link
                                href={scene.cta.href}
                                className="group inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_14px_34px_rgba(0,58,117,0.18)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                              >
                                {scene.cta.label}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </Link>
                            </div>
                          ) : null}
                        </motion.div>
                      ) : null}
                    </motion.div>
                    )
                  ) : null}
                </AnimatePresence>

                {index === 2 ? (
                  <div className="relative hidden lg:block">
                    <AnimatePresence mode="wait">
                      {isActive ? (
                      <motion.div
                        key={`visual-${scene.id}`}
                        initial={{
                          opacity: 0,
                          x: 30,
                          scale: 0.98,
                          filter: "blur(14px)"
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          filter: "blur(0px)"
                        }}
                        exit={{
                          opacity: 0,
                          x: 18,
                          scale: 0.98,
                          filter: "blur(12px)"
                        }}
                        transition={{
                          duration: 0.72,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        className="ml-auto w-full max-w-[520px]"
                      >
                        <YogurtsPreviewCard />
                      </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-16 bg-[linear-gradient(180deg,rgba(237,246,255,0),rgba(237,246,255,0.16))]" />
    </section>
  );
}

function HeroMainScene({
  scene,
  reducedMotion
}: {
  scene: HeroScene;
  reducedMotion: boolean;
}) {
  const item = {
    hidden: {opacity: 0, y: 22, filter: "blur(10px)"},
    visible: {opacity: 1, y: 0, filter: "blur(0px)"},
    exit: {opacity: 0, y: -12, filter: "blur(8px)"}
  };

  return (
    <motion.div
      key={`content-${scene.id}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.11,
            delayChildren: reducedMotion ? 0 : 0.03
          }
        },
        exit: {
          transition: {
            staggerChildren: 0.03,
            staggerDirection: -1
          }
        }
      }}
      className="flex w-full max-w-[555px] flex-col text-[var(--brand-primary)] max-sm:min-h-[calc(100dvh-8rem)]"
    >
      <motion.h1
        variants={{
          hidden: {opacity: 0, y: 26, scale: 0.985, filter: "blur(12px)"},
          visible: {opacity: 1, y: 0, scale: 1, filter: "blur(0px)"},
          exit: {opacity: 0, y: -14, scale: 0.992, filter: "blur(8px)"}
        }}
        transition={{duration: 0.82, ease: [0.22, 1, 0.36, 1]}}
        className="w-fit rounded-[24px] border border-white/58 bg-white/54 px-3 py-2 text-[clamp(2.85rem,13vw,3.55rem)] font-semibold leading-[0.92] tracking-[-0.07em] shadow-[0_18px_52px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-[16px] sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[clamp(5.5rem,9vw,8.5rem)] sm:tracking-[-0.075em] sm:shadow-none sm:backdrop-blur-0 lg:text-[clamp(6.2rem,7.4vw,8.8rem)]"
      >
        {scene.title}
      </motion.h1>

      {scene.subtitle ? (
        <motion.p
          variants={item}
          transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
          className="mt-2 w-fit rounded-2xl border border-white/52 bg-white/48 px-3 py-2 text-[clamp(1.05rem,5vw,1.36rem)] font-medium leading-tight tracking-[-0.035em] shadow-[0_12px_34px_rgba(25,68,112,0.10)] backdrop-blur-[14px] sm:mt-8 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[clamp(2rem,3vw,2.85rem)] sm:tracking-[-0.045em] sm:shadow-none sm:backdrop-blur-0"
        >
          {scene.subtitle}
        </motion.p>
      ) : null}

      <motion.div
        variants={item}
        transition={{duration: 0.64, ease: [0.22, 1, 0.36, 1]}}
        className="mt-3 flex max-w-[220px] items-center gap-3 text-[#59799b] sm:mt-8 sm:max-w-[450px] sm:gap-4"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-[#9eb1c8]/62" />
        <Leaf className="h-7 w-7" strokeWidth={1.9} />
        <span className="h-px flex-1 bg-[#9eb1c8]/62" />
      </motion.div>

      <motion.div
        variants={item}
        transition={{duration: 0.72, ease: [0.22, 1, 0.36, 1]}}
        className="mt-auto flex max-w-[535px] items-center gap-3 rounded-[22px] border border-white/60 bg-white/58 p-3 text-[#244d7c] shadow-[0_22px_70px_rgba(25,68,112,0.12),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-[18px] sm:mt-7 sm:gap-6 sm:rounded-[30px] sm:bg-white/38 sm:p-6"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#315b89]/30 bg-white/38 text-[#315b89] sm:h-[74px] sm:w-[74px] sm:border-[#315b89]/36 sm:bg-white/26">
          <Leaf className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={1.8} />
        </span>
        <p className="text-pretty text-[13px] font-medium leading-6 sm:text-[16px] sm:leading-8">
          {scene.description}
        </p>
      </motion.div>

      {scene.cta ? (
        <motion.div
          variants={item}
          transition={{duration: 0.68, ease: [0.22, 1, 0.36, 1]}}
          className="mt-4 sm:mt-8"
        >
          <Link
            href={scene.cta.href}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white shadow-[0_18px_46px_rgba(0,58,117,0.22)] transition hover:bg-[#0a4a89] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 sm:min-h-[60px] sm:gap-4 sm:px-9 sm:text-base"
          >
            {scene.cta.label}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function YogurtsPreviewCard() {
  return (
    <Link
      href="/yogurts"
      className="group relative block min-h-[420px] overflow-hidden rounded-[32px] border border-white/58 bg-white/40 p-5 shadow-[0_24px_70px_rgba(25,68,112,0.14)] outline-none transition duration-500 hover:-translate-y-1 hover:bg-white/52 focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.46),transparent_28%),radial-gradient(circle_at_78%_78%,rgba(89,121,155,0.12),transparent_32%)]" />
      <div className="relative h-[380px] overflow-hidden rounded-[26px] border border-white/56 bg-white/28">
        <Image
          src={assetUrl("/backgrounds/main-background.webp")}
          alt=""
          fill
          sizes="520px"
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(245,250,255,0.16)_50%,rgba(245,250,255,0.72)_100%)]" />
      </div>

      <div className="absolute left-8 top-8 rounded-full border border-[#315b89]/18 bg-white/58 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)] backdrop-blur-md">
        SOFIN / Yogurts
      </div>

      <div className="absolute bottom-8 left-8 right-8 rounded-[22px] border border-white/54 bg-white/58 p-4 text-[var(--brand-primary)] backdrop-blur-md">
        <div className="text-sm font-medium uppercase tracking-[0.28em] text-[#59799b]">
          Коллекция
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Перейти к странице йогуртов
        </div>
      </div>
    </Link>
  );
}
