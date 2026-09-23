"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface HeroLayersProps {
  pointerX: number; // -1 to 1
  pointerY: number; // -1 to 1
  scrollProgress: number; // 0.0 to 1.0
  reducedMotion?: boolean;
}

export const HeroLayers: React.FC<HeroLayersProps> = ({
  pointerX,
  pointerY,
  scrollProgress,
  reducedMotion = false,
}) => {
  const { camera, size } = useThree();

  // Load textures
  const [landscapeTexture, facilityTexture, solarMaskTexture] = useTexture([
    "/media/hero/convalt-hero-landscape.webp",
    "/media/hero/convalt-facility-fg.webp",
    "/media/hero/convalt-solar-mask.webp",
  ]);

  useMemo(() => {
    [landscapeTexture, facilityTexture, solarMaskTexture].forEach((tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
    });
  }, [landscapeTexture, facilityTexture, solarMaskTexture]);

  const landscapeRef = useRef<THREE.Mesh>(null);
  const facilityRef = useRef<THREE.Mesh>(null);
  const solarHighlightRef = useRef<THREE.Mesh>(null);

  // Aspect ratio of the original Convalt renders (1672 / 941 = ~1.7768)
  const imgAspect = 1672 / 941;
  const screenAspect = size.width / Math.max(1, size.height);

  // Compute exact frustum dimensions in "cover" mode at given distance
  const getCoverDimensions = (distance: number, parallaxBleed = 1.08) => {
    const fovRad = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2);
    const visibleHeight = 2 * Math.tan(fovRad) * distance;
    const visibleWidth = visibleHeight * screenAspect;

    let width = visibleWidth;
    let height = visibleHeight;

    if (screenAspect > imgAspect) {
      width = visibleWidth * parallaxBleed;
      height = width / imgAspect;
    } else {
      height = visibleHeight * parallaxBleed;
      width = height * imgAspect;
    }

    return { width, height };
  };

  // Background plane (Z = -3.8, Camera ~5.0 -> Distance = 8.8)
  const bgDim = getCoverDimensions(8.8, 1.12);

  // Foreground plane (Z = 0.0, Camera ~5.0 -> Distance = 5.0)
  const fgDim = getCoverDimensions(5.0, 1.12);

  // Solar Highlight Shader: traveling specular sunlight highlight across the solar panels
  const solarShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMask: { value: solarMaskTexture },
        uTime: { value: 0 },
        uSpeed: { value: 0.1 }, // ~10s cycle
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uMask;
        uniform float uTime;
        uniform float uSpeed;

        void main() {
          vec4 maskColor = texture2D(uMask, vUv);
          if (maskColor.a < 0.02) {
            discard;
          }

          // Traveling beam across roof from left to right every ~9-11 seconds
          // Diagonal angle matching the morning sunlight direction
          float travel = mod(uTime * uSpeed, 1.6) - 0.3;
          float beamDist = abs((vUv.x * 0.8 + vUv.y * 0.4) - travel);
          
          // Soft natural specular beam
          float beam = smoothstep(0.18, 0.0, beamDist);

          // Sunlight warm reflection color (restrained and natural, not sci-fi blue)
          vec3 sunGleam = vec3(1.0, 0.96, 0.88);
          float alpha = maskColor.a * beam * 0.28;

          gl_FragColor = vec4(sunGleam, alpha);
        }
      `,
    });
  }, [solarMaskTexture]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (solarShaderMaterial) {
      solarShaderMaterial.uniforms.uTime.value = time;
    }

    if (!reducedMotion) {
      // 1. Distant Landscape Parallax: subtle counter-shift
      if (landscapeRef.current) {
        const targetBgX = -pointerX * 0.04;
        const targetBgY = -pointerY * 0.025;
        landscapeRef.current.position.x = THREE.MathUtils.damp(
          landscapeRef.current.position.x,
          targetBgX,
          3.5,
          delta
        );
        landscapeRef.current.position.y = THREE.MathUtils.damp(
          landscapeRef.current.position.y,
          targetBgY,
          3.5,
          delta
        );
      }

      // 2. Foreground Facility Parallax: receives more responsive shift
      // Plus ScrollTrigger foreground depth push
      if (facilityRef.current) {
        const targetFgX = pointerX * 0.12;
        const targetFgY = pointerY * 0.06 - scrollProgress * 0.15;
        const targetFgZ = scrollProgress * 0.25;

        facilityRef.current.position.x = THREE.MathUtils.damp(
          facilityRef.current.position.x,
          targetFgX,
          4.0,
          delta
        );
        facilityRef.current.position.y = THREE.MathUtils.damp(
          facilityRef.current.position.y,
          targetFgY,
          4.0,
          delta
        );
        facilityRef.current.position.z = THREE.MathUtils.damp(
          facilityRef.current.position.z,
          targetFgZ,
          4.0,
          delta
        );

        if (solarHighlightRef.current) {
          solarHighlightRef.current.position.copy(facilityRef.current.position);
          solarHighlightRef.current.position.z += 0.01;
        }
      }
    }
  });

  return (
    <group name="HeroLayersGroup">
      {/* 1. Distant Landscape Plane (Sky, Sunrise, Mountains, Water, Bay) */}
      <mesh
        ref={landscapeRef}
        position={[0, 0, -3.8]}
      >
        <planeGeometry args={[bgDim.width, bgDim.height]} />
        <meshBasicMaterial
          map={landscapeTexture}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Facility Foreground Layer (Convalt Building, Rooftop Solar, Waterfall, Cliffs) */}
      <mesh
        ref={facilityRef}
        position={[0, 0, 0.0]}
      >
        <planeGeometry args={[fgDim.width, fgDim.height]} />
        <meshBasicMaterial
          map={facilityTexture}
          transparent={true}
          alphaTest={0.01}
          depthWrite={true}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Solar Panel Subtle Sunlight Highlight Pass */}
      <mesh
        ref={solarHighlightRef}
        position={[0, 0, 0.01]}
        material={solarShaderMaterial}
      >
        <planeGeometry args={[fgDim.width, fgDim.height]} />
      </mesh>
    </group>
  );
};
