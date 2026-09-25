"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface BusinessSceneProps {
  progress: number; // 0.0 to 1.0 master story progress
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
}

// Media asset mapping per story checkpoint
const MEDIA_TIMELINE = [
  { p: 0.16, src: "/media/service/01-solar-manufacturing.png" },
  { p: 0.25, src: "/media/service/05-raw-materials.png" },
  { p: 0.285, src: "/media/service/06-wafer-production.png" },
  { p: 0.32, src: "/media/service/07-cell-manufacturing.png" },
  { p: 0.355, src: "/media/service/08-module-assembly.png" },
  { p: 0.40, src: "/media/service/02-power-generation.png" },
  { p: 0.58, src: "/media/service/03-data-centers.png" },
  { p: 0.76, src: "/media/service/04-recycling.png" },
];

export const BusinessScene: React.FC<BusinessSceneProps> = ({
  progress,
  pointerX,
  pointerY,
  reducedMotion = false,
}) => {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const midgroundShaderRef = useRef<THREE.ShaderMaterial>(null);
  const backgroundShaderRef = useRef<THREE.ShaderMaterial>(null);
  const mistShaderRef = useRef<THREE.ShaderMaterial>(null);

  // Dynamic texture cache
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});
  const loaderRef = useRef<THREE.TextureLoader | null>(null);

  if (!loaderRef.current && typeof window !== "undefined") {
    loaderRef.current = new THREE.TextureLoader();
  }

  // Preload textures progressively based on story progress
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const toLoad = new Set<string>();

    // Initial load: Solar overview and raw materials
    toLoad.add("/media/service/01-solar-manufacturing.png");
    toLoad.add("/media/service/05-raw-materials.png");

    if (progress > 0.15) {
      toLoad.add("/media/service/06-wafer-production.png");
      toLoad.add("/media/service/07-cell-manufacturing.png");
      toLoad.add("/media/service/08-module-assembly.png");
      toLoad.add("/media/service/02-power-generation.png");
    }

    if (progress > 0.38) {
      toLoad.add("/media/service/03-data-centers.png");
      toLoad.add("/media/service/04-recycling.png");
    }

    toLoad.forEach((src) => {
      if (!textures[src]) {
        loader.load(src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          setTextures((prev) => ({ ...prev, [src]: tex }));
        });
      }
    });
  }, [progress, textures]);

  // Determine active visual texture and pending visual texture from progress
  const { activeSrc, pendingSrc, mixRatio, sceneMasterOpacity } = useMemo(() => {
    const p = Math.max(0, Math.min(1, progress));

    // Master opacity of the Business multi-plane world:
    // Fades in during entry descent (0.14 -> 0.20)
    // Fully active (0.20 -> 0.92)
    // Fades out into conclusion overview (0.92 -> 0.98)
    let opacity = 0;
    if (p >= 0.14 && p < 0.20) {
      const t = (p - 0.14) / 0.06;
      opacity = t * t * (3 - 2 * t);
    } else if (p >= 0.20 && p <= 0.92) {
      opacity = 1.0;
    } else if (p > 0.92 && p <= 0.98) {
      const t = (p - 0.92) / 0.06;
      opacity = 1.0 - t * t * (3 - 2 * t);
    }

    // Sequence stages:
    // 0: 0.14 - 0.25 -> Solar Overview
    // 1: 0.25 - 0.285 -> Raw Materials
    // 2: 0.285 - 0.32 -> Wafer Production
    // 3: 0.32 - 0.355 -> Cell Manufacturing
    // 4: 0.355 - 0.40 -> Module Assembly
    // 5: 0.40 - 0.58 -> Power Generation
    // 6: 0.58 - 0.76 -> Data Centers
    // 7: 0.76 - 0.94 -> Recycling

    let aSrc = MEDIA_TIMELINE[0].src;
    let bSrc = MEDIA_TIMELINE[0].src;
    let ratio = 0.0;

    if (p < 0.25) {
      aSrc = "/media/service/01-solar-manufacturing.png";
      bSrc = "/media/service/05-raw-materials.png";
      ratio = Math.max(0, (p - 0.22) / 0.03);
    } else if (p < 0.285) {
      aSrc = "/media/service/05-raw-materials.png";
      bSrc = "/media/service/06-wafer-production.png";
      ratio = Math.max(0, (p - 0.27) / 0.015);
    } else if (p < 0.32) {
      aSrc = "/media/service/06-wafer-production.png";
      bSrc = "/media/service/07-cell-manufacturing.png";
      ratio = Math.max(0, (p - 0.305) / 0.015);
    } else if (p < 0.355) {
      aSrc = "/media/service/07-cell-manufacturing.png";
      bSrc = "/media/service/08-module-assembly.png";
      ratio = Math.max(0, (p - 0.34) / 0.015);
    } else if (p < 0.40) {
      aSrc = "/media/service/08-module-assembly.png";
      bSrc = "/media/service/02-power-generation.png";
      ratio = Math.max(0, (p - 0.38) / 0.02);
    } else if (p < 0.58) {
      aSrc = "/media/service/02-power-generation.png";
      bSrc = "/media/service/03-data-centers.png";
      ratio = Math.max(0, (p - 0.55) / 0.03);
    } else if (p < 0.76) {
      aSrc = "/media/service/03-data-centers.png";
      bSrc = "/media/service/04-recycling.png";
      ratio = Math.max(0, (p - 0.73) / 0.03);
    } else {
      aSrc = "/media/service/04-recycling.png";
      bSrc = "/media/service/04-recycling.png";
      ratio = 0.0;
    }

    ratio = Math.min(1, Math.max(0, ratio));

    return {
      activeSrc: aSrc,
      pendingSrc: bSrc,
      mixRatio: ratio,
      sceneMasterOpacity: opacity,
    };
  }, [progress]);

  const activeTexture = textures[activeSrc] || null;
  const pendingTexture = textures[pendingSrc] || activeTexture;

  const imgAspect = 16 / 9;
  const { planeWidth, planeHeight } = useMemo(() => {
    const margin = 1.15;
    let w = viewport.width * margin;
    let h = w / imgAspect;
    if (h < viewport.height * margin) {
      h = viewport.height * margin;
      w = h * imgAspect;
    }
    return { planeWidth: w, planeHeight: h };
  }, [viewport.width, viewport.height, imgAspect]);

  // Master 2.5D Midground Shader Material with Directional Wipe & Daylight Sweep
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

          // Edge feathering to eliminate harsh rectangle border
          float edgeAlphaX = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);
          float edgeAlphaY = smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.92, uv.y);
          float edgeMask = edgeAlphaX * edgeAlphaY;

          vec4 colA = texture2D(uActiveTex, uv);
          vec4 colB = texture2D(uPendingTex, uv);

          // Spatial directional transition: subtle wipe across X/Y axis
          float wipe = smoothstep(uMixProgress - 0.25, uMixProgress + 0.25, uv.x * 0.7 + uv.y * 0.3);
          vec4 blended = mix(colB, colA, wipe);

          // Daylight sweep across landscape/panels
          float lightSweep = sin(uTime * 0.45 + uv.x * 2.2 + uv.y * 1.4) * 0.035;
          blended.rgb += vec3(lightSweep * 0.5, lightSweep * 0.7, lightSweep * 0.4);

          // Soft atmospheric contrast matching Convalt palette
          float mistBlend = (1.0 - uMasterProgress) * 0.25;
          blended.rgb = mix(blended.rgb, vec3(0.06, 0.10, 0.11), mistBlend);

          gl_FragColor = vec4(blended.rgb, blended.a * edgeMask * uMasterProgress);
        }
      `,
    });
  }, []);

  // Background Atmospheric Depth Layer
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
          vec2 bgUv = vec2(vUv.x * 0.94 + 0.03, vUv.y * 0.85 + 0.15);
          vec4 texColor = texture2D(uActiveTex, bgUv);

          float edgeMask = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x) * smoothstep(0.0, 0.08, vUv.y);
          vec3 hazeColor = vec3(0.08, 0.14, 0.16);
          texColor.rgb = mix(texColor.rgb, hazeColor, 0.30);

          gl_FragColor = vec4(texColor.rgb, texColor.a * edgeMask * uMasterProgress * 0.85);
        }
      `,
    });
  }, []);

  // Foreground Dynamic Mist Layer
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
          float band1 = sin(vUv.x * 3.5 + uTime * 0.22) * 0.5 + 0.5;
          float band2 = cos(vUv.x * 5.0 - uTime * 0.14 + vUv.y * 2.0) * 0.5 + 0.5;
          float mist = smoothstep(0.12, 0.82, band1 * band2);

          float heightFade = smoothstep(0.0, 0.40, vUv.y) * (1.0 - smoothstep(0.20, 0.75, vUv.y));
          float alpha = mist * heightFade * 0.24 * uMasterProgress;

          vec3 mistColor = vec3(0.75, 0.88, 0.82);
          gl_FragColor = vec4(mistColor, alpha);
        }
      `,
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const p = sceneMasterOpacity;

    // Update Midground uniforms
    if (midgroundShaderRef.current) {
      midgroundShaderRef.current.uniforms.uActiveTex.value = activeTexture;
      midgroundShaderRef.current.uniforms.uPendingTex.value = pendingTexture || activeTexture;
      midgroundShaderRef.current.uniforms.uMixProgress.value = mixRatio;
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

    // Emergence from depth during descent bridge (0.14 -> 0.20)
    // Sits in place while camera navigates the chapters
    const baseZ = THREE.MathUtils.lerp(-3.0, 0.0, p);
    const baseY = THREE.MathUtils.lerp(-0.4, 0.0, p);
    const baseScale = THREE.MathUtils.lerp(0.88, 1.0, p);

    let breathingY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    if (!reducedMotion && p > 0.1) {
      breathingY = Math.sin(t * 0.6) * 0.015;
      parallaxX = pointerX * 0.05;
      parallaxY = pointerY * 0.03;
    }

    groupRef.current.position.set(parallaxX, baseY + breathingY + parallaxY, baseZ);
    groupRef.current.scale.set(baseScale, baseScale, baseScale);
    groupRef.current.visible = p > 0.005;
  });

  return (
    <group ref={groupRef} position={[0, -0.4, -3.0]}>
      {/* 1. Background Sky/Horizon Layer */}
      <mesh position={[0, 0.12, -0.45]}>
        <planeGeometry args={[planeWidth * 1.06, planeHeight * 1.06]} />
        <primitive object={backgroundMaterial} ref={backgroundShaderRef} attach="material" />
      </mesh>

      {/* 2. Midground Main Business Facility Layer */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <primitive object={midgroundMaterial} ref={midgroundShaderRef} attach="material" />
      </mesh>

      {/* 3. Foreground Mist & Atmosphere Layer */}
      <mesh position={[0, -0.12, 0.35]}>
        <planeGeometry args={[planeWidth * 1.04, planeHeight * 0.75]} />
        <primitive object={mistMaterial} ref={mistShaderRef} attach="material" />
      </mesh>
    </group>
  );
};
