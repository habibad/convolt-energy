"use client";

import React from "react";
import { ApproachCamera } from "./ApproachCamera";
import { ApproachModel } from "./ApproachModel";
import { BusinessScene } from "./business/BusinessScene";
import { BUSINESS_DATA, BusinessId } from "./business/businessData";

interface ApproachSceneProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  hoveredZone: number | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
  labelRefs?: React.RefObject<(HTMLElement | null)[]>;
  transitionProgress?: number;
  activeBusiness?: BusinessId | null;
  pendingBusiness?: BusinessId | null;
  businessToBusinessProgress?: number;
  isBusinessMode?: boolean;
}

export const ApproachScene: React.FC<ApproachSceneProps> = ({
  progress,
  visualActiveZone,
  hoveredZone,
  pointerX,
  pointerY,
  reducedMotion = false,
  labelRefs,
  transitionProgress = 0,
  activeBusiness = null,
  pendingBusiness = null,
  businessToBusinessProgress = 0,
  isBusinessMode = false,
}) => {
  const businessCameraPose = activeBusiness ? BUSINESS_DATA[activeBusiness].cameraPose : null;

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
        transitionProgress={transitionProgress}
        businessCameraPose={businessCameraPose}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. Master 2.5D Ecosystem Overview (Motion A: Sinks into Depth)*/}
      {/* ------------------------------------------------------------- */}
      <ApproachModel
        progress={progress}
        visualActiveZone={visualActiveZone}
        reducedMotion={reducedMotion}
        transitionProgress={transitionProgress}
      />

      {/* ------------------------------------------------------------- */}
      {/* 2. Business World (Motion B: Rises Forward Simultaneously)    */}
      {/* ------------------------------------------------------------- */}
      <BusinessScene
        activeBusiness={activeBusiness}
        pendingBusiness={pendingBusiness}
        transitionProgress={transitionProgress}
        businessToBusinessProgress={businessToBusinessProgress}
        isBusinessMode={isBusinessMode}
        pointerX={pointerX}
        pointerY={pointerY}
        reducedMotion={reducedMotion}
      />
    </>
  );
};
