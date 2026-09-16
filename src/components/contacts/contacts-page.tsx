"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {Send, Mail, Phone, MapPin, Instagram} from "lucide-react";
import {siteContacts} from "@/data/contacts";
import {CONTACT_LIMITS} from "@/lib/contact-validation";

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

export default function ContactsPage() {
  const t = useTranslations("ContactsPage");
  const errors = useTranslations("ContactErrors");
  const [form, setForm] = useState<FormState>(initialState);
  const [website, setWebsite] = useState("");
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
        body: JSON.stringify({...form, website})
      });

      const data = (await response.json()) as {ok?: boolean; code?: string};

      if (!response.ok || !data.ok) {
        const codes = ["invalid_fields", "invalid_email", "too_long", "rate_limited", "unavailable", "send_failed"];
        setStatus({type: "error", message: errors(codes.includes(data.code ?? "") ? data.code! : "send_failed")});
        return;
      }

      setForm(initialState);
      setStatus({
        type: "success",
        message: t("form.success")
      });
    } catch {
      setStatus({
        type: "error",
        message: t("form.error")
      });
    } finally {
      setLoading(false);
    }
  };

  return <main className="contacts-page page-content"><div className="content-container">
    <header className="contacts-heading"><span className="eyebrow">{t("badge")}</span><h1 className="page-title">{t("title")}</h1><p className="page-intro">{t("description")}</p></header>
    <div className="contacts-layout">
      <div className="contact-directory">
        <div className="contact-cards">
          <ContactCard icon={<Phone size={20} aria-hidden="true" />} title={t("cards.phone.title")} value={siteContacts.phone} href={siteContacts.phoneHref} />
          <ContactCard icon={<Mail size={20} aria-hidden="true" />} title={t("cards.email.title")} value={siteContacts.email} href={`mailto:${siteContacts.email}`} />
          <ContactCard icon={<Instagram size={20} aria-hidden="true" />} title={t("cards.instagram.title")} value={siteContacts.instagramLabel} href={siteContacts.instagram} />
          <ContactCard icon={<Send size={20} aria-hidden="true" />} title={t("cards.telegram.title")} value={siteContacts.telegramLabel} href={siteContacts.telegram} />
        </div>
        <div className="contact-address"><MapPin size={22} aria-hidden="true" /><div><h2>{t("cards.address.title")}</h2><p>{t("cards.address.value")}</p></div></div>
      </div>
      <section className="contact-form-panel"><span className="eyebrow">{t("form.eyebrow")}</span><h2>{t("form.title")}</h2><p>{t("form.description")}</p>
              <form className="contact-form space-y-4" onSubmit={onSubmit} aria-busy={loading}>
                <div hidden aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
                <FieldLabel label={t("form.name")} htmlFor="name" />
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.name}
                  type="text"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder={t("form.namePlaceholder")}
                  className="h-14 w-full rounded-[20px] border border-white/40 bg-white/55 px-4 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174d9e] transition placeholder:text-slate-500 focus:border-[rgba(12,58,106,0.25)] focus:bg-white"
                  required
                />

                <FieldLabel label={t("form.email")} htmlFor="email" />
                <input
                  id="email"
                  name="email"
                  autoComplete="email"
                  maxLength={CONTACT_LIMITS.email}
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder={t("form.emailPlaceholder")}
                  className="h-14 w-full rounded-[20px] border border-white/40 bg-white/55 px-4 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174d9e] transition placeholder:text-slate-500 focus:border-[rgba(12,58,106,0.25)] focus:bg-white"
                  required
                />

                <FieldLabel label={t("form.message")} htmlFor="message" />
                <textarea
                  id="message"
                  name="message"
                  maxLength={CONTACT_LIMITS.message}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder={t("form.messagePlaceholder")}
                  className="min-h-[180px] w-full resize-y rounded-[24px] border border-white/40 bg-white/55 px-4 py-4 text-base text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174d9e] transition placeholder:text-slate-500 focus:border-[rgba(12,58,106,0.25)] focus:bg-white"
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
                    role={status.type === "error" ? "alert" : "status"}
                    aria-live={status.type === "error" ? "assertive" : "polite"}
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
      </section>
    </div>
  </div></main>;
}

function ContactCard({icon, title, value, href}: {icon: React.ReactNode; title: string; value: string; href: string}) {
  return <a className="contact-card" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}><span className="contact-card-icon">{icon}</span><span><span className="contact-card-label">{title}</span><span className="contact-card-value">{value}</span></span></a>;
}
function FieldLabel({label, htmlFor}: {label: string; htmlFor: string}) {return <label className="block text-sm font-medium text-slate-700" htmlFor={htmlFor}>{label}</label>;}
