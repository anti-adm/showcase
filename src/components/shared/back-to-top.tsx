'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {ChevronUp} from 'lucide-react';
import {useEffect, useState} from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          animate={{opacity: 1, y: 0, scale: 1}}
          className="liquid-back-to-top focus-ring fixed bottom-5 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-[color:var(--text)] sm:bottom-7 sm:right-6 sm:h-14 sm:w-14"
          exit={{opacity: 0, y: 14, scale: 0.9}}
          initial={{opacity: 0, y: 14, scale: 0.9}}
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          type="button"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
