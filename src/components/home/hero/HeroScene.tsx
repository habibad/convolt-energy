"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HeroLayers } from "./HeroLayers";
import { HeroAtmosphere } from "./HeroAtmosphere";

interface HeroSceneProps {
  pointerX: number; // -1 to 1
  pointerY: number; // -1 to 1
  scrollProgress: number; // 0.0 to 1.0
  introProgress: number; // 0.0 to 1.0
  selectedChapterId?: string;
  reducedMotion?: boolean;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  pointerX,
  pointerY,
  scrollProgress,
  introProgress,
  selectedChapterId = "01",
  reducedMotion = false,
}) => {
  const { camera } = useThree();

  // Reference for storing camera interpolation state
  const cameraState = useRef({
    baseZ: 5.0,
    currentZ: 4.8, // starts slightly pushed forward in Phase 01
    currentX: 0,
    currentY: 0,
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Phase 01 -> Phase 02: Intro camera pull-back (4.8 -> 5.0)
    const introZ = THREE.MathUtils.lerp(4.78, 5.0, introProgress);

    // Scroll advancement: gentle forward cinematography travel (5.0 -> 4.5)
    const scrollZOffset = -scrollProgress * 0.5;
    const scrollYOffset = -scrollProgress * 0.12;

    // Chapter preview offset when chapters 02-05 are clicked
    let chapterXOffset = 0;
    let chapterYOffset = 0;
    if (selectedChapterId === "02") {
      // Focus slightly toward solar facility
      chapterXOffset = 0.08;
      chapterYOffset = -0.04;
    } else if (selectedChapterId === "03") {
      chapterXOffset = -0.06;
      chapterYOffset = 0.03;
    } else if (selectedChapterId === "04") {
      chapterXOffset = 0.04;
      chapterYOffset = 0.05;
    } else if (selectedChapterId === "05") {
      chapterXOffset = -0.04;
      chapterYOffset = -0.03;
    }

    if (!reducedMotion) {
      // 1. Almost subconscious continuous cinematic idle drift
      const idleX = Math.sin(time * 0.35) * 0.015;
      const idleY = Math.cos(time * 0.28) * 0.009;

      // 2. Desktop Mouse Parallax (X: ~0.12 world units, Y: ~0.06 world units)
      const mouseX = pointerX * 0.12;
      const mouseY = pointerY * 0.06;

      const targetX = idleX + mouseX + chapterXOffset;
      const targetY = idleY + mouseY + scrollYOffset + chapterYOffset;
      const targetZ = introZ + scrollZOffset;

      // Smooth frame-rate independent camera damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4.0, delta);
    } else {
      // Reduced motion: static camera at target depth
      camera.position.x = chapterXOffset;
      camera.position.y = scrollYOffset + chapterYOffset;
      camera.position.z = introZ + scrollZOffset;
    }

    // Keep camera looking straight ahead with very slight upward tilt
    camera.lookAt(0, 0.02, 0);
  });

  return (
    <>
      {/* Ambient and directional environmental lights */}
      <ambientLight intensity={1.1} color="#FFFBF0" />
      <directionalLight
        position={[-6, 4, 3]}
        intensity={0.65}
        color="#FFE7BA"
      />

      {/* Atmospheric Effects: Sun Glow, Drifting Fog, Dust Particles */}
      <HeroAtmosphere
        introProgress={introProgress}
        reducedMotion={reducedMotion}
      />

      {/* Multi-plane visual layers: Distant Landscape & Foreground Facility */}
      <HeroLayers
        pointerX={pointerX}
        pointerY={pointerY}
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
    </>
  );
};
