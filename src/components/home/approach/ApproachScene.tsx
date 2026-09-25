"use client";

import React from "react";
import { ApproachCamera } from "./ApproachCamera";
import { ApproachModel } from "./ApproachModel";
import { BusinessScene } from "./business/BusinessScene";

interface ApproachSceneProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  hoveredZone: number | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
  labelRefs?: React.RefObject<(HTMLElement | null)[]>;
}

export const ApproachScene: React.FC<ApproachSceneProps> = ({
  progress,
  visualActiveZone,
  hoveredZone,
  pointerX,
  pointerY,
  reducedMotion = false,
  labelRefs,
}) => {
  return (
    <>
      {/* Ambient and Environmental Fill Light */}
      <ambientLight color="#FFFDF8" intensity={1.1} />
      <directionalLight position={[-4, 6, 4]} color="#FFF8E8" intensity={0.65} />

      {/* Primary Storyteller: Smooth Continuous Camera Controller */}
      <ApproachCamera
        progress={progress}
        hoveredZone={hoveredZone}
        pointerX={pointerX}
        pointerY={pointerY}
        reducedMotion={reducedMotion}
        labelRefs={labelRefs}
      />

      {/* 1. Master 2.5D Ecosystem Overview (Overview & Conclusion Pullback) */}
      <ApproachModel
        progress={progress}
        visualActiveZone={visualActiveZone}
        reducedMotion={reducedMotion}
      />

      {/* 2. Continuous Cinematic Business World (Solar, Power, Data, Recycling) */}
      <BusinessScene
        progress={progress}
        pointerX={pointerX}
        pointerY={pointerY}
        reducedMotion={reducedMotion}
      />
    </>
  );
};
