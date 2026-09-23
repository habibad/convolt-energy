"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ZoneProps {
  isActive: boolean;
  isAllActive: boolean;
}

export const SolarManufacturingZone: React.FC<ZoneProps> = ({
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

  return (
    <group ref={groupRef} position={[-0.78, 0, -0.78]}>
      {/* Factory Base Foundation Pad */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.08, 0.9]} />
        <meshStandardMaterial
          color={isActive ? "#E8E4DA" : "#DFDBD1"}
          roughness={0.7}
        />
      </mesh>

      {/* Main Factory Hall (Clean Architectural Volume) */}
      <mesh position={[-0.15, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.2, 0.74]} />
        <meshStandardMaterial
          color={isActive ? "#F3EFE7" : "#E5E1D7"}
          roughness={0.5}
        />
      </mesh>

      {/* Saw-tooth Roof Array (Distinctive Industrial Clean-Tech Architecture) */}
      {[0.24, 0.0, -0.24].map((zPos, idx) => (
        <group key={`sawtooth-${idx}`} position={[-0.15, 0.31, zPos]}>
          {/* Angled Solar Roof Surface */}
          <mesh rotation={[0.42, 0, 0]} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.52, 0.02, 0.16]} />
            <meshStandardMaterial
              color="#131C24"
              roughness={0.25}
              metalness={0.65}
              emissive={isActive ? "#2F5036" : "#000000"}
              emissiveIntensity={isActive ? 0.35 : 0.0}
            />
          </mesh>
          {/* Vertical Clerestory Window Strip */}
          <mesh position={[0, -0.02, 0.07]}>
            <boxGeometry args={[0.5, 0.04, 0.015]} />
            <meshStandardMaterial
              color="#D8E2E6"
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* High-Bay Automated Logistics Wing */}
      <mesh position={[0.26, 0.15, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.14, 0.44]} />
        <meshStandardMaterial
          color={isActive ? "#EFECE4" : "#E2DDD3"}
          roughness={0.55}
        />
      </mesh>

      {/* Loading Dock Canopy with Convalt Emerald Accent */}
      <mesh position={[0.26, 0.08, 0.22]} castShadow>
        <boxGeometry args={[0.26, 0.015, 0.16]} />
        <meshStandardMaterial
          color={isActive ? "#63A75B" : "#2E3B3E"}
          roughness={0.4}
          metalness={0.4}
          emissive={isActive ? "#63A75B" : "#000000"}
          emissiveIntensity={isActive ? 0.25 : 0.0}
        />
      </mesh>

      {/* Miniature Solar Panel Pallet Stacks */}
      {[
        [-0.1, 0.09, 0.38],
        [0.02, 0.09, 0.38],
      ].map(([x, y, z], i) => (
        <mesh key={`pallet-${i}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.08, 0.025, 0.06]} />
          <meshStandardMaterial
            color="#1B2631"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};
