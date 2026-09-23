"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ApproachConnections } from "./ApproachConnections";

interface ModelProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  reducedMotion?: boolean;
}

export const ApproachModel: React.FC<ModelProps> = ({
  progress,
  visualActiveZone,
  reducedMotion = false,
}) => {
  // Load approved high-resolution master environment asset (05-integrated-ecosystem.png)
  const masterTexture = useTexture("/media/approach/05-integrated-ecosystem.png");
  masterTexture.colorSpace = THREE.SRGBColorSpace;
  masterTexture.generateMipmaps = true;
  masterTexture.minFilter = THREE.LinearMipmapLinearFilter;

  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // 05-integrated-ecosystem.png dimensions: 1672 x 941
  const imgAspect = 1672 / 941; // ~1.7768

  // Dynamic plane dimensions guaranteeing full-bleed coverage across any viewport aspect ratio
  const { planeWidth, planeHeight } = useMemo(() => {
    const margin = 1.12; // Slight bleed for parallax & subtle camera movements
    let w = viewport.width * margin;
    let h = w / imgAspect;
    if (h < viewport.height * margin) {
      h = viewport.height * margin;
      w = h * imgAspect;
    }
    return { planeWidth: w, planeHeight: h };
  }, [viewport.width, viewport.height, imgAspect]);

  // Compute active zone index for uniform (-1 none, 0 solar, 1 power, 2 data, 3 recycling, 4 all)
  const activeZoneIndex = useMemo(() => {
    if (visualActiveZone === "all" || (progress >= 0.86 && progress < 0.94)) {
      return 4; // All zones
    }
    if (visualActiveZone !== null && typeof visualActiveZone === "number") {
      return visualActiveZone;
    }
    return -1;
  }, [visualActiveZone, progress]);

  // Master 2.5D shader with accurate Linear-to-sRGB color transform
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: false,
      uniforms: {
        uTexture: { value: masterTexture },
        uActiveZone: { value: -1 },
        uZoneWeight: { value: 0.0 },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform int uActiveZone;
        uniform float uZoneWeight;
        uniform float uTime;
        varying vec2 vUv;

        // Accurate Linear to sRGB color space conversion for WebGL canvas output
        vec3 linearToSRGB(vec3 c) {
          vec3 b = step(vec3(0.0031308), c);
          return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, b);
        }

        void main() {
          vec4 texColor = texture2D(uTexture, vUv);
          vec3 linearColor = texColor.rgb;

          // 1. Subtle Local Exposure Lift for active business zones (in linear space)
          // Zone 0: Solar Manufacturing (UV: 0.335, 0.692)
          float distSolar = length(vUv - vec2(0.335, 0.692));
          float solarLift = smoothstep(0.18, 0.0, distSolar) * 0.16;

          // Zone 1: Power Generation (UV: 0.652, 0.692)
          float distPower = length(vUv - vec2(0.652, 0.692));
          float powerLift = smoothstep(0.18, 0.0, distPower) * 0.16;

          // Zone 2: Data Centers (UV: 0.754, 0.362)
          float distData = length(vUv - vec2(0.720, 0.420));
          float dataLift = smoothstep(0.18, 0.0, distData) * 0.18;

          // Zone 3: Recycling (UV: 0.293, 0.352)
          float distRecycle = length(vUv - vec2(0.330, 0.400));
          float recycleLift = smoothstep(0.18, 0.0, distRecycle) * 0.16;

          if (uActiveZone == 0 || uActiveZone == 4) {
            linearColor += vec3(0.07, 0.14, 0.08) * solarLift * uZoneWeight;
          }
          if (uActiveZone == 1 || uActiveZone == 4) {
            linearColor += vec3(0.07, 0.12, 0.14) * powerLift * uZoneWeight;
          }
          if (uActiveZone == 2 || uActiveZone == 4) {
            linearColor += vec3(0.15, 0.12, 0.04) * dataLift * uZoneWeight;
          }
          if (uActiveZone == 3 || uActiveZone == 4) {
            linearColor += vec3(0.07, 0.14, 0.08) * recycleLift * uZoneWeight;
          }

          // 2. Soft natural blending at bottom where mist meets #0E1A1A Story Rail
          vec3 bgDarkLinear = vec3(0.003, 0.008, 0.008); // #0E1A1A linearized
          float bottomFade = 1.0 - smoothstep(0.0, 0.10, vUv.y);
          linearColor = mix(linearColor, bgDarkLinear, bottomFade * 0.50);

          // 3. ESSENTIAL: Convert Linear RGB to sRGB for display output
          vec3 srgbOut = linearToSRGB(linearColor);

          gl_FragColor = vec4(srgbOut, 1.0);
        }
      `,
    });
  }, [masterTexture]);

  const targetWeight = activeZoneIndex >= 0 ? 1.0 : 0.0;
  const currentWeightRef = useRef(0);

  useFrame((state, delta) => {
    if (!shaderRef.current) return;
    currentWeightRef.current = THREE.MathUtils.damp(
      currentWeightRef.current,
      targetWeight,
      4.0,
      delta
    );

    shaderRef.current.uniforms.uActiveZone.value = activeZoneIndex;
    shaderRef.current.uniforms.uZoneWeight.value = currentWeightRef.current;
    shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <group position={[0.2, -0.35, 0.0]}>
      {/* ------------------------------------------------------------- */}
      {/* Full-Bleed Dynamic Cinematic Ecosystem Plane                  */}
      {/* ------------------------------------------------------------- */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <primitive object={shaderMaterial} ref={shaderRef} attach="material" />
      </mesh>

      {/* ------------------------------------------------------------- */}
      {/* Subtle Traveling Energy Beads along the Campus Road           */}
      {/* ------------------------------------------------------------- */}
      <ApproachConnections
        visualActiveZone={visualActiveZone}
        progress={progress}
        reducedMotion={reducedMotion}
        planeWidth={planeWidth}
        planeHeight={planeHeight}
      />
    </group>
  );
};
