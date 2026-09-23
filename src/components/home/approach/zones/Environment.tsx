"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export const Environment: React.FC = () => {
  // Minimalist architectural maquette tree positions
  const treePositions = useMemo(
    () => [
      // Central North-South boulevard edges
      [0.12, 0.05, -0.15],
      [-0.12, 0.05, -0.25],
      [0.12, 0.05, 0.2],
      [-0.12, 0.05, 0.3],

      // Perimeter landscaping
      [-1.32, 0.05, -0.4],
      [-1.32, 0.05, 0.4],
      [1.32, 0.05, -0.4],
      [1.32, 0.05, 0.4],

      // Courtyard nodes
      [-0.02, 0.05, -1.25],
      [0.02, 0.05, 1.25],
    ],
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Primary Elevated Architectural Plinth (Base Podium) */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[2.84, 0.08, 2.84]} />
        <meshStandardMaterial
          color="#EAE7DF"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Sub-Foundation Charcoal Footing (Creates architectural floating shadow gap) */}
      <mesh position={[0, -0.09, 0]}>
        <boxGeometry args={[2.74, 0.04, 2.74]} />
        <meshStandardMaterial color="#1D2628" roughness={0.9} />
      </mesh>

      {/* 3. Central Axis Pedestrian Circulation Arteries (Paved walkways) */}
      {/* North-South Spine */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[0.22, 2.7]} />
        <meshStandardMaterial
          color="#DCD7CD"
          roughness={0.7}
        />
      </mesh>
      {/* East-West Cross Corridor */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.7, 0.22]} />
        <meshStandardMaterial
          color="#DCD7CD"
          roughness={0.7}
        />
      </mesh>

      {/* 4. Central Campus Nexus / Circular Water Feature Plinth */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.015, 32]} />
        <meshStandardMaterial color="#C5CFD4" roughness={0.15} metalness={0.4} />
      </mesh>
      {/* Water Pool Ring */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.01, 32]} />
        <meshStandardMaterial
          color="#3B5965"
          roughness={0.1}
          metalness={0.85}
        />
      </mesh>

      {/* 5. Minimalist Architectural Maquette Trees */}
      {treePositions.map(([x, y, z], idx) => (
        <group key={`tree-${idx}`} position={[x, y, z]}>
          {/* Slender Charcoal Trunk */}
          <mesh position={[0, 0.035, 0]}>
            <cylinderGeometry args={[0.006, 0.008, 0.07, 8]} />
            <meshStandardMaterial color="#2B363A" roughness={0.9} />
          </mesh>
          {/* Geometric Sage Canopy (Clean Architectural Cylinder / Cone) */}
          <mesh position={[0, 0.085, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.038, 0.07, 12]} />
            <meshStandardMaterial
              color="#5F7661"
              roughness={0.65}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
