"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Inter, Playfair_Display } from "next/font/google";
import { useLocale } from "next-intl";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  TEXT_LAYER_CONTROLS,
  TEXT_REVEAL_PHASES,
  scaleTextDuration,
  type ShowcaseStep,
  type TextFloatingBlockControls,
  type TextSceneControls,
} from "@/lib/showcase-controls";

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;
const CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

const TEXT_LAYER_EDITOR = TEXT_LAYER_CONTROLS;
const TEXT_LAYER_SCENE_OVERRIDES = TEXT_LAYER_CONTROLS.scenes;

type Props = {
  step: ShowcaseStep;
  step1Progress: number;
  step2Progress: number;
  step3Progress: number;
  step4Progress: number;
  step5Progress: number;
  step6Progress: number;
  step7Progress: number;
  step8Progress: number;
  step9Progress: number;
  isMobile?: boolean;
};

type SceneAlign = "left" | "right" | "center";

type SceneContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  align: SceneAlign;
};

type Locale = "uz" | "ru" | "en";

type UiLabels = {
  catalog: string;
  details: string;
};

type SceneProps = {
  content: SceneContent;
  progress: number;
  manualControls: TextSceneControls;
  disableInitialAnimation?: boolean;
};

export function IntroTextLayer({
  step,
  step1Progress,
  step2Progress,
  step3Progress,
  step4Progress,
  step5Progress,
  step6Progress,
  step7Progress,
  step8Progress,
  step9Progress,
  isMobile = false,
}: Props) {
  const locale = normalizeLocale(useLocale());
  const progressByStep = [
    1,
    step1Progress,
    step2Progress,
    step3Progress,
    step4Progress,
    step5Progress,
    step6Progress,
    step7Progress,
    step8Progress,
    step9Progress,
  ] as const;

  const sceneProgress = clamp(progressByStep[step] ?? 1, 0, 1);
  const previousFrame = useRef({ step, progress: sceneProgress });
  const [isRewinding, setIsRewinding] = useState(false);

  useEffect(() => {
    const previous = previousFrame.current;

    if (step === previous.step) {
      const delta = sceneProgress - previous.progress;
      if (Math.abs(delta) > 0.001) {
        setIsRewinding(delta < 0);
      }
    } else {
      setIsRewinding(false);
    }

    previousFrame.current = { step, progress: sceneProgress };
  }, [sceneProgress, step]);

  const renderStep = step;
  const renderContent = getContent(renderStep, locale);
  const uiLabels = INTRO_TEXT_TRANSLATIONS[locale].ui;
  const renderIsGlassScene = renderStep >= 4 && renderStep !== 5;
  const renderProgress = sceneProgress;
  const manualControls = TEXT_LAYER_SCENE_OVERRIDES[renderStep] ?? {};
  const isMalinaPair = renderStep === 1 || renderStep === 2;
  const sceneKey = isMalinaPair ? "intro-text-scene-malina" : `intro-text-scene-${renderStep}`;

  const disableInitialAnimation =
    renderStep === 0 && progressByStep.slice(1).every((value) => value <= 0.001);

  const reverseOutro =
    isRewinding && renderStep === step ? 1 - smoothstep(0.12, 0.56, renderProgress) : 0;

  const shellOpacity = clamp(1 - reverseOutro * (renderIsGlassScene ? 0.15 : 0.1), 0, 1);
  const shellShift = -lerp(0, renderIsGlassScene ? 16 : 10, reverseOutro);
  const shellScale = lerp(1, renderIsGlassScene ? 0.988 : 0.994, reverseOutro);
  const shellBlur = lerp(0, renderIsGlassScene ? 5 : 3.5, reverseOutro);

  if (isMobile) {
    return (
      <MobileTextLayer
        key="mobile-text-layer"
        step={renderStep}
        content={renderContent}
        progress={renderProgress}
        uiLabels={uiLabels}
        disableInitialAnimation={disableInitialAnimation}
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <AnimatePresence initial={false} mode="sync">
        {isMalinaPair ? (
          <motion.section
            key={sceneKey}
            initial={
              disableInitialAnimation
                ? false
                : { opacity: 0, y: 28, scale: 0.982, filter: "blur(14px)" }
            }
            animate={{
              opacity: shellOpacity,
              y: shellShift,
              scale: shellScale,
              filter: cssBlur(shellBlur),
            }}
            exit={{
              opacity: 0,
              y: -18,
              scale: 0.992,
              filter: "blur(18px)",
            }}
            transition={{
              opacity: getTimedTransition(0.8, PREMIUM_EASE),
              y: getTimedTransition(0.94, PREMIUM_EASE),
              scale: getTimedTransition(0.94, PREMIUM_EASE),
              filter: getTimedTransition(0.82, CONTENT_EASE),
            }}
            className="absolute inset-0"
            style={{ willChange: "transform, opacity, filter" }}
          >
            <MalinaLinkedScene
              step={renderStep}
              progress={renderProgress}
              content={renderContent}
              disableInitialAnimation={disableInitialAnimation}
            />
          </motion.section>
        ) : (
          <motion.section
            key={`intro-text-scene-${renderStep}`}
            className={`absolute inset-x-0 flex ${getJustifyClass(renderContent.align)}`}
            style={getWrapperStyle()}
          >
            <div className="relative" style={getSceneOffsetStyle(manualControls)}>
              <motion.div
                initial={
                  disableInitialAnimation
                    ? false
                    : {
                        opacity: 0,
                        y: renderIsGlassScene ? 44 : 38,
                        scale: renderIsGlassScene ? 0.94 : 0.982,
                        filter: `blur(${renderIsGlassScene ? 18 : 14}px)`,
                      }
                }
                animate={{
                  opacity: shellOpacity,
                  y: shellShift,
                  scale: shellScale,
                  filter: cssBlur(shellBlur),
                }}
                exit={{
                  opacity: 0,
                  y: renderIsGlassScene ? -34 : -28,
                  scale: renderIsGlassScene ? 0.976 : 0.986,
                  filter: "blur(18px)",
                }}
                transition={{
                  opacity: getTimedTransition(renderIsGlassScene ? 0.88 : 0.8, PREMIUM_EASE),
                  y: getTimedTransition(renderIsGlassScene ? 1.08 : 0.94, PREMIUM_EASE),
                  scale: getTimedTransition(renderIsGlassScene ? 1.08 : 0.94, PREMIUM_EASE),
                  filter: getTimedTransition(0.82, CONTENT_EASE),
                }}
                className={`relative flex ${getAlignmentClass(renderContent.align)}`}
                style={{
                  width: getSceneWidth(renderContent.align, renderIsGlassScene, manualControls),
                  willChange: "transform, opacity, filter",
                }}
              >
                {renderIsGlassScene ? (
                  <GlassCardScene
                    content={renderContent}
                    progress={renderProgress}
                    manualControls={manualControls}
                    uiLabels={uiLabels}
                    disableInitialAnimation={disableInitialAnimation}
                  />
                ) : (
                  <PlainTextScene
                    content={renderContent}
                    progress={renderProgress}
                    manualControls={manualControls}
                    isProductScene={renderStep >= 3}
                    disableInitialAnimation={disableInitialAnimation}
                  />
                )}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileTextLayer({
  step,
  content,
  progress,
  uiLabels,
  disableInitialAnimation = false,
}: {
  step: ShowcaseStep;
  content: SceneContent;
  progress: number;
  uiLabels: UiLabels;
  disableInitialAnimation?: boolean;
}) {
  const phases = step >= 4 ? TEXT_REVEAL_PHASES.productGlass : TEXT_REVEAL_PHASES.productPlain;
  const eyebrowIn = content.eyebrow ? getPhaseProgress(phases.eyebrow, progress) : 1;
  const titleIn = getPhaseProgress(phases.title, progress);
  const subtitleIn = content.subtitle ? getPhaseProgress(phases.subtitle, progress) : 0;
  const actionsRange =
    step >= 4 ? TEXT_REVEAL_PHASES.productGlass.actions : TEXT_REVEAL_PHASES.productPlain.accent;
  const actionsIn = step >= 3 ? getPhaseProgress(actionsRange, progress) : 0;
  const cardIn = step === 0 ? 1 : smoothstep(0.08, 0.48, progress);
  const title = getMobileTitle(content.title);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden px-3">
      <AnimatePresence initial={false} mode="sync">
        <motion.section
          key={`mobile-text-scene-${step}`}
          initial={
            disableInitialAnimation
              ? false
              : { opacity: 0, y: -46, scale: 0.985, filter: "blur(16px)" }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: 62,
            scale: 0.992,
            filter: "blur(18px)",
          }}
          transition={{
            opacity: getTimedTransition(0.9, PREMIUM_EASE),
            y: getTimedTransition(1.08, PREMIUM_EASE),
            scale: getTimedTransition(1.08, PREMIUM_EASE),
            filter: getTimedTransition(0.9, CONTENT_EASE),
          }}
          className="absolute inset-x-0 flex justify-center px-3"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 2.6rem)",
          }}
        >
          <motion.div
            initial={disableInitialAnimation ? false : { opacity: 0, y: -28, scale: 0.97 }}
            animate={{
              opacity: lerp(0, 1, cardIn),
              y: lerp(-28, 0, cardIn),
              scale: lerp(0.97, 1, cardIn),
            }}
            transition={getPhaseTransition(0.95)}
            className="relative w-full max-w-[360px] overflow-hidden border border-white/48 bg-[linear-gradient(145deg,rgba(255,255,255,0.68),rgba(255,255,255,0.34)_48%,rgba(255,249,244,0.22)_100%)] px-4 py-4 text-center shadow-[0_22px_72px_rgba(78,49,31,0.18)] backdrop-blur-[26px]"
            style={{
              borderRadius: "clamp(24px, 8vw, 34px)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.46),transparent_48%)]" />

            <div className="relative flex flex-col items-center">
              {content.eyebrow ? (
                <motion.p
                  initial={disableInitialAnimation ? false : { opacity: 0, y: -14, filter: "blur(8px)" }}
                  animate={{
                    opacity: eyebrowIn,
                    y: lerp(-14, 0, eyebrowIn),
                    filter: cssBlur(lerp(8, 0, eyebrowIn)),
                  }}
                  transition={getPhaseTransition(0.72)}
                  className={`${inter.className} mb-3 font-semibold uppercase text-[#7c6557]/76`}
                  style={{
                    fontSize: "11px",
                  }}
                >
                  {content.eyebrow}
                </motion.p>
              ) : null}

              <motion.h1
                initial={
                  disableInitialAnimation
                    ? false
                    : { opacity: 0, y: -24, scale: 0.97, filter: "blur(14px)" }
                }
                animate={{
                  opacity: titleIn,
                  y: lerp(-24, 0, titleIn),
                  scale: lerp(0.97, 1, titleIn),
                  filter: cssBlur(lerp(14, 0, titleIn)),
                }}
                transition={getPhaseTransition(0.96)}
                className={`${playfair.className} text-[#2f241f]`}
                style={{
                  fontSize:
                    step === 0
                      ? "clamp(1.55rem, 7.5vw, 2rem)"
                      : "clamp(1.62rem, 8.3vw, 2.28rem)",
                  lineHeight: 1.02,
                  textWrap: "balance",
                }}
              >
                {title}
              </motion.h1>

              {content.subtitle ? (
                <motion.p
                  initial={
                    disableInitialAnimation
                      ? false
                      : { opacity: 0, y: -18, scale: 0.992, filter: "blur(10px)" }
                  }
                  animate={{
                    opacity: subtitleIn,
                    y: lerp(-18, 0, subtitleIn),
                    scale: lerp(0.992, 1, subtitleIn),
                    filter: cssBlur(lerp(10, 0, subtitleIn)),
                  }}
                  transition={getPhaseTransition(0.9)}
                  className={`${inter.className} mt-4 text-[#5e4d42]/84`}
                  style={{
                    fontSize: "clamp(0.84rem, 3.45vw, 0.96rem)",
                    lineHeight: 1.5,
                    textWrap: "balance",
                  }}
                >
                  {content.subtitle}
                </motion.p>
              ) : null}

              {step >= 3 ? (
                <motion.div
                  initial={disableInitialAnimation ? false : { opacity: 0, y: -14, scale: 0.98 }}
                  animate={{
                    opacity: actionsIn,
                    y: lerp(-14, 0, actionsIn),
                    scale: lerp(0.98, 1, actionsIn),
                  }}
                  transition={getPhaseTransition(0.84)}
                  className="mt-4 flex flex-wrap justify-center gap-2.5"
                >
                  <button
                    type="button"
                    className={`${inter.className} pointer-events-auto rounded-full bg-[#2f241f] px-5 py-2.5 text-[11px] font-semibold uppercase text-white shadow-[0_14px_30px_rgba(47,36,31,0.18)]`}
                  >
                    {uiLabels.catalog}
                  </button>

                  <button
                    type="button"
                    className={`${inter.className} pointer-events-auto rounded-full border border-white/52 bg-white/62 px-5 py-2.5 text-[11px] font-semibold uppercase text-[#3b2d26] backdrop-blur-xl`}
                  >
                    {uiLabels.details}
                  </button>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}

function MalinaLinkedScene({
  step,
  progress,
  content,
  disableInitialAnimation = false,
}: {
  step: number;
  progress: number;
  content: SceneContent;
  disableInitialAnimation?: boolean;
}) {
  const phases = TEXT_REVEAL_PHASES.malina;
  const eyebrowIn = step === 1 ? getPhaseProgress(phases.eyebrow, progress) : 1;
  const titleIn = step === 1 ? getPhaseProgress(phases.title, progress) : 1;
  const subtitleIn = step === 2 ? getPhaseProgress(phases.subtitle, progress) : 0;

  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        initial={
          disableInitialAnimation
            ? false
            : { opacity: 0, y: 26, scale: 0.978, filter: "blur(16px)" }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={getPhaseTransition(1.05)}
        className="absolute inset-x-0 flex flex-col items-center px-4 text-center"
        style={{
          top: TEXT_LAYER_EDITOR.malina.headline.top,
          ...getFloatingBlockMoveStyle(TEXT_LAYER_EDITOR.malina.headline),
        }}
      >
        <motion.p
          initial={disableInitialAnimation ? false : { opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={buildRevealStyles(eyebrowIn, {
            distance: 10,
            blur: 8,
            scaleFrom: 0.99,
          })}
          transition={getPhaseTransition(0.82)}
          className={`${inter.className} mb-3 font-semibold uppercase text-[#81695a]/70`}
          style={{
            fontSize: TEXT_LAYER_EDITOR.malina.eyebrowFontSize,
            letterSpacing: TEXT_LAYER_EDITOR.malina.eyebrowTracking,
          }}
        >
          {content.eyebrow}
        </motion.p>

        <motion.h1
          initial={
            disableInitialAnimation
              ? false
              : { opacity: 0, y: 28, scale: 0.972, filter: "blur(16px)" }
          }
          animate={buildRevealStyles(titleIn, {
            distance: 28,
            blur: 16,
            scaleFrom: 0.972,
          })}
          transition={getPhaseTransition(1.16)}
          className={`${playfair.className} whitespace-pre-line text-center text-[#2f241f] drop-shadow-[0_14px_30px_rgba(255,255,255,0.18)]`}
          style={{
            maxWidth: TEXT_LAYER_EDITOR.malina.titleMaxWidth,
            fontSize: TEXT_LAYER_EDITOR.malina.titleFontSize,
            lineHeight: TEXT_LAYER_EDITOR.malina.titleLineHeight,
            letterSpacing: TEXT_LAYER_EDITOR.malina.titleLetterSpacing,
          }}
        >
          {content.title}
        </motion.h1>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          opacity: subtitleIn,
          y: lerp(24, 0, subtitleIn),
          scale: lerp(0.992, 1, subtitleIn),
          filter: cssBlur(lerp(12, 0, subtitleIn)),
        }}
        transition={getPhaseTransition(1.02)}
        className="absolute inset-x-0 flex flex-col items-center px-4 text-center"
        style={{
          top: TEXT_LAYER_EDITOR.malina.body.top,
          width: "100%",
          ...getFloatingBlockMoveStyle(TEXT_LAYER_EDITOR.malina.body),
        }}
      >
        <p
          className={`${inter.className} whitespace-pre-line text-[#5d4d42]/84`}
          style={{
            maxWidth: TEXT_LAYER_EDITOR.malina.bodyWidth,
            fontSize: TEXT_LAYER_EDITOR.malina.bodyFontSize,
            lineHeight: TEXT_LAYER_EDITOR.malina.bodyLineHeight,
            textWrap: "balance",
          }}
        >
          {content.subtitle}
        </p>
      </motion.div>
    </div>
  );
}

function PlainTextScene({
  content,
  progress,
  manualControls,
  isProductScene,
  disableInitialAnimation = false,
}: SceneProps & { isProductScene: boolean }) {
  const phases = isProductScene ? TEXT_REVEAL_PHASES.productPlain : TEXT_REVEAL_PHASES.intro;
  const eyebrowIn = getPhaseProgress(phases.eyebrow, progress);
  const titleIn = getPhaseProgress(phases.title, progress);
  const subtitleIn = getPhaseProgress(phases.subtitle, progress);
  const accentIn = getPhaseProgress(phases.accent, progress);

  const titleMaxWidth = manualControls.titleMaxWidth ?? TEXT_LAYER_EDITOR.plain.titleMaxWidth;
  const titleFontSize = manualControls.titleFontSize ?? TEXT_LAYER_EDITOR.plain.titleFontSize;
  const titleLineHeight = manualControls.titleLineHeight ?? TEXT_LAYER_EDITOR.plain.titleLineHeight;
  const titleLetterSpacing =
    manualControls.titleLetterSpacing ?? TEXT_LAYER_EDITOR.plain.titleLetterSpacing;
  const subtitleMaxWidth =
    manualControls.subtitleMaxWidth ?? TEXT_LAYER_EDITOR.plain.subtitleMaxWidth;

  return (
    <div className="relative flex flex-col">
      {content.eyebrow ? (
        <motion.p
          initial={disableInitialAnimation ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={buildRevealStyles(eyebrowIn, {
            distance: 14,
            blur: 8,
            scaleFrom: 0.985,
          })}
          transition={getPhaseTransition(0.86)}
          className={`${inter.className} font-semibold uppercase text-[#81695a]/72`}
          style={{
            marginBottom: TEXT_LAYER_EDITOR.plain.eyebrowMarginBottom,
            fontSize: TEXT_LAYER_EDITOR.plain.eyebrowFontSize,
            letterSpacing: TEXT_LAYER_EDITOR.plain.eyebrowTracking,
          }}
        >
          {content.eyebrow}
        </motion.p>
      ) : null}

      <motion.h1
        initial={
          disableInitialAnimation
            ? false
            : { opacity: 0, y: 36, scale: 0.968, filter: "blur(18px)" }
        }
        animate={buildRevealStyles(titleIn, {
          distance: 36,
          blur: 18,
          scaleFrom: 0.968,
        })}
        transition={getPhaseTransition(1.22)}
        className={`${playfair.className} whitespace-pre-line text-[#2f241f] drop-shadow-[0_14px_30px_rgba(255,255,255,0.18)]`}
        style={{
          maxWidth: titleMaxWidth,
          fontSize: titleFontSize,
          lineHeight: titleLineHeight,
          letterSpacing: titleLetterSpacing,
          textWrap: "balance",
        }}
      >
        {content.title}
      </motion.h1>

      {content.subtitle ? (
        <motion.p
          initial={
            disableInitialAnimation
              ? false
              : { opacity: 0, y: 24, scale: 0.992, filter: "blur(12px)" }
          }
          animate={buildRevealStyles(subtitleIn, {
            distance: 22,
            blur: 12,
            scaleFrom: 0.992,
          })}
          transition={getPhaseTransition(1.02)}
          className={`${inter.className} text-[#5d4d42]/82`}
          style={{
            marginTop: TEXT_LAYER_EDITOR.plain.subtitleMarginTop,
            maxWidth: subtitleMaxWidth,
            fontSize: TEXT_LAYER_EDITOR.plain.subtitleFontSize,
            lineHeight: TEXT_LAYER_EDITOR.plain.subtitleLineHeight,
            textWrap: "balance",
          }}
        >
          {content.subtitle}
        </motion.p>
      ) : null}

      {content.subtitle ? (
        <motion.div
          initial={disableInitialAnimation ? false : { opacity: 0, scaleX: 0.36 }}
          animate={buildLineRevealStyles(accentIn, 0.36)}
          transition={getPhaseTransition(0.9)}
          className={`h-px bg-[#8a705f]/18 ${getOriginClass(content.align)}`}
          style={{
            marginTop: TEXT_LAYER_EDITOR.plain.accentMarginTop,
            width: TEXT_LAYER_EDITOR.plain.accentWidth,
          }}
        />
      ) : null}
    </div>
  );
}

function GlassCardScene({
  content,
  progress,
  manualControls,
  uiLabels,
  disableInitialAnimation = false,
}: SceneProps & { uiLabels: UiLabels }) {
  const phases = TEXT_REVEAL_PHASES.productGlass;
  const cardIn = getPhaseProgress(phases.card, progress);
  const eyebrowIn = getPhaseProgress(phases.eyebrow, progress);
  const titleIn = getPhaseProgress(phases.title, progress);
  const dividerIn = getPhaseProgress(phases.divider, progress);
  const subtitleIn = getPhaseProgress(phases.subtitle, progress);
  const actionsIn = getPhaseProgress(phases.actions, progress);
  const sheenIn = getPhaseProgress(phases.sheen, progress);
  const glowIn = getPhaseProgress(phases.glow, progress);

  const titleMaxWidth = manualControls.titleMaxWidth ?? TEXT_LAYER_EDITOR.glass.titleMaxWidth;
  const subtitleMaxWidth =
    manualControls.subtitleMaxWidth ?? TEXT_LAYER_EDITOR.glass.subtitleMaxWidth;
  const subtitleFontSize =
    manualControls.subtitleFontSize ?? TEXT_LAYER_EDITOR.glass.subtitleFontSize;
  const subtitleLineHeight =
    manualControls.subtitleLineHeight ?? TEXT_LAYER_EDITOR.glass.subtitleLineHeight;
  const lateralOffset = getDirectionalOffset(content.align, 26);
  const cardTilt =
    content.align === "left"
      ? TEXT_LAYER_EDITOR.glass.sideTilt
      : content.align === "right"
        ? -TEXT_LAYER_EDITOR.glass.sideTilt
        : 0;

  return (
    <motion.div
      initial={
        disableInitialAnimation
          ? false
          : {
              opacity: 0,
              y: 38,
              scale: 0.92,
              rotateX: 10,
              rotateY: cardTilt,
              filter: "blur(18px)",
            }
      }
      animate={{
        ...buildRevealStyles(cardIn, {
          distance: 38,
          blur: 18,
          scaleFrom: 0.92,
        }),
        rotateX: lerp(10, 0, cardIn),
        rotateY: lerp(cardTilt, 0, cardIn),
      }}
      transition={getPhaseTransition(0.96)}
      className="relative w-full overflow-hidden border border-white/44 bg-[linear-gradient(145deg,rgba(255,255,255,0.58),rgba(255,255,255,0.2)_38%,rgba(255,249,244,0.14)_100%)] shadow-[0_34px_120px_rgba(78,49,31,0.2)] backdrop-blur-[30px]"
      style={{
        borderRadius: TEXT_LAYER_EDITOR.glass.radius,
        paddingInline: TEXT_LAYER_EDITOR.glass.paddingInline,
        paddingBlock: TEXT_LAYER_EDITOR.glass.paddingBlock,
        minHeight: TEXT_LAYER_EDITOR.glass.minHeight,
        transformPerspective: "1600px",
      }}
    >
      <motion.div
        initial={disableInitialAnimation ? false : { opacity: 0, scale: 0.94 }}
        animate={{
          opacity: lerp(0, 0.95, cardIn),
          scale: lerp(0.94, 1, cardIn),
        }}
        transition={getPhaseTransition(0.92)}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.56),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(219,184,145,0.18),transparent_38%)]"
      />

      <motion.div
        initial={disableInitialAnimation ? false : { opacity: 0, scaleX: 0.72 }}
        animate={buildLineRevealStyles(cardIn, 0.72)}
        transition={getPhaseTransition(0.9)}
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-white/85 via-white/35 to-transparent"
      />

      <motion.div
        initial={disableInitialAnimation ? false : { opacity: 0, scale: 0.86 }}
        animate={{
          opacity: lerp(0, 0.9, glowIn),
          scale: lerp(0.8, 1.04, glowIn),
        }}
        transition={getPhaseTransition(1.08)}
        className="pointer-events-none absolute -bottom-20 right-[-10%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_70%)] blur-3xl"
      />

      <motion.div
        initial={disableInitialAnimation ? false : { opacity: 0, x: -96, scaleX: 0.84 }}
        animate={{
          opacity: lerp(0, 0.9, sheenIn),
          x: lerp(-96, 0, sheenIn),
          scaleX: lerp(0.84, 1, sheenIn),
        }}
        transition={getPhaseTransition(1)}
        className="pointer-events-none absolute inset-y-[-18%] left-[-8%] w-[44%] bg-[linear-gradient(105deg,rgba(255,255,255,0)_10%,rgba(255,255,255,0.38)_42%,rgba(255,255,255,0.1)_64%,rgba(255,255,255,0)_84%)] blur-2xl"
      />

      <motion.div
        initial={disableInitialAnimation ? false : { opacity: 0, x: 42, y: -18, scale: 0.9 }}
        animate={{
          opacity: lerp(0, 0.72, glowIn),
          x: lerp(42, 0, glowIn),
          y: lerp(-18, 0, glowIn),
          scale: lerp(0.9, 1, glowIn),
        }}
        transition={getPhaseTransition(1.04)}
        className="pointer-events-none absolute -right-10 top-[-15%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.34),transparent_72%)] blur-2xl"
      />

      <div className={`relative flex min-h-full flex-col ${getGlassAlignmentClass(content.align)}`}>
        <motion.p
          initial={
            disableInitialAnimation
              ? false
              : { opacity: 0, x: lateralOffset * 0.5, y: 12, filter: "blur(8px)" }
          }
          animate={{
            ...buildRevealStyles(eyebrowIn, {
              distance: 12,
              blur: 8,
              scaleFrom: 0.985,
            }),
            x: lerp(lateralOffset * 0.5, 0, eyebrowIn),
          }}
          transition={getPhaseTransition(0.8)}
          className={`${inter.className} font-semibold uppercase text-[#7c6557]/76`}
          style={{
            marginBottom: TEXT_LAYER_EDITOR.glass.eyebrowMarginBottom,
            fontSize: TEXT_LAYER_EDITOR.glass.eyebrowFontSize,
            letterSpacing: TEXT_LAYER_EDITOR.glass.eyebrowTracking,
          }}
        >
          {content.eyebrow}
        </motion.p>

        <motion.h2
          initial={
            disableInitialAnimation
              ? false
              : {
                  opacity: 0,
                  x: lateralOffset,
                  y: 34,
                  scale: 0.958,
                  rotateX: 6,
                  filter: "blur(18px)",
                }
          }
          animate={{
            ...buildRevealStyles(titleIn, {
              distance: 34,
              blur: 18,
              scaleFrom: 0.958,
            }),
            x: lerp(lateralOffset, 0, titleIn),
            rotateX: lerp(6, 0, titleIn),
          }}
          transition={getPhaseTransition(0.98)}
          className={`${playfair.className} text-[#2f241f] drop-shadow-[0_14px_28px_rgba(255,255,255,0.2)]`}
          style={{
            maxWidth: titleMaxWidth,
            fontSize: TEXT_LAYER_EDITOR.glass.titleFontSize,
            lineHeight: TEXT_LAYER_EDITOR.glass.titleLineHeight,
            letterSpacing: TEXT_LAYER_EDITOR.glass.titleLetterSpacing,
            textWrap: "balance",
            transformPerspective: "1400px",
          }}
        >
          {getEditorialTitle(content.title)}
        </motion.h2>

        <motion.div
          initial={disableInitialAnimation ? false : { opacity: 0, scaleX: 0.2 }}
          animate={buildLineRevealStyles(dividerIn, 0.2)}
          transition={getPhaseTransition(0.76)}
          className={`h-px bg-[#7f6757]/20 ${getOriginClass(content.align)}`}
          style={{
            marginTop: TEXT_LAYER_EDITOR.glass.dividerMarginTop,
            width: TEXT_LAYER_EDITOR.glass.dividerWidth,
          }}
        />

        <motion.p
          initial={
            disableInitialAnimation
              ? false
              : {
                  opacity: 0,
                  x: lateralOffset * 0.42,
                  y: 20,
                  scale: 0.992,
                  filter: "blur(12px)",
                }
          }
          animate={{
            ...buildRevealStyles(subtitleIn, {
              distance: 20,
              blur: 12,
              scaleFrom: 0.992,
            }),
            x: lerp(lateralOffset * 0.42, 0, subtitleIn),
          }}
          transition={getPhaseTransition(0.9)}
          className={`${inter.className} text-[#5e4d42]/84`}
          style={{
            marginTop: TEXT_LAYER_EDITOR.glass.subtitleMarginTop,
            maxWidth: subtitleMaxWidth,
            fontSize: subtitleFontSize,
            lineHeight: subtitleLineHeight,
            textWrap: "balance",
          }}
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={
            disableInitialAnimation
              ? false
              : {
                  opacity: 0,
                  x: lateralOffset * 0.28,
                  y: 18,
                  scale: 0.988,
                  filter: "blur(10px)",
                }
          }
          animate={{
            ...buildRevealStyles(actionsIn, {
              distance: 18,
              blur: 10,
              scaleFrom: 0.988,
            }),
            x: lerp(lateralOffset * 0.28, 0, actionsIn),
          }}
          transition={getPhaseTransition(0.86)}
          className={`flex flex-wrap ${getActionsClass(content.align)}`}
          style={{
            marginTop: TEXT_LAYER_EDITOR.glass.actionsMarginTop,
            gap: TEXT_LAYER_EDITOR.glass.actionsGap,
          }}
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.985 }}
            className={`${inter.className} pointer-events-auto rounded-full border border-[#2f241f]/12 bg-[#2f241f] font-medium uppercase text-white shadow-[0_16px_38px_rgba(47,36,31,0.18)] transition-colors duration-300 hover:bg-[#3a2c24]`}
            style={{
              fontSize: TEXT_LAYER_EDITOR.glass.buttonFontSize,
              paddingInline: TEXT_LAYER_EDITOR.glass.buttonPaddingInline,
              paddingBlock: TEXT_LAYER_EDITOR.glass.buttonPaddingBlock,
            }}
          >
            {uiLabels.catalog}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.985 }}
            className={`${inter.className} pointer-events-auto rounded-full border border-white/46 bg-white/58 font-medium uppercase text-[#3b2d26] shadow-[0_10px_26px_rgba(255,255,255,0.12)] backdrop-blur-xl transition-colors duration-300 hover:bg-white/72`}
            style={{
              fontSize: TEXT_LAYER_EDITOR.glass.buttonFontSize,
              paddingInline: TEXT_LAYER_EDITOR.glass.buttonPaddingInline,
              paddingBlock: TEXT_LAYER_EDITOR.glass.buttonPaddingBlock,
            }}
          >
            {uiLabels.details}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

const INTRO_TEXT_TRANSLATIONS: Record<
  Locale,
  {ui: UiLabels; empty: SceneContent; scenes: Record<number, SceneContent>}
> = {
  ru: {
    ui: {catalog: "Каталог", details: "Подробнее"},
    empty: {eyebrow: "", title: "", subtitle: "", align: "center"},
    scenes: {
      0: {eyebrow: "", title: "Натуральные йогурты от компании\nSOFIN.", subtitle: "", align: "center"},
      1: {eyebrow: "SOFIN / MALINA", title: "Малина.\nНежный ягодный вкус", subtitle: "", align: "center"},
      2: {eyebrow: "SOFIN / MALINA", title: "Малина.\nНежный ягодный вкус", subtitle: "Лёгкий сливочный йогурт с деликатной малиновой сладостью.\nМягкий и приятный вкус для первого знакомства с коллекцией.", align: "center"},
      3: {eyebrow: "SOFIN / ANANAS", title: "Ананас.\nСвежий тропический акцент", subtitle: "Освежающий вкус с лёгкой фруктовой яркостью и мягкой молочной основой. Идеальный баланс нежности и сочного настроения.", align: "left"},
      4: {eyebrow: "SOFIN / BANAN", title: "Банан. Кремовый", subtitle: "Более плотный и бархатный вкус с приятной банановой сладостью. Спокойный вариант для любителей мягких десертных нот.", align: "right"},
      5: {eyebrow: "SOFIN / OLCHA", title: "Вишня", subtitle: "Фруктовый вкус с более насыщенным характером и лёгкой освежающей кислинкой. Яркий выбор для тех, кто любит сочные ягодные акценты.", align: "left"},
      6: {eyebrow: "SOFIN / ORMON MEVA", title: "Лесные ягоды. Микс", subtitle: "Богатый вкус с многослойным ягодным оттенком. Более глубокий, ароматный и выразительный вариант с приятной десертной мягкостью.", align: "right"},
      7: {eyebrow: "SOFIN / QULUPNAY", title: "Клубника. Классика", subtitle: "Нежный сливочно-клубничный вкус, который легко полюбить с первой ложки. Лёгкий, понятный и особенно приятный в повседневной подаче.", align: "left"},
      8: {eyebrow: "SOFIN / SHAFTOLI", title: "Персик.", subtitle: "Тёплый, гладкий и мягко-сочный вкус с деликатной фруктовой сладостью.", align: "right"},
      9: {eyebrow: "SOFIN / QULUPNAY BANAN", title: "Клубника и банан.", subtitle: "Мягкое сочетание клубничной свежести и кремовой банановой сладости. Нежный десертный вкус с лёгким фруктовым настроением.", align: "left"}
    }
  },
  uz: {
    ui: {catalog: "Katalog", details: "Batafsil"},
    empty: {eyebrow: "", title: "", subtitle: "", align: "center"},
    scenes: {
      0: {eyebrow: "", title: "SOFIN kompaniyasining\ntabiiy yogurtlari.", subtitle: "", align: "center"},
      1: {eyebrow: "SOFIN / MALINA", title: "Malina.\nMayin rezavor ta’m", subtitle: "", align: "center"},
      2: {eyebrow: "SOFIN / MALINA", title: "Malina.\nMayin rezavor ta’m", subtitle: "Nozik malina shirinligi va yengil qaymoqli asos.\nKolleksiya bilan birinchi tanishuv uchun yoqimli, yumshoq ta’m.", align: "center"},
      3: {eyebrow: "SOFIN / ANANAS", title: "Ananas.\nTropik yangilik", subtitle: "Yengil mevali yorqinlik va yumshoq sutli asos. Noziklik va shirali kayfiyatning muvozanati.", align: "left"},
      4: {eyebrow: "SOFIN / BANAN", title: "Banan. Kremli", subtitle: "Banan shirinligi bilan zichroq va baxmal ta’m. Yumshoq desert notalarini yoqtiradiganlar uchun sokin variant.", align: "right"},
      5: {eyebrow: "SOFIN / OLCHA", title: "Olcha", subtitle: "Yanada to‘yingan xarakter va yengil tetik nordonlik. Shira va rezavor ohanglarni sevuvchilar uchun yorqin tanlov.", align: "left"},
      6: {eyebrow: "SOFIN / ORMON MEVA", title: "O‘rmon mevalari. Miks", subtitle: "Ko‘p qatlamli rezavor ohangli boy ta’m. Chuqurroq, iforli va ifodali desert yumshoqligi.", align: "right"},
      7: {eyebrow: "SOFIN / QULUPNAY", title: "Qulupnay. Klassika", subtitle: "Birinchi qoshiqdanoq yoqimli bo‘ladigan mayin qaymoqli-qulupnay ta’mi. Kundalik taqdim uchun yengil va tushunarli.", align: "left"},
      8: {eyebrow: "SOFIN / SHAFTOLI", title: "Shaftoli.", subtitle: "Nozik mevali shirinlik bilan iliq, silliq va yumshoq-shirali ta’m.", align: "right"},
      9: {eyebrow: "SOFIN / QULUPNAY BANAN", title: "Qulupnay va banan.", subtitle: "Qulupnay yangiligi va kremli banan shirinligining mayin uyg‘unligi. Yengil mevali kayfiyatdagi desert ta’m.", align: "left"}
    }
  },
  en: {
    ui: {catalog: "Catalog", details: "Details"},
    empty: {eyebrow: "", title: "", subtitle: "", align: "center"},
    scenes: {
      0: {eyebrow: "", title: "Natural yogurts\nby SOFIN.", subtitle: "", align: "center"},
      1: {eyebrow: "SOFIN / MALINA", title: "Raspberry.\nSoft berry taste", subtitle: "", align: "center"},
      2: {eyebrow: "SOFIN / MALINA", title: "Raspberry.\nSoft berry taste", subtitle: "Light creamy yogurt with delicate raspberry sweetness.\nSoft, pleasant flavor for a first taste of the collection.", align: "center"},
      3: {eyebrow: "SOFIN / ANANAS", title: "Pineapple.\nFresh tropical accent", subtitle: "Refreshing fruit brightness with a soft dairy base. A balanced mix of tenderness and juicy mood.", align: "left"},
      4: {eyebrow: "SOFIN / BANAN", title: "Banana. Creamy", subtitle: "A denser, velvety taste with pleasant banana sweetness. A calm choice for soft dessert notes.", align: "right"},
      5: {eyebrow: "SOFIN / OLCHA", title: "Cherry", subtitle: "A fruit flavor with a richer character and light refreshing tartness. Bright and juicy berry accents.", align: "left"},
      6: {eyebrow: "SOFIN / ORMON MEVA", title: "Forest berries. Mix", subtitle: "A rich, layered berry flavor. Deeper, aromatic and expressive with soft dessert smoothness.", align: "right"},
      7: {eyebrow: "SOFIN / QULUPNAY", title: "Strawberry. Classic", subtitle: "A tender creamy strawberry flavor that is easy to love from the first spoon. Light and familiar for everyday serving.", align: "left"},
      8: {eyebrow: "SOFIN / SHAFTOLI", title: "Peach.", subtitle: "Warm, smooth and softly juicy taste with delicate fruit sweetness.", align: "right"},
      9: {eyebrow: "SOFIN / QULUPNAY BANAN", title: "Strawberry and banana.", subtitle: "A soft pairing of strawberry freshness and creamy banana sweetness. Gentle dessert flavor with a light fruity mood.", align: "left"}
    }
  }
};

function getContent(step: number, locale: Locale): SceneContent {
  return INTRO_TEXT_TRANSLATIONS[locale].scenes[step] ?? INTRO_TEXT_TRANSLATIONS[locale].empty;
}

function getWrapperStyle() {
  return {
    bottom: TEXT_LAYER_EDITOR.wrapper.bottom,
    paddingInline: TEXT_LAYER_EDITOR.wrapper.paddingX,
  };
}

function getSceneOffsetStyle(manualControls: TextSceneControls): CSSProperties {
  return getFloatingBlockMoveStyle(manualControls);
}

function getFloatingBlockMoveStyle(
  manualControls: TextFloatingBlockControls | TextSceneControls
): CSSProperties {
  return {
    translate: `${manualControls.x ?? "0px"} ${manualControls.y ?? "0px"}`,
  };
}

function getSceneWidth(
  align: SceneAlign,
  isGlassScene: boolean,
  manualControls: TextSceneControls
) {
  if (manualControls.width) return manualControls.width;
  if (isGlassScene) return TEXT_LAYER_EDITOR.glass.width;
  if (align === "center") return TEXT_LAYER_EDITOR.plain.centerWidth;
  return TEXT_LAYER_EDITOR.plain.sideWidth;
}

function getJustifyClass(align: SceneAlign) {
  if (align === "left") return "justify-center sm:justify-start";
  if (align === "right") return "justify-center sm:justify-end";
  return "justify-center";
}

function getAlignmentClass(align: SceneAlign) {
  if (align === "left") return "flex-col items-center text-center sm:items-start sm:text-left";
  if (align === "right") return "flex-col items-center text-center sm:items-end sm:text-right";
  return "flex-col items-center text-center";
}

function getGlassAlignmentClass(align: SceneAlign) {
  if (align === "left") return "items-start text-left";
  if (align === "right") return "items-end text-right";
  return "items-center text-center";
}

function getActionsClass(align: SceneAlign) {
  if (align === "left") return "justify-start";
  if (align === "right") return "justify-end";
  return "justify-center";
}

function getDirectionalOffset(align: SceneAlign, distance: number) {
  if (align === "left") return -distance;
  if (align === "right") return distance;
  return 0;
}

function getOriginClass(align: SceneAlign) {
  if (align === "left") return "origin-left";
  if (align === "right") return "origin-right";
  return "origin-center";
}

function getEditorialTitle(title: string) {
  return title.replace(/\s*\n\s*/g, " ");
}

function getMobileTitle(title: string) {
  return getEditorialTitle(title);
}

function normalizeLocale(locale: string): Locale {
  if (locale === "uz" || locale === "ru" || locale === "en") return locale;
  return "ru";
}

function buildRevealStyles(
  phase: number,
  options: {
    distance?: number;
    blur?: number;
    scaleFrom?: number;
    opacityFrom?: number;
  } = {}
) {
  const value = clamp(phase, 0, 1);
  const { distance = 18, blur = 10, scaleFrom = 1, opacityFrom = 0 } = options;

  return {
    opacity: lerp(opacityFrom, 1, value),
    y: lerp(distance, 0, value),
    scale: lerp(scaleFrom, 1, value),
    filter: cssBlur(lerp(blur, 0, value)),
  };
}

function cssBlur(value: number) {
  return `blur(${Math.max(0, value).toFixed(3)}px)`;
}

function buildLineRevealStyles(phase: number, scaleFrom = 0.4) {
  const value = clamp(phase, 0, 1);

  return {
    opacity: value,
    scaleX: lerp(scaleFrom, 1, value),
  };
}

function getPhaseTransition(duration: number, delay = 0) {
  return getTimedTransition(duration, CONTENT_EASE, delay);
}

function getTimedTransition(
  duration: number,
  ease: typeof CONTENT_EASE | typeof PREMIUM_EASE,
  delay = 0
) {
  return {
    duration: scaleTextDuration(duration),
    delay: scaleTextDuration(delay),
    ease,
  };
}

function getPhaseProgress(range: readonly [number, number], progress: number) {
  return smoothstep(range[0], range[1], progress);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
