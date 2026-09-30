"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CommitmentVisual } from "./CommitmentVisual";
import { CommitmentContent } from "./CommitmentContent";
import { CommitmentPrinciples } from "./CommitmentPrinciples";
import { CommitmentImpact } from "./CommitmentImpact";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const CommitmentSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Normalized section progress (0.00 -> 1.00)
  const [sectionProgress, setSectionProgress] = useState(0);

  // Pointer Parallax & Reduced Motion hooks
  const pointerCoords = usePointerParallax(0.025);
  const reducedMotion = useReducedMotion();

  // ScrollTrigger Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop & Tablet: Pinned 180vh smooth storytelling stage
    mm.add("(min-width: 768px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);
        },
      });
    });

    // Mobile: Slightly shorter scroll distance (135vh) for brisk touch pacing
    mm.add("(max-width: 767px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);
        },
      });
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      mm.revert();
      clearTimeout(refreshTimer);
      scrollTriggerRef.current = null;
    };
  }, []);

  return (
    <section
      id="our-commitment"
      ref={containerRef}
      aria-label="Convalt Energy Commitment to a cleaner, resilient and circular future"
      className="relative w-full bg-[#0E1A1A] text-white h-[180vh] md:h-[200vh]"
    >
      {/* ------------------------------------------------------------- */}
      {/* Sticky Cinematic Viewport: 100svh, min-h-[720px]               */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-[100svh] min-h-[720px] overflow-hidden flex flex-col justify-between select-none bg-[#0E1A1A]"
      >
        {/* 1. Full-Bleed 2.5D Cinematic Visual Environment */}
        <CommitmentVisual
          progress={sectionProgress}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          reducedMotion={reducedMotion}
        />

        {/* 2. Top Header Navigation Bar (matches reference mockup) */}
        <header className="relative w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 flex items-center justify-between z-30 pointer-events-auto">
          {/* Brand Left */}
          <div className="flex items-center space-x-3">
            <span className="text-[13px] font-mono font-bold tracking-[0.22em] uppercase text-white">
              CONVALT
            </span>
            <span className="text-white/30 text-xs hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono tracking-[0.16em] uppercase text-[#A0B2B6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D9E32]" />
              <span>A CLEANER TOMORROW</span>
            </div>
          </div>

          {/* Action Right */}
          <div className="flex items-center space-x-6">
            <a
              href="#contact"
              data-cursor="hover"
              className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-white/90 hover:text-[#78E070] transition-colors duration-200"
            >
              LET’S BUILD TOGETHER
            </a>

            {/* Subtle Hamburger Menu Icon */}
            <button
              type="button"
              data-cursor="hover"
              aria-label="Toggle navigation menu"
              className="flex flex-col space-y-1.5 w-6 cursor-pointer focus:outline-none"
            >
              <span className="w-6 h-[1.5px] bg-white transition-all" />
              <span className="w-6 h-[1.5px] bg-white transition-all" />
            </button>
          </div>
        </header>

        {/* 3. Main Narrative Stage (Left: Content, Right: Principles) */}
        <div className="relative w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 pt-3 sm:pt-6 pb-2 sm:pb-4 z-20">
          {/* Left: Eyebrow + Masked Headline + Body + CTA */}
          <CommitmentContent
            progress={sectionProgress}
            reducedMotion={reducedMotion}
          />

          {/* Center Valley & Sun negative space (kept clear for visual balance) */}
          <div className="hidden lg:block lg:flex-1 h-12" aria-hidden="true" />

          {/* Right: Vertical Editorial Principles Stack */}
          <CommitmentPrinciples
            progress={sectionProgress}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* 4. Bottom: Integrated 4-Column Impact Strip & Topographic Transition */}
        <CommitmentImpact
          progress={sectionProgress}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
};
