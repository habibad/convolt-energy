"use client";

import React from "react";
import { ApproachCamera } from "./ApproachCamera";
import { ApproachModel } from "./ApproachModel";

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
      {/* ------------------------------------------------------------- */}
      {/* Ambient and Environmental Fill Light                          */}
      {/* ------------------------------------------------------------- */}
      <ambientLight color="#FFFDF8" intensity={1.1} />
      <directionalLight position={[-4, 6, 4]} color="#FFF8E8" intensity={0.65} />

      {/* ------------------------------------------------------------- */}
      {/* Camera Controller & Label Projection                          */}
      {/* ------------------------------------------------------------- */}
      <ApproachCamera
        progress={progress}
        hoveredZone={hoveredZone}
        pointerX={pointerX}
        pointerY={pointerY}
        reducedMotion={reducedMotion}
        labelRefs={labelRefs}
      />

      {/* ------------------------------------------------------------- */}
      {/* Master 2.5D Cinematic Environmental Ecosystem                 */}
      {/* ------------------------------------------------------------- */}
      <ApproachModel
        progress={progress}
        visualActiveZone={visualActiveZone}
        reducedMotion={reducedMotion}
      />
    </>
  );
};
