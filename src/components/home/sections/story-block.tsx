"use client";

import {motion} from "framer-motion";
import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
  reverse?: boolean;
};

export default function StoryBlock({
  eyebrow,
  title,
  description,
  cta
}: Props) {
  return (
    <section className="relative py-24 sm:py-28 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.36),transparent_30%),linear-gradient(180deg,rgba(234,242,252,0.78)_0%,rgba(214,228,244,0.82)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[10px]" />

      <div className="relative z-10 mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{opacity: 0, y: 28, filter: "blur(10px)"}}
          whileInView={{opacity: 1, y: 0, filter: "blur(0px)"}}
          viewport={{once: true, amount: 0.35}}
          transition={{duration: 0.75, ease: [0.22, 1, 0.36, 1]}}
          className="rounded-[30px] border border-white/40 bg-white/34 p-6 shadow-[0_24px_80px_rgba(53,84,120,0.12)] backdrop-blur-[22px] sm:p-8 lg:p-10"
        >
          {eyebrow ? (
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.34em] text-slate-600">
              {eyebrow}
            </div>
          ) : null}

          <h2 className="max-w-[760px] text-balance text-3xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-5 max-w-[760px] text-[15px] leading-7 text-slate-700 sm:text-base lg:text-lg lg:leading-8">
            {description}
          </p>

          {cta ? (
            <div className="mt-7">
              <Link
                href={cta.href}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/85 px-5 py-3 text-sm font-medium text-slate-900 backdrop-blur-xl transition hover:bg-white"
              >
                {cta.label}
              </Link>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}