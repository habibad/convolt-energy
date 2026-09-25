"use client";

import React from "react";
import Image from "next/image";
import { APPROACH_DATA, ApproachChapter } from "@/data/home";

interface StoryRailProps {
  progress: number;
  visualActiveZone: number | "all" | null;
  onSeekProgress: (progressTarget: number) => void;
}

export const ApproachStoryRail: React.FC<StoryRailProps> = ({
  progress,
  visualActiveZone,
  onSeekProgress,
}) => {
  const chapters = APPROACH_DATA.chapters;

  // Real-time progress percentage (0% to 100%)
  const realtimePercent = Math.max(0, Math.min(100, progress * 100));

  // Determine current active chapter index (0 to 4)
  let activeIndex = 0;
  if (progress >= 0.92) {
    activeIndex = 4; // Full Ecosystem
  } else if (progress >= 0.76) {
    activeIndex = 3; // Recycling
  } else if (progress >= 0.58) {
    activeIndex = 2; // Data Centers
  } else if (progress >= 0.40) {
    activeIndex = 1; // Power Generation
  } else {
    activeIndex = 0; // Solar Manufacturing
  }

  const railLabels = [
    { num: "01", label: "SOLAR MANUFACTURING", progressTarget: 0.22, percent: 20 },
    { num: "02", label: "POWER GENERATION", progressTarget: 0.48, percent: 42 },
    { num: "03", label: "DATA CENTERS", progressTarget: 0.66, percent: 62 },
    { num: "04", label: "RECYCLING", progressTarget: 0.83, percent: 80 },
    { num: "05", label: "ECOSYSTEM", progressTarget: 0.96, percent: 95 },
  ];

  // Storyboard cards are visible during initial Overview (<= 0.16) and final Conclusion (>= 0.92)
  // Hidden during deep business travel (0.18 - 0.90) so 3D facilities have full visual breathing room
  let cardsOpacity = 1.0;
  if (progress > 0.12 && progress < 0.20) {
    cardsOpacity = Math.max(0, 1 - (progress - 0.12) / 0.08);
  } else if (progress >= 0.20 && progress < 0.92) {
    cardsOpacity = 0.0;
  } else if (progress >= 0.92) {
    cardsOpacity = Math.min(1, (progress - 0.92) / 0.06);
  }

  return (
    <>
      {/* 1. Environmental Dark Atmospheric Gradient at Bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-[28vh] pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,26,26,0) 0%, rgba(14,26,26,0.60) 40%, rgba(14,26,26,0.95) 100%)",
          opacity: cardsOpacity > 0 ? 0.9 : 0.4,
        }}
      />

      {/* 2. Lower Story Rail & Real-Time Interactive Timeline */}
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pb-3 select-none">
        {/* Title + Realtime Progress Line Row */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2.5">
          {/* Bottom-Left Title: THE INTEGRATED VALUE CHAIN */}
          <div className="pl-1 md:pl-2 shrink-0 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#3D9E32] animate-pulse" />
            <p className="text-[10.5px] sm:text-[11.5px] font-mono tracking-[0.16em] uppercase text-[#D2E2E6] font-semibold drop-shadow-sm">
              THE INTEGRATED VALUE CHAIN
            </p>
          </div>

          {/* Real-time Horizontal Progress Line across middle viewport */}
          <div className="hidden md:flex flex-1 max-w-[980px] mx-auto items-center relative px-6">
            {/* Background Inactive Track */}
            <div className="absolute top-[6px] left-6 right-6 h-[2px] bg-white/20 rounded-full" />

            {/* Real-time Active Glowing Track Line */}
            <div
              className="absolute top-[6px] left-6 h-[2.5px] bg-[#3D9E32] rounded-full shadow-[0_0_10px_#3D9E32] transition-all duration-150 ease-out"
              style={{
                width: `calc(${Math.min(100, Math.max(0, realtimePercent))}% - ${(
                  (Math.min(100, Math.max(0, realtimePercent)) / 100) *
                  48
                ).toFixed(1)}px)`,
              }}
            />

            {/* 5 Real-Time Progress Nodes with Labels Below */}
            <div className="relative w-full flex justify-between items-start">
              {railLabels.map((node, idx) => {
                const isActive = activeIndex === idx;
                const isPassed = realtimePercent >= node.percent || activeIndex >= idx;

                return (
                  <button
                    key={node.num}
                    type="button"
                    onClick={() => onSeekProgress(node.progressTarget)}
                    className="group flex flex-col items-center cursor-pointer focus:outline-none z-10 transition-transform duration-200 hover:scale-110"
                    aria-label={`Jump to ${node.label}`}
                  >
                    {/* Circular Node with Ripple on Active */}
                    <div className="relative flex items-center justify-center w-3.5 h-3.5">
                      {isActive && (
                        <span className="absolute w-6 h-6 rounded-full bg-[#3D9E32]/35 animate-ping pointer-events-none" />
                      )}
                      <span
                        className={`rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-3 h-3 bg-[#3D9E32] ring-2 ring-white shadow-[0_0_12px_#3D9E32] scale-110"
                            : isPassed
                            ? "w-2.5 h-2.5 bg-[#3D9E32] shadow-[0_0_6px_rgba(61,158,50,0.8)]"
                            : "w-2.5 h-2.5 bg-[#0E1A1A] border-2 border-white/40 group-hover:border-white/80"
                        }`}
                      />
                    </div>

                    {/* Node Metadata Below */}
                    <div className="mt-1 text-center whitespace-nowrap">
                      <span
                        className={`block text-[9px] sm:text-[10px] font-mono tracking-[0.10em] uppercase transition-all duration-300 ${
                          isActive
                            ? "text-[#4ADE80] font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                            : isPassed
                            ? "text-[#E0EBE8] font-medium"
                            : "text-[#889FA3] group-hover:text-[#FFFFFF]"
                        }`}
                      >
                        {node.num}&nbsp;&nbsp;{node.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 3. Desktop: 5 Real-Time Synced Storyboard Frames            */}
        {/* (Visually prominent in Overview & Conclusion)               */}
        {/* ----------------------------------------------------------- */}
        <div
          className="hidden md:grid grid-cols-5 gap-3 lg:gap-4 transition-all duration-300"
          style={{
            opacity: cardsOpacity,
            pointerEvents: cardsOpacity > 0.1 ? "auto" : "none",
            transform: `translateY(${(1 - cardsOpacity) * 20}px)`,
          }}
        >
          {chapters.map((ch: ApproachChapter) => {
            const isChapterActive = activeIndex === ch.index;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSeekProgress(ch.progressStart)}
                className={`group relative text-left rounded-[4px] overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none ${
                  isChapterActive
                    ? "ring-1.5 ring-[#3D9E32] shadow-[0_0_14px_rgba(61,158,50,0.35)] opacity-100 z-10"
                    : "ring-1 ring-white/10 hover:ring-white/30 opacity-70 hover:opacity-100 z-0"
                }`}
              >
                {/* 16:9 Landscape Cinematic Frame */}
                <div className="relative w-full h-[115px] lg:h-[128px] xl:h-[135px] bg-[#0E1A1A]">
                  <Image
                    src={ch.image}
                    alt={ch.title}
                    fill
                    sizes="(max-width: 1536px) 20vw, 300px"
                    className={`object-cover transition-transform duration-500 ease-out ${
                      isChapterActive ? "scale-102" : "group-hover:scale-102"
                    }`}
                  />

                  {/* Dark gradient overlay for bottom caption contrast */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isChapterActive
                        ? "bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                        : "bg-gradient-to-t from-black/80 via-black/35 to-transparent"
                    }`}
                  />

                  {/* Caption at bottom inside frame */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 flex items-center space-x-2 z-10">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isChapterActive ? "text-[#3D9E32]" : "text-[#5A9E4B]"
                      }`}
                    >
                      {ch.num}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[10.5px] font-mono tracking-[0.08em] uppercase truncate drop-shadow-sm transition-colors duration-300 ${
                        isChapterActive
                          ? "text-white font-semibold"
                          : "text-[#D2E2E6] font-medium"
                      }`}
                    >
                      {ch.index === 4 ? "ONE INTEGRATED VALUE CHAIN" : ch.title}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
