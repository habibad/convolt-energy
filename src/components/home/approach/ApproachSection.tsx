"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { ApproachCanvas } from "./ApproachCanvas";
import { ApproachLabels } from "./ApproachLabels";
import { ApproachStoryRail } from "./ApproachStoryRail";
import { BusinessDetailUI } from "./business/BusinessDetailUI";
import { BUSINESS_DATA, BusinessId, BusinessItem } from "./business/businessData";
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

const ZONE_TO_BUSINESS_ID: Record<number, BusinessId> = {
  0: "solar",
  1: "power",
  2: "data",
  3: "recycling",
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
  const ctaRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const railContainerRef = useRef<HTMLDivElement>(null);

  // Decoupled State Architecture (Scroll vs. Hover)
  const [scrollActiveZone, setScrollActiveZone] = useState<number | "all" | null>(null);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const [sectionProgress, setSectionProgress] = useState(0);

  // -----------------------------------------------------------------
  // IMMERSIVE BUSINESS EXPLORATION SYSTEM STATE
  // -----------------------------------------------------------------
  const [mode, setMode] = useState<
    "overview" | "transitioning-in" | "business" | "transitioning-between" | "transitioning-out"
  >("overview");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const [activeBusiness, setActiveBusiness] = useState<BusinessId | null>(null);
  const [pendingBusiness, setPendingBusiness] = useState<BusinessId | null>(null);
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [businessToBusinessProgress, setBusinessToBusinessProgress] = useState<number>(0);

  // State capture for flawless restoration on Back to Ecosystem
  const capturedScrollProgress = useRef<number>(0);
  const capturedActiveZone = useRef<number | "all" | null>(null);
  const masterTransitionRef = useRef<{ progress: number }>({ progress: 0 });

  // Pointer Parallax & Reduced Motion
  const pointerCoords = usePointerParallax(0.03);
  const reducedMotion = useReducedMotion();

  // Computed Visual Zone
  const visualActiveZone = hoveredZone ?? scrollActiveZone;

  // Latch/Lock for discrete step transitions
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
      if (modeRef.current !== "overview") return;
      if (!scrollTriggerRef.current) return;
      const st = scrollTriggerRef.current;
      const targetScrollY = st.start + targetProgress * (st.end - st.start);
      scrollToTarget(targetScrollY);
    },
    [scrollToTarget]
  );

  // -----------------------------------------------------------------
  // BUSINESS TRANSITION CONTROLLERS
  // -----------------------------------------------------------------
  const enterBusiness = useCallback(
    (businessId: BusinessId) => {
      if (modeRef.current !== "overview") return;

      // 1. Capture current Approach scroll and zone state exactly
      capturedScrollProgress.current = sectionProgress;
      capturedActiveZone.current = visualActiveZone;

      setActiveBusiness(businessId);
      setActiveProcessStep(0);
      setMode("transitioning-in");
      modeRef.current = "transitioning-in";

      // 2. Master Normalized Progress Timeline (0 -> 1)
      masterTransitionRef.current.progress = 0;
      gsap.to(masterTransitionRef.current, {
        progress: 1,
        duration: reducedMotion ? 0.4 : 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          const p = masterTransitionRef.current.progress;
          setTransitionProgress(p);
        },
        onComplete: () => {
          setMode("business");
          modeRef.current = "business";
        },
      });
    },
    [sectionProgress, visualActiveZone, reducedMotion]
  );

  const exitToOverview = useCallback(() => {
    if (modeRef.current !== "business") return;

    setMode("transitioning-out");
    modeRef.current = "transitioning-out";

    masterTransitionRef.current.progress = 1;
    gsap.to(masterTransitionRef.current, {
      progress: 0,
      duration: reducedMotion ? 0.35 : 1.35,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = masterTransitionRef.current.progress;
        setTransitionProgress(p);
      },
      onComplete: () => {
        setMode("overview");
        modeRef.current = "overview";
        setActiveBusiness(null);
        setPendingBusiness(null);

        // Flawlessly restore pre-entry state
        setSectionProgress(capturedScrollProgress.current);
        setScrollActiveZone(capturedActiveZone.current);
      },
    });
  }, [reducedMotion]);

  const switchBusiness = useCallback(
    (nextBusinessId: BusinessId) => {
      if (modeRef.current !== "business" || nextBusinessId === activeBusiness) return;

      setMode("transitioning-between");
      modeRef.current = "transitioning-between";
      setPendingBusiness(nextBusinessId);
      setActiveProcessStep(0);

      const b2bProxy = { p: 0 };
      gsap.to(b2bProxy, {
        p: 1,
        duration: reducedMotion ? 0.3 : 1.15,
        ease: "power2.inOut",
        onUpdate: () => {
          setBusinessToBusinessProgress(b2bProxy.p);
        },
        onComplete: () => {
          setActiveBusiness(nextBusinessId);
          setPendingBusiness(null);
          setBusinessToBusinessProgress(0);
          setMode("business");
          modeRef.current = "business";
        },
      });
    },
    [activeBusiness, reducedMotion]
  );

  // -----------------------------------------------------------------
  // SCROLL LOCKING IN BUSINESS MODE (Requirement 1)
  // -----------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleWheel = (e: WheelEvent) => {
      // FREEZE SCROLL in business or transition modes!
      if (modeRef.current !== "overview") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const st = scrollTriggerRef.current;
      if (!st || !st.isActive) return;

      if (Math.abs(e.deltaY) < 14 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      const currentP = Math.max(0, Math.min(1, st.progress));
      const currentStep = getStepFromProgress(currentP);

      if (e.deltaY > 0) {
        if (currentStep >= 4 && currentP >= 0.94) return;

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
        if (currentStep <= 0 && currentP <= 0.12) return;

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
      if (modeRef.current !== "overview") {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp") {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

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

  // Master ScrollTrigger Choreography
  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia();

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
          // Freeze overview updates if inside business exploration
          if (modeRef.current !== "overview") return;

          const p = Math.max(0, Math.min(1, self.progress));
          setSectionProgress(p);

          // Hero-to-Approach Entrance Seam
          if (topSeamRef.current) {
            const seamOpacity = Math.max(0, 1 - p / 0.04);
            topSeamRef.current.style.opacity = seamOpacity.toFixed(3);
          }

          if (p < 0.35) {
            setScrollActiveZone(0);
          } else if (p < 0.56) {
            setScrollActiveZone(1);
          } else if (p < 0.76) {
            setScrollActiveZone(2);
          } else if (p < 0.90) {
            setScrollActiveZone(3);
          } else {
            setScrollActiveZone("all");
          }
        },
      });
    });

    mm.add("(max-width: 767px)", () => {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 0.3,
        onUpdate: (self) => {
          if (modeRef.current !== "overview") return;

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

  // -----------------------------------------------------------------
  // APPROACH UI EXIT HIERARCHY CALCULATIONS
  // FIRST: non-selected business labels, right body, CTA (0.00 -> 0.35)
  // SECOND: Value Chain rail (0.20 -> 0.55)
  // THIRD: Main headline (0.40 -> 0.75)
  // -----------------------------------------------------------------
  const rightBodyOpacity = Math.max(0, 1 - transitionProgress / 0.35);
  const storyRailOpacity = Math.max(0, 1 - Math.max(0, transitionProgress - 0.2) / 0.35);
  const headlineOpacity = Math.max(0, 1 - Math.max(0, transitionProgress - 0.4) / 0.35);
  const businessUIOpacity = Math.min(1, Math.max(0, (transitionProgress - 0.65) / 0.35));

  const isBusinessMode = mode === "business" || mode === "transitioning-between";
  const currentBusinessData: BusinessItem | null = activeBusiness ? BUSINESS_DATA[activeBusiness] : null;

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
        {/* 1. Hero Entrance Top Seam */}
        <div
          ref={topSeamRef}
          className="hidden md:block absolute top-0 inset-x-0 h-16 pointer-events-none z-30 transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(180deg, #101A1D 0%, rgba(16,26,29,0.3) 50%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* 2. FULL-BLEED WebGL Canvas (Hosts both Overview & Business 2.5D worlds) */}
        <ApproachCanvas
          progress={sectionProgress}
          visualActiveZone={visualActiveZone}
          hoveredZone={hoveredZone}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          reducedMotion={reducedMotion}
          labelRefs={labelRefs}
          transitionProgress={transitionProgress}
          activeBusiness={activeBusiness}
          pendingBusiness={pendingBusiness}
          businessToBusinessProgress={businessToBusinessProgress}
          isBusinessMode={isBusinessMode}
        />

        {/* Spatial Projected DOM Hotspots overlaying the 3D scene */}
        <ApproachLabels
          visualActiveZone={visualActiveZone}
          onHoverZone={(zoneIdx) => {
            if (mode === "overview") setHoveredZone(zoneIdx);
          }}
          onSelectZone={(zoneIdx) => {
            const bizId = ZONE_TO_BUSINESS_ID[zoneIdx];
            if (bizId) enterBusiness(bizId);
          }}
          labelRefs={labelRefs}
          disabled={mode !== "overview"}
        />

        {/* Localized Warm Atmospheric Wash behind Left Content (Fades out on transition) */}
        <div
          className="hidden md:block absolute top-0 left-0 w-[520px] h-[650px] pointer-events-none z-5 transition-opacity duration-300"
          style={{
            opacity: headlineOpacity.toFixed(3),
            background:
              "radial-gradient(ellipse 75% 65% at 0% 28%, rgba(246, 243, 237, 0.82) 0%, rgba(246, 243, 237, 0.40) 55%, rgba(246, 243, 237, 0) 100%)",
          }}
        />

        {/* ----------------------------------------------------------------- */}
        {/* 3. Master Editorial Layout Grid (Overview State)                   */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="relative z-10 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 pointer-events-none transition-all duration-150"
          style={{
            pointerEvents: mode === "overview" ? "auto" : "none",
          }}
        >
          {/* LEFT: Eyebrow + 5-Line Editorial Headline */}
          <div
            className="w-full lg:w-[26%] xl:max-w-[310px] flex flex-col justify-start pointer-events-auto pl-1 lg:pl-3 transition-opacity duration-200"
            style={{ opacity: headlineOpacity.toFixed(3) }}
          >
            <div
              ref={eyebrowRef}
              className="flex items-center space-x-3 mb-2 sm:mb-3 will-change-transform"
            >
              <span className="w-[5px] h-[15px] bg-[#4A9342] rounded-full inline-block shrink-0" />
              <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.18em] uppercase text-[#54646A] font-semibold">
                {APPROACH_DATA.eyebrow}
              </p>
            </div>

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

          {/* CENTER: Open environmental negative space */}
          <div className="hidden lg:block lg:flex-1 h-12" aria-hidden="true" />

          {/* RIGHT: Supporting Body Copy & CTA */}
          <div
            className="w-full lg:w-[22%] xl:max-w-[280px] flex flex-col justify-start pt-1 sm:pt-2 pointer-events-auto ml-auto pr-2 lg:pr-6 transition-opacity duration-200"
            style={{ opacity: rightBodyOpacity.toFixed(3) }}
          >
            <div ref={bodyRef} className="will-change-transform">
              <p className="text-[14px] sm:text-[15px] leading-[1.6] font-normal text-[#38484E]">
                {APPROACH_DATA.body}
              </p>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                ref={ctaRef as React.RefObject<HTMLButtonElement>}
                onClick={() => enterBusiness("solar")}
                data-cursor="view-details"
                className="group inline-flex items-center space-x-2 text-[15px] font-medium text-[#132126] cursor-pointer will-change-transform border-b border-[#132126]/60 hover:border-[#132126] pb-0.5 transition-colors duration-300 focus:outline-none"
              >
                <span>{APPROACH_DATA.cta.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1 text-[#132126]" />
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 4. BOTTOM: Integrated Story Rail (Overview State)                  */}
        {/* ----------------------------------------------------------------- */}
        <div
          ref={railContainerRef}
          className="transition-opacity duration-200"
          style={{
            opacity: storyRailOpacity.toFixed(3),
            pointerEvents: mode === "overview" ? "auto" : "none",
          }}
        >
          <ApproachStoryRail
            progress={sectionProgress}
            visualActiveZone={visualActiveZone}
            onSeekProgress={handleSeekProgress}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 5. CINEMATIC BUSINESS DETAIL WORLD (Synchronized DOM UI)           */}
        {/* ----------------------------------------------------------------- */}
        {currentBusinessData && (
          <BusinessDetailUI
            business={currentBusinessData}
            opacity={businessUIOpacity}
            activeProcessStep={activeProcessStep}
            onSelectProcessStep={(stepIdx) => setActiveProcessStep(stepIdx)}
            onSwitchBusiness={switchBusiness}
            onBackToOverview={exitToOverview}
          />
        )}
      </div>
    </section>
  );
};
