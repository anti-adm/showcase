export type ShowcaseStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CssLength = string;
export type PhaseRange = readonly [number, number];

export type TextSceneControls = {
  x?: CssLength;
  y?: CssLength;
  width?: CssLength;
  titleMaxWidth?: CssLength;
  titleFontSize?: CssLength;
  titleLineHeight?: number;
  titleLetterSpacing?: CssLength;
  subtitleMaxWidth?: CssLength;
  subtitleFontSize?: CssLength;
  subtitleLineHeight?: number;
};

export type TextFloatingBlockControls = {
  x?: CssLength;
  y?: CssLength;
  top?: CssLength;
};

export type SlideBackgroundControls = {
  src: string;
  steps: readonly ShowcaseStep[];
  position?: string;
  size?: string;
  maxOpacity?: number;
};

export const SHOWCASE_ANIMATION = {
  // The main handle: 1 is normal, 1.25 is faster, 0.75 is slower.
  speed: {
    timeline: 1,
    text: 1,
    modelSettle: 1,
    idle: 1,
  },
  stepDurationsMs: {
    default: 1750,
    1: 2050,
    2: 1850,
    3: 1900,
    product: 2130,
  },
} as const;

export const SHOWCASE_MODEL_TIMING = {
  flavorSwap: {
    softForward: 0.915,
    softBackward: 0.54,
    spinForward: 0.48,
    spinBackward: 0.52,
  },
  spinTurnsPerStep: 1,
} as const;

export const SLIDE_BACKGROUND_CONTROLS = {
  transition: {
    maxOpacity: 0.88,
    scaleFrom: 1.052,
    scaleTo: 1.018,
    shiftXFromVw: -1.4,
    shiftYFromVh: 0.9,
    veilOpacity: 0.22,
  },

  layers: [
    {
      src: "/backgrounds/main-background.webp",
      steps: [0],
      position: "center center",
      size: "cover",
      maxOpacity: 0.84,
    },
    {
      src: "/backgrounds/malina.webp",
      steps: [1, 2],
      position: "center center",
      size: "cover",
      maxOpacity: 0.84,
    },
    {
      src: "/backgrounds/ananas.webp",
      steps: [3],
      position: "center center",
      size: "cover",
      maxOpacity: 0.9,
    },
    {
      src: "/backgrounds/banan.webp",
      steps: [4],
      position: "center center",
      size: "cover",
      maxOpacity: 0.88,
    },
    {
      src: "/backgrounds/olcha.webp",
      steps: [5],
      position: "center center",
      size: "cover",
      maxOpacity: 0.84,
    },
    {
      src: "/backgrounds/berries.webp",
      steps: [6],
      position: "center center",
      size: "cover",
      maxOpacity: 0.86,
    },
    {
      src: "/backgrounds/strawbarry.webp",
      steps: [7],
      position: "center center",
      size: "cover",
      maxOpacity: 0.84,
    },
    {
      src: "/backgrounds/shaftoli.webp",
      steps: [8],
      position: "center center",
      size: "cover",
      maxOpacity: 0.84,
    },
    {
      src: "/backgrounds/strawberry-banan.webp",
      steps: [9],
      position: "center center",
      size: "cover",
      maxOpacity: 0.86,
    },
  ] satisfies readonly SlideBackgroundControls[],
} as const;

export const TEXT_REVEAL_PHASES = {
  intro: {
    eyebrow: [0.04, 0.18],
    title: [0.1, 0.34],
    subtitle: [0.28, 0.54],
    accent: [0.48, 0.7],
  },
  malina: {
    eyebrow: [0.04, 0.18],
    title: [0.1, 0.28],
    subtitle: [0.08, 0.3],
  },
  productPlain: {
    eyebrow: [0.7, 0.82],
    title: [0.76, 0.96],
    subtitle: [0.84, 1],
    accent: [0.92, 1],
  },
  productGlass: {
    card: [0.3, 0.48],
    eyebrow: [0.38, 0.52],
    title: [0.46, 0.68],
    divider: [0.56, 0.72],
    subtitle: [0.62, 0.84],
    actions: [0.76, 0.98],
    sheen: [0.42, 0.7],
    glow: [0.48, 0.82],
  },
} as const satisfies Record<string, Record<string, PhaseRange>>;

