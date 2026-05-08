'use client';

import {Languages} from 'lucide-react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {cn} from '@/lib/utils';

type LanguageSwitcherProps = {
  mobile?: boolean;
  onChange?: () => void;
};

const labels: Record<(typeof routing.locales)[number], string> = {
  uz: 'UZ',
  en: 'EN',
  ru: 'RU'
};

export default function LanguageSwitcher({
  mobile = false,
  onChange
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (nextLocale: (typeof routing.locales)[number]) => {
    router.replace(pathname, {locale: nextLocale});
    onChange?.();
  };

  if (mobile) {
    return (
      <div className="liquid-language-switcher flex items-center gap-2 rounded-2xl p-2">
        <div className="liquid-language-icon flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--text)]">
          <Languages className="h-4 w-4" />
        </div>

        <div className="flex flex-1 items-center gap-1">
          {routing.locales.map((item) => {
            const active = item === locale;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleChange(item)}
                className={cn(
                  'flex-1 rounded-full px-3 py-2 text-sm font-medium transition',
                  active
                    ? 'liquid-language-active text-[color:var(--text)]'
                    : 'text-[color:var(--text-soft)] hover:bg-white/42 hover:text-[color:var(--text)]'
                )}
                aria-pressed={active}
              >
                {labels[item]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-language-switcher inline-flex items-center gap-1 rounded-full p-1">
      <div className="liquid-language-icon flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--text)]">
        <Languages className="h-4 w-4" />
      </div>

      {routing.locales.map((item) => {
        const active = item === locale;

        return (
          <button
            key={item}
            type="button"
            onClick={() => handleChange(item)}
            className={cn(
              'rounded-full px-3 py-2 text-xs font-medium transition',
              active
                ? 'liquid-language-active text-[color:var(--text)]'
                : 'text-[color:var(--text-soft)] hover:bg-white/42 hover:text-[color:var(--text)]'
            )}
            aria-pressed={active}
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}
