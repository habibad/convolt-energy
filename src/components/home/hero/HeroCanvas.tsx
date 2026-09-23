"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { HeroScene } from "./HeroScene";
import { useWebGLCapability } from "@/hooks/useWebGLCapability";
import { HERO_CHAPTERS } from "@/data/home";

interface HeroCanvasProps {
  fromIndex: number;
  toIndex: number;
  mixRatio: number;
  localProgress: number;
  activeIndex: number;
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  scrollVelocity: number;
  introProgress: number;
  reducedMotion?: boolean;
}

// Resilient Fallback with authored per-scene motion when WebGL is unavailable
const FallbackPoster: React.FC<{
  fromIndex: number;
  toIndex: number;
  mixRatio: number;
  localProgress: number;
  pointerX: number;
  pointerY: number;
}> = ({ fromIndex, toIndex, mixRatio, localProgress, pointerX, pointerY }) => {
  const chapterA = HERO_CHAPTERS[fromIndex] || HERO_CHAPTERS[0];
  const chapterB = HERO_CHAPTERS[toIndex] || HERO_CHAPTERS[0];

  // Authored CSS motion profile per chapter for fallback
  const getTransformForScene = (sceneIdx: number, p: number) => {
    switch (sceneIdx) {
      case 0:
        return `scale(${1.02 + p * 0.02}) translate3d(${pointerX * 6}px, ${pointerY * 4}px, 0)`;
      case 1:
        // Scene 02: Scale 1.03 -> 1.0
        return `scale(${1.03 - p * 0.02}) translate3d(${pointerX * 8}px, ${pointerY * 5}px, 0)`;
      case 2:
        // Scene 03: Horizontal pan
        return `scale(1.02) translate3d(${-(p * 24) + pointerX * 6}px, ${pointerY * 3}px, 0)`;
      case 3:
        // Scene 04: Scale 1.025 -> 1.0
        return `scale(${1.025 - p * 0.015}) translate3d(${pointerX * 6}px, ${pointerY * 4}px, 0)`;
      case 4:
        // Scene 05: Translate + subtle scale
        return `scale(${1.02 - p * 0.01}) translate3d(${p * 14 + pointerX * 6}px, ${pointerY * 4}px, 0)`;
      default:
        return `scale(1.02) translate3d(${pointerX * 6}px, ${pointerY * 4}px, 0)`;
    }
  };

  const transformA = getTransformForScene(fromIndex, localProgress);
  const transformB = getTransformForScene(toIndex, 0);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#101A1D]">
      {/* Base Chapter Image A */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
        style={{ transform: transformA, opacity: 1 - mixRatio }}
      >
        <Image
          src={chapterA.image}
          alt={chapterA.navLabel}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Crossfading Chapter Image B */}
      {mixRatio > 0.01 && (
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: transformB, opacity: mixRatio }}
        >
          <Image
            src={chapterB.image}
            alt={chapterB.navLabel}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}
    </div>
  );
};

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  fromIndex,
  toIndex,
  mixRatio,
  localProgress,
  activeIndex,
  pointerX,
  pointerY,
  scrollProgress,
  scrollVelocity,
  introProgress,
  reducedMotion = false,
}) => {
  const { isSupported, maxDpr } = useWebGLCapability();
  const [webGLError, setWebGLError] = useState(false);

  // If WebGL is unsupported or threw context loss, render the multi-scene fallback
  if (!isSupported || webGLError) {
    return (
      <FallbackPoster
        fromIndex={fromIndex}
        toIndex={toIndex}
        mixRatio={mixRatio}
        localProgress={localProgress}
        pointerX={pointerX}
        pointerY={pointerY}
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Background Poster while Canvas initializes to guarantee zero black flash */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: introProgress > 0.8 ? 0 : 1 }}
      >
        <FallbackPoster
          fromIndex={fromIndex}
          toIndex={toIndex}
          mixRatio={mixRatio}
          localProgress={localProgress}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      </div>

      <Canvas
        camera={{
          fov: 42,
          position: [0, 0, 5.0],
          near: 0.1,
          far: 25,
        }}
        dpr={[1, maxDpr]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setWebGLError(true);
          });
        }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <Suspense fallback={null}>
          <HeroScene
            fromIndex={fromIndex}
            toIndex={toIndex}
            mixRatio={mixRatio}
            localProgress={localProgress}
            activeIndex={activeIndex}
            pointerX={pointerX}
            pointerY={pointerY}
            scrollProgress={scrollProgress}
            scrollVelocity={scrollVelocity}
            introProgress={introProgress}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
