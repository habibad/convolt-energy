"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { HeroHeader } from "./HeroHeader";
import { HeroContent } from "./HeroContent";
import { HeroChapterNav } from "./HeroChapterNav";
import { HeroScrollCue } from "./HeroScrollCue";
import { HeroCanvas } from "./HeroCanvas";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO_CHAPTERS } from "@/data/home";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Discrete Active Chapter (0 to 4)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapterIndexRef = useRef(0);

  // WebGL Transition Indices & Blend Ratio
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(0);
  const [mixRatio, setMixRatio] = useState(0);

  // Continuous Scroll & Intro State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);
  const [debugEffects, setDebugEffects] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("debug=webgl")) {
      setDebugEffects(true);
    }
  }, []);

  const pointerCoords = usePointerParallax(0.06);
  const reducedMotion = useReducedMotion();

  // 1. Initialize Lenis Smooth Scrolling & GSAP ScrollTrigger Synchronization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 2. Cinematic Phased Intro Choreography (0.0s to ~2.0s)
  useEffect(() => {
    if (reducedMotion) {
      setIntroReady(true);
      setIntroProgress(1.0);
      return;
    }

    const introObj = { progress: 0 };

    const introTl = gsap.timeline({
      onComplete: () => {
        setIntroReady(true);
      },
    });

    introTl.to(introObj, {
      progress: 1.0,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        setIntroProgress(introObj.progress);
      },
    });

    const timer = setTimeout(() => {
      setIntroReady(true);
    }, 350);

    return () => {
      introTl.kill();
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  // 3. Hero ScrollTrigger Master Timeline (~500vh total scroll distance)
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          setScrollProgress(p);

          const chapterCount = HERO_CHAPTERS.length; // 5

          // Divide scroll progress into 5 equal chapter bands
          const floatBand = p * chapterCount; // 0.0 to 5.0
          const bandIndex = Math.min(chapterCount - 1, Math.floor(floatBand));
          const bandProgress = floatBand - bandIndex; // 0.0 to 1.0 within chapter band

          let localP = bandProgress;
          let fIdx = bandIndex;
          let tIdx = Math.min(bandIndex + 1, chapterCount - 1);
          let mix = 0;

          if (bandIndex < chapterCount - 1) {
            // For chapters 0, 1, 2, 3:
            // 0.0 - 0.70: Steady Hold period
            // 0.70 - 1.00: Smooth crossfade transition toward next chapter
            if (bandProgress > 0.70) {
              const norm = (bandProgress - 0.70) / 0.30;
              mix = norm * norm * (3 - 2 * norm); // smoothstep curve
            }
          } else {
            // Chapter 4 (Scene 05): localProgress continues cleanly 0.0 -> 1.0 through its final scroll range
            localP = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
            fIdx = 4;
            tIdx = 4;
            mix = 0;
          }

          // Active Chapter Index: transitions when mix passes 0.50 (midpoint of transition)
          const activeIdx =
            mix >= 0.50 && bandIndex < chapterCount - 1 ? bandIndex + 1 : bandIndex;

          if (activeIdx !== activeChapterIndexRef.current) {
            activeChapterIndexRef.current = activeIdx;
            setActiveChapterIndex(activeIdx);
          }

          const rawVel = typeof self.getVelocity === "function" ? self.getVelocity() : 0;
          const clampedVel = Math.max(-1, Math.min(1, rawVel / 3000));

          setFromIndex(fIdx);
          setToIndex(tIdx);
          setMixRatio(mix);
          setLocalProgress(localP);
          setScrollVelocity(clampedVel);
        },
      });

      scrollTriggerRef.current = st;
    }, containerRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
      scrollTriggerRef.current = null;
    };
  }, []);

  // Smooth scroll down when Explore or ScrollCue is clicked
  const handleExploreClick = () => {
    if (!containerRef.current || !scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    // Advance into chapter 02 hold zone
    const targetProgress = 0.27;
    const targetScroll = st.start + (st.end - st.start) * targetProgress;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, { duration: 1.4 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  // Timeline click navigation (smoothly scrolls to chapter hold position)
  const handleChapterClick = (index: number) => {
    if (!scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    const chapterCount = HERO_CHAPTERS.length;

    // Target midpoint of hold period within that chapter band
    const targetProgress = (index + 0.35) / chapterCount;
    const targetScroll = st.start + (st.end - st.start) * targetProgress;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetScroll, { duration: 1.4 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  const handleChapterLearnMore = (slug: string) => {
    console.log(`Explore chapter details: ${slug}`);
  };

  const activeChapter = HERO_CHAPTERS[activeChapterIndex] || HERO_CHAPTERS[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] sm:h-[450vh] lg:h-[500vh] bg-[#101A1D]"
    >
      {/* Sticky Viewport Stage: 100vw, 100svh, min-height 760px desktop */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-[100svh] min-h-[760px] overflow-hidden select-none"
      >
        {/* Transparent Header with dynamic chapter theme */}
        <HeroHeader introReady={introReady} theme={activeChapter.theme} />

        {/* 3D WebGL Canvas Layer with 5-chapter crossfading */}
        <HeroCanvas
          fromIndex={fromIndex}
          toIndex={toIndex}
          mixRatio={mixRatio}
          localProgress={localProgress}
          activeIndex={activeChapterIndex}
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          scrollProgress={scrollProgress}
          scrollVelocity={scrollVelocity}
          introProgress={introProgress}
          reducedMotion={reducedMotion}
        />

        {/* Temporary WebGL Debug Overlay (enabled via ?debug=webgl) */}
        {debugEffects && (
          <div className="absolute top-24 left-6 z-50 pointer-events-none bg-black/85 border border-white/20 text-[#F4F3EF] px-3.5 py-2.5 rounded-lg font-mono text-[11px] backdrop-blur-md shadow-2xl flex flex-col gap-1">
            <div className="font-semibold text-emerald-400">
              [DEBUG] WebGL Scene 0{activeChapterIndex + 1}: {HERO_CHAPTERS[activeChapterIndex]?.navLabel}
            </div>
            <div>LocalProgress: {localProgress.toFixed(3)} | Blend uMix: {mixRatio.toFixed(3)}</div>
            <div>ScrollProgress: {scrollProgress.toFixed(3)} | Velocity: {scrollVelocity.toFixed(3)}</div>
            <div>Active Blend: Ch 0{fromIndex + 1} &rarr; Ch 0{toIndex + 1}</div>
          </div>
        )}

        {/* Local Readability Gradient (tailored per chapter, smooth crossfade) */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-[55%] pointer-events-none z-10 opacity-90 transition-all duration-700 ease-out"
          style={{
            background: activeChapter.gradient,
          }}
        />

        {/* Bottom soft dark gradient for foreground labels */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(0deg, rgba(16,26,29,0.7) 0%, rgba(16,26,29,0.2) 50%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* Right subtle darkening gradient for timeline rail readability */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 w-36 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(270deg, rgba(16,26,29,0.35) 0%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* Hero Dynamic Editorial Content with Masked Transitions */}
        <HeroContent
          introReady={introReady}
          activeChapter={activeChapter}
          scrollProgress={scrollProgress}
          onExploreClick={handleExploreClick}
          onChapterLearnMore={handleChapterLearnMore}
        />

        {/* Right Story Chapter Navigation Rail */}
        <HeroChapterNav
          introReady={introReady}
          activeChapterIndex={activeChapterIndex}
          scrollProgress={scrollProgress}
          onChapterClick={handleChapterClick}
        />

        {/* Bottom-Right Scroll Discovery Interaction (fades out past Scene 01) */}
        <HeroScrollCue
          introReady={introReady}
          scrollProgress={scrollProgress}
          onClick={handleExploreClick}
        />

        {/* End-of-Hero subtle narrative complete indicator */}
        {scrollProgress > 0.95 && (
          <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none items-center animate-in fade-in duration-300">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#F4F3EF]/85 bg-black/60 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-lg">
              Circular Value Chain &bull; Final Chapter
            </span>
          </div>
        )}
      </div>

      {/* Target anchor for next homepage section */}
      <div id="hero-end-anchor" className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none" />
    </div>
  );
};
