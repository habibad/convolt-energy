"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { ApproachScene } from "./ApproachScene";
import { useWebGLCapability } from "@/hooks/useWebGLCapability";

interface ApproachCanvasProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  hoveredZone: number | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
  labelRefs?: React.RefObject<(HTMLElement | null)[]>;
}

export const ApproachCanvas: React.FC<ApproachCanvasProps> = ({
  progress,
  visualActiveZone,
  hoveredZone,
  pointerX,
  pointerY,
  reducedMotion = false,
  labelRefs,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMountedOnce, setHasMountedOnce] = useState(false);
  const [isInOrNearView, setIsInOrNearView] = useState(false);
  const [webGLError, setWebGLError] = useState(false);
  const { isSupported } = useWebGLCapability();

  // Viewport proximity observer for lazy mount & frameloop pause
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setHasMountedOnce(true);
          setIsInOrNearView(true);
        } else {
          setIsInOrNearView(false);
        }
      },
      { rootMargin: "350px 0px 350px 0px", threshold: 0.01 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Determine mobile vs desktop DPR (DPR max 1.5 on desktop, 1.0 on mobile for optimal 60fps)
  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Fallback image when WebGL is unsupported or context lost */}
      {(!isSupported || webGLError) && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[1200px] h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/media/approach/05-integrated-ecosystem.png"
              alt="Convalt Energy Integrated Ecosystem"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}

      {/* R3F WebGL Canvas (Full-bleed, transparent, single persistent context) */}
      {isSupported && !webGLError && hasMountedOnce && (
        <Canvas
          camera={{
            fov: 42,
            position: [0.0, 0.0, 8.5],
            near: 0.1,
            far: 35,
          }}
          dpr={isMobile ? 1 : [1, 1.5]}
          frameloop={isInOrNearView ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setWebGLError(true);
            });
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Suspense fallback={null}>
            <ApproachScene
              progress={progress}
              visualActiveZone={visualActiveZone}
              hoveredZone={hoveredZone}
              pointerX={pointerX}
              pointerY={pointerY}
              reducedMotion={reducedMotion}
              labelRefs={labelRefs}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
