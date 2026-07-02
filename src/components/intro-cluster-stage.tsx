"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Html, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {assetUrl} from "@/lib/assets";
import {
  SHOWCASE_MODEL_TIMING,
  getIdleTime,
  scaleModelDamping,
} from "@/lib/showcase-controls";

type IntroClusterStageProps = {
  step: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  step1Progress: number;
  step2Progress: number;
  step3Progress: number;
  step4Progress: number;
  step5Progress: number;
  step6Progress: number;
  step7Progress: number;
  step8Progress: number;
  step9Progress: number;
  direction: "forward" | "backward";
  isMobile?: boolean;
};

type FlavorKey =
  | "banan"
  | "ormon-meva"
  | "olcha"
  | "shaftoli"
  | "ananas"
  | "malina"
  | "oulupnay"
  | "oulupnay-banan";

type CupConfig = {
  flavor: FlavorKey;
  isMain?: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  floatOffset: number;
  floatAmp: number;
  rotAmp: number;
};

type SceneStepProgressProps = IntroClusterStageProps;

type TransformTarget = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
};

type MotionOffsets = TransformTarget;

const BASE_MODEL_PATH = assetUrl("/models/products/base-cup.glb");
const PRODUCT_TEXTURE_FLAVORS: FlavorKey[] = [
  "ananas",
  "banan",
  "malina",
  "olcha",
  "ormon-meva",
  "oulupnay",
  "oulupnay-banan",
  "shaftoli",
];
const PRODUCT_TEXTURE_URLS = PRODUCT_TEXTURE_FLAVORS.flatMap((flavor) => [
  assetUrl(`/textures/products/${flavor}-side.webp`),
  assetUrl(`/textures/products/${flavor}-lid.webp`),
]);

const cups: CupConfig[] = [
  {
    flavor: "banan",
    position: [-1, 0.64, -0.82],
    rotation: [0.18, 0.08, 0],
    scale: 0.4,
    floatOffset: 0.1,
    floatAmp: 0.0045,
    rotAmp: 0.0035,
  },
  {
    flavor: "ormon-meva",
    position: [0.2, 0.64, -0.82],
    rotation: [0.18, 0.03, 0],
    scale: 0.4,
    floatOffset: 0.9,
    floatAmp: 0.0045,
    rotAmp: 0.0035,
  },
  {
    flavor: "olcha",
    position: [1.5, 0.64, -0.82],
    rotation: [0.18, -0.03, 0],
    scale: 0.4,
    floatOffset: 1.7,
    floatAmp: 0.0045,
    rotAmp: 0.0035,
  },
  {
    flavor: "shaftoli",
    position: [2.7, 0.64, -0.82],
    rotation: [0.18, -0.08, 0],
    scale: 0.4,
    floatOffset: 2.5,
    floatAmp: 0.0045,
    rotAmp: 0.0035,
  },
  {
    flavor: "ananas",
    position: [-0.3, -0.2, 0.16],
    rotation: [0.05, 0.08, 0],
    scale: 0.54,
    floatOffset: 0.4,
    floatAmp: 0.006,
    rotAmp: 0.004,
  },
  {
    flavor: "malina",
    isMain: true,
    position: [1.2, -0.24, 0.34],
    rotation: [0.05, 0, 0],
    scale: 0.64,
    floatOffset: 1.2,
    floatAmp: 0.007,
    rotAmp: 0.004,
  },
  {
    flavor: "oulupnay",
    position: [2.4, -0.2, 0.16],
    rotation: [0.05, -0.08, 0],
    scale: 0.54,
    floatOffset: 2.0,
    floatAmp: 0.006,
    rotAmp: 0.004,
  },
];

const SWAP_AT = SHOWCASE_MODEL_TIMING.flavorSwap.softForward;
const SWAP_BACK_AT = SHOWCASE_MODEL_TIMING.flavorSwap.softBackward;
const SWAP_SPIN_AT = SHOWCASE_MODEL_TIMING.flavorSwap.spinForward;
const SWAP_SPIN_BACK_AT = SHOWCASE_MODEL_TIMING.flavorSwap.spinBackward;
const OLCHA_TEXTURE_SWAP_AT = 0.62;
const OLCHA_TEXTURE_SWAP_BACK_AT = 0.46;

const SWAP_POSE = {
  x: 3.04,
  y: -0.3,
  z: 0.22,
  rx: 4.26,
  ry: -0.48,
  rz: 0.1,
  s: 0.762,
};

const STEP4_START_ROT = {
  rx: 6.9,
  ry: -0.32,
  rz: 0.04,
};

const BANAN_POSE = {
  x: -0.4,
  y: 0.18,
  z: 0.2,
  rx: 7,
  ry: 0.6,
  rz: 0.0,
  s: 0.82,
};

const OLCHA_POSE = {
  x: 3.2,
  y: -0.4,
  z: 0.18,
  rx: 1.1,
  ry: -0.45,
  rz: 0.5,
  s: 0.8,
};

const ORMON_POSE = {
  x: -0.4,
  y: 0.18,
  z: 0.18,
  rx: 6.9,
  ry: 0.65,
  rz: -0.05,
  s: 0.8,
};

const OULUPNAY_POSE = {
  x: 3,
  y: 0.34,
  z: 0.22,
  rx: 7.85,
  ry: 0.15,
  rz: 0.4,
  s: 0.82,
};

const SHAFTOLI_POSE = {
  x: 1.18,
  y: -0.46,
  z: 0.22,
  rx: 13.3,
  ry: -0.1,
  rz: 0.02,
  s: 0.84,
};

const STRAWBERRY_BANAN_POSE = {
  x: 2.72,
  y: -0.75,
  z: 0.2,
  rx: 7.3,
  ry: -0.4,
  rz: -0.0,
  s: 0.82,
};

const DESKTOP_INTRO_CUP_POSES: Partial<Record<FlavorKey, TransformTarget & {hidden?: boolean}>> = {
  malina: {x: 1.36, y: 0.34, z: 0.18, rx: 0.06, ry: 0.02, rz: 0.01, s: 0.52},
  ananas: {x: 0.52, y: -0.44, z: 0.08, rx: 0.05, ry: 0.07, rz: -0.02, s: 0.5},
  shaftoli: {x: 2.09, y: -0.42, z: 0.08, rx: 0.05, ry: -0.07, rz: 0.02, s: 0.5},
  "ormon-meva": {x: 0.02, y: -1.18, z: 0.2, rx: 0.05, ry: 0.08, rz: -0.02, s: 0.46},
  oulupnay: {x: 1.32, y: -1.2, z: 0.28, rx: 0.05, ry: 0, rz: 0, s: 0.52},
  banan: {x: 2.58, y: -1.16, z: 0.2, rx: 0.05, ry: -0.08, rz: 0.02, s: 0.46},
  olcha: {x: 3.18, y: -0.5, z: 0, rx: 0.05, ry: -0.08, rz: 0.02, s: 0.42, hidden: true},
};

const MOBILE_MAIN_POSE = {
  x: 0.9,
  y: 0.76,
  z: 1.28,
  rx: 7.06,
  ry: 0.18,
  rz: 0.02,
  s: 0.64,
};

