"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {useLocale} from "next-intl";

import {getHeroScenes, type HeroScene} from "@/data/home/hero-scenes";
import {assetUrl} from "@/lib/assets";
import {cn} from "@/lib/utils";
import HeroSnapController from "./hero-snap-controller";

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
      "/images/hero/main-hero.webp",
      "/images/hero/main-hero.webp",
      "/images/hero/main-hero.webp",
      "/images/hero/hero-second.webp",
      "/images/hero/hero-second.webp"
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

  const currentBg = assetUrl(backgroundByScene[activeScene]);

  return (
    <section id="hero-story-root" className="relative bg-[#07192d]">
      <HeroSnapController
        rootId="hero-story-root"
        selector="[data-scene-index]"
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07192d]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBg}
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
                src={currentBg}
                alt=""
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_34%),linear-gradient(180deg,rgba(7,20,36,0.20)_0%,rgba(8,24,44,0.48)_50%,rgba(6,18,33,0.72)_100%)]" />
            <div className="absolute inset-0 bg-[#07192d]/18" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:flex">
        <div className="rounded-full border border-white/18 bg-white/8 px-2.5 py-3 backdrop-blur-2xl">
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
                      ? "scale-110 border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.55)]"
                      : "border-white/45 bg-white/12 hover:bg-white/24"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 h-[500svh]">
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
                "relative flex h-[100svh] items-center"
              )}
            >
              <div
                className={cn(
                  "mx-auto grid w-full max-w-[1380px] items-center gap-8 px-5 pb-14 pt-32 sm:px-8 sm:pt-36 lg:px-12 xl:gap-12",
                  index === 2
                    ? "lg:grid-cols-[minmax(0,0.86fr)_minmax(360px,0.72fr)]"
                    : "lg:grid-cols-1"
                )}
              >
                <AnimatePresence mode="wait">
                  {isActive ? (
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
                      className={cn("max-w-[1080px]", index === 2 && "lg:max-w-[920px]")}
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
                          className="mb-4 inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/82 backdrop-blur-2xl"
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
                          "max-w-[1080px] text-balance font-semibold leading-[1.06] tracking-[-0.045em] text-white",
                          index === 2
                            ? "max-w-[860px] leading-[1.06] text-[clamp(2rem,8.8vw,2.85rem)] sm:text-[clamp(2.55rem,5.7vw,3.45rem)] lg:text-[clamp(2.7rem,3vw,3.22rem)]"
                            : "text-[clamp(2.35rem,8.4vw,3.05rem)] sm:text-[clamp(2.8rem,5vw,3.7rem)] lg:text-[clamp(3rem,3.35vw,3.65rem)]"
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
                          className="mt-4 max-w-[540px] text-xl font-medium text-white/90 sm:text-2xl lg:text-[1.85rem]"
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
                          className="mt-7 max-w-[600px] rounded-[28px] border border-white/16 bg-white/8 p-5 shadow-[0_24px_70px_rgba(4,19,36,0.18)] backdrop-blur-[24px] sm:p-6"
                        >
                          <p className="text-pretty text-sm leading-7 text-white/80 sm:text-[15px] lg:text-base lg:leading-8">
                            {scene.description}
                          </p>

                          {scene.cta ? (
                            <div className="mt-5">
                              <Link
                                href={scene.cta.href}
                                className="group inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                              >
                                {scene.cta.label}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </Link>
                            </div>
                          ) : null}
                        </motion.div>
                      ) : null}
                    </motion.div>
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

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-16 bg-[linear-gradient(180deg,rgba(7,25,45,0),rgba(7,25,45,0.14))]" />
    </section>
  );
}

function YogurtsPreviewCard() {
  return (
    <Link
      href="/yogurts"
      className="group relative block min-h-[420px] overflow-hidden rounded-[32px] border border-white/22 bg-[linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.08))] p-5 shadow-[0_26px_80px_rgba(4,19,36,0.22)] outline-none transition duration-500 hover:-translate-y-1 hover:bg-white/18 focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.34),transparent_28%),radial-gradient(circle_at_78%_78%,rgba(255,220,184,0.18),transparent_32%)]" />
      <div className="relative h-[380px] overflow-hidden rounded-[26px] border border-white/22 bg-white/18">
        <Image
          src={assetUrl("/backgrounds/main-background.webp")}
          alt=""
          fill
          sizes="520px"
          className="object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(5,18,34,0.12)_50%,rgba(5,18,34,0.58)_100%)]" />
      </div>

      <div className="absolute left-8 top-8 rounded-full border border-white/18 bg-white/18 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-white/86 backdrop-blur-md">
        SOFIN / Yogurts
      </div>

      <div className="absolute bottom-8 left-8 right-8 rounded-[22px] border border-white/18 bg-white/14 p-4 text-white backdrop-blur-md">
        <div className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
          Коллекция
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Перейти к странице йогуртов
        </div>
      </div>
    </Link>
  );
}
