"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { HeroScene } from "./HeroScene";
import { useWebGLCapability } from "@/hooks/useWebGLCapability";

interface HeroCanvasProps {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  introProgress: number;
  selectedChapterId?: string;
  reducedMotion?: boolean;
}

// Fallback component while textures load or if WebGL is unavailable
const FallbackPoster: React.FC<{
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
}> = ({ pointerX, pointerY, scrollProgress }) => {
  const transform = `scale(${1.04 + scrollProgress * 0.04}) translate3d(${
    pointerX * 6
  }px, ${pointerY * 4}px, 0)`;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#101A1D]">
      <picture className="w-full h-full block">
        <source
          media="(max-width: 768px)"
          srcSet="/media/hero/hero-mobile.webp"
        />
        <Image
          src="/media/hero/convalt-hero-master.webp"
          alt="Convalt Energy Infrastructure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-300 ease-out"
          style={{ transform }}
        />
      </picture>
    </div>
  );
};

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  pointerX,
  pointerY,
  scrollProgress,
  introProgress,
  selectedChapterId,
  reducedMotion = false,
}) => {
  const { isSupported, maxDpr } = useWebGLCapability();
  const [webGLError, setWebGLError] = useState(false);

  // If WebGL is unsupported or threw an error, render the resilient fallback poster
  if (!isSupported || webGLError) {
    return (
      <FallbackPoster
        pointerX={pointerX}
        pointerY={pointerY}
        scrollProgress={scrollProgress}
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Background Poster while Canvas initializes to guarantee zero black flash */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: introProgress > 0.8 ? 0 : 1 }}
      >
        <FallbackPoster
          pointerX={pointerX}
          pointerY={pointerY}
          scrollProgress={scrollProgress}
        />
      </div>

      <Canvas
        camera={{
          fov: 42,
          position: [0, 0, 5.0],
          near: 0.1,
          far: 25,
        }}
        dpr={[1, maxDpr]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setWebGLError(true);
          });
        }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <Suspense fallback={null}>
          <HeroScene
            pointerX={pointerX}
            pointerY={pointerY}
            scrollProgress={scrollProgress}
            introProgress={introProgress}
            selectedChapterId={selectedChapterId}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
