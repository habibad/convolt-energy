"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConnectionsProps {
  visualActiveZone: number | "all" | null;
  progress: number;
}

export const ApproachConnections: React.FC<ConnectionsProps> = ({
  visualActiveZone,
  progress,
}) => {
  const pulsesGroupRef = useRef<THREE.Group>(null);

  // 1. Closed Catmull-Rom spline linking the four clean-tech campus zones
  const { curve, lineGeometry } = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.78, 0.12, -0.78), // 0: Solar Manufacturing
      new THREE.Vector3(0.0, 0.16, -0.88),  // Mid-way curve North
      new THREE.Vector3(0.78, 0.12, -0.78),  // 1: Power Generation
      new THREE.Vector3(0.88, 0.16, 0.0),   // Mid-way curve East
      new THREE.Vector3(0.78, 0.12, 0.78),   // 2: Data Centers
      new THREE.Vector3(0.0, 0.16, 0.88),   // Mid-way curve South
      new THREE.Vector3(-0.78, 0.12, 0.78),  // 3: Recycling
      new THREE.Vector3(-0.88, 0.16, 0.0),  // Mid-way curve West
    ];

    const c = new THREE.CatmullRomCurve3(points, true, "centripetal", 0.3);
    const divisions = 140;
    const curvePoints = c.getPoints(divisions);
    const geom = new THREE.BufferGeometry().setFromPoints(curvePoints);

    return { curve: c, lineGeometry: geom };
  }, []);

  // 2. Exactly 6 restrained energy pulse markers evenly distributed along the loop
  const pulseCount = 6;
  const pulseOffsets = useMemo(
    () => Array.from({ length: pulseCount }, (_, i) => i / pulseCount),
    [pulseCount]
  );

  // Smooth pulse loop animation
  useFrame((state) => {
    if (!pulsesGroupRef.current) return;
    const t = (state.clock.getElapsedTime() * 0.12) % 1.0;
    const children = pulsesGroupRef.current.children;

    for (let i = 0; i < children.length; i++) {
      const offset = pulseOffsets[i];
      const u = (t + offset) % 1.0;
      const pt = curve.getPointAt(u);
      children[i].position.copy(pt);
    }
  });

  const isAllActive = visualActiveZone === "all" || progress >= 0.86;
  const isAnyActive = visualActiveZone !== null;

  // Restrained line opacity & color modulation
  const baseOpacity = isAllActive ? 0.65 : isAnyActive ? 0.45 : 0.28;
  const lineColor = isAllActive ? "#74B06D" : isAnyActive ? "#84A98C" : "#A6B5BA";

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Spline Energy Transmission Path */}
      {/* Native Three.js line with restrained opacity */}
      {/* @ts-expect-error Three.js line element */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={baseOpacity}
          linewidth={1}
        />
      </line>

      {/* 6 Restrained Moving Energy Pulses (Tiny Beads) */}
      <group ref={pulsesGroupRef}>
        {pulseOffsets.map((_, idx) => (
          <mesh key={`pulse-${idx}`}>
            <sphereGeometry args={[0.016, 12, 12]} />
            <meshStandardMaterial
              color="#F4F3EF"
              emissive="#74B06D"
              emissiveIntensity={isAllActive ? 0.8 : 0.45}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
