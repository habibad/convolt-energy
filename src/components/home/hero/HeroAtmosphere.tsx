"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HERO_SCENE_EFFECTS } from "@/data/heroEffects";

interface HeroAtmosphereProps {
  fromIndex: number;
  toIndex: number;
  mixRatio: number;
  localProgress: number;
  introProgress: number; // 0.0 to 1.0 (clears initial entry fog)
  reducedMotion?: boolean;
}

export const HeroAtmosphere: React.FC<HeroAtmosphereProps> = ({
  fromIndex,
  toIndex,
  mixRatio,
  localProgress,
  introProgress,
  reducedMotion = false,
}) => {
  const sunGlowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const fogRef = useRef<THREE.Mesh>(null);

  // 1. Sunlight Radial Bloom Shader Material
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.8 },
        uSunGlow: { value: 0.85 },
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
        uniform float uTime;
        uniform float uIntensity;
        uniform float uSunGlow;

        void main() {
          if (uSunGlow < 0.005) {
            discard;
          }

          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Smooth radial falloff
          float glow = smoothstep(0.5, 0.0, dist);
          glow = pow(glow, 2.2);

          // Subtle breathing luminance
          float pulse = 1.0 + 0.08 * sin(uTime * 0.8);
          
          // Warm golden sunrise hue
          vec3 sunColor = vec3(1.0, 0.92, 0.72);
          float alpha = glow * 0.45 * pulse * uIntensity * uSunGlow;

          gl_FragColor = vec4(sunColor, alpha);
        }
      `,
    });
  }, []);

  // 2. Persistent Atmospheric Dust / Glint Particles
  const particleCount = 50;
  const [particlePositions, particleVelocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = -4.5 + Math.random() * 9.0; // Wide X spread
      pos[i * 3 + 1] = -1.5 + Math.random() * 4.0; // Y
      pos[i * 3 + 2] = -2.5 + Math.random() * 3.5; // Z

      vel[i * 3] = 0.0008 + Math.random() * 0.0016;
      vel[i * 3 + 1] = 0.0006 + Math.random() * 0.0014;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0008;
    }

    return [pos, vel];
  }, []);

  const particlesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    return geo;
  }, [particlePositions]);

  // 3. Persistent Drifting Haze / Fog Layer
  const fogMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.28 },
        uColor: { value: new THREE.Vector3(0.96, 0.94, 0.90) },
        uSpeed: { value: 0.012 },
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
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uColor;
        uniform float uSpeed;

        void main() {
          float drift = vUv.x + uTime * uSpeed;
          float band = sin(drift * 3.5) * 0.5 + 0.5;
          float verticalFalloff = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
          
          float fog = band * verticalFalloff;
          gl_FragColor = vec4(uColor, fog * uOpacity);
        }
      `,
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const effA = HERO_SCENE_EFFECTS[fromIndex] || HERO_SCENE_EFFECTS[0];
    const effB = HERO_SCENE_EFFECTS[toIndex] || HERO_SCENE_EFFECTS[0];

    // 1. Interpolate Sun Glow
    const sunA = effA.atmosphere.sunGlow;
    const sunB = effB.atmosphere.sunGlow;
    const blendSun = THREE.MathUtils.lerp(sunA, sunB, mixRatio);

    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value = time;
      sunMaterial.uniforms.uIntensity.value = 0.5 + introProgress * 0.45;
      sunMaterial.uniforms.uSunGlow.value = blendSun;
    }

    if (sunGlowRef.current) {
      sunGlowRef.current.visible = blendSun > 0.01;
    }

    // 2. Interpolate Fog Color, Opacity & Drift Speed
    const colA = effA.atmosphere.fogColor;
    const colB = effB.atmosphere.fogColor;
    const blendR = THREE.MathUtils.lerp(colA[0], colB[0], mixRatio);
    const blendG = THREE.MathUtils.lerp(colA[1], colB[1], mixRatio);
    const blendB = THREE.MathUtils.lerp(colA[2], colB[2], mixRatio);

    const opA = effA.atmosphere.fogOpacity;
    const opB = effB.atmosphere.fogOpacity;
    const blendOp = THREE.MathUtils.lerp(opA, opB, mixRatio);

    const spdA = effA.atmosphere.fogDriftSpeed;
    const spdB = effB.atmosphere.fogDriftSpeed;
    const blendSpd = THREE.MathUtils.lerp(spdA, spdB, mixRatio);

    if (fogMaterial) {
      fogMaterial.uniforms.uTime.value = time;
      fogMaterial.uniforms.uColor.value.set(blendR, blendG, blendB);
      fogMaterial.uniforms.uSpeed.value = blendSpd;

      // Clears slightly during intro
      const introFade = THREE.MathUtils.lerp(1.2, 1.0, introProgress);
      fogMaterial.uniforms.uOpacity.value = blendOp * introFade;
    }

    // 3. Animate Light / Glint Particles
    if (!reducedMotion && particlesRef.current) {
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      const countA = effA.atmosphere.particleCount;
      const countB = effB.atmosphere.particleCount;
      const blendCountRatio = THREE.MathUtils.lerp(countA, countB, mixRatio) / 45;

      pMat.opacity = blendCountRatio * 0.35 * Math.min(1, introProgress + 0.2);

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speedFactor = THREE.MathUtils.lerp(effA.atmosphere.particleSpeed, effB.atmosphere.particleSpeed, mixRatio) / 0.0018;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i * 3] * speedFactor;
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1] * speedFactor;

        // Wrap around bounds
        if (positions[i * 3] > 4.5) positions[i * 3] = -4.5;
        if (positions[i * 3 + 1] > 2.5) positions[i * 3 + 1] = -1.5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group name="AtmosphericSystem">
      {/* Sun Radial Glow Plane (Positioned at morning sunrise, blends with chapter) */}
      <mesh
        ref={sunGlowRef}
        position={[-3.1, 1.45, -3.2]}
        material={sunMaterial}
      >
        <planeGeometry args={[4.2, 4.2]} />
      </mesh>

      {/* Persistent Midground Drifting Fog/Haze Plane */}
      <mesh
        ref={fogRef}
        position={[-0.4, -0.2, -2.6]}
        material={fogMaterial}
      >
        <planeGeometry args={[13.0, 4.5]} />
      </mesh>

      {/* Persistent Subtle Floating Particles */}
      {!reducedMotion && (
        <points ref={particlesRef} geometry={particlesGeo}>
          <pointsMaterial
            size={0.032}
            color="#FFF4D0"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
