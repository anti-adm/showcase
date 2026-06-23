"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {motion, type Variants} from "framer-motion";
import {Send, Mail, Phone, MapPin, Instagram} from "lucide-react";
import {assetUrl} from "@/lib/assets";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: ""
};

const easeCurve = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: {opacity: 0, y: 32, filter: "blur(10px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.7, ease: easeCurve}
  }
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06
    }
  }
};

export default function ContactsPage() {
  const t = useTranslations("ContactsPage");
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: ""
  });

  const onChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({...prev, [field]: event.target.value}));
    };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus({type: "idle", message: ""});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as {ok?: boolean; message?: string};

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t("form.error"));
      }

      setForm(initialState);
      setStatus({
        type: "success",
        message: t("form.success")
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error && error.message
            ? error.message
            : t("form.error")
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_28%),linear-gradient(180deg,#edf4fc_0%,#dae7f6_52%,#cfdeef_100%)]" />
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.10]"
        style={{backgroundImage: `url("${assetUrl("/images/Carta.webp")}")`}}
      />
      <div className="absolute inset-0 -z-10 backdrop-blur-[18px]" />

      <section className="mx-auto max-w-[1380px] px-5 pb-14 sm:px-8 lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="rounded-[34px] border border-white/35 bg-white/28 p-5 shadow-[0_24px_80px_rgba(44,78,120,0.10)] backdrop-blur-[24px] sm:p-7 lg:p-8"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto max-w-[820px] text-center"
          >
            <div className="inline-flex rounded-full border border-[rgba(12,58,106,0.10)] bg-white/55 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              {t("badge")}
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] text-[var(--brand-primary)] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-5 max-w-[760px] text-pretty text-base leading-8 text-slate-700 sm:text-lg">
              {t("description")}
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div
              variants={fadeUp}
              className="rounded-[30px] border border-white/40 bg-white/34 p-5 shadow-[0_20px_70px_rgba(44,78,120,0.08)] backdrop-blur-[20px] sm:p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ContactCard
                  icon={<Phone className="h-5 w-5" />}
                  title={t("cards.phone.title")}
                  value="+998 71 200 36 36"
                  href="tel:+998712003636"
                />
                <ContactCard
                  icon={<Mail className="h-5 w-5" />}
                  title={t("cards.email.title")}
                  value="yangi_asr_2000@mail.ru"
                  href="mailto:yangi_asr_2000@mail.ru"
                />
                <ContactCard
                  icon={<Instagram className="h-5 w-5" />}
                  title={t("cards.instagram.title")}
                  value="@sofin.uz"
                  href="https://instagram.com/sofin.uz"
                />
                <ContactCard
                  icon={<TelegramIcon className="h-5 w-5" />}
                  title={t("cards.telegram.title")}
                  value="@sofin.uz"
                  href="https://t.me/sofin_uz"
                />
              </div>

              <div className="mt-4 rounded-[24px] border border-white/40 bg-white/42 p-5 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(12,58,106,0.08)] text-[var(--brand-primary)]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm text-slate-500">
                      {t("cards.address.title")}
                    </div>
                    <div className="mt-2 text-base leading-7 text-slate-800">
                      {t("cards.address.value")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-[30px] border border-white/40 bg-white/34 p-5 shadow-[0_20px_70px_rgba(44,78,120,0.08)] backdrop-blur-[20px] sm:p-6 lg:p-7"
            >
              <div className="mb-6">
                <div className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  {t("form.eyebrow")}
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--brand-primary)] sm:text-4xl">
                  {t("form.title")}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  {t("form.description")}
                </p>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <FieldLabel label={t("form.name")} htmlFor="name" />
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder={t("form.namePlaceholder")}
                  className="h-14 w-full rounded-[20px] border border-white/40 bg-white/55 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgba(12,58,106,0.25)] focus:bg-white"
                  required
                />

                <FieldLabel label={t("form.email")} htmlFor="email" />
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder={t("form.emailPlaceholder")}
                  className="h-14 w-full rounded-[20px] border border-white/40 bg-white/55 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgba(12,58,106,0.25)] focus:bg-white"
                  required
                />

                <FieldLabel label={t("form.message")} htmlFor="message" />
                <textarea
                  id="message"
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder={t("form.messagePlaceholder")}
                  className="min-h-[180px] w-full resize-none rounded-[24px] border border-white/40 bg-white/55 px-4 py-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgba(12,58,106,0.25)] focus:bg-white"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="h-4 w-4" />
                  {loading ? t("form.sending") : t("form.submit")}
                </button>

                {status.type !== "idle" ? (
                  <div
                    className={`rounded-[18px] px-4 py-3 text-sm ${
                      status.type === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {status.message}
                  </div>
                ) : null}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <motion.a
      whileHover={{y: -3, scale: 1.01}}
      transition={{duration: 0.25, ease: easeCurve}}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group rounded-[24px] border border-white/40 bg-white/42 p-5 backdrop-blur-xl transition hover:bg-white/60"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(12,58,106,0.08)] text-[var(--brand-primary)]">
        {icon}
      </div>
      <div className="mt-4 text-sm text-slate-500">{title}</div>
      <div className="mt-1 text-base font-medium text-slate-900">{value}</div>
    </motion.a>
  );
}

function FieldLabel({
  label,
  htmlFor
}: {
  label: string;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700"
    >
      {label}
    </label>
  );
}

function TelegramIcon({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M21.2 4.2 18 19.3c-.24 1.06-.87 1.32-1.76.82l-4.87-3.59-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.97 9.05-8.18c.39-.35-.09-.55-.6-.2L5.66 12.98 1 11.52c-1.02-.32-1.04-1.02.21-1.51L19.44 2.98c.84-.31 1.57.2 1.3 1.22Z" />
    </svg>
  );
}