const MOBILE_MODEL_EDITOR = {
  introCluster: {
    banan: { x: -0.74, y: 1.2, z: 0.92, rx: 7.02, ry: 0.28, rz: -0.08, s: 0.25 },
    shaftoli: { x: 0.9, y: 1.1, z: 1.08, rx: 7.04, ry: -0.18, rz: 0.00, s: 0.3 },
    olcha: { x: -0.7, y: 0.72, z: 1.04, rx: 7.02, ry: 0.06, rz: 0.04, s: 0.28 },
    ananas: { x: 0.1, y: 1.2, z: 1.08, rx: 7.04, ry: 0.18, rz: 0.02, s: 0.3 },
    oulupnay: { x: 0.9, y: -0.15, z: 1.14, rx: 7, ry: -0.08, rz: -0, s: 0.3 },
    malina: { x: 0.7, y: 0.5, z: 1.14, rx: 7, ry: 0.0, rz: 0.00, s: 0.4 },
    "ormon-meva": { x: 0.1, y: -0.1, z: 1.14, rx: 7, ry: 0.08, rz: -0, s: 0.3 },
  },

  finalPoses: {
    0: { x: 0.95, y: 0.74, z: 1.18, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.42 },
    1: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.55 },
    2: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.55 },
    3: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
    4: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
    5: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
    6: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
    7: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
    8: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
    9: { x: 0.95, y: 0.72, z: 1.28, rx: 7.06, ry: 0.18, rz: 0.02, s: 0.58 },
  },
} satisfies {
  introCluster: Partial<Record<FlavorKey, TransformTarget>>;
  finalPoses: Record<IntroClusterStageProps["step"], TransformTarget>;
};

