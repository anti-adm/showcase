'use client';

import {AnimatePresence, motion} from 'framer-motion';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import {assetUrl} from '@/lib/assets';

const PRELOAD_ASSETS = [
  '/images/hero/main-hero.png',
  '/images/hero/hero-second.png',
  '/images/hero/hero-products.webp',
  '/images/products.webp',
  '/images/brand/pack-line.webp',
  '/logo/sofin-logo.webp'
];

export function Preloader({disabled = false}: {disabled?: boolean}) {
  const [visible, setVisible] = useState(!disabled);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (disabled) {
      return;
    }

    let cancelled = false;
    let completed = 0;

    const markDone = () => {
      completed += 1;
      if (!cancelled) setProgress(Math.min(1, completed / PRELOAD_ASSETS.length));
    };

    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = assetUrl(src);
      }).finally(markDone);

    const minIntro = new Promise<void>((resolve) => window.setTimeout(resolve, 1150));

    Promise.allSettled([...PRELOAD_ASSETS.map(loadImage), minIntro]).then(() => {
      if (cancelled) return;
      setProgress(1);
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 320);
    });

    return () => {
      cancelled = true;
    };
  }, [disabled]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{opacity: 1}}
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#f7efe3]"
          exit={{opacity: 0, filter: 'blur(10px)', transition: {duration: 0.7, ease: [0.22, 1, 0.36, 1]}}}
          initial={{opacity: 1}}
        >
          <div className="absolute inset-0">
            <Image
              src={assetUrl("/images/hero/main-hero.png")}
              alt=""
              fill
              priority
              unoptimized
              quality={100}
              sizes="100vw"
              className="object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.38),transparent_34%),linear-gradient(180deg,rgba(250,244,235,0.42),rgba(226,237,249,0.54))]" />
          </div>

          <motion.div
            animate={{opacity: 1, scale: 1, y: 0}}
            initial={{opacity: 0, scale: 0.94, y: 22}}
            transition={{duration: 0.78, ease: [0.22, 1, 0.36, 1]}}
            className="relative flex flex-col items-center"
          >
            <div className="sofin-premium-loader relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] border border-white/54 bg-[linear-gradient(145deg,rgba(255,255,255,0.46),rgba(255,246,236,0.18))] shadow-[0_28px_90px_rgba(34,61,94,0.18)] backdrop-blur-2xl sm:h-48 sm:w-48">
              <motion.div
                className="absolute inset-3 rounded-[1.5rem] border border-white/36 bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]"
                animate={{rotate: [0, 12, -8, 0], scale: [1, 1.015, 0.995, 1]}}
                transition={{duration: 4.8, repeat: Infinity, ease: [0.22, 1, 0.36, 1]}}
              />
              <div className="relative h-24 w-24 overflow-hidden rounded-[1.25rem] sm:h-28 sm:w-28">
                <Image
                  src={assetUrl("/logo/sofin-logo.webp")}
                  alt="SOFIN"
                  width={112}
                  height={112}
                  priority
                  className="absolute inset-0 h-full w-full object-cover opacity-24 grayscale"
                />
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  animate={{clipPath: `inset(${Math.max(0, 100 - Math.round(progress * 100))}% 0% 0% 0%)`}}
                  transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                >
                  <Image
                    src={assetUrl("/logo/sofin-logo.webp")}
                    alt=""
                    width={112}
                    height={112}
                    priority
                    className="h-full w-full object-cover saturate-[0.85]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),rgba(178,211,232,0.18))] mix-blend-screen" />
                </motion.div>
              </div>
            </div>

            <div className="mt-7 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.46em] text-[#3b2d26]/54">
                SOFIN
              </div>
            </div>

            <div className="mt-7 h-px w-64 overflow-hidden rounded-full bg-white/62">
              <motion.div
                className="h-full rounded-full bg-[#3b2d26]"
                animate={{width: `${Math.round(progress * 100)}%`}}
                transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
