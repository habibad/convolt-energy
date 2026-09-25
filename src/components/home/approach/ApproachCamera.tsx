"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ApproachCameraProps {
  progress: number; // 0.0 to 1.0 master story progress
  hoveredZone: number | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
  labelRefs?: React.RefObject<(HTMLElement | null)[]>;
}

// Normalized UV coordinates of the 4 facilities on 05-integrated-ecosystem.png
const ZONE_UVS = [
  { u: 0.335, v: 0.692 }, // 0: Solar Manufacturing roof
  { u: 0.605, v: 0.692 }, // 1: Power Generation hillside solar field
  { u: 0.754, v: 0.362 }, // 2: Data Centers right edge
  { u: 0.293, v: 0.352 }, // 3: Recycling circular tanks left edge
];

const _posTarget = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _projected = new THREE.Vector3();

// Helper for smoothstep easing
function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const ApproachCamera: React.FC<ApproachCameraProps> = ({
  progress,
  hoveredZone,
  pointerX,
  pointerY,
  reducedMotion = false,
  labelRefs,
}) => {
  const { camera, size, viewport } = useThree();

  const imgAspect = 1672 / 941;
  const margin = 1.12;
  let planeWidth = viewport.width * margin;
  let planeHeight = planeWidth / imgAspect;
  if (planeHeight < viewport.height * margin) {
    planeHeight = viewport.height * margin;
    planeWidth = planeHeight * imgAspect;
  }

  // 3D Anchor positions for the 4 zones on the plane centered at [0.2, -0.35, 0.0]
  const zoneAnchors = useMemo(() => {
    return ZONE_UVS.map(({ u, v }) => {
      return new THREE.Vector3(
        (u - 0.5) * planeWidth + 0.2,
        (v - 0.5) * planeHeight - 0.35,
        0.02
      );
    });
  }, [planeWidth, planeHeight]);

  const currentPos = useRef(new THREE.Vector3(0.0, 0.0, 8.5));
  const currentLookAt = useRef(new THREE.Vector3(0.0, -0.2, 0.0));

  useFrame((_, delta) => {
    // -----------------------------------------------------------------
    // 1. SCROLL-DRIVEN CONTINUOUS CINEMATIC CAMERA SPLINE (0.00 -> 1.00)
    // -----------------------------------------------------------------
    const masterOverviewPos = [0.0, 0.0, 8.5];
    const masterOverviewLook = [0.0, -0.2, 0.0];

    let targetX = masterOverviewPos[0];
    let targetY = masterOverviewPos[1];
    let targetZ = masterOverviewPos[2];

    let lookX = masterOverviewLook[0];
    let lookY = masterOverviewLook[1];
    let lookZ = 0.0;

    const p = Math.max(0, Math.min(1, progress));

    if (p <= 0.12) {
      // Phase 0: Master Overview (0.00 - 0.12)
      targetX = masterOverviewPos[0];
      targetY = masterOverviewPos[1];
      targetZ = masterOverviewPos[2];
      lookX = masterOverviewLook[0];
      lookY = masterOverviewLook[1];
    } else if (p <= 0.20) {
      // Phase 0 -> 1: Descent into Solar Campus (0.12 - 0.20)
      const t = smoothstep(0.12, 0.20, p);
      targetX = THREE.MathUtils.lerp(masterOverviewPos[0], -0.42, t);
      targetY = THREE.MathUtils.lerp(masterOverviewPos[1], 0.16, t);
      targetZ = THREE.MathUtils.lerp(masterOverviewPos[2], 6.2, t);

      lookX = THREE.MathUtils.lerp(masterOverviewLook[0], -0.44, t);
      lookY = THREE.MathUtils.lerp(masterOverviewLook[1], 0.05, t);
    } else if (p <= 0.40) {
      // Phase 1: Solar Manufacturing & 4 Process Stages (0.20 - 0.40)
      if (p <= 0.25) {
        // Solar facility opening
        targetX = -0.42;
        targetY = 0.16;
        targetZ = 6.2;
        lookX = -0.44;
        lookY = 0.05;
      } else if (p <= 0.285) {
        // Step 01: Raw Materials
        const t = smoothstep(0.25, 0.285, p);
        targetX = THREE.MathUtils.lerp(-0.42, -0.48, t);
        targetY = THREE.MathUtils.lerp(0.16, 0.20, t);
        targetZ = THREE.MathUtils.lerp(6.2, 5.8, t);
        lookX = THREE.MathUtils.lerp(-0.44, -0.50, t);
        lookY = THREE.MathUtils.lerp(0.05, 0.10, t);
      } else if (p <= 0.32) {
        // Step 02: Wafer Production
        const t = smoothstep(0.285, 0.32, p);
        targetX = THREE.MathUtils.lerp(-0.48, -0.43, t);
        targetY = THREE.MathUtils.lerp(0.20, 0.14, t);
        targetZ = THREE.MathUtils.lerp(5.8, 5.6, t);
        lookX = THREE.MathUtils.lerp(-0.50, -0.44, t);
        lookY = THREE.MathUtils.lerp(0.10, 0.06, t);
      } else if (p <= 0.355) {
        // Step 03: Cell Manufacturing
        const t = smoothstep(0.32, 0.355, p);
        targetX = THREE.MathUtils.lerp(-0.43, -0.38, t);
        targetY = THREE.MathUtils.lerp(0.14, 0.10, t);
        targetZ = THREE.MathUtils.lerp(5.6, 5.5, t);
        lookX = THREE.MathUtils.lerp(-0.44, -0.38, t);
        lookY = THREE.MathUtils.lerp(0.06, 0.02, t);
      } else {
        // Step 04: Module Assembly
        const t = smoothstep(0.355, 0.40, p);
        targetX = THREE.MathUtils.lerp(-0.38, -0.30, t);
        targetY = THREE.MathUtils.lerp(0.10, 0.06, t);
        targetZ = THREE.MathUtils.lerp(5.5, 5.7, t);
        lookX = THREE.MathUtils.lerp(-0.38, -0.32, t);
        lookY = THREE.MathUtils.lerp(0.02, 0.0, t);
      }
    } else if (p <= 0.58) {
      // Phase 2: Power Generation (0.40 - 0.58)
      // Camera pulls outward along the transmission corridor, sweeping diagonally
      const t = smoothstep(0.40, 0.48, p);
      targetX = THREE.MathUtils.lerp(-0.30, 0.45, t);
      targetY = THREE.MathUtils.lerp(0.06, 0.24, t);
      targetZ = THREE.MathUtils.lerp(5.7, 7.5, t);

      lookX = THREE.MathUtils.lerp(-0.32, 0.42, t);
      lookY = THREE.MathUtils.lerp(0.0, 0.08, t);
    } else if (p <= 0.76) {
      // Phase 3: Data Centers (0.58 - 0.76)
      // Camera follows energy into compute facility
      const t = smoothstep(0.58, 0.65, p);
      targetX = THREE.MathUtils.lerp(0.45, 0.38, t);
      targetY = THREE.MathUtils.lerp(0.24, -0.16, t);
      targetZ = THREE.MathUtils.lerp(7.5, 6.3, t);

      lookX = THREE.MathUtils.lerp(0.42, 0.42, t);
      lookY = THREE.MathUtils.lerp(0.08, -0.22, t);
    } else if (p <= 0.92) {
      // Phase 4: Recycling (0.76 - 0.92)
      // Camera curves toward circular recovery tanks
      const t = smoothstep(0.76, 0.83, p);
      targetX = THREE.MathUtils.lerp(0.38, -0.36, t);
      targetY = THREE.MathUtils.lerp(-0.16, -0.22, t);
      targetZ = THREE.MathUtils.lerp(6.3, 6.2, t);

      lookX = THREE.MathUtils.lerp(0.42, -0.40, t);
      lookY = THREE.MathUtils.lerp(-0.22, -0.26, t);
    } else {
      // Phase 5: Connected Value Chain Conclusion (0.92 - 1.00)
      // Camera pulls back gracefully to full panoramic view
      const t = smoothstep(0.92, 0.98, p);
      targetX = THREE.MathUtils.lerp(-0.36, 0.0, t);
      targetY = THREE.MathUtils.lerp(-0.22, 0.12, t);
      targetZ = THREE.MathUtils.lerp(6.2, 8.8, t);

      lookX = THREE.MathUtils.lerp(-0.40, 0.0, t);
      lookY = THREE.MathUtils.lerp(-0.26, -0.16, t);
    }

    // -----------------------------------------------------------------
    // 2. POINTER PARALLAX (Subtle, Restrained Micro-Drift)
    // -----------------------------------------------------------------
    const parallaxDamp = reducedMotion ? 0 : 0.035;
    const finalX = targetX + pointerX * parallaxDamp;
    const finalY = targetY + pointerY * parallaxDamp;
    const finalZ = targetZ;

    _posTarget.set(finalX, finalY, finalZ);
    _lookTarget.set(lookX, lookY, lookZ);

    // Smooth camera interpolation (no violent jumps, handles fast & reverse scroll)
    const smoothFactor = reducedMotion ? 12 : 5.0;
    currentPos.current.lerp(_posTarget, Math.min(1, delta * smoothFactor));
    currentLookAt.current.lerp(_lookTarget, Math.min(1, delta * smoothFactor));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // -----------------------------------------------------------------
    // 3. PROJECT HOTSPOT LABELS (Active during Overview Phase <= 0.16)
    // -----------------------------------------------------------------
    if (labelRefs && labelRefs.current && p < 0.18) {
      const halfW = size.width / 2;
      const halfH = size.height / 2;

      for (let i = 0; i < 4; i++) {
        const domEl = labelRefs.current[i];
        if (!domEl) continue;

        const anchor = zoneAnchors[i];
        _projected.copy(anchor);
        _projected.project(camera);

        const screenX = _projected.x * halfW + halfW;
        const screenY = -_projected.y * halfH + halfH;

        domEl.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)`;

        // Fade out labels cleanly as progress leaves overview
        const labelFade = Math.max(0, 1 - Math.max(0, p - 0.10) / 0.06);
        domEl.style.opacity = labelFade.toFixed(3);
        domEl.style.pointerEvents = labelFade > 0.1 ? "auto" : "none";
      }
    }
  });

  return null;
};
