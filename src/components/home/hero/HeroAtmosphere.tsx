"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HeroAtmosphereProps {
  introProgress: number; // 0.0 to 1.0 (clears fog)
  reducedMotion?: boolean;
}

export const HeroAtmosphere: React.FC<HeroAtmosphereProps> = ({
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

        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Smooth radial falloff
          float glow = smoothstep(0.5, 0.0, dist);
          glow = pow(glow, 2.2);

          // Subtle breathing luminance
          float pulse = 1.0 + 0.08 * sin(uTime * 0.8);
          
          // Warm golden sunrise hue
          vec3 sunColor = vec3(1.0, 0.92, 0.72);
          float alpha = glow * 0.45 * pulse * uIntensity;

          gl_FragColor = vec4(sunColor, alpha);
        }
      `,
    });
  }, []);

  // 2. Lightweight Dust/Light Particles in Sunbeam zone
  const particleCount = 50;
  const [particlePositions, particleVelocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Concentrated in the left/upper-left sunrise zone
      pos[i * 3] = -4.5 + Math.random() * 5.0; // X
      pos[i * 3 + 1] = -1.0 + Math.random() * 3.5; // Y
      pos[i * 3 + 2] = -2.0 + Math.random() * 3.0; // Z

      vel[i * 3] = 0.001 + Math.random() * 0.002;
      vel[i * 3 + 1] = 0.001 + Math.random() * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return [pos, vel];
  }, []);

  const particlesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    return geo;
  }, [particlePositions]);

  // 3. Subtle Drifting Fog Layer
  const fogMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
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
        uniform float uTime;
        uniform float uOpacity;

        // Simple smooth noise-based fog gradient
        void main() {
          float drift = vUv.x + uTime * 0.012;
          float band = sin(drift * 4.0) * 0.5 + 0.5;
          float verticalFalloff = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
          
          float fog = band * verticalFalloff;
          vec3 fogColor = vec3(0.96, 0.94, 0.90);
          
          gl_FragColor = vec4(fogColor, fog * uOpacity);
        }
      `,
    });
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Animate Sun Glow
    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value = time;
      sunMaterial.uniforms.uIntensity.value = 0.5 + introProgress * 0.45;
    }

    // Animate Fog Drift & dissipation
    if (fogMaterial) {
      fogMaterial.uniforms.uTime.value = time;
      // Clears slightly as intro completes
      fogMaterial.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        0.32,
        0.12,
        introProgress
      );
    }

    // Animate Light Particles
    if (!reducedMotion && particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particleVelocities[i * 3];
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];

        // Wrap around bounds
        if (positions[i * 3] > 1.0) positions[i * 3] = -4.5;
        if (positions[i * 3 + 1] > 2.8) positions[i * 3 + 1] = -1.2;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group name="AtmosphericSystem">
      {/* Sun Radial Glow Plane located at morning sunrise */}
      <mesh
        ref={sunGlowRef}
        position={[-3.1, 1.45, -3.2]}
        material={sunMaterial}
      >
        <planeGeometry args={[4.2, 4.2]} />
      </mesh>

      {/* Midground Drifting Fog Plane */}
      <mesh
        ref={fogRef}
        position={[-0.4, -0.2, -2.6]}
        material={fogMaterial}
      >
        <planeGeometry args={[12.0, 4.0]} />
      </mesh>

      {/* Gentle Floating Sunlight Particles */}
      {!reducedMotion && (
        <points ref={particlesRef} geometry={particlesGeo}>
          <pointsMaterial
            size={0.035}
            color="#FFF4D0"
            transparent
            opacity={0.35 * Math.min(1, introProgress + 0.2)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