export function IntroClusterStage({
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
  direction,
  isMobile = false,
}: IntroClusterStageProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  return (
    <div className="absolute inset-0 z-20">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0.02, 9.95]} fov={23} />

        <PremiumLightRig
          direction={direction}
          step={step}
          step1Progress={step1Progress}
          step2Progress={step2Progress}
          step3Progress={step3Progress}
          step4Progress={step4Progress}
          step5Progress={step5Progress}
          step6Progress={step6Progress}
          step7Progress={step7Progress}
          step8Progress={step8Progress}
          step9Progress={step9Progress}
          isMobile={isMobile}
        />

        <SceneCamera
          direction={direction}
          cameraRef={cameraRef}
          step={step}
          step1Progress={step1Progress}
          step2Progress={step2Progress}
          step3Progress={step3Progress}
          step4Progress={step4Progress}
          step5Progress={step5Progress}
          step6Progress={step6Progress}
          step7Progress={step7Progress}
          step8Progress={step8Progress}
          step9Progress={step9Progress}
          isMobile={isMobile}
        />

        <Suspense fallback={<Fallback />}>
          <Environment preset="studio" environmentIntensity={0.34} />

          {cups.map((cup) => (
            <Cup
              key={cup.flavor}
              {...cup}
              step={step}
              step1Progress={step1Progress}
              step2Progress={step2Progress}
              step3Progress={step3Progress}
              step4Progress={step4Progress}
              step5Progress={step5Progress}
              step6Progress={step6Progress}
              step7Progress={step7Progress}
              step8Progress={step8Progress}
              step9Progress={step9Progress}
              direction={direction}
              isMobile={isMobile}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

function PremiumLightRig({
  direction,
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
}: SceneStepProgressProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const time = getIdleTime(state.clock.getElapsedTime());
    const activeProgress = getCurrentStepProgress(
      step,
      step1Progress,
      step2Progress,
      step3Progress,
      step4Progress,
      step5Progress,
      step6Progress,
      step7Progress,
      step8Progress,
      step9Progress
    );
    const settle = getCinematicMotionStrength(direction, step, activeProgress);
    const premiumBias = direction === "backward" ? 1 : step >= 4 ? 1 : 0.76;
    const finalFlavorLight = step >= 9 ? smoothstep(0.18, 1, step9Progress) : 0;
    const glow = Math.sin(time * 0.62 + 0.4) * 0.5 + 0.5;
    const shimmer = Math.sin(time * 1.08 + 1.3);

    if (ambientRef.current) {
      ambientRef.current.intensity = dampValue(
        ambientRef.current.intensity,
        0.48 + settle * 0.12 + glow * 0.05 + finalFlavorLight * 0.035,
        2.8,
        delta,
        0.002
      );
    }

    if (keyRef.current) {
      keyRef.current.intensity = dampValue(
        keyRef.current.intensity,
        0.76 + settle * 0.2 + shimmer * 0.06 + finalFlavorLight * 0.075,
        3.1,
        delta,
        0.002
      );
      keyRef.current.position.x = dampValue(
        keyRef.current.position.x,
        3.2 + Math.sin(time * 0.44 + 0.35) * 0.24 * premiumBias,
        3,
        delta
      );
      keyRef.current.position.y = dampValue(
        keyRef.current.position.y,
        3.4 + Math.cos(time * 0.32 + 0.6) * 0.18,
        3,
        delta
      );
      keyRef.current.position.z = dampValue(
        keyRef.current.position.z,
        5.2 + Math.cos(time * 0.28 + 0.8) * 0.16,
        3,
        delta
      );
    }

    if (fillRef.current) {
      fillRef.current.intensity = dampValue(
        fillRef.current.intensity,
        0.24 + settle * 0.12 + glow * 0.04 + finalFlavorLight * 0.035,
        2.8,
        delta,
        0.002
      );
      fillRef.current.position.x = dampValue(
        fillRef.current.position.x,
        -3 + Math.cos(time * 0.41 + 0.2) * 0.22,
        3,
        delta
      );
      fillRef.current.position.y = dampValue(
        fillRef.current.position.y,
        2 + Math.sin(time * 0.36 + 1.4) * 0.14,
        3,
        delta
      );
      fillRef.current.position.z = dampValue(
        fillRef.current.position.z,
        4.6 + Math.sin(time * 0.24 + 0.3) * 0.12,
        3,
        delta
      );
    }

    if (pointRef.current) {
      pointRef.current.intensity = dampValue(
        pointRef.current.intensity,
        0.08 + settle * 0.1 + glow * 0.06 + (step >= 4 ? 0.04 : 0) + finalFlavorLight * 0.07,
        3.2,
        delta,
        0.002
      );
      pointRef.current.position.x = dampValue(
        pointRef.current.position.x,
        1.6 + Math.sin(time * 0.58 + 0.5) * 0.3,
        3.1,
        delta
      );
      pointRef.current.position.y = dampValue(
        pointRef.current.position.y,
        1 + Math.cos(time * 0.52 + 0.7) * 0.18,
        3.1,
        delta
      );
      pointRef.current.position.z = dampValue(
        pointRef.current.position.z,
        4 + Math.cos(time * 0.31 + 0.4) * 0.18 * premiumBias,
        3.1,
        delta
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.52} />
      <directionalLight
        ref={keyRef}
        position={[3.2, 3.4, 5.2]}
        intensity={0.78}
        color="#fff6ee"
      />
      <directionalLight
        ref={fillRef}
        position={[-3.0, 2.0, 4.6]}
        intensity={0.28}
        color="#f4efe9"
      />
      <pointLight
        ref={pointRef}
        position={[1.6, 1.0, 4.0]}
        intensity={0.08}
        color="#fffaf4"
      />
    </>
  );
}

function SceneCamera(
  props: SceneStepProgressProps & {
    cameraRef: { current: THREE.PerspectiveCamera | null };
  }
) {
  const {
    cameraRef,
    direction,
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
    isMobile,
  } = props;

  useFrame((state, delta) => {
    const camera = cameraRef.current;
    if (!camera) return;

    const time = getIdleTime(state.clock.getElapsedTime());
    let targetY = 0.02;
    let targetZ = 8.95;
    let targetX = 0;

    if (isMobile) {
      const activeProgress = getCurrentStepProgress(
        step,
        step1Progress,
        step2Progress,
        step3Progress,
        step4Progress,
        step5Progress,
        step6Progress,
        step7Progress,
        step8Progress,
        step9Progress
      );
      const settle = getCinematicMotionStrength(direction, step, activeProgress);

      targetX = 0;
      targetY = 0.16 + Math.sin(time * 0.54 + 0.35) * 0.018 * settle;
      targetZ = 8.42 + Math.cos(time * 0.38 + 0.8) * 0.035 * settle;

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        targetX,
        scaleModelDamping(5.2),
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        targetY,
        scaleModelDamping(5.2),
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetZ,
        scaleModelDamping(5.2),
        delta
      );

      const nextFov = dampValue(camera.fov, 25.6, 3.4, delta, 0.01);

      if (Math.abs(camera.fov - nextFov) > 0.001) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }

      camera.lookAt(0, 0.18, 0);
      return;
    }

    if (step >= 1) {
      const t = smoothstep(0.18, 1, step1Progress);
      targetY = THREE.MathUtils.lerp(0.02, -0.18, t);
      targetZ = THREE.MathUtils.lerp(8.95, 8.45, t);
      targetX = THREE.MathUtils.lerp(0, -0.1, t);
    }

    if (step >= 2) {
      const t2 = easeInOutSoft(step2Progress);
      targetY = THREE.MathUtils.lerp(-0.18, -0.28, t2);
      targetZ = THREE.MathUtils.lerp(8.45, 8.05, t2);
      targetX = THREE.MathUtils.lerp(-0.1, 0.18, t2);
    }

    if (step >= 3) {
      const t3 = easeInOutSoft(step3Progress);
      const camT = smoothstep(0.84, 1, t3);

      targetY = THREE.MathUtils.lerp(-0.28, -0.02, camT);
      targetZ = THREE.MathUtils.lerp(8.05, 7.72, camT);
      targetX = THREE.MathUtils.lerp(0.18, 0.36, camT);
    }

    if (step >= 4) {
      const t4 = easeInOutSoft(step4Progress);
      const camT4 = smoothstep(0.14, 1, t4);

      targetY = THREE.MathUtils.lerp(-0.02, -0.02, camT4);
      targetZ = THREE.MathUtils.lerp(7.72, 7.84, camT4);
      targetX = THREE.MathUtils.lerp(0.36, -0.18, camT4);
    }

    if (step >= 5) {
      const t5 = easeInOutSoft(step5Progress);
      const camT5 = smoothstep(0.14, 1, t5);

      targetY = THREE.MathUtils.lerp(-0.02, 0.04, camT5);
      targetZ = THREE.MathUtils.lerp(7.84, 7.72, camT5);
      targetX = THREE.MathUtils.lerp(-0.18, -0.24, camT5);
    }

    if (step >= 6) {
      const t6 = easeInOutSoft(step6Progress);
      const camT6 = smoothstep(0.14, 1, t6);

      targetY = THREE.MathUtils.lerp(0.04, 0.01, camT6);
      targetZ = THREE.MathUtils.lerp(7.72, 7.76, camT6);
      targetX = THREE.MathUtils.lerp(-0.24, -0.06, camT6);
    }

    if (step >= 7) {
      const t7 = easeInOutSoft(step7Progress);
      const camT7 = smoothstep(0.14, 1, t7);

      targetY = THREE.MathUtils.lerp(0.01, 0.0, camT7);
      targetZ = THREE.MathUtils.lerp(7.76, 7.68, camT7);
      targetX = THREE.MathUtils.lerp(-0.06, 0.12, camT7);
    }

    if (step >= 8) {
      const t8 = easeInOutSoft(step8Progress);
      const camT8 = smoothstep(0.14, 1, t8);

      targetY = THREE.MathUtils.lerp(0.0, -0.02, camT8);
      targetZ = THREE.MathUtils.lerp(7.68, 7.58, camT8);
      targetX = THREE.MathUtils.lerp(0.12, 0.02, camT8);
    }

    if (step >= 9) {
      const t9 = easeInOutSoft(step9Progress);
      const camT9 = smoothstep(0.14, 1, t9);

      targetY = THREE.MathUtils.lerp(-0.02, 0.02, camT9);
      targetZ = THREE.MathUtils.lerp(7.58, 7.66, camT9);
      targetX = THREE.MathUtils.lerp(0.02, -0.08, camT9);
    }

    const activeProgress = getCurrentStepProgress(
      step,
      step1Progress,
      step2Progress,
      step3Progress,
      step4Progress,
      step5Progress,
      step6Progress,
      step7Progress,
      step8Progress,
      step9Progress
    );
    const settle = getCinematicMotionStrength(direction, step, activeProgress);
    const cinematicBias = direction === "backward" ? 1 : step >= 4 ? 1 : 0.72;

    targetX += Math.sin(time * 0.38 + 0.5) * 0.045 * settle * cinematicBias;
    targetY += Math.sin(time * 0.74 + 0.6) * 0.028 * settle;
    targetZ += Math.cos(time * 0.46 + 0.8) * 0.065 * settle * cinematicBias;

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      scaleModelDamping(4.8),
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      scaleModelDamping(4.8),
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ,
      scaleModelDamping(4.8),
      delta
    );

    const targetFov =
      22.84 + Math.sin(time * 0.23 + 0.5) * 0.16 * settle * cinematicBias;
    const nextFov = dampValue(camera.fov, targetFov, 3.1, delta, 0.01);

    if (Math.abs(camera.fov - nextFov) > 0.001) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }

    camera.lookAt(
      0.15 + Math.sin(time * 0.31 + 0.3) * 0.06 * settle * cinematicBias,
      -0.05 + Math.cos(time * 0.4 + 0.7) * 0.035 * settle,
      Math.sin(time * 0.27 + 0.2) * 0.05 * settle
    );
  });

  return null;
}

