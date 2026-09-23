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
  if (visualActiveZone === "all" || progress >= 0.88) {
    activeIndex = 4; // Full Ecosystem
  } else if (visualActiveZone !== null && typeof visualActiveZone === "number") {
    activeIndex = visualActiveZone;
  } else if (progress < 0.35) {
    activeIndex = 0; // Solar Manufacturing
  } else if (progress < 0.56) {
    activeIndex = 1; // Power Generation
  } else if (progress < 0.76) {
    activeIndex = 2; // Data Centers
  } else if (progress < 0.88) {
    activeIndex = 3; // Recycling
  } else {
    activeIndex = 4; // Full Ecosystem
  }

  const railLabels = [
    { num: "01", label: "SOLAR MANUFACTURING", progressTarget: 0.18, percent: 0 },
    { num: "02", label: "POWER GENERATION", progressTarget: 0.45, percent: 25 },
    { num: "03", label: "DATA CENTERS", progressTarget: 0.66, percent: 50 },
    { num: "04", label: "RECYCLING", progressTarget: 0.82, percent: 75 },
    { num: "05", label: "FULL ECOSYSTEM", progressTarget: 0.94, percent: 100 },
  ];

  // Active track width: flows in real time with scroll progress, or jumps on hover
  const activeTrackWidth =
    visualActiveZone !== null && typeof visualActiveZone === "number"
      ? (visualActiveZone / 4) * 100
      : visualActiveZone === "all"
      ? 100
      : realtimePercent;

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. Environmental Dark Atmospheric Gradient at Bottom          */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute bottom-0 inset-x-0 h-[38vh] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,26,26,0) 0%, rgba(14,26,26,0.72) 30%, rgba(14,26,26,0.96) 70%, #0E1A1A 100%)",
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* 2. Lower Story Rail & Real-Time Interactive Timeline          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pb-3 select-none">
        {/* Title + Realtime Progress Line Row */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-3">
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
                width: `calc(${Math.min(100, Math.max(0, activeTrackWidth))}% - ${(
                  (Math.min(100, Math.max(0, activeTrackWidth)) / 100) *
                  48
                ).toFixed(1)}px)`,
              }}
            />

            {/* 5 Real-Time Progress Nodes with Labels Below */}
            <div className="relative w-full flex justify-between items-start">
              {railLabels.map((node, idx) => {
                const isActive = activeIndex === idx;
                const isPassed =
                  realtimePercent >= node.percent || activeIndex >= idx;

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
                    <div className="mt-1.5 text-center whitespace-nowrap">
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
        {/* ----------------------------------------------------------- */}
        <div className="hidden md:grid grid-cols-5 gap-3 lg:gap-4">
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
                <div className="relative w-full h-[120px] lg:h-[135px] xl:h-[142px] bg-[#0E1A1A]">
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
                        isChapterActive
                          ? "text-[#3D9E32]"
                          : "text-[#5A9E4B]"
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

        {/* ----------------------------------------------------------- */}
        {/* 4. Mobile: Single Active Chapter Card (< 768px)             */}
        {/* ----------------------------------------------------------- */}
        <div className="md:hidden w-full px-2 mt-2">
          <div className="relative w-full h-[110px] rounded-lg overflow-hidden ring-1 ring-[#3D9E32]">
            <Image
              src={chapters[activeIndex]?.image || chapters[0].image}
              alt={chapters[activeIndex]?.title || chapters[0].title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#3D9E32] font-bold">
                0{activeIndex + 1} / 05 &bull; {chapters[activeIndex]?.shortName}
              </span>
              <p className="text-[13px] font-medium text-white line-clamp-1">
                {chapters[activeIndex]?.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
