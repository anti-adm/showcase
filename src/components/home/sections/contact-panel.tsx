import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {assetUrl} from '@/lib/assets';

export async function ContactPanel() {
  const t = await getTranslations('Panels.contact');

  return (
    <section className="container-shell pb-4 pt-4 sm:pb-6 sm:pt-6">
      <div className="glass relative min-h-[92svh] overflow-hidden rounded-[40px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0">
          <Image alt="SOFIN closing background" className="object-cover" fill unoptimized quality={100} sizes="100vw" src={assetUrl("/images/hero/main-hero.webp")} />
          <div className="panel-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,43,0.38),rgba(10,24,54,0.22)_32%,rgba(240,247,255,0.16)_100%)]" />
        </div>

        <div className="relative flex min-h-[calc(92svh-4rem)] items-end">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div className="max-w-3xl rounded-[34px] border border-white/16 bg-[linear-gradient(180deg,rgba(6,19,44,0.34),rgba(8,22,48,0.16))] p-6 text-white backdrop-blur-md sm:p-8 lg:p-10">
              <div className="inline-flex rounded-full bg-white/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/82">{t('eyebrow')}</div>
              <h2 className="mt-6 font-[family:var(--font-display)] text-4xl leading-[0.98] sm:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)]">{t('title')}</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/84 sm:text-lg">{t('description')}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link className="focus-ring inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--text)]" href="/contacts">{t('primary')}</Link>
                <Link className="focus-ring inline-flex rounded-full border border-white/22 bg-white/12 px-5 py-3 text-sm font-semibold text-white" href="/products">{t('secondary')}</Link>
              </div>
            </div>

            <div className="soft-card rounded-[34px] p-4">
              <div className="relative aspect-[4/4.8] overflow-hidden rounded-[26px]">
                <Image alt="SOFIN package visual" className="object-cover" fill sizes="400px" src={assetUrl("/logo/sofin-logo.webp")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
