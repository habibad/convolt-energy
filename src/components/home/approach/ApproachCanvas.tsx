"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ApproachScene } from "./ApproachScene";
import { useWebGLCapability } from "@/hooks/useWebGLCapability";

interface ApproachCanvasProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  pointerX: number;
  pointerY: number;
  reducedMotion?: boolean;
}

export const ApproachCanvas: React.FC<ApproachCanvasProps> = ({
  progress,
  visualActiveZone,
  pointerX,
  pointerY,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMountedOnce, setHasMountedOnce] = useState(false);
  const [isInOrNearView, setIsInOrNearView] = useState(false);
  const [webGLError, setWebGLError] = useState(false);
  const { isSupported } = useWebGLCapability();

  // 1. Viewport proximity observer for lazy mount & frameloop pause
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    // Observe with 350px rootMargin so canvas warms up slightly before arrival
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

  // Determine mobile vs desktop DPR
  const isMobile =
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      aria-hidden="true"
    >
      {/* Fallback presentation when WebGL is unsupported or threw context loss */}
      {(!isSupported || webGLError) && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-black/5 border border-black/10 backdrop-blur-sm">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#63A75B]/20 flex items-center justify-center text-[#63A75B]">
              ✦
            </div>
            <p className="text-sm font-medium text-[#202A2E]">
              Interactive 3D Ecosystem
            </p>
            <p className="text-xs text-[#55656C] mt-1">
              Integrated Value Chain: Solar Manufacturing &bull; Power Generation &bull; Data Centers &bull; Recycling
            </p>
          </div>
        </div>
      )}

      {/* R3F Canvas mounted lazily and kept alive thereafter */}
      {isSupported && !webGLError && hasMountedOnce && (
        <Canvas
          camera={{
            fov: 38,
            position: [0, 2.7, 5.2],
            near: 0.1,
            far: 25,
          }}
          // Non-negotiable DPR: Desktop [1, 1.5], Mobile 1.0
          dpr={isMobile ? 1 : [1, 1.5]}
          // Frameloop: 'always' while near or in view, 'never' when far out of view
          frameloop={isInOrNearView ? "always" : "never"}
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
            <ApproachScene
              progress={progress}
              visualActiveZone={visualActiveZone}
              pointerX={pointerX}
              pointerY={pointerY}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