function Cup({
  flavor,
  isMain,
  position,
  rotation,
  scale,
  floatOffset,
  floatAmp,
  rotAmp,
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
  direction,
  isMobile = false,
}: CupConfig & {
  step: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  step1Progress: number;
  step2Progress: number;
  step3Progress: number;
  step4Progress: number;
  step5Progress: number;
  step6Progress: number;
  step7Progress: number;
  step8Progress: number;
  step9Progress: number;
  direction: "forward" | "backward";
  isMobile?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mobileSpinRef = useRef({
    key: "",
    baseTurn: 0,
  });

  const renderFlavor: FlavorKey = isMobile && isMain
    ? getMobileRenderFlavor(step, direction, {
        step1Progress,
        step2Progress,
        step3Progress,
        step4Progress,
        step5Progress,
        step6Progress,
        step7Progress,
        step8Progress,
        step9Progress,
      })
    : isMain
    ? step >= 9
      ? direction === "forward"
        ? step9Progress >= SWAP_SPIN_AT
          ? "oulupnay-banan"
          : "shaftoli"
        : step9Progress > SWAP_SPIN_BACK_AT
          ? "oulupnay-banan"
          : "shaftoli"
      : step >= 8
      ? direction === "forward"
        ? step8Progress >= SWAP_SPIN_AT
          ? "shaftoli"
          : "oulupnay"
        : step8Progress > SWAP_SPIN_BACK_AT
          ? "shaftoli"
          : "oulupnay"
      : step >= 7
        ? direction === "forward"
          ? step7Progress >= SWAP_SPIN_AT
            ? "oulupnay"
            : "ormon-meva"
          : step7Progress > SWAP_SPIN_BACK_AT
            ? "oulupnay"
            : "ormon-meva"
        : step >= 6
          ? direction === "forward"
            ? step6Progress >= SWAP_SPIN_AT
              ? "ormon-meva"
              : "olcha"
            : step6Progress > SWAP_SPIN_BACK_AT
              ? "ormon-meva"
              : "olcha"
          : step >= 5
            ? direction === "forward"
              ? step5Progress >= OLCHA_TEXTURE_SWAP_AT
                ? "olcha"
                : "banan"
              : step5Progress > OLCHA_TEXTURE_SWAP_BACK_AT
                ? "olcha"
                : "banan"
            : step >= 4
              ? direction === "forward"
                ? step4Progress >= SWAP_SPIN_AT
                  ? "banan"
                  : "ananas"
                : step4Progress > SWAP_SPIN_BACK_AT
                  ? "banan"
                  : "ananas"
              : step >= 3
                ? direction === "forward"
                  ? step3Progress >= SWAP_AT
                    ? "ananas"
                    : flavor
                  : step3Progress > SWAP_BACK_AT
                    ? "ananas"
                    : flavor
                : flavor
    : flavor;

  const model = useCupModel(renderFlavor);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const time = getIdleTime(state.clock.getElapsedTime(), 0.72) + floatOffset;
    const clusterIdleMotion = getClusterCupIdleMotion(
      time,
      floatOffset,
      floatAmp,
      rotAmp,
      step1Progress
    );
    const heroMotion = getHeroCupMotion(time);

    if (isMobile) {
      if (!isMain) {
        const introPose = getMobileIntroCupPose(flavor);

        if (!introPose || step > 1) {
          setVisibility(group, false);
          setOpacity(group, 0);
          return;
        }

        const exit = step === 1 ? smoothstep(0.06, 0.42, step1Progress) : 0;

        applyTransformMobile(group, delta, {
          ...introPose,
          y: introPose.y + exit * 0.1,
          z: introPose.z - exit * 0.14,
          rx: introPose.rx - exit * 0.14,
          ry: introPose.ry + exit * (introPose.x < 0 ? -0.24 : 0.24),
          rz: introPose.rz + exit * (introPose.x < 0 ? -0.08 : 0.08),
          s: introPose.s * lerp(1, 0.92, exit),
        });

        setVisibility(group, exit < 0.98);
        setOpacity(group, 1 - exit);
        return;
      }

      const activeProgress = getCurrentStepProgress(
        step,
        step1Progress,
        step2Progress,
        step3Progress,
        step4Progress,
        step5Progress,
        step6Progress,
        step7Progress,
        step8Progress,
        step9Progress
      );

      if (step === 0) {
        const introPose = getMobileIntroCupPose("malina") ?? getMobileMainPose(0);

        applyTransformMobile(group, delta, {
          x: introPose.x + heroMotion.x * 0.16,
          y: introPose.y + heroMotion.y * 0.18,
          z: introPose.z + heroMotion.z * 0.16,
          rx: introPose.rx + heroMotion.rx * 0.18,
          ry: introPose.ry + heroMotion.ry * 0.18,
          rz: introPose.rz + heroMotion.rz * 0.18,
          s: introPose.s,
        });

        setVisibility(group, true);
        setOpacity(group, 1);
        return;
      }

      const pose = getMobileMainPose(step);
      const transitionProgress = direction === "backward" ? 1 - activeProgress : activeProgress;
      const fallArc = Math.sin(smoothstep(0.0, 1.0, transitionProgress) * Math.PI) * -0.52;
      const tumbleProgress = smoothstep(0.0, 0.88, transitionProgress);
      const eased = tumbleProgress < 0.5
        ? 2 * tumbleProgress * tumbleProgress
        : 1 - Math.pow(-2 * tumbleProgress + 2, 2) / 2;
      const tumbleDirection = direction === "backward" ? -1 : 1;
      const spinTurn = Math.PI * 2 * SHOWCASE_MODEL_TIMING.spinTurnsPerStep;
      const transitionKey = `${step}-${direction}`;

      if (mobileSpinRef.current.key !== transitionKey) {
        mobileSpinRef.current = {
          key: transitionKey,
          baseTurn: Math.round((group.rotation.x - pose.rx) / spinTurn),
        };
      }

      const finalRx =
        pose.rx +
        mobileSpinRef.current.baseTurn * spinTurn +
        eased * spinTurn * tumbleDirection;

      applyTransformMobile(group, delta, {
        x: pose.x + heroMotion.x * 0.24,
        y: pose.y + fallArc + heroMotion.y * 0.22,
        z: pose.z + heroMotion.z * 0.18,
        rx: finalRx + heroMotion.rx * 0.32,
        ry: pose.ry + heroMotion.ry * 0.24,
        rz: pose.rz + heroMotion.rz * 0.26,
        s: pose.s,
      });

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (!isMain) {
      const desktopIntroPose = DESKTOP_INTRO_CUP_POSES[flavor];

      if (step === 0 && desktopIntroPose) {
        if (desktopIntroPose.hidden) {
          setVisibility(group, false);
          setOpacity(group, 0);
          return;
        }

        applyTransform(group, delta, {
          x: desktopIntroPose.x + heroMotion.x * 0.12,
          y: desktopIntroPose.y + heroMotion.y * 0.14,
          z: desktopIntroPose.z + heroMotion.z * 0.12,
          rx: desktopIntroPose.rx + heroMotion.rx * 0.16,
          ry: desktopIntroPose.ry + heroMotion.ry * 0.16,
          rz: desktopIntroPose.rz + heroMotion.rz * 0.16,
          s: desktopIntroPose.s,
        });

        setVisibility(group, true);
        setOpacity(group, 1);
        return;
      }

      const lift = smoothstep(0.02, 0.18, step1Progress);
      const fall = smoothstep(0.14, 1, step1Progress);
      const side = position[0] < 0.2 ? -0.18 : position[0] < 1.5 ? 0.04 : 0.18;

      const targetX = position[0] + clusterIdleMotion.x + side * fall;
      const targetY =
        position[1] +
        clusterIdleMotion.y +
        THREE.MathUtils.lerp(0, 0.16, lift) +
        THREE.MathUtils.lerp(0, -3.1, fall);
      const targetZ =
        position[2] + clusterIdleMotion.z + THREE.MathUtils.lerp(0, position[2] - 0.72 - position[2], fall);

      const targetRotX = THREE.MathUtils.lerp(rotation[0] + clusterIdleMotion.rx, 1.18, fall);
      const targetRotY = THREE.MathUtils.lerp(
        rotation[1] + clusterIdleMotion.ry,
        rotation[1] * 0.2,
        fall
      );
      const targetRotZ = THREE.MathUtils.lerp(
        rotation[2] + clusterIdleMotion.rz,
        side > 0 ? 0.18 : -0.18,
        fall
      );

      const targetScale = THREE.MathUtils.lerp(scale * clusterIdleMotion.s, scale * 0.76, fall);
      const fade = smoothstep(0.52, 1, step1Progress);

      applyTransform(group, delta, {
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      });

      setVisibility(group, true);
      setOpacity(group, 1 - fade);
      return;
    }

    const t1 = smoothstep(0.08, 1, step1Progress);

    const desktopIntroMainPose = DESKTOP_INTRO_CUP_POSES[flavor];
    const startX = desktopIntroMainPose?.x ?? position[0];
    const startY = desktopIntroMainPose?.y ?? position[1];
    const startZ = desktopIntroMainPose?.z ?? position[2];
    const startRx = desktopIntroMainPose?.rx ?? rotation[0];
    const startRy = desktopIntroMainPose?.ry ?? rotation[1];
    const startRz = desktopIntroMainPose?.rz ?? rotation[2];
    const startScale = desktopIntroMainPose?.s ?? scale;

    const heroX = 1.5;
    const heroY = 0.6;
    const heroZ = 0.5;

    const dropArc = Math.sin(t1 * Math.PI) * 0.08;

    let targetX = THREE.MathUtils.lerp(startX, heroX, t1);
    let targetY =
      THREE.MathUtils.lerp(startY, heroY, t1) +
      THREE.MathUtils.lerp(0, -0.92, t1) +
      dropArc;
    let targetZ = THREE.MathUtils.lerp(startZ, heroZ, t1);

    let targetRotX = THREE.MathUtils.lerp(startRx, 0.03, t1);
    let targetRotY = THREE.MathUtils.lerp(startRy, 0.01, t1);
    let targetRotZ = THREE.MathUtils.lerp(startRz, 0, t1);

    let targetScale = THREE.MathUtils.lerp(startScale, 0.86, t1);
    const aspect = state.size.width / state.size.height;
    const responsiveXScale = getResponsiveSceneXScale(aspect);
    const responsiveYLift = step >= 3 ? getResponsiveSceneYLift(aspect) : 0;
    const responsiveModelScale = step >= 3 ? getResponsiveSceneScale(aspect) : 1;
    const applyResponsiveMainTransform = (
      target: TransformTarget,
      motion: MotionOffsets,
      mode: "base" | "softSwap" | "spin"
    ) => {
      applyMainTransform(
        group,
        delta,
        target,
        motion,
        mode,
        responsiveXScale,
        responsiveYLift,
        responsiveModelScale
      );
    };

    if (step <= 1) {
      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "base");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 2) {
      const t2 = easeInOutSoft(step2Progress);

      targetY = THREE.MathUtils.lerp(heroY - 0.92, -0.9, t2);
      targetX = THREE.MathUtils.lerp(heroX, 1.5, t2);
      targetZ = THREE.MathUtils.lerp(heroZ, -0.5, t2);

      targetRotX = THREE.MathUtils.lerp(0.03, 1.3, t2);
      targetRotY = THREE.MathUtils.lerp(0.01, 0.0, t2);
      targetRotZ = THREE.MathUtils.lerp(0, 0, t2);

      targetScale = THREE.MathUtils.lerp(0.86, 0.84, t2);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "base");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 3) {
      const t3 = easeInOutSoft(step3Progress);

      targetX = THREE.MathUtils.lerp(1.5, SWAP_POSE.x, t3);
      targetY = THREE.MathUtils.lerp(-0.9, SWAP_POSE.y, t3) - Math.sin(t3 * Math.PI) * 0.14;
      targetZ = THREE.MathUtils.lerp(-0.5, SWAP_POSE.z, t3);

      const rotT = smoothstep(0.0, 0.82, t3);
      const settleT = smoothstep(0.72, 1.0, t3);

      const spinRx = THREE.MathUtils.lerp(1.3, 2.55, rotT);
      const settleRx = THREE.MathUtils.lerp(spinRx, STEP4_START_ROT.rx, settleT);

      const spinRy = THREE.MathUtils.lerp(0.0, -0.62, rotT);
      const settleRy = THREE.MathUtils.lerp(spinRy, STEP4_START_ROT.ry, settleT);

      const spinRz = THREE.MathUtils.lerp(0.0, 0.16, rotT);
      const settleRz = THREE.MathUtils.lerp(spinRz, STEP4_START_ROT.rz, settleT);

      targetRotX = settleRx;
      targetRotY = settleRy;
      targetRotZ = settleRz;

      targetScale = THREE.MathUtils.lerp(0.84, SWAP_POSE.s, t3);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 4) {
      const t4 = easeInOutSoft(step4Progress);
      const posT4 = smoothstep(0.02, 0.96, t4);
      const rotT4 = smoothstep(0.12, 0.98, t4);

      const arcLift = Math.sin(posT4 * Math.PI) * 0.2;
      const twistY4 = Math.sin(rotT4 * Math.PI) * 0.48;
      const roll = Math.sin(rotT4 * Math.PI) * 0.14;

      targetX = THREE.MathUtils.lerp(SWAP_POSE.x, BANAN_POSE.x, posT4);
      targetY = THREE.MathUtils.lerp(SWAP_POSE.y, BANAN_POSE.y, posT4) + arcLift;
      targetZ = THREE.MathUtils.lerp(SWAP_POSE.z, BANAN_POSE.z, posT4);

      targetRotX = THREE.MathUtils.lerp(STEP4_START_ROT.rx, BANAN_POSE.rx, rotT4) + roll * 0.4;
      targetRotY = THREE.MathUtils.lerp(STEP4_START_ROT.ry, BANAN_POSE.ry, rotT4) + twistY4;
      targetRotZ = THREE.MathUtils.lerp(STEP4_START_ROT.rz, BANAN_POSE.rz, rotT4) + roll * 0.16;

      targetScale = THREE.MathUtils.lerp(SWAP_POSE.s, BANAN_POSE.s, posT4);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 5) {
      const t5 = easeInOutSoft(step5Progress);
      const posT5 = smoothstep(0.02, 0.96, t5);
      const rotT5 = smoothstep(0, 0.86, t5);
      const settleT5 = smoothstep(0.72, 1, t5);

      const softDip5 = Math.sin(posT5 * Math.PI) * 0.14;
      const twist5 = Math.sin(rotT5 * Math.PI);

      targetX = THREE.MathUtils.lerp(BANAN_POSE.x, OLCHA_POSE.x, posT5);
      targetY = THREE.MathUtils.lerp(BANAN_POSE.y, OLCHA_POSE.y, posT5) - softDip5;
      targetZ = THREE.MathUtils.lerp(BANAN_POSE.z, OLCHA_POSE.z, posT5);

      const twistRotX5 = THREE.MathUtils.lerp(BANAN_POSE.rx, OLCHA_POSE.rx + 0.26, rotT5);
      const twistRotY5 = THREE.MathUtils.lerp(BANAN_POSE.ry, OLCHA_POSE.ry - 0.5, rotT5);
      const twistRotZ5 = THREE.MathUtils.lerp(BANAN_POSE.rz, OLCHA_POSE.rz + 0.12, rotT5);

      targetRotX = THREE.MathUtils.lerp(twistRotX5 + twist5 * 0.1, OLCHA_POSE.rx, settleT5);
      targetRotY = THREE.MathUtils.lerp(twistRotY5 + twist5 * 0.35, OLCHA_POSE.ry, settleT5);
      targetRotZ = THREE.MathUtils.lerp(twistRotZ5 + twist5 * 0.08, OLCHA_POSE.rz, settleT5);

      targetScale = THREE.MathUtils.lerp(BANAN_POSE.s, OLCHA_POSE.s, posT5);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 6) {
      const t6 = easeInOutSoft(step6Progress);
      const posT6 = smoothstep(0.02, 0.96, t6);
      const rotT6 = smoothstep(0.12, 0.98, t6);

      const arcLift6 = Math.sin(posT6 * Math.PI) * 0.16;
      const twistY6 = Math.sin(rotT6 * Math.PI) * 0.5;
      const roll6 = Math.sin(rotT6 * Math.PI) * 0.15;

      targetX = THREE.MathUtils.lerp(OLCHA_POSE.x, ORMON_POSE.x, posT6);
      targetY = THREE.MathUtils.lerp(OLCHA_POSE.y, ORMON_POSE.y, posT6) + arcLift6;
      targetZ = THREE.MathUtils.lerp(OLCHA_POSE.z, ORMON_POSE.z, posT6);

      targetRotX = THREE.MathUtils.lerp(OLCHA_POSE.rx, ORMON_POSE.rx, rotT6) + roll6 * 0.4;
      targetRotY = THREE.MathUtils.lerp(OLCHA_POSE.ry, ORMON_POSE.ry, rotT6) + twistY6;
      targetRotZ = THREE.MathUtils.lerp(OLCHA_POSE.rz, ORMON_POSE.rz, rotT6) + roll6 * 0.16;

      targetScale = THREE.MathUtils.lerp(OLCHA_POSE.s, ORMON_POSE.s, posT6);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 7) {
      const t7 = easeInOutSoft(step7Progress);
      const posT7 = smoothstep(0.02, 0.96, t7);
      const rotT7 = smoothstep(0.12, 0.98, t7);

      const arcLift7 = Math.sin(posT7 * Math.PI) * 0.14;
      const twistY7 = Math.sin(rotT7 * Math.PI) * 0.46;
      const roll7 = Math.sin(rotT7 * Math.PI) * 0.13;

      targetX = THREE.MathUtils.lerp(ORMON_POSE.x, OULUPNAY_POSE.x, posT7);
      targetY = THREE.MathUtils.lerp(ORMON_POSE.y, OULUPNAY_POSE.y, posT7) + arcLift7;
      targetZ = THREE.MathUtils.lerp(ORMON_POSE.z, OULUPNAY_POSE.z, posT7);

      targetRotX = THREE.MathUtils.lerp(ORMON_POSE.rx, OULUPNAY_POSE.rx, rotT7) + roll7 * 0.38;
      targetRotY = THREE.MathUtils.lerp(ORMON_POSE.ry, OULUPNAY_POSE.ry, rotT7) + twistY7;
      targetRotZ = THREE.MathUtils.lerp(ORMON_POSE.rz, OULUPNAY_POSE.rz, rotT7) + roll7 * 0.15;

      targetScale = THREE.MathUtils.lerp(ORMON_POSE.s, OULUPNAY_POSE.s, posT7);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 8) {
      const t8 = easeInOutSoft(step8Progress);
      const posT8 = smoothstep(0.02, 0.96, t8);
      const rotT8 = smoothstep(0.12, 0.98, t8);

      const softDip8 = Math.sin(posT8 * Math.PI) * 0.08;
      const twist8 = Math.sin(rotT8 * Math.PI);

      targetX = THREE.MathUtils.lerp(OULUPNAY_POSE.x, SHAFTOLI_POSE.x, posT8);
      targetY = THREE.MathUtils.lerp(OULUPNAY_POSE.y, SHAFTOLI_POSE.y, posT8) - softDip8;
      targetZ = THREE.MathUtils.lerp(OULUPNAY_POSE.z, SHAFTOLI_POSE.z, posT8);

      targetRotX = THREE.MathUtils.lerp(OULUPNAY_POSE.rx, SHAFTOLI_POSE.rx, rotT8) + twist8 * 0.18;
      targetRotY = THREE.MathUtils.lerp(OULUPNAY_POSE.ry, SHAFTOLI_POSE.ry, rotT8) + twist8 * 0.72;
      targetRotZ = THREE.MathUtils.lerp(OULUPNAY_POSE.rz, SHAFTOLI_POSE.rz, rotT8) + twist8 * 0.08;

      targetScale = THREE.MathUtils.lerp(OULUPNAY_POSE.s, SHAFTOLI_POSE.s, posT8);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    if (step === 9) {
      const t9 = easeInOutSoft(step9Progress);
      const posT9 = smoothstep(0.02, 0.96, t9);
      const rotT9 = smoothstep(0.1, 0.98, t9);

      const arcLift9 = Math.sin(posT9 * Math.PI) * 0.16;
      const twist9 = Math.sin(rotT9 * Math.PI);

      targetX = THREE.MathUtils.lerp(SHAFTOLI_POSE.x, STRAWBERRY_BANAN_POSE.x, posT9);
      targetY = THREE.MathUtils.lerp(SHAFTOLI_POSE.y, STRAWBERRY_BANAN_POSE.y, posT9) + arcLift9;
      targetZ = THREE.MathUtils.lerp(SHAFTOLI_POSE.z, STRAWBERRY_BANAN_POSE.z, posT9);

      targetRotX =
        THREE.MathUtils.lerp(SHAFTOLI_POSE.rx, STRAWBERRY_BANAN_POSE.rx, rotT9) +
        twist9 * 0.16;
      targetRotY =
        THREE.MathUtils.lerp(SHAFTOLI_POSE.ry, STRAWBERRY_BANAN_POSE.ry, rotT9) +
        twist9 * 0.62;
      targetRotZ =
        THREE.MathUtils.lerp(SHAFTOLI_POSE.rz, STRAWBERRY_BANAN_POSE.rz, rotT9) +
        twist9 * 0.08;

      targetScale = THREE.MathUtils.lerp(SHAFTOLI_POSE.s, STRAWBERRY_BANAN_POSE.s, posT9);

      applyResponsiveMainTransform({
        x: targetX,
        y: targetY,
        z: targetZ,
        rx: targetRotX,
        ry: targetRotY,
        rz: targetRotZ,
        s: targetScale,
      }, heroMotion, "softSwap");

      setVisibility(group, true);
      setOpacity(group, 1);
      return;
    }

    applyResponsiveMainTransform({
      x: targetX,
      y: targetY,
      z: targetZ,
      rx: targetRotX,
      ry: targetRotY,
      rz: targetRotZ,
      s: targetScale,
    }, heroMotion, "base");

    setVisibility(group, true);
    setOpacity(group, 1);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={model} />
    </group>
  );
}

