"use client";

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { HERO_SCENE_EFFECTS } from "@/data/heroEffects";

interface HeroLayersProps {
  fromIndex: number; // 0 to 4
  toIndex: number; // 0 to 4
  mixRatio: number; // 0.0 to 1.0
  localProgress: number; // 0.0 to 1.0 within chapter
  activeIndex: number; // 0 to 4
  pointerX: number; // -1 to 1
  pointerY: number; // -1 to 1
  scrollProgress: number; // 0.0 to 1.0
  scrollVelocity: number;
  introProgress: number;
  reducedMotion?: boolean;
}

export const HeroLayers: React.FC<HeroLayersProps> = ({
  fromIndex,
  toIndex,
  mixRatio,
  localProgress,
  activeIndex,
  pointerX,
  pointerY,
  scrollProgress,
  scrollVelocity,
  introProgress,
  reducedMotion = false,
}) => {
  const { camera, size } = useThree();

  // 1. Preload all 5 chapter textures simultaneously
  const chapterTextures = useTexture([
    "/media/hero/chapters/01-cleaner-tomorrow.webp",
    "/media/hero/chapters/02-solar-manufacturing.webp",
    "/media/hero/chapters/03-power-generation.webp",
    "/media/hero/chapters/04-data-centers.webp",
    "/media/hero/chapters/05-recycling.webp",
  ]);

  // Preload Scene 01 facility cutout and solar mask
  const [facilityTexture, solarMaskTexture] = useTexture([
    "/media/hero/convalt-facility-fg.webp",
    "/media/hero/convalt-solar-mask.webp",
  ]);

  // Configure high-fidelity filtering and correct sRGB color space
  useMemo(() => {
    [...chapterTextures, facilityTexture, solarMaskTexture].forEach((tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = false;
    });
  }, [chapterTextures, facilityTexture, solarMaskTexture]);

  // Mesh Refs
  const crossfadeMeshRef = useRef<THREE.Mesh>(null);
  const facilityRef = useRef<THREE.Mesh>(null);
  const solarHighlightRef = useRef<THREE.Mesh>(null);
  const panelLayerRef = useRef<THREE.Mesh>(null);
  const solarFieldMidRef = useRef<THREE.Mesh>(null);
  const campusFgRef = useRef<THREE.Mesh>(null);
  const recyclingFgRef = useRef<THREE.Mesh>(null);

  // Aspect ratio of the Convalt renders (1672 / 941 = ~1.7768)
  const imgAspect = 1672 / 941;
  const screenAspect = size.width / Math.max(1, size.height);

  // Responsive cover calculations ensuring zero gaps or borders on any device
  const getCoverDimensions = (distance: number, parallaxBleed = 1.14) => {
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

  // Distance calculations from camera (~5.0)
  const bgDim = getCoverDimensions(8.8, 1.16); // Z = -3.8
  const fgDim = getCoverDimensions(5.0, 1.14); // Z = 0.0
  const midDim = getCoverDimensions(6.4, 1.15); // Z = -1.4

  // 2. High-Fidelity Crossfade Shader with authored per-scene effects
  const crossfadeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: false,
      uniforms: {
        uTextureA: { value: chapterTextures[0] },
        uTextureB: { value: chapterTextures[1] },
        uMix: { value: 0.0 },
        uTime: { value: 0.0 },
        uLocalProgress: { value: 0.0 },
        uSceneA: { value: 0.0 },
        uSceneB: { value: 1.0 },
        uPointer: { value: new THREE.Vector2(0.0, 0.0) },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uImageResolution: { value: new THREE.Vector2(1672, 941) },
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
        uniform sampler2D uTextureA;
        uniform sampler2D uTextureB;
        uniform float uMix;
        uniform float uTime;
        uniform float uLocalProgress;
        uniform float uSceneA;
        uniform float uSceneB;
        uniform vec2 uPointer;
        uniform vec2 uResolution;
        uniform vec2 uImageResolution;

        // Diagonal soft specular sweep calculation (for panels & industrial surfaces)
        float getSweep(vec2 uv, float time, float speed, float width) {
          float travel = mod(time * speed, 1.9) - 0.45;
          float lineDist = abs((uv.x * 0.75 + uv.y * 0.45) - travel);
          return smoothstep(width, 0.0, lineDist);
        }

        // Scene-specific procedural enhancements
        vec4 computeSceneEffect(sampler2D tex, vec2 uv, float sceneId, float time, float localP) {
          vec4 color = texture2D(tex, uv);
          int sId = int(floor(sceneId + 0.5));

          if (sId == 0) {
            // Scene 01: Sunrise warm exposure breathing
            float sunDist = length(uv - vec2(0.22, 0.72));
            float sunGleam = smoothstep(0.75, 0.0, sunDist);
            color.rgb += vec3(0.04, 0.025, 0.006) * sunGleam * (1.0 + 0.06 * sin(time * 0.8));
          }
          else if (sId == 1) {
            // Scene 02: Solar Manufacturing — Exploded panel diagonal light reflection sweep (7-10s)
            float sweep = getSweep(uv, time, 0.115, 0.20);
            float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            float panelMask = smoothstep(0.18, 0.70, luma);
            float breathe = 1.0 + 0.025 * sin(time * 0.85);
            // Soft technical Fresnel highlight
            float edgeFresnel = smoothstep(0.42, 0.65, luma) * 0.05;
            color.rgb = mix(color.rgb, color.rgb * breathe + vec3(0.18, 0.22, 0.28) * sweep * panelMask * 0.24 + edgeFresnel, 0.85);
          }
          else if (sId == 2) {
            // Scene 03: Power Generation — Landscape sunlight shimmer & exposure breathing
            float shimmerWave = sin(uv.x * 16.0 + uv.y * 8.0 + time * 0.75) * 0.5 + 0.5;
            float solarFieldsMask = smoothstep(0.25, 0.65, uv.y) * smoothstep(0.85, 0.45, uv.y);
            float shimmer = shimmerWave * solarFieldsMask * 0.08;
            float exposureBreath = 1.0 + 0.024 * sin(time * 0.35);
            color.rgb = (color.rgb * exposureBreath) + vec3(0.12, 0.10, 0.05) * shimmer;
          }
          else if (sId == 3) {
            // Scene 04: Data Centers — Subtle window/server light warmth variation (±3%) & ground reflection
            float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            float windowMask = smoothstep(0.55, 0.95, luma);
            float windowPulse = 1.0 + 0.035 * sin(time * 0.7 + uv.x * 9.0);
            float groundShimmer = sin(uv.x * 28.0 + time * 0.45) * smoothstep(0.38, 0.10, uv.y) * 0.022;
            color.rgb += vec3(0.14, 0.12, 0.05) * windowMask * (windowPulse - 1.0) + groundShimmer;
          }
          else if (sId == 4) {
            // Scene 05: Recycling — Metallic surface reflection sweep (8-12s cycle) & conveyor activity
            float metalSweep = getSweep(uv, time, 0.105, 0.24);
            float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            float metalMask = smoothstep(0.40, 0.85, luma);
            float conveyorMotion = sin(uv.x * 24.0 - time * 1.1) * smoothstep(0.32, 0.06, uv.y) * 0.025;
            color.rgb += vec3(0.22, 0.22, 0.24) * metalSweep * metalMask * 0.22 + conveyorMotion;
          }

          return color;
        }

        void main() {
          // Extremely subtle architectural crossfade displacement (1-2px max)
          float disp = sin(vUv.y * 22.0 + uTime * 1.4) * 0.0012 * sin(uMix * 3.14159);
          vec2 uvA = vUv + vec2(disp, 0.0);
          vec2 uvB = vUv - vec2(disp, 0.0);

          vec4 colorA = computeSceneEffect(uTextureA, uvA, uSceneA, uTime, uLocalProgress);
          vec4 colorB = computeSceneEffect(uTextureB, uvB, uSceneB, uTime, 0.0);

          // Cinematic smoothstep blend curve
          float blend = smoothstep(0.0, 1.0, uMix);
          vec4 blendedColor = mix(colorA, colorB, blend);

          // Authentic Montfort interactive mouse light response on 3D plane
          vec2 mouseUv = vec2(uPointer.x * 0.45 + 0.5, -uPointer.y * 0.45 + 0.5);
          float mouseDist = length(vUv - mouseUv);
          float mouseLight = smoothstep(0.46, 0.0, mouseDist) * 0.032;
          blendedColor.rgb += vec3(0.95, 0.98, 1.0) * mouseLight;

          gl_FragColor = blendedColor;
        }
      `,
    });
  }, [chapterTextures]);

  // 3. Solar Highlight Shader Material for Chapter 01
  const solarShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMask: { value: solarMaskTexture },
        uTime: { value: 0 },
        uSpeed: { value: 0.1 },
        uOpacity: { value: 0.28 },
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
        uniform float uOpacity;

        void main() {
          vec4 maskColor = texture2D(uMask, vUv);
          if (maskColor.a < 0.02) {
            discard;
          }

          float travel = mod(uTime * uSpeed, 1.6) - 0.3;
          float beamDist = abs((vUv.x * 0.8 + vUv.y * 0.4) - travel);
          float beam = smoothstep(0.18, 0.0, beamDist);

          vec3 sunGleam = vec3(1.0, 0.96, 0.88);
          float alpha = maskColor.a * beam * uOpacity;

          gl_FragColor = vec4(sunGleam, alpha);
        }
      `,
    });
  }, [solarMaskTexture]);

  // 4. Chapter 02 Exploded Panel Floating Layer Shader Material
  const panelFloatingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTexture: { value: chapterTextures[1] },
        uOpacity: { value: 0.0 },
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
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        uniform float uTime;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          // Isolate the central exploded panel stack area with soft radial mask
          vec2 center = vec2(0.55, 0.48);
          float dist = distance(vUv, center);
          float mask = smoothstep(0.45, 0.15, dist);

          float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          float panelFeatures = smoothstep(0.15, 0.65, luma);

          float alpha = mask * panelFeatures * uOpacity * 0.55;
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
    });
  }, [chapterTextures]);

  // 5. Chapter 03 Solar Landscape 2.5D Shimmer Layer Shader Material
  const landscapeMidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTexture: { value: chapterTextures[2] },
        uOpacity: { value: 0.0 },
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
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        uniform float uTime;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          // Focus on the utility solar arrays in midground
          float verticalBand = smoothstep(0.22, 0.55, vUv.y) * smoothstep(0.85, 0.45, vUv.y);
          float shimmer = sin(vUv.x * 20.0 + uTime * 0.8) * 0.5 + 0.5;
          float alpha = verticalBand * shimmer * uOpacity * 0.18;
          gl_FragColor = vec4(color.rgb * vec3(1.1, 1.05, 0.95), alpha);
        }
      `,
    });
  }, [chapterTextures]);

  // 6. Chapter 04 Data Center Foreground Layer Material
  const campusFgMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTexture: { value: chapterTextures[3] },
        uOpacity: { value: 0.0 },
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
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        uniform float uTime;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          // Mask foreground road and trees
          float fgMask = smoothstep(0.45, 0.10, vUv.y);
          float alpha = fgMask * uOpacity * 0.45;
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
    });
  }, [chapterTextures]);

  // 7. Chapter 05 Recycling Conveyor Foreground Layer Material
  const recyclingFgMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTexture: { value: chapterTextures[4] },
        uOpacity: { value: 0.0 },
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
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        uniform float uTime;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          // Mask lower conveyor & sorting machinery
          float conveyorMask = smoothstep(0.42, 0.05, vUv.y);
          float alpha = conveyorMask * uOpacity * 0.50;
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
    });
  }, [chapterTextures]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. Update Crossfade Shader Uniforms
    if (crossfadeMaterial) {
      crossfadeMaterial.uniforms.uTextureA.value = chapterTextures[fromIndex] || chapterTextures[0];
      crossfadeMaterial.uniforms.uTextureB.value = chapterTextures[toIndex] || chapterTextures[0];
      crossfadeMaterial.uniforms.uMix.value = mixRatio;
      crossfadeMaterial.uniforms.uTime.value = time;
      crossfadeMaterial.uniforms.uLocalProgress.value = localProgress;
      crossfadeMaterial.uniforms.uSceneA.value = fromIndex;
      crossfadeMaterial.uniforms.uSceneB.value = toIndex;
      crossfadeMaterial.uniforms.uPointer.value.set(pointerX, pointerY);
      crossfadeMaterial.uniforms.uResolution.value.set(size.width, size.height);
    }

    // 2. Animate Solar Highlight pass on Scene 01
    if (solarShaderMaterial) {
      solarShaderMaterial.uniforms.uTime.value = time;
      const scene1Factor = fromIndex === 0 ? 1.0 - mixRatio : 0.0;
      solarShaderMaterial.uniforms.uOpacity.value = 0.28 * scene1Factor;
    }

    // 3. Scene 01 Foreground Facility Mesh
    if (facilityRef.current) {
      const facilityMat = facilityRef.current.material as THREE.MeshBasicMaterial;
      const fgAlpha = fromIndex === 0 ? 1.0 - mixRatio : 0.0;
      facilityMat.opacity = fgAlpha;
      facilityRef.current.visible = fgAlpha > 0.005;

      if (!reducedMotion && facilityRef.current.visible) {
        const targetFgX = pointerX * 0.12;
        const targetFgY = pointerY * 0.06 - scrollProgress * 0.12;
        const targetFgZ = scrollProgress * 0.2;

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

    // 4. Scene 02 Floating Exploded Panel Layer (Z = -1.2)
    // Micro-breathing (perceived 2-6px equivalent) + high pointer parallax
    const ch2Factor =
      fromIndex === 1
        ? 1.0 - mixRatio
        : toIndex === 1
        ? mixRatio
        : 0.0;

    if (panelFloatingMaterial) {
      panelFloatingMaterial.uniforms.uTime.value = time;
      panelFloatingMaterial.uniforms.uOpacity.value = ch2Factor;
    }

    if (panelLayerRef.current) {
      panelLayerRef.current.visible = ch2Factor > 0.005;
      if (!reducedMotion && panelLayerRef.current.visible) {
        // Micro-breathing sine motion
        const breatheY = Math.sin(time * 0.85) * 0.006;
        const breatheX = Math.cos(time * 0.65) * 0.004;

        // Differential pointer parallax (panel group foreground: 0.16 vs bg: 0.035)
        const targetX = pointerX * 0.16 + breatheX;
        const targetY = pointerY * 0.08 + breatheY - localProgress * 0.04;

        panelLayerRef.current.position.x = THREE.MathUtils.damp(
          panelLayerRef.current.position.x,
          targetX,
          3.5,
          delta
        );
        panelLayerRef.current.position.y = THREE.MathUtils.damp(
          panelLayerRef.current.position.y,
          targetY,
          3.5,
          delta
        );
      }
    }

    // 5. Scene 03 Solar Landscape Midground Shimmer Layer (Z = -1.6)
    const ch3Factor =
      fromIndex === 2
        ? 1.0 - mixRatio
        : toIndex === 2
        ? mixRatio
        : 0.0;

    if (landscapeMidMaterial) {
      landscapeMidMaterial.uniforms.uTime.value = time;
      landscapeMidMaterial.uniforms.uOpacity.value = ch3Factor;
    }

    if (solarFieldMidRef.current) {
      solarFieldMidRef.current.visible = ch3Factor > 0.005;
      if (!reducedMotion && solarFieldMidRef.current.visible) {
        // Horizontal glide offset + midground parallax (0.65)
        const glideX = -(localProgress - 0.5) * 0.035;
        const targetX = pointerX * 0.09 + glideX;
        const targetY = pointerY * 0.045;

        solarFieldMidRef.current.position.x = THREE.MathUtils.damp(
          solarFieldMidRef.current.position.x,
          targetX,
          3.5,
          delta
        );
        solarFieldMidRef.current.position.y = THREE.MathUtils.damp(
          solarFieldMidRef.current.position.y,
          targetY,
          3.5,
          delta
        );
      }
    }

    // 6. Scene 04 Data Center Foreground Campus Layer (Z = -1.4)
    const ch4Factor =
      fromIndex === 3
        ? 1.0 - mixRatio
        : toIndex === 3
        ? mixRatio
        : 0.0;

    if (campusFgMaterial) {
      campusFgMaterial.uniforms.uTime.value = time;
      campusFgMaterial.uniforms.uOpacity.value = ch4Factor;
    }

    if (campusFgRef.current) {
      campusFgRef.current.visible = ch4Factor > 0.005;
      if (!reducedMotion && campusFgRef.current.visible) {
        // Foreground trees/road moves faster than background data center
        const targetX = pointerX * 0.14;
        const targetY = pointerY * 0.07 - localProgress * 0.03;

        campusFgRef.current.position.x = THREE.MathUtils.damp(
          campusFgRef.current.position.x,
          targetX,
          3.5,
          delta
        );
        campusFgRef.current.position.y = THREE.MathUtils.damp(
          campusFgRef.current.position.y,
          targetY,
          3.5,
          delta
        );
      }
    }

    // 7. Scene 05 Recycling Conveyor Foreground Layer (Z = -1.2)
    const ch5Factor =
      fromIndex === 4
        ? 1.0 - mixRatio
        : toIndex === 4
        ? mixRatio
        : 0.0;

    if (recyclingFgMaterial) {
      recyclingFgMaterial.uniforms.uTime.value = time;
      recyclingFgMaterial.uniforms.uOpacity.value = ch5Factor;
    }

    if (recyclingFgRef.current) {
      recyclingFgRef.current.visible = ch5Factor > 0.005;
      if (!reducedMotion && recyclingFgRef.current.visible) {
        // Foreground conveyor sorting layer
        const targetX = pointerX * 0.15 + (localProgress - 0.5) * 0.02;
        const targetY = pointerY * 0.075;

        recyclingFgRef.current.position.x = THREE.MathUtils.damp(
          recyclingFgRef.current.position.x,
          targetX,
          3.5,
          delta
        );
        recyclingFgRef.current.position.y = THREE.MathUtils.damp(
          recyclingFgRef.current.position.y,
          targetY,
          3.5,
          delta
        );
      }
    }

    // 8. Background Plane Counter-Shift (applied across all chapters)
    if (!reducedMotion && crossfadeMeshRef.current) {
      const effA = HERO_SCENE_EFFECTS[fromIndex] || HERO_SCENE_EFFECTS[0];
      const effB = HERO_SCENE_EFFECTS[toIndex] || HERO_SCENE_EFFECTS[0];

      const bgRatioA = effA.parallax.background;
      const bgRatioB = effB.parallax.background;
      const blendBg = THREE.MathUtils.lerp(bgRatioA, bgRatioB, mixRatio);

      const targetBgX = pointerX * blendBg;
      const targetBgY = pointerY * (blendBg * 0.6);

      crossfadeMeshRef.current.position.x = THREE.MathUtils.damp(
        crossfadeMeshRef.current.position.x,
        targetBgX,
        3.5,
        delta
      );
      crossfadeMeshRef.current.position.y = THREE.MathUtils.damp(
        crossfadeMeshRef.current.position.y,
        targetBgY,
        3.5,
        delta
      );
    }
  });

  return (
    <group name="HeroLayersGroup">
      {/* 1. Primary Fullscreen Crossfade Plane (Z = -3.8) */}
      <mesh
        ref={crossfadeMeshRef}
        position={[0, 0, -3.8]}
        material={crossfadeMaterial}
      >
        <planeGeometry args={[bgDim.width, bgDim.height]} />
      </mesh>

      {/* 2. Chapter 01 Foreground Facility Layer (Convalt Building, Rooftop Solar, Waterfall at Z = 0.0) */}
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

      {/* 3. Chapter 01 Solar Roof Highlight Pass (Z = 0.01) */}
      <mesh
        ref={solarHighlightRef}
        position={[0, 0, 0.01]}
        material={solarShaderMaterial}
      >
        <planeGeometry args={[fgDim.width, fgDim.height]} />
      </mesh>

      {/* 4. Chapter 02 Floating Exploded Panel Accent Layer (Z = -1.2) */}
      <mesh
        ref={panelLayerRef}
        position={[0, 0, -1.2]}
        material={panelFloatingMaterial}
      >
        <planeGeometry args={[midDim.width, midDim.height]} />
      </mesh>

      {/* 5. Chapter 03 Solar Landscape 2.5D Shimmer Layer (Z = -1.6) */}
      <mesh
        ref={solarFieldMidRef}
        position={[0, 0, -1.6]}
        material={landscapeMidMaterial}
      >
        <planeGeometry args={[midDim.width, midDim.height]} />
      </mesh>

      {/* 6. Chapter 04 Data Center Foreground Campus Layer (Z = -1.4) */}
      <mesh
        ref={campusFgRef}
        position={[0, 0, -1.4]}
        material={campusFgMaterial}
      >
        <planeGeometry args={[midDim.width, midDim.height]} />
      </mesh>

      {/* 7. Chapter 05 Recycling Conveyor Foreground Layer (Z = -1.2) */}
      <mesh
        ref={recyclingFgRef}
        position={[0, 0, -1.2]}
        material={recyclingFgMaterial}
      >
        <planeGeometry args={[midDim.width, midDim.height]} />
      </mesh>
    </group>
  );
};
