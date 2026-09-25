"use client";

import {useEffect, useId, useRef, useState, type CSSProperties} from "react";
import {ChevronUp, X} from "lucide-react";
import styles from "./flavor-navigation.module.css";

export const CUP_FLAVORS = ["malina", "ananas", "banan", "olcha", "ormon-meva", "qulupnay", "shaftoli", "qulupnay-banan"] as const;
const names = {
  ru: ["Малина", "Ананас", "Банан", "Вишня", "Лесные ягоды", "Клубника", "Персик", "Клубника и банан"],
  en: ["Raspberry", "Pineapple", "Banana", "Cherry", "Forest berries", "Strawberry", "Peach", "Strawberry & banana"],
  uz: ["Malina", "Ananas", "Banan", "Olcha", "O‘rmon mevalari", "Qulupnay", "Shaftoli", "Qulupnay va banan"],
};
const colors = ["#d96596", "#c6a337", "#dab453", "#b74c64", "#9772b1", "#de7181", "#de9969", "#d9948b"];

export function FlavorNavigation({locale, flavors, active, onSelect, disabled = false}: {
  locale: "ru" | "en" | "uz";
  flavors: readonly string[];
  active: string | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const label = locale === "ru" ? "Выберите вкус" : locale === "uz" ? "Ta’mni tanlang" : "Choose a flavor";
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return <nav ref={nav} className={styles.nav} aria-label={label} data-open={open} data-flavor-navigation onKeyDown={event => {
    if (event.key === "Escape") {setOpen(false); toggle.current?.focus();}
  }}>
    <button ref={toggle} className={styles.toggle} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span>{locale === "ru" ? "Вкусы" : locale === "uz" ? "Ta’mlar" : "Flavors"}</span>
      {open ? <X size={16} /> : <ChevronUp size={16} />}
    </button>
    <div id={id} className={styles.panel}>
      <p className={styles.heading}>{label}<span>08</span></p>
      <div className={styles.list}>
        {flavors.map((flavor, index) => {
          const nameIndex = CUP_FLAVORS.indexOf(flavor as typeof CUP_FLAVORS[number]);
          return <button key={flavor} type="button" className={styles.flavor} aria-label={names[locale][nameIndex]} aria-current={active === flavor ? "true" : undefined} disabled={disabled}
            style={{"--flavor-color": colors[nameIndex]} as CSSProperties}
            onClick={() => {onSelect(index); if (open) {setOpen(false); toggle.current?.focus();}}}>
            <span className={styles.swatch} aria-hidden="true" /><span>{names[locale][nameIndex]}</span>
            <span className={styles.indicator} aria-hidden="true">→</span>
          </button>;
        })}
      </div>
    </div>
  </nav>;
}