function useCupModel(flavor: FlavorKey) {
  const { scene } = useGLTF(BASE_MODEL_PATH);

  const sideTexture = useLoader(THREE.TextureLoader, assetUrl(`/textures/products/${flavor}-side.webp`));
  const lidTexture = useLoader(THREE.TextureLoader, assetUrl(`/textures/products/${flavor}-lid.webp`));

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    cloned.position.sub(center);

    const fitScale = 2 / Math.max(size.x, size.y, size.z, 0.001);
    cloned.scale.setScalar(fitScale);

    prepareTexture(sideTexture);
    prepareTexture(lidTexture);

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.frustumCulled = false;

      const matName =
        child.material && !Array.isArray(child.material)
          ? child.material.name.toLowerCase()
          : "";
      const meshName = child.name.toLowerCase();

      let nextMap: THREE.Texture | null = null;

      if (
        matName.includes("side") ||
        matName.includes("label_side") ||
        meshName.includes("side") ||
        meshName.includes("body")
      ) {
        nextMap = sideTexture;
      } else if (
        matName.includes("lid") ||
        matName.includes("label_lid") ||
        meshName.includes("lid") ||
        meshName.includes("top")
      ) {
        nextMap = lidTexture;
      } else {
        nextMap = null;
      }

      const applyMat = (sourceMat: THREE.Material) => {
        const m = patchMaterial(sourceMat);

        if (nextMap) {
          m.map = nextMap;
          m.color = new THREE.Color("#ffffff");
        } else {
          m.map = null;
          m.color = new THREE.Color("#f4f4f4");
          m.roughness = 0.55;
          m.metalness = 0.02;
        }

        m.needsUpdate = true;
        return m;
      };

      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => applyMat(m));
      } else {
        child.material = applyMat(child.material);
      }
    });

    return cloned;
  }, [scene, sideTexture, lidTexture]);

  return model;
}

function prepareTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = false;
  texture.needsUpdate = true;
}

function dampAngle(current: number, target: number, lambda: number, delta: number) {
  const twoPi = Math.PI * 2;
  let diff = (target - current) % twoPi;

  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;

  const next = current + diff * (1 - Math.exp(-scaleModelDamping(lambda) * delta));
  return Math.abs(diff) < 0.0008 ? target : next;
}

function dampValue(current: number, target: number, lambda: number, delta: number, eps = 0.0012) {
  const next = THREE.MathUtils.damp(current, target, scaleModelDamping(lambda), delta);
  return Math.abs(target - next) < eps ? target : next;
}

function applyTransformSoftSwap(group: THREE.Group, delta: number, target: TransformTarget) {
  group.position.x = dampValue(group.position.x, target.x, 4.2, delta);
  group.position.y = dampValue(group.position.y, target.y, 4.2, delta);
  group.position.z = dampValue(group.position.z, target.z, 4.2, delta);

  group.rotation.x = dampAngle(group.rotation.x, target.rx, 4.8, delta);
  group.rotation.y = dampAngle(group.rotation.y, target.ry, 4.8, delta);
  group.rotation.z = dampAngle(group.rotation.z, target.rz, 4.8, delta);

  group.scale.x = dampValue(group.scale.x, target.s, 4.6, delta);
  group.scale.y = dampValue(group.scale.y, target.s, 4.6, delta);
  group.scale.z = dampValue(group.scale.z, target.s, 4.6, delta);
}

