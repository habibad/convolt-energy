"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { ApproachCanvas } from "./ApproachCanvas";
import { ApproachLabels } from "./ApproachLabels";
import { APPROACH_DATA } from "@/data/home";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const ApproachSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const transitionLayerRef = useRef<HTMLDivElement>(null);

  // Text Reveal Refs
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // 1. Decoupled State Architecture (Scroll vs. Hover)
  const [scrollActiveZone, setScrollActiveZone] = useState<number | "all" | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [sectionProgress, setSectionProgress] = useState(0);

  // Pointer Parallax & Reduced Motion Hooks
  const pointerCoords = usePointerParallax(0.05);
  const reducedMotion = useReducedMotion();

  // 2. Computed Visual Zone: Hover temporarily overrides without mutating scroll state
  const visualActiveZone = hoveredZone ?? scrollActiveZone;

  // 3. GSAP ScrollTrigger Master Choreography Controller (Responsive with gsap.matchMedia)
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // DESKTOP & TABLET (>= 768px): Pinned 240vh scrub choreography
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);

          // A. Hero-to-Approach Entrance Transition Layer (0.00 -> 0.10)
          if (transitionLayerRef.current) {
            const transOpacity = Math.max(0, 1 - p / 0.1);
            transitionLayerRef.current.style.opacity = transOpacity.toFixed(3);
            transitionLayerRef.current.style.pointerEvents =
              transOpacity > 0.05 ? "auto" : "none";
          }

          // B. Eyebrow & Headline Masked Lines Reveal (0.10 -> 0.22)
          if (eyebrowRef.current) {
            const eyeP = Math.max(0, Math.min(1, (p - 0.08) / 0.08));
            eyebrowRef.current.style.opacity = eyeP.toFixed(3);
            eyebrowRef.current.style.transform = `translate3d(0, ${(1 - eyeP) * 12}px, 0)`;
          }

          const animateLine = (el: HTMLSpanElement | null, startP: number) => {
            if (!el) return;
            const norm = Math.max(0, Math.min(1, (p - startP) / 0.06));
            el.style.transform = `translate3d(0, ${(1 - norm) * 115}%, 0)`;
          };

          animateLine(line1Ref.current, 0.1);
          animateLine(line2Ref.current, 0.14);
          animateLine(line3Ref.current, 0.18);

          // C. Supporting Body Copy & CTA Reveal (0.24 -> 0.38)
          if (bodyRef.current) {
            const bodyP = Math.max(0, Math.min(1, (p - 0.24) / 0.1));
            bodyRef.current.style.opacity = bodyP.toFixed(3);
            bodyRef.current.style.transform = `translate3d(0, ${(1 - bodyP) * 16}px, 0)`;
          }

          if (ctaRef.current) {
            const ctaP = Math.max(0, Math.min(1, (p - 0.32) / 0.08));
            ctaRef.current.style.opacity = ctaP.toFixed(3);
            ctaRef.current.style.transform = `translate3d(0, ${(1 - ctaP) * 12}px, 0)`;
          }

          // D. Four Business Reveal & Value Chain Choreography
          if (p < 0.2) {
            setScrollActiveZone(null);
          } else if (p < 0.35) {
            setScrollActiveZone(0); // 01 Solar Manufacturing
          } else if (p < 0.52) {
            setScrollActiveZone(1); // 02 Power Generation
          } else if (p < 0.69) {
            setScrollActiveZone(2); // 03 Data Centers
          } else if (p < 0.85) {
            setScrollActiveZone(3); // 04 Recycling
          } else if (p < 0.94) {
            setScrollActiveZone("all"); // Integrated Circular Value Chain
          } else {
            setScrollActiveZone(0); // Settle & Bridge toward Solar Manufacturing
          }
        },
      });
    });

    // MOBILE (< 768px): Natural flow scroll choreography
    mm.add("(max-width: 767px)", () => {
      // Ensure text is immediately visible without needing to scrub
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = "1";
      if (line1Ref.current) line1Ref.current.style.transform = "translate3d(0, 0, 0)";
      if (line2Ref.current) line2Ref.current.style.transform = "translate3d(0, 0, 0)";
      if (line3Ref.current) line3Ref.current.style.transform = "translate3d(0, 0, 0)";
      if (bodyRef.current) bodyRef.current.style.opacity = "1";
      if (ctaRef.current) ctaRef.current.style.opacity = "1";
      if (transitionLayerRef.current) transitionLayerRef.current.style.opacity = "0";

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);

          if (p < 0.2) {
            setScrollActiveZone(0);
          } else if (p < 0.45) {
            setScrollActiveZone(1);
          } else if (p < 0.7) {
            setScrollActiveZone(2);
          } else if (p < 0.85) {
            setScrollActiveZone(3);
          } else {
            setScrollActiveZone("all");
          }
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
      className="relative w-full bg-[#F4F2EC] text-[#101A1D] min-h-screen md:h-[200vh] lg:h-[220vh] xl:h-[240vh]"
    >
      {/* ------------------------------------------------------------------- */}
      {/* 1. Hero Entrance Transition Layer (Zero modification to Hero)       */}
      {/* Starts at deep dark Hero tone and smoothly lifts across 0.00 -> 0.10 */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={transitionLayerRef}
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-30 transition-opacity duration-150"
        style={{
          background:
            "linear-gradient(180deg, #101A1D 0%, rgba(16,26,29,0.92) 50%, rgba(16,26,29,0) 100%)",
        }}
      />

      {/* ------------------------------------------------------------------- */}
      {/* 2. Responsive Stage: Pinned 100svh on desktop; natural flow on mobile*/}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={stickyRef}
        className="relative md:sticky md:top-0 left-0 w-full min-h-screen md:h-[100svh] md:min-h-[760px] md:overflow-hidden flex flex-col justify-between py-12 md:pt-20 md:pb-10 px-[clamp(20px,4vw,64px)] max-w-[1540px] mx-auto select-none"
      >
        {/* Subtle Warm Atmospheric Center Radial Glow behind 3D model */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(244,242,236,0.3) 50%, rgba(244,242,236,0) 75%)",
          }}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Main 3-Column Editorial Grid (Desktop) / Vertical Stack (Mobile)  */}
        {/* Hierarchy: EYEBROW -> HEADLINE -> 3D MODEL -> BODY -> CTA         */}
        {/* ----------------------------------------------------------------- */}
        <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 my-auto">
          {/* LEFT / TOP: Eyebrow + Masked 3-Line Headline */}
          <div className="w-full lg:max-w-[460px] xl:max-w-[500px] flex flex-col justify-center">
            {/* Small uppercase green/slate eyebrow with vertical rule */}
            <div
              ref={eyebrowRef}
              className="flex items-center space-x-2.5 mb-3 sm:mb-4 will-change-transform"
            >
              <span className="w-1.5 h-3.5 bg-[#63A75B] rounded-full inline-block" />
              <p className="text-[11px] sm:text-[12px] font-mono tracking-eyebrow uppercase text-[#55656C] font-medium">
                {APPROACH_DATA.eyebrow}
              </p>
            </div>

            {/* Strategic Editorial Headline with Masked Line Wrappers */}
            <h2 className="font-editorial-heading text-[clamp(32px,4.2vw,68px)] font-normal tracking-[-0.04em] leading-[1.04] text-[#101A1D]">
              <span className="line-mask-wrapper">
                <span ref={line1Ref} className="block transform translate-y-0">
                  {APPROACH_DATA.headline[0]}
                </span>
              </span>
              <span className="line-mask-wrapper">
                <span ref={line2Ref} className="block transform translate-y-0">
                  {APPROACH_DATA.headline[1]}
                </span>
              </span>
              <span className="line-mask-wrapper">
                <span ref={line3Ref} className="block transform translate-y-0">
                  {APPROACH_DATA.headline[2]}
                </span>
              </span>
            </h2>
          </div>

          {/* CENTER / MIDDLE: 3D Integrated Energy Ecosystem & Labels */}
          <div className="relative w-full flex-1 h-[320px] sm:h-[400px] md:h-[480px] lg:h-[560px] xl:h-[620px] max-w-[700px] flex flex-col items-center justify-center">
            {/* R3F Canvas with frameloop lifecycle & DPR control */}
            <div className="relative w-full h-[280px] sm:h-[360px] md:h-full">
              <ApproachCanvas
                progress={sectionProgress}
                visualActiveZone={visualActiveZone}
                pointerX={pointerCoords.x}
                pointerY={pointerCoords.y}
                reducedMotion={reducedMotion}
              />

              {/* Accessible Semantic DOM Labels (Desktop Overlay) */}
              <ApproachLabels
                visualActiveZone={visualActiveZone}
                onHoverZone={(zoneIdx) => setHoveredZone(zoneIdx)}
              />
            </div>
          </div>

          {/* RIGHT / BOTTOM: Supporting Body Copy & Animated Text Link CTA */}
          <div className="w-full lg:max-w-[360px] xl:max-w-[390px] flex flex-col justify-center">
            {/* Paragraph / Body Text */}
            <div ref={bodyRef} className="will-change-transform">
              <p className="text-[15px] sm:text-[16px] md:text-[17px] leading-[1.65] font-normal text-[#4A585D]">
                {APPROACH_DATA.body}
              </p>
            </div>

            {/* CTA: Understated Text Link with Underline Expand & Arrow Shift */}
            <div className="mt-5 sm:mt-7">
              <a
                ref={ctaRef}
                href={APPROACH_DATA.cta.href}
                className="group inline-flex items-center space-x-2 text-[14px] sm:text-[15px] font-medium text-[#101A1D] hover:text-[#101A1D] cursor-pointer will-change-transform"
              >
                <span className="relative pb-0.5">
                  {APPROACH_DATA.cta.label}
                  {/* Underline grows from left */}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#101A1D] transition-all duration-350 ease-out group-hover:w-full" />
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-350 ease-out group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Narrative Anchor Cue */}
        <div className="hidden sm:flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-[#7E8F95] border-t border-black/8 pt-3 mt-4">
          <span>02 / Circular Infrastructure</span>
          <span>Four Interconnected Hubs</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Solar Manufacturing True Section Boundary Anchor                */}
      {/* Placed at the true bottom boundary, not inside sticky stage         */}
      {/* ------------------------------------------------------------------- */}
      <div
        id="solar-manufacturing-anchor"
        className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none"
      />
    </section>
  );
};
