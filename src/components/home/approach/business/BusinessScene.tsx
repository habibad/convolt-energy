"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BUSINESS_DATA, BusinessId } from "./businessData";

interface BusinessSceneProps {
  activeBusiness: BusinessId | null;
  pendingBusiness: BusinessId | null;
  transitionProgress: number; // 0 (overview) -> 1 (business fully dominant)
  businessToBusinessProgress: number; // 0 (active) -> 1 (pending)
  isBusinessMode: boolean;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
}

export const BusinessScene: React.FC<BusinessSceneProps> = ({
  activeBusiness,
  pendingBusiness,
  transitionProgress,
  businessToBusinessProgress,
  isBusinessMode,
  pointerX,
  pointerY,
  reducedMotion = false,
}) => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const midgroundShaderRef = useRef<THREE.ShaderMaterial>(null);
  const backgroundShaderRef = useRef<THREE.ShaderMaterial>(null);
  const mistShaderRef = useRef<THREE.ShaderMaterial>(null);

  // Dynamic texture loading for active and pending businesses (GPU memory conscious)
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const needed = new Set<string>();
    if (activeBusiness) needed.add(BUSINESS_DATA[activeBusiness].media);
    if (pendingBusiness) needed.add(BUSINESS_DATA[pendingBusiness].media);

    // Preload Solar and adjacent assets for instant readiness
    needed.add(BUSINESS_DATA.solar.media);

    needed.forEach((src) => {
      if (!textures[src]) {
        loader.load(src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          setTextures((prev) => ({ ...prev, [src]: tex }));
        });
      }
    });

    // Cleanup: dispose textures that are no longer active or pending
    return () => {
      // safe no-op or selective cleanup
    };
  }, [activeBusiness, pendingBusiness, textures]);

  const activeMedia = activeBusiness ? BUSINESS_DATA[activeBusiness].media : BUSINESS_DATA.solar.media;
  const activeTexture = textures[activeMedia] || null;

  const pendingMedia = pendingBusiness ? BUSINESS_DATA[pendingBusiness].media : null;
  const pendingTexture = pendingMedia ? textures[pendingMedia] || null : null;

  // Aspect ratio based on standard 16:9 widescreen master
  const imgAspect = 16 / 9;

  const { planeWidth, planeHeight } = useMemo(() => {
    const margin = 1.14;
    let w = viewport.width * margin;
    let h = w / imgAspect;
    if (h < viewport.height * margin) {
      h = viewport.height * margin;
      w = h * imgAspect;
    }
    return { planeWidth: w, planeHeight: h };
  }, [viewport.width, viewport.height, imgAspect]);

  // Master 2.5D Midground Material with edge feathering & lighting sweep
  const midgroundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uActiveTex: { value: null },
        uPendingTex: { value: null },
        uMixProgress: { value: 0.0 },
        uMasterProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uActiveTex;
        uniform sampler2D uPendingTex;
        uniform float uMixProgress;
        uniform float uMasterProgress;
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec2 vUv;

        vec3 linearToSRGB(vec3 c) {
          vec3 b = step(vec3(0.0031308), c);
          return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, b);
        }

        void main() {
          vec2 uv = vUv;

          // Soft edge feathering so NO rectangular image boundary ever appears
          float edgeAlphaX = smoothstep(0.0, 0.07, uv.x) * smoothstep(1.0, 0.93, uv.x);
          float edgeAlphaY = smoothstep(0.0, 0.09, uv.y) * smoothstep(1.0, 0.91, uv.y);
          float edgeMask = edgeAlphaX * edgeAlphaY;

          vec4 colA = texture2D(uActiveTex, uv);
          vec4 colB = texture2D(uPendingTex, uv);
          vec4 finalColor = mix(colA, colB, uMixProgress);

          // Restrained living idle effect: subtle daylight sweep across terrain
          float lightSweep = sin(uTime * 0.45 + uv.x * 2.5 + uv.y * 1.5) * 0.04;
          finalColor.rgb += vec3(lightSweep * 0.6, lightSweep * 0.8, lightSweep * 0.5);

          // Subtle contrast and atmospheric mist blend during entrance
          float mistBlend = (1.0 - uMasterProgress) * 0.35;
          finalColor.rgb = mix(finalColor.rgb, vec3(0.04, 0.08, 0.09), mistBlend);

          gl_FragColor = vec4(finalColor.rgb, finalColor.a * edgeMask * uMasterProgress);
        }
      `,
    });
  }, []);

  // Background Sky/Mountain Atmospheric Depth Layer
  const backgroundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uActiveTex: { value: null },
        uMasterProgress: { value: 0.0 },
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
        uniform sampler2D uActiveTex;
        uniform float uMasterProgress;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          // Upper sky / mountain crop with slight zoom
          vec2 bgUv = vec2(vUv.x * 0.94 + 0.03, vUv.y * 0.85 + 0.15);
          vec4 texColor = texture2D(uActiveTex, bgUv);

          // Edge alpha
          float edgeMask = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) * smoothstep(0.0, 0.1, vUv.y);
          
          // Soft atmospheric haze
          vec3 hazeColor = vec3(0.08, 0.14, 0.16);
          texColor.rgb = mix(texColor.rgb, hazeColor, 0.28);

          gl_FragColor = vec4(texColor.rgb, texColor.a * edgeMask * uMasterProgress * 0.85);
        }
      `,
    });
  }, []);

  // Foreground Dynamic Traveling Mist Layer
  const mistMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMasterProgress: { value: 0.0 },
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
        uniform float uMasterProgress;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          // Animated multi-sine atmospheric mist bands
          float band1 = sin(vUv.x * 3.5 + uTime * 0.25) * 0.5 + 0.5;
          float band2 = cos(vUv.x * 5.0 - uTime * 0.15 + vUv.y * 2.0) * 0.5 + 0.5;
          float mist = smoothstep(0.1, 0.85, band1 * band2);

          // Concentrate mist in lower terrain edge
          float heightFade = smoothstep(0.0, 0.45, vUv.y) * (1.0 - smoothstep(0.25, 0.8, vUv.y));
          float alpha = mist * heightFade * 0.25 * uMasterProgress;

          vec3 mistColor = vec3(0.75, 0.88, 0.82);
          gl_FragColor = vec4(mistColor, alpha);
        }
      `,
    });
  }, []);

  // Render Loop & Restrained Alive Idle Breathing
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const p = Math.min(1, Math.max(0, transitionProgress));

    // Update Midground uniforms
    if (midgroundShaderRef.current) {
      midgroundShaderRef.current.uniforms.uActiveTex.value = activeTexture;
      midgroundShaderRef.current.uniforms.uPendingTex.value = pendingTexture || activeTexture;
      midgroundShaderRef.current.uniforms.uMixProgress.value = businessToBusinessProgress;
      midgroundShaderRef.current.uniforms.uMasterProgress.value = p;
      midgroundShaderRef.current.uniforms.uTime.value = t;
      midgroundShaderRef.current.uniforms.uPointer.value.set(pointerX, pointerY);
    }

    // Update Background uniforms
    if (backgroundShaderRef.current) {
      backgroundShaderRef.current.uniforms.uActiveTex.value = activeTexture;
      backgroundShaderRef.current.uniforms.uMasterProgress.value = p;
      backgroundShaderRef.current.uniforms.uTime.value = t;
    }

    // Update Mist uniforms
    if (mistShaderRef.current) {
      mistShaderRef.current.uniforms.uMasterProgress.value = p;
      mistShaderRef.current.uniforms.uTime.value = t;
    }

    // -------------------------------------------------------------
    // MOTION B: Business World Emergence from depth
    // Initial: Z: -3.5, Scale: 0.85, Y: -0.8
    // Final:   Z: 0.0,  Scale: 1.0,  Y: 0.0
    // -------------------------------------------------------------
    const easeP = p * p * (3 - 2 * p); // smoothstep
    const baseZ = THREE.MathUtils.lerp(-3.5, 0.0, easeP);
    const baseScale = THREE.MathUtils.lerp(0.85, 1.0, easeP);
    const baseY = THREE.MathUtils.lerp(-0.75, 0.0, easeP);

    // Living idle motion when in business mode
    let breathingY = 0;
    let breathingRotZ = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    if (isBusinessMode && !reducedMotion) {
      breathingY = Math.sin(t * 0.75) * 0.02;
      breathingRotZ = Math.sin(t * 0.5) * 0.002;
      parallaxX = pointerX * 0.06;
      parallaxY = pointerY * 0.04;
    }

    groupRef.current.position.set(parallaxX, baseY + breathingY + parallaxY, baseZ);
    groupRef.current.scale.set(baseScale, baseScale, baseScale);
    groupRef.current.rotation.z = breathingRotZ;
    groupRef.current.visible = p > 0.005;
  });

  return (
    <group ref={groupRef} position={[0, -0.75, -3.5]}>
      {/* ------------------------------------------------------------- */}
      {/* 1. Background Sky/Horizon Layer (Slower Z Approach)           */}
      {/* ------------------------------------------------------------- */}
      <mesh position={[0, 0.15, -0.45]}>
        <planeGeometry args={[planeWidth * 1.06, planeHeight * 1.06]} />
        <primitive object={backgroundMaterial} ref={backgroundShaderRef} attach="material" />
      </mesh>

      {/* ------------------------------------------------------------- */}
      {/* 2. Midground Main Business Facility Layer (Normal Approach)   */}
      {/* ------------------------------------------------------------- */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <primitive object={midgroundMaterial} ref={midgroundShaderRef} attach="material" />
      </mesh>

      {/* ------------------------------------------------------------- */}
      {/* 3. Foreground Mist & Atmosphere Layer (Faster Approach)       */}
      {/* ------------------------------------------------------------- */}
      <mesh position={[0, -0.15, 0.35]}>
        <planeGeometry args={[planeWidth * 1.04, planeHeight * 0.75]} />
        <primitive object={mistMaterial} ref={mistShaderRef} attach="material" />
      </mesh>
    </group>
  );
};
