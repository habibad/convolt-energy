"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClosingVisual } from "./ClosingVisual";
import { CommitmentContent } from "../commitment/CommitmentContent";
import { CommitmentPrinciples } from "../commitment/CommitmentPrinciples";
import { CommitmentImpact } from "../commitment/CommitmentImpact";
import { FinalCTAContent } from "../final-cta/FinalCTAContent";
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

export const ClosingExperience: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Master normalized progress across closing journey (0.00 -> 1.00)
  const [closingProgress, setClosingProgress] = useState(0);

  // Pointer Parallax & Reduced Motion hooks
  const pointerCoords = usePointerParallax(0.025);
  const reducedMotion = useReducedMotion();

  // ScrollTrigger Choreography
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop (1024px+): Continuous Pinned Cinematic Storytelling (~340vh)
    mm.add("(min-width: 1024px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setClosingProgress(p);
        },
      });
    });

    // Mobile & Tablet (< 1024px): Responsive scroll observer
    mm.add("(max-width: 1023px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setClosingProgress(p);
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

  // --------------------------------------------------------------------------
  // Choreography Calculations (Desktop):
  // --------------------------------------------------------------------------
  // Act 1: Our Commitment (0.00 -> 0.44)
  // Maps 0.00 -> 0.24 to complete entrance of all commitment items
  const commitLocalProgress = Math.min(1, closingProgress / 0.24);
  // Commitment exits smoothly between 0.44 and 0.54 as dusk deepens
  const commitExitT = reducedMotion
    ? closingProgress >= 0.48 ? 1 : 0
    : smoothstep(0.44, 0.54, closingProgress);
  const commitOpacity = 1 - commitExitT;
  const commitTranslateY = -24 * commitExitT;
  const impactTranslateY = 24 * commitExitT;

  // Act 2: Final CTA Entrance & Active Stage (0.48 -> 0.76)
  const ctaEnterT = reducedMotion
    ? closingProgress >= 0.50 ? 1 : 0
    : smoothstep(0.48, 0.58, closingProgress);
  const ctaLocalProgress = reducedMotion
    ? closingProgress >= 0.52 ? 1 : 0
    : smoothstep(0.48, 0.70, closingProgress);
  const ctaOpacity = ctaEnterT;
  const ctaTranslateY = (1 - ctaEnterT) * 20;

  // Act 3: Footer Settle (0.72 -> 0.96)
  const footerT = reducedMotion
    ? closingProgress >= 0.76 ? 1 : 0
    : smoothstep(0.72, 0.96, closingProgress);
  const footerTranslateY = (1 - footerT) * 60;
  const footerOpacity = footerT;

  return (
    <section
      id="closing-experience"
      ref={containerRef}
      aria-label="Convalt Energy Closing Journey: Our Commitment, Final Call to Action, and Site Footer"
      className="relative w-full bg-[#081214] text-white lg:h-[380vh]"
    >
      {/* Target Anchors for seamless hash navigation and links */}
      <div id="our-commitment" className="absolute top-0 left-0 w-full h-[1px] pointer-events-none" />
      <div id="final-cta" className="absolute top-[48%] left-0 w-full h-[1px] pointer-events-none" />
      <div id="contact" className="absolute top-[52%] left-0 w-full h-[1px] pointer-events-none" />
      <div id="site-footer" className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* 1. Desktop (lg+): Pinned 100svh Continuous Cinematic Stage    */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={stickyRef}
        className="hidden lg:flex sticky top-0 left-0 w-full h-[100svh] min-h-[760px] overflow-hidden flex-col justify-between select-none bg-[#081214]"
      >
        {/* Persistent 2.5D Visual Environment (Never unpins or jumps) */}
        <ClosingVisual
          progress={closingProgress}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          reducedMotion={reducedMotion}
        />

        {/* Top Header Navigation Bar (Matches reference mockup across whole closing) */}
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

        {/* ------------------------------------------------------------- */}
        {/* Dynamic Central Stage: Transforms from Commitment to Final CTA */}
        {/* ------------------------------------------------------------- */}
        <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden z-20">
          {/* ACT 1: Commitment Content + Principles (Fades out seamlessly 0.38 -> 0.50) */}
          <div
            className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between will-change-transform transition-all duration-150"
            style={{
              opacity: commitOpacity,
              transform: `translate3d(0, ${commitTranslateY.toFixed(1)}px, 0)`,
              pointerEvents: commitOpacity > 0.1 ? "auto" : "none",
            }}
          >
            {/* Main Narrative Row */}
            <div className="relative w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 pt-2 sm:pt-4">
              {/* Left Editorial Content */}
              <CommitmentContent
                progress={commitLocalProgress}
                reducedMotion={reducedMotion}
              />

              {/* Center valley spacing */}
              <div className="hidden lg:block lg:flex-1 h-12" aria-hidden="true" />

              {/* Right Vertical Principles Stack */}
              <CommitmentPrinciples
                progress={commitLocalProgress}
                reducedMotion={reducedMotion}
              />
            </div>

            {/* Bottom 4-Column Impact Strip */}
            <div
              className="will-change-transform transition-all duration-150"
              style={{
                transform: `translate3d(0, ${impactTranslateY.toFixed(1)}px, 0)`,
              }}
            >
              <CommitmentImpact
                progress={commitLocalProgress}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>

          {/* ACT 2: Final CTA Content (Glides into place seamlessly 0.46 -> 0.78) */}
          <div
            className="absolute inset-x-0 top-0 pt-4 sm:pt-8 lg:pt-10 will-change-transform transition-all duration-150"
            style={{
              opacity: ctaOpacity,
              transform: `translate3d(0, ${ctaTranslateY.toFixed(1)}px, 0)`,
              pointerEvents: ctaOpacity > 0.1 ? "auto" : "none",
            }}
          >
            <FinalCTAContent
              progress={ctaLocalProgress}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACT 3: Footer Integrated in Lower Composition (0.78 -> 1.00)  */}
        {/* ------------------------------------------------------------- */}
        <div
          className="absolute inset-x-0 bottom-0 z-30 w-full will-change-transform transition-all duration-200"
          style={{
            transform: `translate3d(0, ${footerTranslateY.toFixed(1)}px, 0)`,
            opacity: footerOpacity,
            visibility: footerOpacity > 0.01 ? "visible" : "hidden",
            pointerEvents: footerOpacity > 0.6 ? "auto" : "none",
          }}
        >
          <Footer />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Mobile & Tablet (< lg): Natural Fluid Flow                 */}
      {/* ------------------------------------------------------------- */}
      <div className="lg:hidden relative w-full flex flex-col bg-[#081214]">
        {/* Part A: Commitment Section */}
        <div className="relative w-full min-h-[90vh] flex flex-col justify-between pt-8 pb-10 overflow-hidden">
          <ClosingVisual
            progress={Math.min(0.35, closingProgress)}
            pointerX={0}
            pointerY={0}
            reducedMotion={reducedMotion}
          />
          {/* Mobile Header */}
          <header className="relative w-full px-6 flex items-center justify-between z-20 mb-6">
            <span className="text-[12px] font-mono font-bold tracking-[0.20em] uppercase text-white">
              CONVALT
            </span>
            <a
              href="#contact"
              className="text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#78E070]"
            >
              BUILD TOGETHER
            </a>
          </header>

          <div className="relative z-20 px-6 flex flex-col gap-6">
            <CommitmentContent
              progress={Math.min(1, closingProgress * 2.2)}
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="relative z-20 mt-8">
            <CommitmentImpact
              progress={Math.min(1, closingProgress * 2.2)}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* Part B: Final CTA Section */}
        <div className="relative w-full min-h-[85vh] flex flex-col justify-between pt-12 pb-14 overflow-hidden border-t border-white/10">
          <ClosingVisual
            progress={Math.max(0.65, closingProgress)}
            pointerX={0}
            pointerY={0}
            reducedMotion={reducedMotion}
          />
          <div className="relative z-20 w-full">
            <FinalCTAContent
              progress={Math.min(1, Math.max(0, (closingProgress - 0.35) * 2.0))}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* Part C: Site Footer */}
        <div className="relative z-20 w-full">
          <Footer />
        </div>
      </div>
    </section>
  );
};
