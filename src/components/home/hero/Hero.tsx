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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Unified Scroll & Intro State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const [introProgress, setIntroProgress] = useState(0); // 0.0 to 1.0
  const [selectedChapterId, setSelectedChapterId] = useState("01");

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

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
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

    // Phase 01 (0.0s) -> Phase 02 (0.2s–1.2s): Fog clears, camera pulls back
    introTl.to(introObj, {
      progress: 1.0,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        setIntroProgress(introObj.progress);
      },
    });

    // Mark intro ready at ~0.35s to initiate DOM reveals smoothly
    const timer = setTimeout(() => {
      setIntroReady(true);
    }, 350);

    return () => {
      introTl.kill();
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  // 3. Hero ScrollTrigger Master Timeline (160vh total scroll distance)
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          setScrollProgress(parseFloat(self.progress.toFixed(4)));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll down to discover when Explore or ScrollCue is clicked
  const handleExploreClick = () => {
    if (!containerRef.current) return;
    const targetScroll = containerRef.current.offsetTop + window.innerHeight * 0.75;
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[165vh] bg-[#101A1D]"
    >
      {/* Sticky Viewport Container: 100vw, 100svh, min-height 760px desktop */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-[100svh] min-h-[760px] overflow-hidden select-none"
      >
        {/* Transparent Header */}
        <HeroHeader introReady={introReady} />

        {/* 3D WebGL Canvas Layer */}
        <HeroCanvas
          pointerX={pointerCoords.x}
          pointerY={pointerCoords.y}
          scrollProgress={scrollProgress}
          introProgress={introProgress}
          selectedChapterId={selectedChapterId}
          reducedMotion={reducedMotion}
        />

        {/* Local Readability Gradients (Section 26) - Never darkening the entire hero */}
        {/* Left Side soft off-white atmospheric gradient behind text */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-[55%] pointer-events-none z-10 opacity-90 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, rgba(245,244,239,0.78) 0%, rgba(245,244,239,0.36) 38%, rgba(245,244,239,0) 70%)",
          }}
        />

        {/* Bottom soft dark gradient for foreground labels */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(0deg, rgba(16,26,29,0.65) 0%, rgba(16,26,29,0.2) 50%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* Right subtle darkening gradient for timeline rail readability */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(270deg, rgba(16,26,29,0.25) 0%, rgba(16,26,29,0) 100%)",
          }}
        />

        {/* Hero Editorial Content */}
        <HeroContent
          introReady={introReady}
          scrollProgress={scrollProgress}
          onExploreClick={handleExploreClick}
        />

        {/* Right Story Chapter Navigation Rail */}
        <HeroChapterNav
          introReady={introReady}
          activeChapterId={selectedChapterId}
          onChapterSelect={handleChapterSelect}
          scrollProgress={scrollProgress}
        />

        {/* Bottom-Right Scroll Discovery Interaction */}
        <HeroScrollCue
          introReady={introReady}
          scrollProgress={scrollProgress}
          onClick={handleExploreClick}
        />

        {/* Phase 02 Transition Hook Indicator (shown only near end of hero scroll) */}
        {scrollProgress > 0.88 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center animate-in fade-in duration-300">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#F4F3EF]/70 bg-black/40 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              Phase 01 Complete — Chapter 02 Ready
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
