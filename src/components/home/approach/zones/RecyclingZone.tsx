"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ZoneProps {
  isActive: boolean;
  isAllActive: boolean;
}

export const RecyclingZone: React.FC<ZoneProps> = ({
  isActive,
  isAllActive,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const activeWeight = isActive || isAllActive ? 1.0 : 0.0;
  const currentWeightRef = useRef(0);
  const circularConveyorRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    currentWeightRef.current = THREE.MathUtils.damp(
      currentWeightRef.current,
      activeWeight,
      4.0,
      delta
    );
    const w = currentWeightRef.current;
    groupRef.current.position.y = 0.015 * w;

    // Subtle rotation of circular material recovery ring
    if (circularConveyorRef.current) {
      circularConveyorRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[-0.78, 0, 0.78]}>
      {/* Foundation Processing Pad */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.08, 0.9]} />
        <meshStandardMaterial
          color={isActive ? "#E8E4DA" : "#DFDBD1"}
          roughness={0.7}
        />
      </mesh>

      {/* Advanced Materials Reclamation Building */}
      <mesh position={[-0.18, 0.16, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.16, 0.6]} />
        <meshStandardMaterial
          color={isActive ? "#EFECE4" : "#E0DCD3"}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Primary Circular Extraction Silo / Separation Column */}
      <group position={[0.22, 0.14, -0.12]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.22, 24]} />
          <meshStandardMaterial
            color={isActive ? "#F3EFE7" : "#E2DDD3"}
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
        {/* Metal Silo Accent Band */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.134, 0.134, 0.015, 24]} />
          <meshStandardMaterial
            color={isActive ? "#63A75B" : "#4A5A5E"}
            roughness={0.3}
            metalness={0.6}
            emissive={isActive ? "#63A75B" : "#000000"}
            emissiveIntensity={isActive ? 0.35 : 0.0}
          />
        </mesh>
      </group>

      {/* Circular Closed-Loop Recovery Motif (Rotating Ring with material tokens) */}
      <group ref={circularConveyorRef} position={[0.22, 0.28, -0.12]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.14, 0.007, 12, 32]} />
          <meshStandardMaterial
            color={isActive ? "#63A75B" : "#809299"}
            roughness={0.2}
            metalness={0.7}
            emissive={isActive ? "#63A75B" : "#000000"}
            emissiveIntensity={isActive ? 0.4 : 0.0}
          />
        </mesh>
      </group>

      {/* High-Grade Material Sorting & Output Bay */}
      <group position={[0.14, 0.09, 0.24]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.08, 0.22]} />
          <meshStandardMaterial
            color={isActive ? "#ECE8DF" : "#DCD7CD"}
            roughness={0.55}
          />
        </mesh>

        {/* Reclaimed Ingot / Silicon Pallet Rows */}
        {[-0.08, 0.08].map((xPos, idx) => (
          <mesh key={`ingot-${idx}`} position={[xPos, 0.05, 0]} castShadow>
            <boxGeometry args={[0.1, 0.02, 0.12]} />
            <meshStandardMaterial
              color="#3C4B52"
              roughness={0.25}
              metalness={0.75}
            />
          </mesh>
        ))}
      </group>

      {/* Enclosed Return Pipeline toward Manufacturing */}
      <mesh position={[-0.18, 0.08, 0.32]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.22, 16]} />
        <meshStandardMaterial
          color={isActive ? "#63A75B" : "#5A6970"}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};
