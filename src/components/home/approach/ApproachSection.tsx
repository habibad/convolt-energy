"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { ApproachCanvas } from "./ApproachCanvas";
import { ApproachLabels } from "./ApproachLabels";
import { ApproachStoryRail } from "./ApproachStoryRail";
import { APPROACH_DATA } from "@/data/home";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Discrete storyboard step targets matching the 5 zones
const STEP_TARGETS = [0.10, 0.45, 0.66, 0.83, 0.96];

const getStepFromProgress = (p: number): number => {
  if (p < 0.35) return 0;
  if (p < 0.56) return 1;
  if (p < 0.76) return 2;
  if (p < 0.90) return 3;
  return 4;
};

export const ApproachSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const topSeamRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Direct DOM refs for 3D-to-2D spatial label projection
  const labelRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);

  // Text Reveal Refs
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Decoupled State Architecture (Scroll vs. Hover)
  const [scrollActiveZone, setScrollActiveZone] = useState<number | "all" | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [sectionProgress, setSectionProgress] = useState(0);

  // Pointer Parallax & Reduced Motion (max ~8-10px subtle displacement)
  const pointerCoords = usePointerParallax(0.03);
  const reducedMotion = useReducedMotion();

  // Computed Visual Zone
  const visualActiveZone = hoveredZone ?? scrollActiveZone;

  // Latch/Lock for discrete step transitions (one wheel flick = one step)
  const isStepLockedRef = useRef(false);
  const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth scroll helper using global Lenis or window fallback
  const scrollToTarget = useCallback((targetScrollY: number) => {
    const lenis =
      typeof window !== "undefined"
        ? (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: unknown) => void } }).__lenis
        : null;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetScrollY, {
        duration: 0.85,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    }
  }, []);

  // Smooth seek helper for storyboard frame clicks
  const handleSeekProgress = useCallback(
    (targetProgress: number) => {
      if (!scrollTriggerRef.current) return;
      const st = scrollTriggerRef.current;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      scrollToTarget(targetScrollY);
    },
    [scrollToTarget]
  );

  // One-wheel-turn = One-step discrete controller (strictly one step per wheel turn)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWheel = (e: WheelEvent) => {
      const st = scrollTriggerRef.current;
      if (!st || !st.isActive) return;

      // Ignore horizontal scrolls or tiny sub-pixel trackpad drift
      if (Math.abs(e.deltaY) < 14 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      const currentP = Math.max(0, Math.min(1, st.progress));
      const currentStep = getStepFromProgress(currentP);

      if (e.deltaY > 0) {
        // Downward scroll
        // If at final step and near the very end of section, allow natural exit scroll
        if (currentStep >= 4 && currentP >= 0.94) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (isStepLockedRef.current) return;

        const nextStep = Math.min(4, currentStep + 1);
        const targetP = STEP_TARGETS[nextStep];
        const targetScrollY = st.start + targetP * (st.end - st.start);

        isStepLockedRef.current = true;
        scrollToTarget(targetScrollY);

        if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = setTimeout(() => {
          isStepLockedRef.current = false;
        }, 550);
      } else {
        // Upward scroll
        // If at first step and near the very top of section, allow natural exit scroll up to Hero
        if (currentStep <= 0 && currentP <= 0.12) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (isStepLockedRef.current) return;

        const prevStep = Math.max(0, currentStep - 1);
        const targetP = STEP_TARGETS[prevStep];
        const targetScrollY = st.start + targetP * (st.end - st.start);

        isStepLockedRef.current = true;
        scrollToTarget(targetScrollY);

        if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = setTimeout(() => {
          isStepLockedRef.current = false;
        }, 550);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const st = scrollTriggerRef.current;
      if (!st || !st.isActive) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        const currentP = Math.max(0, Math.min(1, st.progress));
        const currentStep = getStepFromProgress(currentP);
        if (currentStep < 4) {
          e.preventDefault();
          const nextStep = currentStep + 1;
          const targetP = STEP_TARGETS[nextStep];
          scrollToTarget(st.start + targetP * (st.end - st.start));
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const currentP = Math.max(0, Math.min(1, st.progress));
        const currentStep = getStepFromProgress(currentP);
        if (currentStep > 0) {
          e.preventDefault();
          const prevStep = currentStep - 1;
          const targetP = STEP_TARGETS[prevStep];
          scrollToTarget(st.start + targetP * (st.end - st.start));
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, [scrollToTarget]);

  // Master ScrollTrigger Choreography (Expanded height for ample step pacing)
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

    // DESKTOP & TABLET (>= 768px): Pinned scrub choreography with snap points
    mm.add("(min-width: 768px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        snap: {
          snapTo: STEP_TARGETS,
          duration: { min: 0.25, max: 0.5 },
          delay: 0.05,
          ease: "power2.out",
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);

          // A. Hero-to-Approach Entrance Seam (0.00 -> 0.04)
          if (topSeamRef.current) {
            const seamOpacity = Math.max(0, 1 - p / 0.04);
            topSeamRef.current.style.opacity = seamOpacity.toFixed(3);
          }

          // B. Eyebrow & Masked Headline (Visible from start, gentle fade out only if deep in chapters)
          if (eyebrowRef.current) {
            eyebrowRef.current.style.opacity = "1";
            eyebrowRef.current.style.transform = "translate3d(0, 0, 0)";
          }

          lineRefs.current.forEach((el) => {
            if (!el) return;
            el.style.transform = "translate3d(0, 0, 0)";
          });

          // C. Supporting Body Copy & CTA
          if (bodyRef.current) {
            bodyRef.current.style.opacity = "1";
            bodyRef.current.style.transform = "translate3d(0, 0, 0)";
          }

          if (ctaRef.current) {
            ctaRef.current.style.opacity = "1";
            ctaRef.current.style.transform = "translate3d(0, 0, 0)";
          }

          // D. Four Businesses & Value Chain Progression
          // 0.00 - 0.35: 01 Solar Manufacturing
          // 0.35 - 0.56: 02 Power Generation
          // 0.56 - 0.76: 03 Data Centers
          // 0.76 - 0.90: 04 Recycling
          // 0.90 - 1.00: 05 Full Integrated Ecosystem ("all")
          if (p < 0.35) {
            setScrollActiveZone(0); // 01 Solar Manufacturing active from entrance
          } else if (p < 0.56) {
            setScrollActiveZone(1); // 02 Power Generation
          } else if (p < 0.76) {
            setScrollActiveZone(2); // 03 Data Centers
          } else if (p < 0.90) {
            setScrollActiveZone(3); // 04 Recycling
          } else {
            setScrollActiveZone("all"); // 05 Full Ecosystem
          }
        },
      });
    });

    // MOBILE (< 768px): Natural flow scroll choreography
    mm.add("(max-width: 767px)", () => {
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = "1";
      lineRefs.current.forEach((el) => {
        if (el) el.style.transform = "translate3d(0, 0, 0)";
      });
      if (bodyRef.current) bodyRef.current.style.opacity = "1";
      if (ctaRef.current) ctaRef.current.style.opacity = "1";
      if (topSeamRef.current) topSeamRef.current.style.opacity = "0";

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);

          if (p < 0.2) {
            setScrollActiveZone(0);
          } else if (p < 0.42) {
            setScrollActiveZone(1);
          } else if (p < 0.65) {
            setScrollActiveZone(2);
          } else if (p < 0.84) {
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
      className="relative w-full bg-[#0E1A1A] text-[#132126] min-h-screen md:h-[400vh] lg:h-[450vh] xl:h-[500vh]"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Responsive Stage: Pinned 100svh on desktop; natural flow on mobile  */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={stickyRef}
        className="relative md:sticky md:top-0 left-0 w-full min-h-screen md:h-[100svh] md:min-h-[760px] md:overflow-hidden flex flex-col justify-between pt-6 md:pt-8 lg:pt-10 pb-0 select-none bg-[#0E1A1A]"
      >
        {/* ----------------------------------------------------------------- */}
        {/* 1. Hero Entrance Top Seam (Zero white flash, clears instantly)    */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={topSeamRef}
          className="hidden md:block absolute top-0 inset-x-0 h-16 pointer-events-none z-30 transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(180deg, #101A1D 0%, rgba(16,26,29,0.3) 50%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* ----------------------------------------------------------------- */}
        {/* 2. FULL-BLEED WebGL 2.5D Ecosystem Canvas (Edge-to-Edge)          */}
        {/* ----------------------------------------------------------------- */}
        <ApproachCanvas
          progress={sectionProgress}
          visualActiveZone={visualActiveZone}
          hoveredZone={hoveredZone}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          reducedMotion={reducedMotion}
          labelRefs={labelRefs}
        />

        {/* Spatial Projected DOM Labels overlaying the 3D scene */}
        <ApproachLabels
          visualActiveZone={visualActiveZone}
          onHoverZone={(zoneIdx) => setHoveredZone(zoneIdx)}
          labelRefs={labelRefs}
        />

        {/* Localized Warm Atmospheric Wash behind Left Content Only (Preserves central ecosystem) */}
        <div
          className="hidden md:block absolute top-0 left-0 w-[520px] h-[650px] pointer-events-none z-5"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 0% 28%, rgba(246, 243, 237, 0.82) 0%, rgba(246, 243, 237, 0.40) 55%, rgba(246, 243, 237, 0) 100%)",
          }}
        />

        {/* ----------------------------------------------------------------- */}
        {/* 3. Master Editorial Layout Grid (Desktop Reference Proportions)   */}
        {/* ----------------------------------------------------------------- */}
        <div className="relative z-10 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 pointer-events-none">
          {/* LEFT: Eyebrow + 5-Line Editorial Headline (~260-310px width) */}
          <div className="w-full lg:w-[26%] xl:max-w-[310px] flex flex-col justify-start pointer-events-auto pl-1 lg:pl-3">
            {/* Eyebrow: Rounded vertical green bar + uppercase text */}
            <div
              ref={eyebrowRef}
              className="flex items-center space-x-3 mb-2 sm:mb-3 will-change-transform"
            >
              <span className="w-[5px] h-[15px] bg-[#4A9342] rounded-full inline-block shrink-0" />
              <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.18em] uppercase text-[#54646A] font-semibold">
                {APPROACH_DATA.eyebrow}
              </p>
            </div>

            {/* Strategic Editorial Headline matching approved reference proportions (5 lines) */}
            <h2 className="font-editorial-heading text-[clamp(28px,2.4vw,38px)] font-normal tracking-[-0.032em] leading-[1.04] text-[#132126]">
              {APPROACH_DATA.headline.map((line, idx) => (
                <span key={idx} className="line-mask-wrapper block">
                  <span
                    ref={(el) => {
                      lineRefs.current[idx] = el;
                    }}
                    className="block transform translate-y-0 whitespace-nowrap"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          {/* CENTER: Open environmental negative space letting the 3D ecosystem dominate */}
          <div className="hidden lg:block lg:flex-1 h-12" aria-hidden="true" />

          {/* RIGHT: Supporting Body Copy & Text-Link CTA (~240-280px width) */}
          <div className="w-full lg:w-[22%] xl:max-w-[280px] flex flex-col justify-start pt-1 sm:pt-2 pointer-events-auto ml-auto pr-2 lg:pr-6">
            {/* Paragraph / Body Text positioned in upper-right environmental negative space */}
            <div ref={bodyRef} className="will-change-transform">
              <p className="text-[14px] sm:text-[15px] leading-[1.6] font-normal text-[#38484E]">
                {APPROACH_DATA.body}
              </p>
            </div>

            {/* CTA: Understated Text Link with Underline Expand & Arrow Shift */}
            <div className="mt-5 sm:mt-6">
              <a
                ref={ctaRef}
                href={APPROACH_DATA.cta.href}
                className="group inline-flex items-center space-x-2 text-[15px] font-medium text-[#132126] cursor-pointer will-change-transform border-b border-[#132126]/60 hover:border-[#132126] pb-0.5 transition-colors duration-300"
              >
                <span>{APPROACH_DATA.cta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1 text-[#132126]" />
              </a>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 4. BOTTOM: Integrated Story Rail (Max ~24vh height, 5 cinematic frames) */}
        {/* ----------------------------------------------------------------- */}
        <ApproachStoryRail
          progress={sectionProgress}
          visualActiveZone={visualActiveZone}
          onSeekProgress={handleSeekProgress}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Solar Manufacturing True Section Boundary Anchor                */}
      {/* ------------------------------------------------------------------- */}
      <div
        id="solar-manufacturing-anchor"
        aria-hidden="true"
        className="h-0 scroll-mt-20"
      />
    </section>
  );
};
