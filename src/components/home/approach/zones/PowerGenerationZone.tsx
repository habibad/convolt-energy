"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ZoneProps {
  isActive: boolean;
  isAllActive: boolean;
}

export const PowerGenerationZone: React.FC<ZoneProps> = ({
  isActive,
  isAllActive,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const activeWeight = isActive || isAllActive ? 1.0 : 0.0;
  const currentWeightRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    currentWeightRef.current = THREE.MathUtils.damp(
      currentWeightRef.current,
      activeWeight,
      4.0,
      delta
    );
    const w = currentWeightRef.current;
    groupRef.current.position.y = 0.015 * w;
  });

  // 4 rows of 3 tilted solar tracker tables
  const rows = [-0.28, -0.09, 0.1, 0.29];
  const cols = [-0.28, 0.0, 0.28];

  return (
    <group ref={groupRef} position={[0.78, 0, -0.78]}>
      {/* Foundation / Graded Solar Field Bed */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.08, 0.9]} />
        <meshStandardMaterial
          color={isActive ? "#E8E4DA" : "#DFDBD1"}
          roughness={0.75}
        />
      </mesh>

      {/* Utility-Scale Solar Panel Tracker Arrays */}
      {rows.map((z, rowIdx) =>
        cols.map((x, colIdx) => (
          <group key={`pv-${rowIdx}-${colIdx}`} position={[x, 0.11, z]}>
            {/* Tracker Support Torque Tube Post */}
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
              <meshStandardMaterial color="#68757C" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Tilted Solar PV Table (Angled toward South-facing key light) */}
            <mesh rotation={[-0.38, 0, 0]} position={[0, 0.01, 0]} castShadow>
              <boxGeometry args={[0.22, 0.012, 0.13]} />
              <meshStandardMaterial
                color="#0D161F"
                roughness={0.2}
                metalness={0.8}
                emissive={isActive ? "#233F31" : "#000000"}
                emissiveIntensity={isActive ? 0.4 : 0.0}
              />
            </mesh>

            {/* Panel Aluminum Framing Line */}
            <mesh rotation={[-0.38, 0, 0]} position={[0, 0.017, 0]}>
              <boxGeometry args={[0.224, 0.002, 0.134]} />
              <meshStandardMaterial color="#9AA7AE" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Grid Substation / Inverter Enclosure Block */}
      <group position={[0.34, 0.11, -0.32]}>
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.06, 0.14]} />
          <meshStandardMaterial
            color={isActive ? "#F3EFE7" : "#E2DDD3"}
            roughness={0.45}
            metalness={0.3}
          />
        </mesh>
        {/* Substation Ceramic Insulator Bushings */}
        {[-0.04, 0, 0.04].map((px, idx) => (
          <mesh key={`bushing-${idx}`} position={[px, 0.075, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.03, 8]} />
            <meshStandardMaterial
              color={isActive ? "#63A75B" : "#809299"}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
