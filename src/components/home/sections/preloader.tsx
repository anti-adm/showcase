'use client';

import {AnimatePresence, motion} from 'framer-motion';
import Image from 'next/image';
import {useEffect, useState} from 'react';

const PRELOAD_ASSETS = [
  '/images/hero/hero1.jpeg',
  '/images/hero/hero2.jpeg',
  '/images/brand/pack-line.jpg',
  '/logo/sofin-logo.png'
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
        image.src = src;
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
              src="/images/hero/hero1.jpeg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.74),transparent_32%),linear-gradient(180deg,rgba(250,244,235,0.86),rgba(232,240,249,0.82))]" />
          </div>

          <motion.div
            animate={{opacity: 1, scale: 1, y: 0}}
            initial={{opacity: 0, scale: 0.94, y: 22}}
            transition={{duration: 0.78, ease: [0.22, 1, 0.36, 1]}}
            className="relative flex flex-col items-center"
          >
            <div className="relative flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/62 bg-[linear-gradient(145deg,rgba(255,255,255,0.74),rgba(255,246,236,0.32))] shadow-[0_28px_90px_rgba(78,49,31,0.18)] backdrop-blur-2xl sm:h-48 sm:w-48">
              <motion.div
                className="absolute inset-3 rounded-[1.5rem] border border-[#3b2d26]/10"
                animate={{rotate: 360}}
                transition={{duration: 8, repeat: Infinity, ease: 'linear'}}
              />
              <Image
                src="/logo/sofin-logo.png"
                alt="SOFIN"
                width={112}
                height={112}
                priority
                className="relative h-24 w-24 rounded-[1.25rem] object-cover sm:h-28 sm:w-28"
              />
            </div>

            <div className="mt-7 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.46em] text-[#3b2d26]/54">
                SOFIN
              </div>
              <div className="mt-3 text-sm font-medium text-[#3b2d26]/72">
                Загружаем свежесть
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
