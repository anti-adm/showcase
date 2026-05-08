import HeroStory from "@/components/home/sections/hero-story";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroStory />

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#edf5fb_0%,#e6eff8_42%,#dce8f4_100%)] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_8%,rgba(255,255,255,0.62),transparent_34%),radial-gradient(circle_at_84%_28%,rgba(186,217,255,0.28),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-2">
          <HomeLinkPanel
            eyebrow="ПРОДУКЦИЯ"
            title="Йогурты, молоко и другие продукты SOFIN"
            description="Мы развиваем линейку молочных продуктов с акцентом на свежесть, понятный состав и стабильное качество в ежедневном выборе."
            cta="Смотреть продукцию"
            href="/products"
          />
          <HomeLinkPanel
            eyebrow="РЕЦЕПТЫ"
            title="Идеи для завтрака, десертов и повседневных блюд"
            description="Рецепты развивают сайт как бренд-платформу: не только продукт, но и идеи для завтраков, десертов и семейной подачи."
            cta="Перейти к рецептам"
            href="/recipes"
          />
        </div>
      </section>
    </>
  );
}

function HomeLinkPanel({
  eyebrow,
  title,
  description,
  cta,
  href
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <article className="rounded-[30px] border border-white/42 bg-white/30 p-6 shadow-[0_24px_80px_rgba(53,84,120,0.09)] backdrop-blur-[22px] sm:p-8 lg:p-10">
      <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.34em] text-slate-600">
        {eyebrow}
      </div>
      <h2 className="max-w-[760px] text-balance text-3xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-slate-700 sm:text-base lg:leading-8">
        {description}
      </p>
      <div className="mt-7">
        <Link
          href={href}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white/78 px-5 py-3 text-sm font-medium text-slate-900 backdrop-blur-xl transition hover:bg-white"
        >
          {cta}
        </Link>
      </div>
    </article>
  );
}
