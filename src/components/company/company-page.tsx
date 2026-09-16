"use client";

import {useEffect, useRef, useState, type ReactNode} from "react";
import {motion, useInView, useScroll, useSpring, useTransform} from "framer-motion";
import {useTranslations} from "next-intl";
import {ArrowDown, Award, Factory, Landmark, Mail, MapPin, Milk, Sprout, Users} from "lucide-react";
import Image from "@/components/shared/adaptive-image";
import {siteContacts} from "@/data/contacts";
import {usePrefersReducedMotion} from "@/lib/use-prefers-reduced-motion";
import styles from "./company-story.module.css";

const ease = [.22, 1, .36, 1] as const;
const years = ["2000", "2017", "2019", "2021"];

function Reveal({children, className, delay = 0}: {children: ReactNode; className?: string; delay?: number}) {
  const reduced = usePrefersReducedMotion();
  return <motion.div className={className} initial="hidden" whileInView="visible" animate={reduced ? "visible" : undefined} viewport={{once: true, amount: .08}} variants={{hidden: {opacity: 0, y: 28, filter: "blur(7px)"}, visible: {opacity: 1, y: 0, filter: "blur(0px)"}}} transition={{duration: reduced ? 0 : .85, delay: reduced ? 0 : delay, ease}}>{children}</motion.div>;
}

function Milestone({year, title, text, icon, index, onActive}: {year: string; title: string; text: string; icon: ReactNode; index: number; onActive: (index: number) => void}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, {margin: "-25% 0px -35% 0px"});
  useEffect(() => {if (visible) onActive(index);}, [visible, index, onActive]);
  return <article ref={ref} id={`year-${year}`} className={styles.milestone} data-company-year={year}>
    <Reveal className={styles.yearStamp}><span>{String(index + 1).padStart(2, "0")}</span><strong>{year}</strong></Reveal>
    <Reveal className={styles.chapterCard} delay={.1}><span className={styles.chapterIcon}>{icon}</span><h3>{title}</h3><p>{text}</p></Reveal>
  </article>;
}

export default function CompanyPage() {
  const t = useTranslations("CompanyPage");
  const ui = useTranslations("CompanyStory");
  const reduced = usePrefersReducedMotion();
  const timelineRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const {scrollYProgress} = useScroll({target: timelineRef, offset: ["start center", "end center"]});
  const progress = useSpring(scrollYProgress, {stiffness: 110, damping: 30, mass: .6});
  const glowY = useTransform(progress, [0, 1], [0, 120]);
  const milestones = [
    {year: "2000", key: "foundation", icon: <Landmark size={26} />},
    {year: "2017", key: "import", icon: <Sprout size={26} />},
    {year: "2019", key: "factory", icon: <Factory size={26} />},
    {year: "2021", key: "award", icon: <Award size={26} />}
  ];
  return <main className={`${styles.page} company-page`}>
    <section className={`${styles.hero} content-container`}>
      <div className={styles.heroCopy}><Reveal><span className="eyebrow">SOFIN / {t("badge")}</span><h1>{t("title")}</h1></Reveal><Reveal delay={.16}><p>{t("description")}</p><a className="button-primary" href="#company-journey" onClick={event => {event.preventDefault(); document.getElementById('company-journey')?.scrollIntoView({behavior: reduced ? 'auto' : 'smooth'});}}>{ui("explore")}<ArrowDown size={18} aria-hidden="true" /></a></Reveal></div>
      <Reveal className={styles.heroVisual} delay={.12}><Image src="/images/company.webp" alt={ui("imageAlt")} fill priority sizes="(min-width: 1024px) 650px, 90vw" className="object-cover" /><div className={styles.visualShade} /><div className={styles.since}><span>{ui("since")}</span><strong>2000</strong><span>{ui("continuing")}</span></div></Reveal>
    </section>

    <section className={`${styles.intro} content-container`}>
      <Reveal><span className="eyebrow">{t("intro.eyebrow")}</span><h2>{t("intro.title")}</h2></Reveal>
      <Reveal delay={.1} className={styles.introCopy}>{[1,2,3].map(index => <p key={index}>{t(`intro.paragraph${index}`)}</p>)}</Reveal>
    </section>

    <section ref={timelineRef} id="company-journey" className={`${styles.journey} content-container`}>
      <aside className={styles.chapterNav}><span className="eyebrow">{ui("chapters")}</span><h2>{ui("journeyTitle")}</h2><nav aria-label={ui("chapters")}>{years.map((year,index) => <a key={year} href={`#year-${year}`} aria-current={active === index ? "step" : undefined} onClick={event => {event.preventDefault(); document.getElementById(`year-${year}`)?.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block: 'center'});}}><span>{year}</span><span className={styles.navDot} /></a>)}</nav><div className={styles.progressTrack}><motion.span style={{scaleX: reduced ? scrollYProgress : progress}} /></div></aside>
      <div className={styles.chapters}><motion.div className={styles.journeyGlow} aria-hidden="true" style={{y: reduced ? 0 : glowY}} />{milestones.map((item,index) => <Milestone key={item.year} year={item.year} index={index} onActive={setActive} title={t(`timeline.${item.key}.title`)} text={t(`timeline.${item.key}.text`)} icon={item.icon} />)}</div>
    </section>

    <section className={`${styles.production} content-container`}>
      <Reveal className={styles.productionCopy}><span className={styles.chapterIcon}><Milk size={28} aria-hidden="true" /></span><h2>{t("production.title")}</h2><p>{t("production.paragraph1")}</p><p>{t("production.paragraph2")}</p></Reveal>
      <div className={styles.facts}>{[{value:"37",label:t("stats.products")},{value:"40T",label:t("stats.factory")},{value:"394",label:t("stats.cattle")},{value:"4000–5000L",label:t("stats.milk")}].map((item,index)=><Reveal key={item.label} className={styles.fact} delay={(index % 2) * .08}><strong>{item.value}</strong><span>{item.label}</span></Reveal>)}</div>
    </section>
    <section className={`${styles.infoGrid} content-container`} aria-label={ui("details")}>{[{icon:<Users size={22}/>,key:'employment'},{icon:<Factory size={22}/>,key:'capacity'},{icon:<MapPin size={22}/>,key:'address'},{icon:<Mail size={22}/>,key:'email'}].map((item,index)=><Reveal key={item.key} className={styles.infoCard} delay={index * .04}><span className={styles.chapterIcon}>{item.icon}</span><h3>{t(`cards.${item.key}.title`)}</h3>{item.key==='email'?<a href={`mailto:${siteContacts.email}`}>{siteContacts.email}</a>:<p>{t(`cards.${item.key}.text`)}</p>}</Reveal>)}</section>
    <button type="button" className={`button-secondary ${styles.returnTop}`} onClick={() => window.scrollTo({top: 0, behavior: reduced ? "auto" : "smooth"})}>{ui("backToTop")}<ArrowDown size={18} className="rotate-180" aria-hidden="true" /></button>
  </main>;
}
