'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {Menu, X} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import type {PointerEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import LanguageSwitcher from '@/components/layout/language-switcher';
import {Logo} from '@/components/shared/logo';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.82
};

export function SiteHeader() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const glassRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnResize = () => setOpen(false);

    window.addEventListener('orientationchange', closeOnResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('orientationchange', closeOnResize);
    };
  }, [open]);

  const navItems = [
    {href: '/', label: t('home')},
    {href: '/products', label: t('products')},
    {href: '/yogurts', label: t('yogurts')},
    {href: '/company', label: t('company')},
    {href: '/recipes', label: t('recipes')},
    {href: '/contacts', label: t('contacts')}
  ] satisfies NavItem[];

  const activeHref =
    navItems.find(
      (item) =>
        pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
    )?.href ?? '/';

  const liquidHref = hoveredHref ?? activeHref;

  const handleGlassPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = glassRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty('--glass-x', `${x}%`);
    element.style.setProperty('--glass-y', `${y}%`);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="container-shell pt-3 sm:pt-5">
        <motion.div
          ref={glassRef}
          initial={{opacity: 0, y: -16, scale: 0.985, filter: 'blur(10px)'}}
          animate={{opacity: 1, y: 0, scale: 1, filter: 'blur(0px)'}}
          transition={{duration: 0.72, ease: [0.22, 1, 0.36, 1]}}
          onPointerMove={handleGlassPointerMove}
          className={cn(
            'liquid-glass-shell pointer-events-auto px-3 py-2 transition-[transform,box-shadow,background] duration-500 sm:px-5 sm:py-3',
            scrolled && 'liquid-glass-shell-scrolled'
          )}
        >
          <div className="liquid-glass-noise" />
          <motion.div
            aria-hidden="true"
            className="liquid-glass-sweep"
            animate={{x: ['-45%', '145%'], opacity: [0, 0.64, 0]}}
            transition={{
              duration: 1.55,
              repeat: Infinity,
              repeatDelay: 7.5,
              ease: [0.22, 1, 0.36, 1]
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <Link aria-label="SOFIN home" className="shrink-0" href="/" locale={locale}>
              <Logo />
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
              <ul
                className="liquid-nav-pill flex items-center gap-1 p-1"
                onMouseLeave={() => setHoveredHref(null)}
              >
                {navItems.map((item) => {
                  const active = item.href === activeHref;
                  const liquid = item.href === liquidHref;

                  return (
                    <li key={item.href} className="relative">
                      {liquid ? (
                        <motion.span
                          layoutId="liquid-nav-active"
                          className="liquid-nav-blob"
                          transition={springTransition}
                        >
                          <motion.span
                            className="liquid-nav-blob-shine"
                            initial={{scale: 0.82, opacity: 0.4}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                          />
                        </motion.span>
                      ) : null}

                      <Link
                        className={cn(
                          'focus-ring relative z-10 inline-flex rounded-full px-4 py-2 text-sm font-medium transition duration-300',
                          active
                            ? 'text-[color:var(--text)]'
                            : 'text-[color:var(--text-soft)] hover:text-[color:var(--text)]'
                        )}
                        href={item.href}
                        locale={locale}
                        onMouseEnter={() => setHoveredHref(item.href)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto hidden items-center gap-3 xl:flex">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              aria-label={open ? t('closeMenu') : t('openMenu')}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="liquid-icon-button focus-ring ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--text)] sm:h-12 sm:w-12 xl:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{rotate: -45, scale: 0.72, opacity: 0}}
                    animate={{rotate: 0, scale: 1, opacity: 1}}
                    exit={{rotate: 45, scale: 0.72, opacity: 0}}
                    transition={springTransition}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{rotate: 45, scale: 0.72, opacity: 0}}
                    animate={{rotate: 0, scale: 1, opacity: 1}}
                    exit={{rotate: -45, scale: 0.72, opacity: 0}}
                    transition={springTransition}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{height: 0, opacity: 0}}
                animate={{height: 'auto', opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.38, ease: [0.22, 1, 0.36, 1]}}
                className="liquid-mobile-panel relative z-10 mt-3 max-h-[calc(100svh-7rem)] overflow-y-auto xl:hidden"
              >
                <div className="space-y-1.5 pb-2 pt-3">
                  {navItems.map((item, index) => {
                    const active = item.href === activeHref;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{opacity: 0, x: -12, filter: 'blur(8px)'}}
                        animate={{opacity: 1, x: 0, filter: 'blur(0px)'}}
                        transition={{
                          duration: 0.34,
                          delay: index * 0.035,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                      >
                        <Link
                          className={cn(
                            'focus-ring relative flex items-center justify-between overflow-hidden rounded-2xl px-4 py-2.5 text-[15px] font-medium transition',
                            active
                              ? 'liquid-mobile-active text-[color:var(--text)]'
                              : 'text-[color:var(--text-soft)] hover:bg-white/38 hover:text-[color:var(--text)]'
                          )}
                          href={item.href}
                          locale={locale}
                          onClick={() => setOpen(false)}
                        >
                          <span>{item.label}</span>
                          {active ? (
                            <motion.span
                              layoutId="mobile-liquid-dot"
                              className="h-2 w-2 rounded-full bg-[color:var(--brand)]"
                              transition={springTransition}
                            />
                          ) : null}
                        </Link>
                      </motion.div>
                    );
                  })}

                  <div className="pt-2">
                    <LanguageSwitcher mobile onChange={() => setOpen(false)} />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
