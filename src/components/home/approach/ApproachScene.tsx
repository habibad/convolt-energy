"use client";

import React from "react";
import { ApproachModel } from "./ApproachModel";

interface ApproachSceneProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
}

export const ApproachScene: React.FC<ApproachSceneProps> = ({
  progress,
  visualActiveZone,
  pointerX,
  pointerY,
  reducedMotion = false,
}) => {
  return (
    <>
      {/* 1. Studio Lighting Rig for Architectural Presentation */}
      {/* Soft warm ambient base */}
      <ambientLight color="#F9F6F0" intensity={0.9} />

      {/* Key sunlight directional light (Warm top-right angle) */}
      <directionalLight
        position={[4.5, 7.0, 4.0]}
        color="#FFF8EC"
        intensity={1.45}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-2.2}
        shadow-bias={-0.0005}
      />

      {/* Soft cool fill light from opposite flank */}
      <directionalLight
        position={[-4.2, 3.5, -2.8]}
        color="#E4EDF2"
        intensity={0.42}
      />

      {/* Subtle floor bounce light */}
      <directionalLight
        position={[0, -2.0, 1.0]}
        color="#F0EBE1"
        intensity={0.2}
      />

      {/* 2. Procedural 3D Model Hierarchy */}
      <ApproachModel
        progress={progress}
        visualActiveZone={visualActiveZone}
        pointerX={pointerX}
        pointerY={pointerY}
        reducedMotion={reducedMotion}
      />
    </>
  );
};