function applyTransformSpin(group: THREE.Group, delta: number, target: TransformTarget) {
  group.position.x = dampValue(group.position.x, target.x, 4.5, delta);
  group.position.y = dampValue(group.position.y, target.y, 4.5, delta);
  group.position.z = dampValue(group.position.z, target.z, 4.5, delta);

  group.rotation.x = dampValue(group.rotation.x, target.rx, 4.8, delta, 0.001);
  group.rotation.y = dampValue(group.rotation.y, target.ry, 4.8, delta, 0.001);
  group.rotation.z = dampValue(group.rotation.z, target.rz, 4.8, delta, 0.001);

  group.scale.x = dampValue(group.scale.x, target.s, 4.9, delta);
  group.scale.y = dampValue(group.scale.y, target.s, 4.9, delta);
  group.scale.z = dampValue(group.scale.z, target.s, 4.9, delta);
}

function applyTransform(group: THREE.Group, delta: number, target: TransformTarget) {
  group.position.x = dampValue(group.position.x, target.x, 5.8, delta);
  group.position.y = dampValue(group.position.y, target.y, 5.8, delta);
  group.position.z = dampValue(group.position.z, target.z, 5.8, delta);

  group.rotation.x = dampAngle(group.rotation.x, target.rx, 6.1, delta);
  group.rotation.y = dampAngle(group.rotation.y, target.ry, 6.1, delta);
  group.rotation.z = dampAngle(group.rotation.z, target.rz, 6.1, delta);

  group.scale.x = dampValue(group.scale.x, target.s, 6.2, delta);
  group.scale.y = dampValue(group.scale.y, target.s, 6.2, delta);
  group.scale.z = dampValue(group.scale.z, target.s, 6.2, delta);
}

function applyTransformMobile(group: THREE.Group, delta: number, target: TransformTarget) {
  group.position.x = dampValue(group.position.x, target.x, 6.0, delta);
  group.position.y = dampValue(group.position.y, target.y, 6.0, delta);
  group.position.z = dampValue(group.position.z, target.z, 6.0, delta);

  group.rotation.x = dampValue(group.rotation.x, target.rx, 6.8, delta, 0.001);
  group.rotation.y = dampValue(group.rotation.y, target.ry, 6.8, delta, 0.001);
  group.rotation.z = dampValue(group.rotation.z, target.rz, 6.8, delta, 0.001);

  group.scale.x = dampValue(group.scale.x, target.s, 6.4, delta);
  group.scale.y = dampValue(group.scale.y, target.s, 6.4, delta);
  group.scale.z = dampValue(group.scale.z, target.s, 6.4, delta);
}

function setOpacity(group: THREE.Group, value: number) {
  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((mat) => {
      const material = mat as THREE.MeshStandardMaterial;
      const nextDepthWrite = value > 0.95;
      const opacityUnchanged = Math.abs(material.opacity - value) < 0.001;
      const transparencyUnchanged = material.transparent;
      const depthWriteUnchanged = material.depthWrite === nextDepthWrite;

      if (opacityUnchanged && transparencyUnchanged && depthWriteUnchanged) return;

      material.transparent = true;
      material.opacity = value;

      if (!depthWriteUnchanged) {
        material.depthWrite = nextDepthWrite;
        material.needsUpdate = true;
      }
    });
  });
}

function setVisibility(group: THREE.Group, visible: boolean) {
  group.visible = visible;
}

function patchMaterial(material: THREE.Material) {
  const m = material.clone() as THREE.MeshStandardMaterial;

  if (m.map) {
    m.map.colorSpace = THREE.SRGBColorSpace;
    m.map.anisotropy = 8;
    m.map.needsUpdate = true;
  }

  m.envMapIntensity = 1.04;
  m.roughness = Math.max(0.42, Math.min(0.78, m.roughness ?? 0.58));
  m.metalness = Math.min(0.035, m.metalness ?? 0.012);
  m.transparent = true;
  m.opacity = 1;

  return m;
}

