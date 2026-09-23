"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface Chapter {
  id: string;
  number: string;
  titleLine1: string;
  titleLine2?: string;
}

interface HeroChapterNavProps {
  introReady: boolean;
  activeChapterId?: string;
  onChapterSelect?: (id: string) => void;
  scrollProgress?: number;
}

const CHAPTERS: Chapter[] = [
  { id: "01", number: "01", titleLine1: "A CLEANER", titleLine2: "TOMORROW" },
  { id: "02", number: "02", titleLine1: "SOLAR", titleLine2: "MANUFACTURING" },
  { id: "03", number: "03", titleLine1: "POWER", titleLine2: "GENERATION" },
  { id: "04", number: "04", titleLine1: "DATA", titleLine2: "CENTERS" },
  { id: "05", number: "05", titleLine1: "RECYCLING" },
];

export const HeroChapterNav: React.FC<HeroChapterNavProps> = ({
  introReady,
  activeChapterId = "01",
  onChapterSelect,
  scrollProgress = 0,
}) => {
  const [selectedId, setSelectedId] = useState(activeChapterId);
  const containerRef = useRef<HTMLDivElement>(null);
  const railProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedId(activeChapterId);
  }, [activeChapterId]);

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

  const handleSelect = (chapter: Chapter) => {
    setSelectedId(chapter.id);
    if (onChapterSelect) {
      onChapterSelect(chapter.id);
    }
  };

  const activeIndex = CHAPTERS.findIndex((c) => c.id === selectedId);
  const segmentHeight = 100 / CHAPTERS.length;
  const progressHeight = Math.min(
    100,
    (activeIndex + (selectedId === "01" ? scrollProgress * 0.8 : 1)) * segmentHeight
  );

  const currentChapter = CHAPTERS.find((c) => c.id === selectedId) || CHAPTERS[0];

  return (
    <>
      {/* Desktop Vertical Narrative Rail */}
      <div
        ref={containerRef}
        className="opacity-0 hidden lg:flex fixed top-[21vh] right-[clamp(28px,4vw,64px)] z-30 pointer-events-auto select-none"
      >
        <div className="relative flex flex-row items-stretch">
          {/* Vertical Rail Line (1px white/neutral, opacity .35) */}
          <div className="relative w-[1px] bg-white/35 mr-6 flex-shrink-0 self-stretch my-2">
            {/* Active Highlight Segment (1-2px brighter) */}
            <div
              ref={railProgressRef}
              className="absolute top-0 left-[-0.5px] w-[2px] bg-white transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              style={{ height: `${Math.max(16, progressHeight)}%` }}
            />
          </div>

          {/* Chapters List */}
          <div className="flex flex-col justify-between py-1 space-y-6 xl:space-y-8">
            {CHAPTERS.map((chapter) => {
              const isActive = selectedId === chapter.id;

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleSelect(chapter)}
                  className={`group text-left flex flex-col transition-all duration-350 focus:outline-none cursor-pointer ${
                    isActive ? "opacity-100" : "opacity-55 hover:opacity-100"
                  }`}
                >
                  {/* Chapter Number (10-11px) */}
                  <span
                    className={`text-[10px] xl:text-[11px] font-mono tracking-widest transition-colors duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${
                      isActive ? "text-white font-bold" : "text-white/75"
                    }`}
                  >
                    {chapter.number}
                  </span>

                  {/* Chapter Title (11-12px) with horizontal micro-shift */}
                  <div className="mt-0.5 transform transition-transform duration-350 ease-out group-hover:translate-x-1">
                    <span
                      className={`block text-[11px] xl:text-[12px] uppercase tracking-wider leading-tight transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-white/80 group-hover:text-white"
                      }`}
                    >
                      {chapter.titleLine1}
                    </span>
                    {chapter.titleLine2 && (
                      <span
                        className={`block text-[11px] xl:text-[12px] uppercase tracking-wider leading-tight transition-colors duration-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] ${
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

      {/* Mobile/Tablet Compact Progress Indicator */}
      <div className="lg:hidden fixed top-[92px] right-6 z-30 pointer-events-none select-none flex items-center space-x-2 text-[11px] tracking-widest font-mono text-white bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <span className="font-bold text-white">{currentChapter.number}</span>
        <span className="opacity-40">/</span>
        <span className="opacity-60">05</span>
        <span className="mx-1 text-[#63A75B]">•</span>
        <span className="text-[10px] font-sans uppercase font-medium tracking-wider text-white/90">
          {currentChapter.titleLine1} {currentChapter.titleLine2 || ""}
        </span>
      </div>
    </>
  );
};
