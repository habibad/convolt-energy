"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ApproachCameraProps {
  progress: number;
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

  const hoverOffsetPos = useRef(new THREE.Vector3(0, 0, 0));
  const hoverOffsetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    // -----------------------------------------------------------------
    // 1. SCROLL-DRIVEN CAMERA POSE (Cinematic Pacing)
    // -----------------------------------------------------------------
    const masterPos = [0.0, 0.0, 8.5];
    const masterLook = [0.0, -0.2, 0.0];

    let basePos = masterPos;
    let baseLook = masterLook;

    if (progress < 0.35) {
      // 0.00 - 0.35: Solar Manufacturing focus (upper-left campus)
      const t = Math.min(1, Math.max(0, (progress - 0.08) / 0.22));
      const s = t * t * (3 - 2 * t);
      basePos = [
        THREE.MathUtils.lerp(masterPos[0], -0.6, s),
        THREE.MathUtils.lerp(masterPos[1], 0.2, s),
        THREE.MathUtils.lerp(masterPos[2], 7.8, s),
      ];
      baseLook = [
        THREE.MathUtils.lerp(masterLook[0], -0.8, s),
        THREE.MathUtils.lerp(masterLook[1], 0.0, s),
        0.0,
      ];
    } else if (progress < 0.56) {
      // 0.35 - 0.56: Power Generation focus (upper-right hillside solar)
      const t = Math.min(1, Math.max(0, (progress - 0.35) / 0.18));
      const s = t * t * (3 - 2 * t);
      basePos = [
        THREE.MathUtils.lerp(-0.6, 0.6, s),
        THREE.MathUtils.lerp(0.2, 0.3, s),
        THREE.MathUtils.lerp(7.8, 7.8, s),
      ];
      baseLook = [
        THREE.MathUtils.lerp(-0.8, 0.8, s),
        THREE.MathUtils.lerp(0.0, 0.1, s),
        0.0,
      ];
    } else if (progress < 0.76) {
      // 0.56 - 0.76: Data Centers focus (lower-right)
      const t = Math.min(1, Math.max(0, (progress - 0.56) / 0.18));
      const s = t * t * (3 - 2 * t);
      basePos = [
        THREE.MathUtils.lerp(0.6, 0.7, s),
        THREE.MathUtils.lerp(0.3, -0.3, s),
        THREE.MathUtils.lerp(7.8, 7.8, s),
      ];
      baseLook = [
        THREE.MathUtils.lerp(0.8, 0.9, s),
        THREE.MathUtils.lerp(0.1, -0.3, s),
        0.0,
      ];
    } else if (progress < 0.90) {
      // 0.76 - 0.90: Recycling focus (lower-left)
      const t = Math.min(1, Math.max(0, (progress - 0.76) / 0.12));
      const s = t * t * (3 - 2 * t);
      basePos = [
        THREE.MathUtils.lerp(0.7, -0.5, s),
        THREE.MathUtils.lerp(-0.3, -0.4, s),
        THREE.MathUtils.lerp(7.8, 7.9, s),
      ];
      baseLook = [
        THREE.MathUtils.lerp(0.9, -0.7, s),
        THREE.MathUtils.lerp(-0.3, -0.4, s),
        0.0,
      ];
    } else {
      // 0.90 - 1.00: Return to Master Overview (Full Integrated Value Chain)
      const t = Math.min(1, Math.max(0, (progress - 0.90) / 0.10));
      const s = t * t * (3 - 2 * t);
      basePos = [
        THREE.MathUtils.lerp(-0.5, masterPos[0], s),
        THREE.MathUtils.lerp(-0.4, masterPos[1], s),
        THREE.MathUtils.lerp(7.9, masterPos[2], s),
      ];
      baseLook = [
        THREE.MathUtils.lerp(-0.7, masterLook[0], s),
        THREE.MathUtils.lerp(-0.4, masterLook[1], s),
        0.0,
      ];
    }

    // -----------------------------------------------------------------
    // 2. HOVER CAMERA OFFSET (Restrained, <= 0.05 units)
    // -----------------------------------------------------------------
    let targetHoverX = 0;
    let targetHoverY = 0;

    if (!reducedMotion && hoveredZone !== null) {
      if (hoveredZone === 0) {
        targetHoverX = -0.05;
        targetHoverY = 0.02;
      } else if (hoveredZone === 1) {
        targetHoverX = 0.05;
        targetHoverY = 0.02;
      } else if (hoveredZone === 2) {
        targetHoverX = 0.05;
        targetHoverY = -0.02;
      } else if (hoveredZone === 3) {
        targetHoverX = -0.05;
        targetHoverY = -0.02;
      }
    }

    hoverOffsetPos.current.x = THREE.MathUtils.damp(
      hoverOffsetPos.current.x,
      targetHoverX,
      3.5,
      delta
    );
    hoverOffsetPos.current.y = THREE.MathUtils.damp(
      hoverOffsetPos.current.y,
      targetHoverY,
      3.5,
      delta
    );

    // -----------------------------------------------------------------
    // 3. POINTER PARALLAX (Subtle desktop displacement max ~8-10px)
    // -----------------------------------------------------------------
    const parallaxX = reducedMotion ? 0 : pointerX * 0.08;
    const parallaxY = reducedMotion ? 0 : pointerY * 0.05;

    // -----------------------------------------------------------------
    // 4. APPLY DAMPING TO CAMERA POSITION & LOOKAT
    // -----------------------------------------------------------------
    _posTarget.set(
      basePos[0] + hoverOffsetPos.current.x + parallaxX,
      basePos[1] + hoverOffsetPos.current.y + parallaxY,
      basePos[2]
    );

    _lookTarget.set(
      baseLook[0] + parallaxX * 0.4,
      baseLook[1] + parallaxY * 0.4,
      baseLook[2]
    );

    currentPos.current.lerp(_posTarget, 0.08);
    currentLookAt.current.lerp(_lookTarget, 0.08);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // -----------------------------------------------------------------
    // 5. DIRECT 3D-TO-2D SCREEN PROJECTION FOR SPATIAL LABELS
    // -----------------------------------------------------------------
    if (labelRefs?.current) {
      camera.updateMatrixWorld();

      for (let i = 0; i < zoneAnchors.length; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;

        const anchor = zoneAnchors[i];
        _projected.set(anchor.x, anchor.y, anchor.z);
        _projected.project(camera);

        // Convert normalized device coords (-1 to +1) to pixels
        const screenX = ((_projected.x + 1) / 2) * size.width;
        const screenY = ((-_projected.y + 1) / 2) * size.height;

        // Apply via direct DOM transform (zero React re-renders)
        el.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)`;
      }
    }
  });

  return null;
};