export const TEXT_LAYER_CONTROLS = {
  wrapper: {
    bottom: "clamp(3.5rem, 8vh, 5rem)",
    paddingX: "clamp(1rem, 5vw, 6vw)",
  },

  plain: {
    sideWidth: "min(92vw, 760px)",
    centerWidth: "min(92vw, 1120px)",
    eyebrowFontSize: "11px",
    eyebrowTracking: "0em",
    eyebrowMarginBottom: "clamp(1.25rem, 2vw, 1.5rem)",
    titleFontSize: "var(--sofin-title-size-plain)",
    titleLineHeight: 0.92,
    titleLetterSpacing: "0em",
    titleMaxWidth: "25ch",
    subtitleFontSize: "var(--sofin-copy-size)",
    subtitleLineHeight: 1.88,
    subtitleMarginTop: "clamp(1.5rem, 2vw, 1.75rem)",
    subtitleMaxWidth: "620px",
    accentWidth: "5rem",
    accentMarginTop: "2rem",
  },

  glass: {
    width: "min(46vw, 520px)",
    minHeight: "clamp(220px, 24vh, 280px)",
    radius: "clamp(24px, 2vw, 30px)",
    paddingInline: "clamp(1.65rem, 2.5vw, 2.45rem)",
    paddingBlock: "clamp(1.55rem, 2.35vw, 2.15rem)",
    eyebrowFontSize: "11px",
    eyebrowTracking: "0em",
    eyebrowMarginBottom: "clamp(1rem, 1.5vw, 1.35rem)",
    titleFontSize: "clamp(2.6rem, 3vw, 3.2rem)",
    titleLineHeight: 0.96,
    titleLetterSpacing: "0em",
    titleMaxWidth: "14ch",
    dividerWidth: "80px",
    dividerMarginTop: "0.75rem",
    subtitleFontSize: "var(--sofin-card-copy-size)",
    subtitleLineHeight: 1.62,
    subtitleMarginTop: "1rem",
    subtitleMaxWidth: "min(100%, 420px)",
    actionsMarginTop: "1.35rem",
    actionsGap: "0.65rem",
    buttonFontSize: "11px",
    buttonPaddingInline: "1.2rem",
    buttonPaddingBlock: "0.7rem",
    sideTilt: 4,
  },

  malina: {
    headline: {
      x: "0px",
      y: "-45px",
      top: "clamp(10vh, 18vh, 19vh)",
    },
    body: {
      x: "0px",
      y: "0px",
      top: "clamp(40vh, 43vh, 45vh)",
    },
    titleFontSize: "clamp(3.2rem, 4.2vw, 6rem)",
    titleLineHeight: 0.92,
    titleLetterSpacing: "0em",
    titleMaxWidth: "16ch",
    eyebrowFontSize: "11px",
    eyebrowTracking: "0em",
    bodyWidth: "min(86vw, 1080px)",
    bodyFontSize: "var(--sofin-copy-size-large)",
    bodyLineHeight: 1.72,
  },

  scenes: {
    0: {
      x: "0px",
      y: "-0.75vh",
      width: "min(96vw, 1320px)",
      titleMaxWidth: "24ch",
      titleFontSize: "var(--sofin-title-size-intro)",
      titleLineHeight: 0.94,
      titleLetterSpacing: "0em",
    },
    1: { x: "0px", y: "0px" },
    2: { x: "0px", y: "0px" },
    3: {
      x: "0px",
      y: "-30px",
      titleMaxWidth: "13ch",
      titleFontSize: "clamp(2.8rem, 3.5vw, 4.2rem)",
      titleLineHeight: 0.98,
      subtitleMaxWidth: "520px",
      subtitleFontSize: "clamp(0.95rem, 1.05vw, 1.12rem)",
      subtitleLineHeight: 1.68,
    },
    4: { x: "0px", y: "0px", titleMaxWidth: "14ch" },
  5: {
    x: "0px",
    y: "-50px",
    titleMaxWidth: "14ch",
    titleFontSize: "clamp(2.8rem, 4.6vw, 5.2rem)",
    titleLineHeight: 0.96,
    subtitleMaxWidth: "560px",
    subtitleFontSize: "clamp(0.95rem, 1.05vw, 1.12rem)",
    subtitleLineHeight: 1.68,
  },
    6: {
    x: "0px",
    y: "0px",
    width: "min(34vw, 420px)",
    titleMaxWidth: "12ch",
    subtitleMaxWidth: "340px",
    subtitleFontSize: "clamp(0.9rem, 1vw, 1.05rem)",
    subtitleLineHeight: 1.55,
  },
    7: { x: "0px", y: "0px", titleMaxWidth: "14ch" },
    8: { x: "0px", y: "0px", titleMaxWidth: "14ch" },
    9: { x: "0px", y: "-14px", titleMaxWidth: "15ch" },
  } satisfies Record<ShowcaseStep, TextSceneControls>,
} as const;

export function getStepDurationMs(step: ShowcaseStep) {
  const base =
    step >= 4
      ? SHOWCASE_ANIMATION.stepDurationsMs.product
      : SHOWCASE_ANIMATION.stepDurationsMs[step as keyof typeof SHOWCASE_ANIMATION.stepDurationsMs] ??
        SHOWCASE_ANIMATION.stepDurationsMs.default;

  return Math.round(base / getSafeSpeed(SHOWCASE_ANIMATION.speed.timeline));
}

export function scaleTextDuration(seconds: number) {
  return seconds / getSafeSpeed(SHOWCASE_ANIMATION.speed.text);
}

export function scaleModelDamping(lambda: number) {
  return lambda * getSafeSpeed(SHOWCASE_ANIMATION.speed.modelSettle);
}

export function getIdleTime(seconds: number, baseSpeed = 1) {
  return seconds * baseSpeed * getSafeSpeed(SHOWCASE_ANIMATION.speed.idle);
}

function getSafeSpeed(value: number) {
  return Math.max(0.05, value);
}
