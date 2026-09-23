"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HeroLayers } from "./HeroLayers";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HERO_SCENE_EFFECTS } from "@/data/heroEffects";

interface HeroSceneProps {
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

export const HeroScene: React.FC<HeroSceneProps> = ({
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
  const { camera } = useThree();
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  const lookTargetRef = useRef(new THREE.Vector3(0, 0.02, 0));
  const rotDampRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const effA = HERO_SCENE_EFFECTS[fromIndex] || HERO_SCENE_EFFECTS[0];
    const effB = HERO_SCENE_EFFECTS[toIndex] || HERO_SCENE_EFFECTS[0];

    // 1. Camera Trajectory Interpolation based on localProgress
    const camAStart = effA.camera.start;
    const camAEnd = effA.camera.end;
    const camAX = THREE.MathUtils.lerp(camAStart[0], camAEnd[0], localProgress);
    const camAY = THREE.MathUtils.lerp(camAStart[1], camAEnd[1], localProgress);
    const camAZ = THREE.MathUtils.lerp(camAStart[2], camAEnd[2], localProgress);

    // Incoming scene camera start position
    const camBStart = effB.camera.start;
    const camBEnd = effB.camera.end;
    const camBX = THREE.MathUtils.lerp(camBStart[0], camBEnd[0], 0);
    const camBY = THREE.MathUtils.lerp(camBStart[1], camBEnd[1], 0);
    const camBZ = THREE.MathUtils.lerp(camBStart[2], camBEnd[2], 0);

    // Seamless crossfade blending between outgoing and incoming scene camera
    const blendX = THREE.MathUtils.lerp(camAX, camBX, mixRatio);
    const blendY = THREE.MathUtils.lerp(camAY, camBY, mixRatio);
    const blendZ = THREE.MathUtils.lerp(camAZ, camBZ, mixRatio);

    // Camera Look-At target blending
    const tgtAX = THREE.MathUtils.lerp(effA.camera.startTarget[0], effA.camera.endTarget[0], localProgress);
    const tgtAY = THREE.MathUtils.lerp(effA.camera.startTarget[1], effA.camera.endTarget[1], localProgress);
    const tgtAZ = THREE.MathUtils.lerp(effA.camera.startTarget[2], effA.camera.endTarget[2], localProgress);

    const tgtBX = effB.camera.startTarget[0];
    const tgtBY = effB.camera.startTarget[1];
    const tgtBZ = effB.camera.startTarget[2];

    const blendTgtX = THREE.MathUtils.lerp(tgtAX, tgtBX, mixRatio);
    const blendTgtY = THREE.MathUtils.lerp(tgtAY, tgtBY, mixRatio);
    const blendTgtZ = THREE.MathUtils.lerp(tgtAZ, tgtBZ, mixRatio);

    // 2. Parallax and Idle strengths blended
    const ptrStrX = THREE.MathUtils.lerp(effA.camera.pointerStrength.x, effB.camera.pointerStrength.x, mixRatio);
    const ptrStrY = THREE.MathUtils.lerp(effA.camera.pointerStrength.y, effB.camera.pointerStrength.y, mixRatio);

    const idleStrX = THREE.MathUtils.lerp(effA.camera.idleStrength.x, effB.camera.idleStrength.x, mixRatio);
    const idleStrY = THREE.MathUtils.lerp(effA.camera.idleStrength.y, effB.camera.idleStrength.y, mixRatio);
    const idleSpeed = THREE.MathUtils.lerp(effA.camera.idleStrength.speed, effB.camera.idleStrength.speed, mixRatio);

    // Initial Intro pull-back (subtle 0.22 distance)
    const introZ = THREE.MathUtils.lerp(-0.22, 0.0, introProgress);

    // Scroll velocity momentum (heavily clamped, max ~0.04)
    const velZ = scrollVelocity * 0.04;

    if (!reducedMotion) {
      // Shared cinematic idle breathing
      const idleX = Math.sin(time * idleSpeed) * idleStrX;
      const idleY = Math.cos(time * idleSpeed * 0.85) * idleStrY;

      // Pointer parallax translation (Montfort ratio ~1.35x)
      const mouseX = pointerX * ptrStrX * 1.35;
      const mouseY = pointerY * ptrStrY * 1.35;

      const targetX = blendX + idleX + mouseX;
      const targetY = blendY + idleY + mouseY;
      const targetZ = blendZ + introZ + velZ;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4.0, delta);

      lookTargetRef.current.x = THREE.MathUtils.damp(lookTargetRef.current.x, blendTgtX + mouseX * 0.15, 3.5, delta);
      lookTargetRef.current.y = THREE.MathUtils.damp(lookTargetRef.current.y, blendTgtY + mouseY * 0.15, 3.5, delta);
      lookTargetRef.current.z = THREE.MathUtils.damp(lookTargetRef.current.z, blendTgtZ, 3.5, delta);

      camera.lookAt(lookTargetRef.current);

      // Authentic Montfort Angular Pitch & Yaw Tilt
      const targetRotY = -pointerX * 0.042; // Yaw: turning camera horizontally toward mouse
      const targetRotX = pointerY * 0.032;  // Pitch: tilting camera vertically toward mouse
      rotDampRef.current.x = THREE.MathUtils.damp(rotDampRef.current.x, targetRotX, 3.5, delta);
      rotDampRef.current.y = THREE.MathUtils.damp(rotDampRef.current.y, targetRotY, 3.5, delta);

      camera.rotation.x += rotDampRef.current.x;
      camera.rotation.y += rotDampRef.current.y;
    } else {
      camera.position.x = blendX;
      camera.position.y = blendY;
      camera.position.z = blendZ + introZ;

      lookTargetRef.current.set(blendTgtX, blendTgtY, blendTgtZ);
      camera.lookAt(lookTargetRef.current);
    }

    // Environmental lighting interpolation
    if (ambientLightRef.current) {
      const ambInt = THREE.MathUtils.lerp(
        effA.atmosphere.ambientIntensity,
        effB.atmosphere.ambientIntensity,
        mixRatio
      );
      ambientLightRef.current.intensity = ambInt;
    }
  });

  return (
    <>
      {/* Environmental Lighting */}
      <ambientLight ref={ambientLightRef} intensity={1.1} color="#FFFBF0" />
      <directionalLight
        ref={dirLightRef}
        position={[-6, 4, 3]}
        intensity={0.65}
        color="#FFE7BA"
      />

      {/* Persistent Atmosphere across all 5 chapters */}
      <HeroAtmosphere
        fromIndex={fromIndex}
        toIndex={toIndex}
        mixRatio={mixRatio}
        localProgress={localProgress}
        introProgress={introProgress}
        reducedMotion={reducedMotion}
      />

      {/* Multi-chapter WebGL layers & crossfade */}
      <HeroLayers
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
    </>
  );
};
