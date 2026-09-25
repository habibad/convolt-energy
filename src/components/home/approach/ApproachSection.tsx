"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ApproachCanvas } from "./ApproachCanvas";
import { ApproachLabels } from "./ApproachLabels";
import { ApproachStoryRail } from "./ApproachStoryRail";
import { CinematicStoryOverlay } from "./business/CinematicStoryOverlay";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Target chapter seek points
const ZONE_SEEK_TARGETS: Record<number, number> = {
  0: 0.22, // Solar Manufacturing
  1: 0.48, // Power Generation
  2: 0.66, // Data Centers
  3: 0.83, // Recycling
};

export const ApproachSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const topSeamRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Direct DOM refs for 3D-to-2D spatial label projection
  const labelRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);

  // Master normalized story progress (0.00 -> 1.00)
  const [storyProgress, setStoryProgress] = useState(0);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);

  // Pointer Parallax & Reduced Motion
  const pointerCoords = usePointerParallax(0.035);
  const reducedMotion = useReducedMotion();

  // Active Zone computation for spatial labels on the master map
  const visualActiveZone = hoveredZone !== null ? hoveredZone : storyProgress < 0.16 ? 0 : null;

  // Smooth scroll helper using global Lenis or window fallback
  const scrollToTarget = useCallback((targetScrollY: number) => {
    const lenis =
      typeof window !== "undefined"
        ? (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: unknown) => void } }).__lenis
        : null;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetScrollY, {
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    }
  }, []);

  // Smooth seek helper for storyboard frame clicks or hotspot clicks
  const handleSeekProgress = useCallback(
    (targetProgress: number) => {
      if (!scrollTriggerRef.current) return;
      const st = scrollTriggerRef.current;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      scrollToTarget(targetScrollY);
    },
    [scrollToTarget]
  );

  // Master ScrollTrigger Timeline: Drives 0.00 -> 1.00 storyProgress
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setStoryProgress(p);

          // Hero-to-Approach Entrance Seam
          if (topSeamRef.current) {
            const seamOpacity = Math.max(0, 1 - p / 0.04);
            topSeamRef.current.style.opacity = seamOpacity.toFixed(3);
          }
        },
      });
    });

    // Mobile fallback match
    mm.add("(max-width: 767px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setStoryProgress(p);
        },
      });
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      mm.revert();
      clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <section
      id="our-approach"
      ref={containerRef}
      aria-label="Convalt Energy integrated value chain connecting solar manufacturing, power generation, data centers and recycling"
      className="relative w-full bg-[#0E1A1A] text-[#132126] min-h-screen md:h-[650vh] lg:h-[750vh] xl:h-[800vh]"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Responsive Stage: Pinned 100svh on desktop; natural flow on mobile  */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-[100svh] min-h-[720px] overflow-hidden flex flex-col justify-between select-none bg-[#0E1A1A]"
      >
        {/* 1. Hero Entrance Top Seam */}
        <div
          ref={topSeamRef}
          className="hidden md:block absolute top-0 inset-x-0 h-16 pointer-events-none z-30 transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(180deg, #101A1D 0%, rgba(16,26,29,0.3) 50%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* 2. FULL-BLEED WebGL Canvas (Persistent single cinematic canvas) */}
        <ApproachCanvas
          progress={storyProgress}
          visualActiveZone={visualActiveZone}
          hoveredZone={hoveredZone}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          reducedMotion={reducedMotion}
          labelRefs={labelRefs}
        />

        {/* 3. Spatial Projected DOM Hotspots overlaying the master map */}
        <ApproachLabels
          visualActiveZone={visualActiveZone}
          onHoverZone={(zoneIdx) => setHoveredZone(zoneIdx)}
          onSelectZone={(zoneIdx) => {
            const targetP = ZONE_SEEK_TARGETS[zoneIdx];
            if (targetP !== undefined) handleSeekProgress(targetP);
          }}
          labelRefs={labelRefs}
          disabled={storyProgress > 0.16}
        />

        {/* 4. Synchronized Cinematic DOM Text Overlay (All chapters) */}
        <CinematicStoryOverlay
          progress={storyProgress}
          onSeek={handleSeekProgress}
        />

        {/* 5. BOTTOM: Integrated Story Rail & Timeline */}
        <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-auto">
          <ApproachStoryRail
            progress={storyProgress}
            visualActiveZone={visualActiveZone}
            onSeekProgress={handleSeekProgress}
          />
        </div>
      </div>
    </section>
  );
};
