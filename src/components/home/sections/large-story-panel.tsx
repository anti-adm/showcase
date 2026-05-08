import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type PanelKey = 'brand' | 'categories' | 'quality' | 'recipes';

export async function LargeStoryPanel({
  panel,
  image,
  accentImage,
  secondaryImage,
  tertiaryImage
}: {
  panel: PanelKey;
  image: string;
  accentImage: string;
  secondaryImage?: string;
  tertiaryImage?: string;
}) {
  const t = await getTranslations(`Panels.${panel}`);

  const chips = panel === 'brand'
    ? [t('stat1'), t('stat2'), t('stat3')]
    : panel === 'categories'
      ? [t('milk'), t('kefir'), t('yogurt'), t('cheese'), t('ayran')]
      : panel === 'quality'
        ? [t('point1'), t('point2'), t('point3'), t('point4')]
        : [t('card1'), t('card2'), t('card3')];

  const ctaHref = panel === 'brand' || panel === 'quality' ? '/company' : panel === 'categories' ? '/products' : '/recipes';

  return (
    <section className="container-shell py-4 sm:py-6">
      <div className="glass relative min-h-[100svh] overflow-hidden rounded-[40px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="absolute inset-0">
          <Image alt="SOFIN section background" className="object-cover" fill sizes="100vw" src={image} />
          <div className="panel-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,18,43,0.36),rgba(8,22,48,0.16)_24%,rgba(244,248,255,0.08)_100%)]" />
        </div>

        <div className="relative flex min-h-[calc(100svh-5rem)] items-end">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
            <div className="max-w-3xl rounded-[34px] border border-white/16 bg-[linear-gradient(180deg,rgba(6,19,44,0.34),rgba(8,22,48,0.16))] p-6 text-white shadow-[0_24px_64px_rgba(8,20,46,0.18)] backdrop-blur-md sm:p-8 lg:p-10">
              <div className="inline-flex rounded-full bg-white/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/82">{t('eyebrow')}</div>
              <h2 className="mt-6 max-w-3xl font-[family:var(--font-display)] text-4xl leading-[0.98] sm:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)]">{t('title')}</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">{t('description')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {chips.map((chip) => (
                  <div className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm text-white/88 backdrop-blur-md" key={chip}>{chip}</div>
                ))}
              </div>
              <div className="mt-8">
                <Link className="focus-ring inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[color:var(--text)]" href={ctaHref}>{t('cta')}</Link>
              </div>
            </div>

            <div className="grid gap-4 lg:justify-end">
              <div className="soft-card relative overflow-hidden rounded-[32px] p-3 sm:p-4">
                <div className="relative aspect-[4/4.8] overflow-hidden rounded-[24px] bg-white/30">
                  <Image alt="SOFIN visual asset" className="object-cover" fill sizes="(max-width: 1024px) 100vw, 420px" src={accentImage} />
                </div>
              </div>

              {secondaryImage ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="soft-card relative overflow-hidden rounded-[28px] p-3">
                    <div className="relative aspect-[1/1] overflow-hidden rounded-[20px]">
                      <Image alt="SOFIN secondary visual" className="object-cover" fill sizes="240px" src={secondaryImage} />
                    </div>
                  </div>
                  <div className="soft-card relative overflow-hidden rounded-[28px] p-3">
                    <div className="relative aspect-[1/1] overflow-hidden rounded-[20px] bg-white/40">
                      <Image alt="SOFIN tertiary visual" className="object-cover" fill sizes="240px" src={tertiaryImage ?? accentImage} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
