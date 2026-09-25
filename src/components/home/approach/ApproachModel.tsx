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
  transitionProgress?: number; // 0 (overview) -> 1 (business)
}

export const ApproachModel: React.FC<ModelProps> = ({
  progress,
  visualActiveZone,
  reducedMotion = false,
  transitionProgress = 0,
}) => {
  // Load approved high-resolution master environment asset (05-integrated-ecosystem.png)
  const masterTexture = useTexture("/media/approach/05-integrated-ecosystem.png");
  masterTexture.colorSpace = THREE.SRGBColorSpace;
  masterTexture.generateMipmaps = true;
  masterTexture.minFilter = THREE.LinearMipmapLinearFilter;

  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
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

  // Master 2.5D shader with accurate Linear-to-sRGB color transform and depth sink
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: { value: masterTexture },
        uActiveZone: { value: -1 },
        uZoneWeight: { value: 0.0 },
        uTime: { value: 0.0 },
        uTransitionProgress: { value: 0.0 },
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
        uniform float uTransitionProgress;
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
          float distSolar = length(vUv - vec2(0.335, 0.692));
          float solarLift = smoothstep(0.18, 0.0, distSolar) * 0.16;

          float distPower = length(vUv - vec2(0.652, 0.692));
          float powerLift = smoothstep(0.18, 0.0, distPower) * 0.16;

          float distData = length(vUv - vec2(0.720, 0.420));
          float dataLift = smoothstep(0.18, 0.0, distData) * 0.18;

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

          // 3. MOTION A: Contrast & Saturation reduction during depth sink
          if (uTransitionProgress > 0.0) {
            float gray = dot(linearColor, vec3(0.299, 0.587, 0.114));
            linearColor = mix(linearColor, vec3(gray), uTransitionProgress * 0.30);
            linearColor = mix(linearColor, bgDarkLinear, uTransitionProgress * 0.45);
          }

          vec3 srgbOut = linearToSRGB(linearColor);
          float alpha = 1.0 - smoothstep(0.75, 1.0, uTransitionProgress);

          gl_FragColor = vec4(srgbOut, alpha);
        }
      `,
    });
  }, [masterTexture]);

  const targetWeight = activeZoneIndex >= 0 ? 1.0 : 0.0;
  const currentWeightRef = useRef(0);

  useFrame((state, delta) => {
    if (!shaderRef.current || !groupRef.current) return;
    currentWeightRef.current = THREE.MathUtils.damp(
      currentWeightRef.current,
      targetWeight,
      4.0,
      delta
    );

    const tp = Math.min(1, Math.max(0, transitionProgress));
    shaderRef.current.uniforms.uActiveZone.value = activeZoneIndex;
    shaderRef.current.uniforms.uZoneWeight.value = currentWeightRef.current;
    shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    shaderRef.current.uniforms.uTransitionProgress.value = tp;

    // MOTION A: Overview group sinks backward and slightly downward
    // Z: 0.0 -> -2.8
    // Y: -0.35 -> -0.65
    // Scale: 1.0 -> 0.92
    const easeTp = tp * tp * (3 - 2 * tp);
    const sinkZ = THREE.MathUtils.lerp(0.0, -2.8, easeTp);
    const sinkY = THREE.MathUtils.lerp(-0.35, -0.65, easeTp);
    const sinkScale = THREE.MathUtils.lerp(1.0, 0.92, easeTp);

    groupRef.current.position.set(0.2, sinkY, sinkZ);
    groupRef.current.scale.set(sinkScale, sinkScale, sinkScale);
    groupRef.current.visible = tp < 0.99;
  });

  return (
    <group ref={groupRef} position={[0.2, -0.35, 0.0]}>
      {/* Full-Bleed Dynamic Cinematic Ecosystem Plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <primitive object={shaderMaterial} ref={shaderRef} attach="material" />
      </mesh>

      {/* Traveling Energy Beads along the Campus Road */}
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
