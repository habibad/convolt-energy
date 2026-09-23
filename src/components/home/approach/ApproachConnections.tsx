"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConnectionsProps {
  visualActiveZone: number | "all" | null;
  progress: number;
  reducedMotion?: boolean;
  planeWidth?: number;
  planeHeight?: number;
}

export const ApproachConnections: React.FC<ConnectionsProps> = ({
  visualActiveZone,
  progress,
  reducedMotion = false,
  planeWidth = 13.6,
  planeHeight = 7.65,
}) => {
  const pulsesGroupRef = useRef<THREE.Group>(null);

  // Road curve traced in UV space of 05-integrated-ecosystem.png
  const { curve } = useMemo(() => {
    const uvPoints = [
      [0.335, 0.692], // 0: Solar Manufacturing
      [0.480, 0.710], // Road bend through trees
      [0.652, 0.692], // 1: Power Generation
      [0.690, 0.530], // Road bend down
      [0.720, 0.420], // 2: Data Centers
      [0.520, 0.350], // Causeway / lake edge
      [0.320, 0.380], // 3: Recycling
      [0.280, 0.520], // Road ascending back to Solar
    ];

    const points = uvPoints.map(
      ([u, v]) =>
        new THREE.Vector3(
          (u - 0.5) * planeWidth,
          (v - 0.5) * planeHeight,
          0.02
        )
    );

    const c = new THREE.CatmullRomCurve3(points, true, "centripetal", 0.3);
    return { curve: c };
  }, [planeWidth, planeHeight]);

  // Exactly 5 tiny moving light beads along the road
  const pulseCount = 5;
  const pulseOffsets = useMemo(
    () => Array.from({ length: pulseCount }, (_, i) => i / pulseCount),
    [pulseCount]
  );

  useFrame((state) => {
    if (!pulsesGroupRef.current || reducedMotion) return;
    const t = (state.clock.getElapsedTime() * 0.05) % 1.0;
    const children = pulsesGroupRef.current.children;

    for (let i = 0; i < children.length; i++) {
      const offset = pulseOffsets[i];
      const u = (t + offset) % 1.0;
      const pt = curve.getPointAt(u);
      children[i].position.copy(pt);
    }
  });

  const isAllActive = visualActiveZone === "all" || (progress >= 0.86 && progress < 0.94);

  return (
    <group position={[0, 0, 0]}>
      {/* 5 Tiny Subtle Traveling Light Beads along the real road */}
      <group ref={pulsesGroupRef}>
        {pulseOffsets.map((_, idx) => (
          <mesh key={`pulse-dot-${idx}`}>
            <sphereGeometry args={[0.026, 10, 10]} />
            <meshStandardMaterial
              color="#F4F3EF"
              emissive="#4A9E44"
              emissiveIntensity={isAllActive ? 0.9 : 0.5}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
