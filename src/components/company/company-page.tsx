"use client";

import {motion} from "framer-motion";
import {useTranslations} from "next-intl";
import {
  Award,
  Factory,
  Landmark,
  Mail,
  MapPin,
  Milk,
  Sprout,
  Users
} from "lucide-react";

const easeCurve = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: {opacity: 0, y: 36, filter: "blur(10px)"},
  whileInView: {opacity: 1, y: 0, filter: "blur(0px)"},
  viewport: {once: true, amount: 0.25},
  transition: {duration: 0.8, ease: easeCurve}
};

export default function CompanyPage() {
  const t = useTranslations("CompanyPage");

  const milestones = [
    {
      year: "2000",
      title: t("timeline.foundation.title"),
      text: t("timeline.foundation.text"),
      icon: Landmark
    },
    {
      year: "2017",
      title: t("timeline.import.title"),
      text: t("timeline.import.text"),
      icon: Sprout
    },
    {
      year: "2019",
      title: t("timeline.factory.title"),
      text: t("timeline.factory.text"),
      icon: Factory
    },
    {
      year: "2021",
      title: t("timeline.award.title"),
      text: t("timeline.award.text"),
      icon: Award
    }
  ];

  const stats = [
    {value: "37", label: t("stats.products")},
    {value: "40T", label: t("stats.factory")},
    {value: "394", label: t("stats.cattle")},
    {value: "4000–5000L", label: t("stats.milk")}
  ];

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#dfe8f2_0%,#d8e3ef_50%,#d1dcea_100%)]" />

      <div className="absolute inset-0 -z-20 bg-[url('/images/company.png')] bg-cover bg-center bg-no-repeat opacity-45" />

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(237,244,252,0.16)_0%,rgba(218,231,246,0.24)_52%,rgba(207,222,239,0.34)_100%)] backdrop-blur-[4px]" />

      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[36px] border border-white/35 bg-white/1 p-5 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[18px] sm:p-7 lg:p-8">
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-[920px] text-center"
          >
            <div className="inline-flex rounded-full border border-[rgba(12,58,106,0.10)] bg-white/60 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              {t("badge")}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-5 max-w-[820px] text-pretty text-base leading-8 text-slate-700 sm:text-lg">
              {t("description")}
            </p>
          </motion.div>

          <motion.section
            {...fadeUp}
            className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="rounded-[32px] border border-white/24 bg-white/8 p-6 shadow-[0_20px_70px_rgba(44,78,120,0.08)] backdrop-blur-[16px] sm:p-8">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
                {t("intro.eyebrow")}
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)] sm:text-4xl">
                {t("intro.title")}
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-8 text-slate-700 sm:text-base">
                <p>{t("intro.paragraph1")}</p>
                <p>{t("intro.paragraph2")}</p>
                <p>{t("intro.paragraph3")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{opacity: 0, y: 24, filter: "blur(8px)"}}
                  whileInView={{opacity: 1, y: 0, filter: "blur(0px)"}}
                  viewport={{once: true, amount: 0.35}}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                    ease: easeCurve
                  }}
                  className="rounded-[28px] border border-white/40 bg-white/30 p-5 shadow-[0_18px_50px_rgba(44,78,120,0.06)] backdrop-blur-[14px] sm:p-6"
                >
                  <div className="text-3xl font-semibold tracking-[-0.05em] text-[var(--brand-primary)] sm:text-4xl">
                    {item.value}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="mt-10 space-y-6">
            {milestones.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.year}
                  initial={{opacity: 0, y: 40, filter: "blur(10px)"}}
                  whileInView={{opacity: 1, y: 0, filter: "blur(0px)"}}
                  viewport={{once: true, amount: 0.22}}
                  transition={{
                    duration: 0.82,
                    delay: index * 0.05,
                    ease: easeCurve
                  }}
                  className="grid grid-cols-1 gap-4 rounded-[32px] border border-white/38 bg-white/20 p-5 shadow-[0_18px_60px_rgba(44,78,120,0.08)] backdrop-blur-[16px] sm:p-6 lg:grid-cols-[180px_1fr]"
                >
                  <div className="flex items-start gap-4 lg:flex-col lg:gap-5">
                    <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(12,58,106,0.08)] text-[var(--brand-primary)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
                        {t("timelineLabel")}
                      </div>
                      <div className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)]">
                        {item.year}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/24 bg-white/12 p-5 backdrop-blur-[14px] sm:p-6">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)] sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-8 text-slate-700 sm:text-base">
                      {item.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </section>

          <motion.section
            {...fadeUp}
            className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="rounded-[28px] border border-white/26 bg-white/12 p-6 shadow-[0_20px_70px_rgba(44,78,120,0.08)] backdrop-blur-[16px] sm:p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(12,58,106,0.08)] text-[var(--brand-primary)]">
                <Milk className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)] sm:text-4xl">
                {t("production.title")}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-8 text-slate-700 sm:text-base">
                <p>{t("production.paragraph1")}</p>
                <p>{t("production.paragraph2")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Users className="h-5 w-5" />}
                title={t("cards.employment.title")}
                text={t("cards.employment.text")}
              />
              <InfoCard
                icon={<Factory className="h-5 w-5" />}
                title={t("cards.capacity.title")}
                text={t("cards.capacity.text")}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                title={t("cards.address.title")}
                text={t("cards.address.text")}
              />
              <InfoCard
                icon={<Mail className="h-5 w-5" />}
                title={t("cards.email.title")}
                text="yangi_asr_2000@mail.ru"
              />
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 24, filter: "blur(8px)"}}
      whileInView={{opacity: 1, y: 0, filter: "blur(0px)"}}
      viewport={{once: true, amount: 0.28}}
      transition={{duration: 0.75, ease: easeCurve}}
      className="rounded-[28px] border border-white/40 bg-white/30 p-5 shadow-[0_18px_50px_rgba(44,78,120,0.06)] backdrop-blur-[14px] sm:p-6"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(12,58,106,0.08)] text-[var(--brand-primary)]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--brand-primary)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{text}</p>
    </motion.div>
  );
}