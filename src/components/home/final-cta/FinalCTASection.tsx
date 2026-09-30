"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FinalCTAVisual } from "./FinalCTAVisual";
import { FinalCTAContent } from "./FinalCTAContent";
import { Footer } from "@/components/layout/footer/Footer";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const FinalCTASection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Normalized local progress (0.00 -> 1.00)
  const [ctaProgress, setCtaProgress] = useState(0);

  // Pointer Parallax & Reduced Motion hooks
  const pointerCoords = usePointerParallax(0.025);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop: Pinned cinematic scrub timeline (~170vh total scroll distance)
    mm.add("(min-width: 1024px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setCtaProgress(p);
        },
      });
    });

    // Tablet & Mobile: Natural scroll with responsive reveal trigger
    mm.add("(max-width: 1023px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        end: "center 40%",
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setCtaProgress(p);
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

  // Footer reveal choreography: enters smoothly from below (0.80 -> 1.00)
  const footerT = reducedMotion
    ? ctaProgress >= 0.75 ? 1 : 0
    : smoothstep(0.80, 1.0, ctaProgress);
  const footerTranslateY = (1 - footerT) * 45;
  const footerOpacity = Math.max(0.2, footerT);

  return (
    <section
      id="final-cta"
      ref={containerRef}
      aria-label="Convalt Energy Final Call to Action and Footer"
      className="relative w-full bg-[#081214] text-white lg:h-[175vh]"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Desktop (lg+): Pinned 100svh Unified Closing Composition   */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={stickyRef}
        className="hidden lg:flex sticky top-0 left-0 w-full h-[100svh] min-h-[760px] overflow-hidden flex-col justify-between select-none bg-[#081214]"
      >
        {/* Full-Bleed 2.5D Visual Environment (CTA Region) */}
        <FinalCTAVisual
          progress={ctaProgress}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          reducedMotion={reducedMotion}
        />

        {/* CTA Narrative Content: Eyebrow, Headline, Body, Button, Principles */}
        <div className="relative w-full z-20 pt-4 sm:pt-8 lg:pt-10 flex-1 flex flex-col justify-start">
          <FinalCTAContent
            progress={ctaProgress}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Footer: Seamlessly Integrated in the Lower Composition */}
        <div
          className="relative z-30 w-full will-change-transform transition-all duration-200"
          style={{
            transform: `translate3d(0, ${footerTranslateY.toFixed(1)}px, 0)`,
            opacity: footerOpacity,
          }}
        >
          <Footer />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Mobile & Tablet (< lg): Natural Flow with Zero Overlap     */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:hidden relative w-full flex flex-col bg-[#081214]">
        {/* Mobile CTA Region */}
        <div className="relative w-full min-h-[85vh] flex flex-col justify-between pt-10 pb-14 overflow-hidden">
          <FinalCTAVisual
            progress={ctaProgress}
            pointerX={0}
            pointerY={0}
            reducedMotion={reducedMotion}
          />
          <div className="relative z-20 w-full">
            <FinalCTAContent
              progress={ctaProgress}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* Mobile Footer Region */}
        <div className="relative z-30 w-full">
          <Footer />
        </div>
      </div>
    </section>
  );
};
