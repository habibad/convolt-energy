"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SolarManufacturingZone } from "./zones/SolarManufacturingZone";
import { PowerGenerationZone } from "./zones/PowerGenerationZone";
import { DataCenterZone } from "./zones/DataCenterZone";
import { RecyclingZone } from "./zones/RecyclingZone";
import { Environment } from "./zones/Environment";
import { ApproachConnections } from "./ApproachConnections";

interface ModelProps {
  progress: number; // 0.0 to 1.0 section scroll progress
  visualActiveZone: number | "all" | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
}

export const ApproachModel: React.FC<ModelProps> = ({
  progress,
  visualActiveZone,
  pointerX,
  pointerY,
  reducedMotion = false,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);

  // Smooth lerp state refs
  const currentEntranceY = useRef(-0.25);
  const currentEntranceScale = useRef(0.92);
  const currentTiltY = useRef(0);
  const currentTiltX = useRef(0);

  useFrame((state, delta) => {
    if (!rootGroupRef.current || !tiltGroupRef.current) return;

    // 1. Entrance Choreography & Settle Curve (0.16 -> 0.30 -> 0.94 -> 1.00)
    let targetY = 0;
    let targetScale = 1.0;
    let targetBaseRotY = 0.28; // Isometric presentation angle (~16 degrees)

    if (progress < 0.16) {
      targetY = -0.25;
      targetScale = 0.92;
      targetBaseRotY = 0.42;
    } else if (progress < 0.3) {
      const norm = (progress - 0.16) / 0.14;
      const smooth = norm * norm * (3 - 2 * norm);
      targetY = -0.25 * (1 - smooth);
      targetScale = 0.92 + 0.08 * smooth;
      targetBaseRotY = 0.42 - 0.14 * smooth;
    } else if (progress > 0.94) {
      // Transition out bridge toward Solar Manufacturing section
      const normOut = (progress - 0.94) / 0.06;
      targetY = -0.04 * normOut;
      targetScale = 1.0 - 0.03 * normOut;
      targetBaseRotY = 0.28 - 0.06 * normOut;
    }

    currentEntranceY.current = THREE.MathUtils.damp(
      currentEntranceY.current,
      targetY,
      3.5,
      delta
    );
    currentEntranceScale.current = THREE.MathUtils.damp(
      currentEntranceScale.current,
      targetScale,
      3.5,
      delta
    );

    // 2. Idle Harmonic Breathing (Disabled if reduced motion is preferred)
    let idleY = 0;
    if (!reducedMotion) {
      const t = state.clock.getElapsedTime();
      idleY = 0.012 * Math.sin(t * 1.4);
    }

    rootGroupRef.current.position.y = currentEntranceY.current + idleY;
    rootGroupRef.current.scale.setScalar(currentEntranceScale.current);

    // 3. Desktop Pointer Parallax Tilt (Damped, Max ±0.06 rad Y, ±0.03 rad X)
    const targetPointerY = reducedMotion ? 0 : pointerX * 0.055;
    const targetPointerX = reducedMotion ? 0 : -pointerY * 0.028;

    currentTiltY.current = THREE.MathUtils.damp(
      currentTiltY.current,
      targetPointerY,
      4.0,
      delta
    );
    currentTiltX.current = THREE.MathUtils.damp(
      currentTiltX.current,
      targetPointerX,
      4.0,
      delta
    );

    tiltGroupRef.current.rotation.y = targetBaseRotY + currentTiltY.current;
    tiltGroupRef.current.rotation.x = 0.46 + currentTiltX.current; // ~26 degree isometric elevation
  });

  const isAllActive = visualActiveZone === "all" || (progress >= 0.86 && progress < 0.94);

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      <group ref={tiltGroupRef}>
        {/* 1. Surrounding Museum-Quality Architectural Boundary Frame */}
        {/* Slender charcoal posts at perimeter corners */}
        {[
          [-1.44, -1.44],
          [1.44, -1.44],
          [1.44, 1.44],
          [-1.44, 1.44],
        ].map(([px, pz], i) => (
          <mesh key={`post-${i}`} position={[px, 0.22, pz]}>
            <cylinderGeometry args={[0.005, 0.005, 0.48, 8]} />
            <meshStandardMaterial color="#354347" roughness={0.5} metalness={0.7} />
          </mesh>
        ))}

        {/* Top perimeter architectural display rail */}
        <group position={[0, 0.46, 0]}>
          <mesh position={[0, 0, -1.44]}>
            <boxGeometry args={[2.88, 0.006, 0.006]} />
            <meshStandardMaterial color="#4A595E" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, 1.44]}>
            <boxGeometry args={[2.88, 0.006, 0.006]} />
            <meshStandardMaterial color="#4A595E" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[-1.44, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.88, 0.006, 0.006]} />
            <meshStandardMaterial color="#4A595E" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[1.44, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.88, 0.006, 0.006]} />
            <meshStandardMaterial color="#4A595E" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>

        {/* Subtle, highly restrained corner glass panels (Avoids heavy full cube & sorting issues) */}
        {[
          [-1.44, 0.22, 0],
          [1.44, 0.22, 0],
        ].map(([gx, gy, gz], idx) => (
          <mesh key={`glass-${idx}`} position={[gx, gy, gz]}>
            <boxGeometry args={[0.004, 0.42, 2.8]} />
            <meshStandardMaterial
              color="#D0DDE2"
              roughness={0.1}
              metalness={0.1}
              transparent
              opacity={0.12}
            />
          </mesh>
        ))}

        {/* 2. Base Podium, Circulation Arteries & Maquette Landscaping */}
        <Environment />

        {/* 3. Four Integrated Business Zones */}
        {/* Zone 0: Solar Manufacturing */}
        <SolarManufacturingZone
          isActive={visualActiveZone === 0 || (progress >= 0.94 && progress <= 1.0)}
          isAllActive={isAllActive}
        />

        {/* Zone 1: Power Generation */}
        <PowerGenerationZone
          isActive={visualActiveZone === 1}
          isAllActive={isAllActive}
        />

        {/* Zone 2: Data Centers */}
        <DataCenterZone
          isActive={visualActiveZone === 2}
          isAllActive={isAllActive}
        />

        {/* Zone 3: Recycling */}
        <RecyclingZone
          isActive={visualActiveZone === 3}
          isAllActive={isAllActive}
        />

        {/* 4. Connected Circular Value Chain Spline */}
        <ApproachConnections
          visualActiveZone={visualActiveZone}
          progress={progress}
        />
      </group>
    </group>
  );
};
