"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { HERO_CHAPTERS } from "@/data/home";

interface HeroChapterNavProps {
  introReady: boolean;
  activeChapterIndex: number;
  scrollProgress: number; // 0.0 to 1.0
  onChapterClick: (index: number) => void;
}

export const HeroChapterNav: React.FC<HeroChapterNavProps> = ({
  introReady,
  activeChapterIndex,
  scrollProgress,
  onChapterClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const railProgressRef = useRef<HTMLDivElement>(null);
  const mobileLabelRef = useRef<HTMLSpanElement>(null);

  // Entrance animation at ~1.5s
  useEffect(() => {
    if (!introReady) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          delay: 1.2,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [introReady]);

  // Mobile label vertical slide animation on chapter change
  useEffect(() => {
    if (!mobileLabelRef.current) return;
    gsap.fromTo(
      mobileLabelRef.current,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [activeChapterIndex]);

  const currentChapter = HERO_CHAPTERS[activeChapterIndex] || HERO_CHAPTERS[0];

  return (
    <>
      {/* Desktop Vertical Narrative Rail */}
      <div
        ref={containerRef}
        className="opacity-0 hidden lg:flex fixed top-[21vh] right-[clamp(28px,4vw,64px)] z-30 pointer-events-auto select-none"
      >
        <div className="relative flex flex-row items-stretch">
          {/* Continuous Vertical Rail Line */}
          <div className="relative w-[1.5px] bg-white/28 mr-6 flex-shrink-0 self-stretch my-2 overflow-hidden rounded-full">
            {/* Continuous Progress Fill Line */}
            <div
              ref={railProgressRef}
              className="absolute inset-0 bg-white origin-top shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                transform: `scaleY(${Math.min(1, Math.max(0.06, scrollProgress))})`,
                transition: "transform 100ms ease-out",
              }}
            />
          </div>

          {/* Chapters List */}
          <div className="flex flex-col justify-between py-1 space-y-6 xl:space-y-8">
            {HERO_CHAPTERS.map((chapter, index) => {
              const isActive = activeChapterIndex === index;

              return (
                <button
                  key={chapter.id}
                  onClick={() => onChapterClick(index)}
                  className={`group text-left flex flex-col transition-all duration-350 focus:outline-none cursor-pointer ${
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-90"
                  }`}
                  aria-label={`Jump to chapter ${chapter.id}: ${chapter.navLabel}`}
                >
                  {/* Chapter Number */}
                  <span
                    className={`text-[10px] xl:text-[11px] font-mono tracking-widest transition-colors duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${
                      isActive ? "text-white font-bold" : "text-white/75"
                    }`}
                  >
                    {chapter.id}
                  </span>

                  {/* Chapter Title with horizontal micro-shift */}
                  <div className="mt-0.5 transform transition-transform duration-350 ease-out group-hover:translate-x-1">
                    <span
                      className={`block text-[11px] xl:text-[12px] uppercase tracking-wider leading-tight transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-white/80 group-hover:text-white"
                      }`}
                    >
                      {chapter.titleLine1}
                    </span>
                    {chapter.titleLine2 && (
                      <span
                        className={`block text-[11px] xl:text-[12px] uppercase tracking-wider leading-tight transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        {chapter.titleLine2}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Compact Progress Indicator with Masked Transition */}
      <div className="lg:hidden fixed top-[92px] right-6 z-30 pointer-events-none select-none flex items-center space-x-2 text-[11px] tracking-widest font-mono text-white bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <span className="font-bold text-white">{currentChapter.id}</span>
        <span className="opacity-40">/</span>
        <span className="opacity-60">05</span>
        <span className="mx-1 text-[#63A75B]">•</span>
        <div className="overflow-hidden inline-block">
          <span
            ref={mobileLabelRef}
            className="block text-[10px] font-sans uppercase font-medium tracking-wider text-white/95"
          >
            {currentChapter.titleLine1} {currentChapter.titleLine2 || ""}
          </span>
        </div>
      </div>
    </>
  );
};
