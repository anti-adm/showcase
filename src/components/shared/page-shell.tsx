import Image from 'next/image';
import {getTranslations} from 'next-intl/server';

export async function PageShell({page}: {page: 'products' | 'company' | 'recipes' | 'contacts'}) {
  const t = await getTranslations(`FuturePages.${page}`);

  return (
    <main className="container-shell pb-12 pt-32 sm:pt-36">
      <section className="glass relative overflow-hidden rounded-[40px] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <div className="absolute inset-0">
          <Image alt="SOFIN background" className="object-cover opacity-25" fill sizes="100vw" src="/images/hero/hero3.jpeg" />
          <div className="panel-overlay absolute inset-0" />
        </div>
        <div className="relative max-w-3xl">
          <div className="inline-flex rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">{t('eyebrow')}</div>
          <h1 className="mt-6 font-[family:var(--font-display)] text-5xl leading-[0.98] text-[color:var(--text)] sm:text-6xl">{t('title')}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--text-soft)] sm:text-lg">{t('description')}</p>
          <div className="mt-8 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white">{t('cta')}</div>
        </div>
      </section>
    </main>
  );
}