function easeInOutSoft(t: number) {
  return t * t * (3 - 2 * t);
}

function getCinematicMotionStrength(
  direction: "forward" | "backward",
  step: number,
  progress: number
) {
  if (step === 0) return 1;
  if (direction === "backward") return 1;
  return lerp(0.72, 1, smoothstep(0.08, 0.82, progress));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getCurrentStepProgress(
  step: number,
  step1Progress: number,
  step2Progress: number,
  step3Progress: number,
  step4Progress: number,
  step5Progress: number,
  step6Progress: number,
  step7Progress: number,
  step8Progress: number,
  step9Progress: number
) {
  switch (step) {
    case 1:
      return step1Progress;
    case 2:
      return step2Progress;
    case 3:
      return step3Progress;
    case 4:
      return step4Progress;
    case 5:
      return step5Progress;
    case 6:
      return step6Progress;
    case 7:
      return step7Progress;
    case 8:
      return step8Progress;
    case 9:
      return step9Progress;
    default:
      return 1;
  }
}

function getMobileFlavor(step: number): FlavorKey {
  switch (step) {
    case 3:
      return "ananas";
    case 4:
      return "banan";
    case 5:
      return "olcha";
    case 6:
      return "ormon-meva";
    case 7:
      return "oulupnay";
    case 8:
      return "shaftoli";
    case 9:
      return "oulupnay-banan";
    default:
      return "malina";
  }
}

function getMobileRenderFlavor(
  step: number,
  direction: "forward" | "backward",
  progress: Record<
    | "step1Progress"
    | "step2Progress"
    | "step3Progress"
    | "step4Progress"
    | "step5Progress"
    | "step6Progress"
    | "step7Progress"
    | "step8Progress"
    | "step9Progress",
    number
  >
): FlavorKey {
  if (step <= 2) return "malina";

  const current = getMobileFlavor(step);
  const previous = getMobileFlavor(step - 1);
  const activeProgress = getCurrentStepProgress(
    step,
    progress.step1Progress,
    progress.step2Progress,
    progress.step3Progress,
    progress.step4Progress,
    progress.step5Progress,
    progress.step6Progress,
    progress.step7Progress,
    progress.step8Progress,
    progress.step9Progress
  );
  const swapAt = step === 5 ? OLCHA_TEXTURE_SWAP_AT : 0.5;
  const swapBackAt = step === 5 ? OLCHA_TEXTURE_SWAP_BACK_AT : 0.5;

  if (direction === "forward") return activeProgress >= swapAt ? current : previous;
  return activeProgress > swapBackAt ? current : previous;
}

function getMobileMainPose(step: number): TransformTarget {
  return MOBILE_MODEL_EDITOR.finalPoses[step as IntroClusterStageProps["step"]] ?? MOBILE_MAIN_POSE;
}

function getMobileIntroCupPose(flavor: FlavorKey): TransformTarget | undefined {
  const introCluster = MOBILE_MODEL_EDITOR.introCluster as Partial<
    Record<FlavorKey, TransformTarget>
  >;

  return introCluster[flavor];
}

function getClusterCupIdleMotion(
  time: number,
  floatOffset: number,
  floatAmp: number,
  rotAmp: number,
  step1Progress: number
): MotionOffsets {
  const fade = 1 - smoothstep(0.05, 0.34, step1Progress);

  return {
    x: Math.sin(time * 0.82 + floatOffset * 0.7) * floatAmp * 5.6 * fade,
    y: Math.sin(time) * floatAmp,
    z: Math.cos(time * 0.6 + floatOffset * 0.9) * floatAmp * 3.8 * fade,
    rx: Math.cos(time * 0.48 + floatOffset * 1.2) * rotAmp * 0.7 * fade,
    ry: Math.sin(time * 0.8 + floatOffset * 0.5) * rotAmp,
    rz: Math.sin(time * 0.62 + floatOffset * 0.8) * (rotAmp * 0.46) * fade,
    s: 1 + Math.sin(time * 1.06 + floatOffset) * 0.012 * fade,
  };
}

function getHeroCupMotion(time: number): MotionOffsets {
  const settle = 1;
  const premiumBias = 1;

  return {
    x: Math.sin(time * 0.62 + 0.9) * 0.034 * settle * premiumBias,
    y:
      (Math.sin(time * 1.04 + 1.15) +
        Math.cos(time * 0.56 + 0.42) * 0.55) *
      0.022 *
      settle,
    z: Math.cos(time * 0.48 + 1.2) * 0.05 * settle * premiumBias,
    rx: Math.sin(time * 0.44 + 0.62) * 0.018 * settle,
    ry: Math.sin(time * 0.36 + 1.36) * 0.05 * settle * premiumBias,
    rz: Math.cos(time * 0.64 + 0.52) * 0.014 * settle,
    s: 1 + Math.sin(time * 0.9 + 0.84) * 0.01 * settle,
  };
}

function mergeMotion(target: TransformTarget, motion: MotionOffsets): TransformTarget {
  return {
    x: target.x + motion.x,
    y: target.y + motion.y,
    z: target.z + motion.z,
    rx: target.rx + motion.rx,
    ry: target.ry + motion.ry,
    rz: target.rz + motion.rz,
    s: target.s * motion.s,
  };
}

function applyMainTransform(
  group: THREE.Group,
  delta: number,
  target: TransformTarget,
  motion: MotionOffsets,
  mode: "base" | "softSwap" | "spin",
  responsiveXScale = 1,
  responsiveYLift = 0,
  responsiveModelScale = 1
) {
  const premiumTarget = mergeMotion(
    {
      ...target,
      x: target.x * responsiveXScale + getResponsiveSceneXBias(target.x, responsiveXScale),
      y: target.y + responsiveYLift,
      s: target.s * responsiveModelScale,
    },
    motion
  );

  if (mode === "softSwap") {
    applyTransformSoftSwap(group, delta, premiumTarget);
    return;
  }

  if (mode === "spin") {
    applyTransformSpin(group, delta, premiumTarget);
    return;
  }

  applyTransform(group, delta, premiumTarget);
}

function getResponsiveSceneXScale(aspect: number) {
  return THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(aspect, 0.46, 1.1, 0.46, 1), 0.46, 1);
}

function getResponsiveSceneXBias(targetX: number, responsiveXScale: number) {
  const narrowAmount = 1 - responsiveXScale;
  const leftPose = 1 - smoothstep(0.35, 1.1, targetX);
  return narrowAmount * leftPose * 0.98;
}

function getResponsiveSceneYLift(aspect: number) {
  return THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(aspect, 0.46, 1.1, 0.72, 0), 0, 0.72);
}

function getResponsiveSceneScale(aspect: number) {
  return THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(aspect, 0.46, 1.1, 0.66, 1), 0.66, 1);
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function Fallback() {
  return (
    <Html center>
      <div className="rounded-full bg-white/80 px-4 py-2 text-sm text-[#4f3a2f]">
        Loading cups…
      </div>
    </Html>
  );
}

useGLTF.preload(BASE_MODEL_PATH);
PRODUCT_TEXTURE_URLS.forEach((url) => {
  useLoader.preload(THREE.TextureLoader, url);
});
