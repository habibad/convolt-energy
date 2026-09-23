"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ZoneProps {
  isActive: boolean;
  isAllActive: boolean;
}

export const DataCenterZone: React.FC<ZoneProps> = ({
  isActive,
  isAllActive,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const activeWeight = isActive || isAllActive ? 1.0 : 0.0;
  const currentWeightRef = useRef(0);
  const windowMatRef = useRef<THREE.MeshStandardMaterial>(null);

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

    // Subtle breathing internal luminance on window slots
    if (windowMatRef.current) {
      const t = state.clock.getElapsedTime();
      const baseEmissive = isActive ? 0.45 : 0.15;
      const breath = 0.05 * Math.sin(t * 1.8);
      windowMatRef.current.emissiveIntensity = baseEmissive + breath;
    }
  });

  return (
    <group ref={groupRef} position={[0.78, 0, 0.78]}>
      {/* Structural Data Hall Foundation Pad */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.08, 0.9]} />
        <meshStandardMaterial
          color={isActive ? "#E8E4DA" : "#DFDBD1"}
          roughness={0.7}
        />
      </mesh>

      {/* Primary Data Hall Module A (Monolithic Clean Form) */}
      <group position={[-0.14, 0.17, -0.06]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.18, 0.62]} />
          <meshStandardMaterial
            color={isActive ? "#F1ECE3" : "#E2DDD3"}
            roughness={0.45}
            metalness={0.2}
          />
        </mesh>

        {/* Server Hall Cooling Louvers (Horizontal Slits) */}
        {[-0.04, 0.0, 0.04].map((y, idx) => (
          <mesh key={`louver-a-${idx}`} position={[-0.282, y, 0]}>
            <boxGeometry args={[0.008, 0.015, 0.48]} />
            <meshStandardMaterial
              color="#202A2E"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        ))}

        {/* Subtle Warm Internal Light Slot (Architectural Illumination) */}
        <mesh position={[0, -0.02, 0.312]}>
          <boxGeometry args={[0.42, 0.018, 0.008]} />
          <meshStandardMaterial
            ref={windowMatRef}
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={isActive ? 0.45 : 0.15}
            roughness={0.3}
          />
        </mesh>

        {/* Modular Rooftop Chillers / Heat Exchange Units */}
        {[-0.12, 0.12].map((xPos, idx) => (
          <mesh key={`chiller-${idx}`} position={[xPos, 0.11, 0]} castShadow>
            <boxGeometry args={[0.16, 0.04, 0.42]} />
            <meshStandardMaterial
              color="#3E4A4E"
              roughness={0.35}
              metalness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Secondary Modular Compute Hall B */}
      <group position={[0.28, 0.14, 0.08]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.12, 0.44]} />
          <meshStandardMaterial
            color={isActive ? "#ECE8DF" : "#DDD8CE"}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* Rooftop Solar Canopy on Module B */}
        <mesh position={[0, 0.07, 0]} castShadow>
          <boxGeometry args={[0.24, 0.01, 0.4]} />
          <meshStandardMaterial
            color="#141E26"
            roughness={0.2}
            metalness={0.8}
            emissive={isActive ? "#2F5036" : "#000000"}
            emissiveIntensity={isActive ? 0.3 : 0.0}
          />
        </mesh>
      </group>

      {/* Sustainable Power Intertie Gateway */}
      <mesh position={[-0.34, 0.08, 0.32]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.12]} />
        <meshStandardMaterial
          color={isActive ? "#63A75B" : "#2E3B3E"}
          roughness={0.4}
          metalness={0.5}
          emissive={isActive ? "#63A75B" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0.0}
        />
      </mesh>
    </group>
  );
};
