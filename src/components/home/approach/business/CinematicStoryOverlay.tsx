"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { APPROACH_DATA } from "@/data/home";
import { BUSINESS_DATA, CONCLUSION_DATA, STORY_CHAPTERS, BusinessProcessStep } from "./businessData";

interface CinematicStoryOverlayProps {
  progress: number; // 0.0 to 1.0
  onSeek: (targetProgress: number) => void;
}

// Compute smooth opacity and translateY based on entrance/exit progress windows
function computeCardMotion(
  currentP: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number
) {
  if (currentP < enterStart || currentP > exitEnd) {
    return { opacity: 0, translateY: 24, pointerEvents: "none" as const };
  }

  let opacity = 1.0;
  let translateY = 0;

  if (currentP < enterEnd) {
    const t = Math.min(1, Math.max(0, (currentP - enterStart) / (enterEnd - enterStart)));
    opacity = t * t * (3 - 2 * t);
    translateY = (1 - opacity) * 24;
  } else if (currentP > exitStart) {
    const t = Math.min(1, Math.max(0, (currentP - exitStart) / (exitEnd - exitStart)));
    opacity = 1 - t * t * (3 - 2 * t);
    translateY = -t * 20;
  }

  const pointerEvents = opacity > 0.1 ? ("auto" as const) : ("none" as const);
  return { opacity, translateY, pointerEvents };
}

export const CinematicStoryOverlay: React.FC<CinematicStoryOverlayProps> = ({
  progress,
  onSeek,
}) => {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDev = process.env.NODE_ENV !== "production";
      const hasDebugQuery = window.location.search.includes("debug");
      setShowDebug(isDev || hasDebugQuery);
    }
  }, []);

  // 1. Overview Approach Content (0.00 -> 0.16)
  const overviewMotion = useMemo(
    () => computeCardMotion(progress, 0.0, 0.02, 0.12, 0.17),
    [progress]
  );

  // 2. Solar Manufacturing Main Headline (0.17 -> 0.40)
  const solarMotion = useMemo(
    () => computeCardMotion(progress, 0.17, 0.21, 0.38, 0.41),
    [progress]
  );

  // Active Solar Process Step (0.25 -> 0.395)
  const activeProcess = useMemo((): { step: BusinessProcessStep; index: number } | null => {
    if (progress < 0.25 || progress > 0.395) return null;
    const steps = BUSINESS_DATA.solar.processSteps || [];
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (progress >= s.range[0] && progress <= s.range[1]) {
        return { step: s, index: i };
      }
    }
    // Fallback to closest if in transition boundary
    if (progress < 0.285) return { step: steps[0], index: 0 };
    if (progress < 0.32) return { step: steps[1], index: 1 };
    if (progress < 0.355) return { step: steps[2], index: 2 };
    return { step: steps[3], index: 3 };
  }, [progress]);

  // 3. Power Generation (0.40 -> 0.58)
  const powerMotion = useMemo(
    () => computeCardMotion(progress, 0.40, 0.44, 0.54, 0.58),
    [progress]
  );

  // 4. Data Centers (0.58 -> 0.76)
  const dataMotion = useMemo(
    () => computeCardMotion(progress, 0.58, 0.62, 0.72, 0.76),
    [progress]
  );

  // 5. Recycling (0.76 -> 0.92)
  const recyclingMotion = useMemo(
    () => computeCardMotion(progress, 0.76, 0.80, 0.88, 0.92),
    [progress]
  );

  // 6. Connected Conclusion (0.92 -> 1.00)
  const conclusionMotion = useMemo(
    () => computeCardMotion(progress, 0.92, 0.95, 1.0, 1.05),
    [progress]
  );

  const solarData = BUSINESS_DATA.solar;
  const powerData = BUSINESS_DATA.power;
  const dataCenterData = BUSINESS_DATA.data;
  const recyclingData = BUSINESS_DATA.recycling;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-20 flex flex-col justify-between pt-6 md:pt-10 pb-16">
      {/* ------------------------------------------------------------- */}
      {/* 0. OUR APPROACH OVERVIEW EDITORIAL STATE (0.00 -> 0.16)       */}
      {/* ------------------------------------------------------------- */}
      <div
        className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 transition-opacity duration-200"
        style={{
          opacity: overviewMotion.opacity,
          transform: `translateY(${overviewMotion.translateY}px)`,
          pointerEvents: overviewMotion.pointerEvents,
        }}
      >
        {/* LEFT: Eyebrow + 5-Line Editorial Headline */}
        <div className="w-full lg:w-[26%] xl:max-w-[310px] flex flex-col justify-start pl-1 lg:pl-3">
          <div className="flex items-center space-x-3 mb-2 sm:mb-3">
            <span className="w-[5px] h-[15px] bg-[#4A9342] rounded-full inline-block shrink-0 shadow-[0_0_8px_#4A9342]" />
            <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.18em] uppercase text-[#54646A] font-semibold">
              {APPROACH_DATA.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(28px,2.4vw,38px)] font-normal tracking-[-0.032em] leading-[1.04] text-[#132126]">
            {APPROACH_DATA.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* CENTER: Atmospheric breathing space */}
        <div className="hidden lg:block lg:flex-1 h-12" aria-hidden="true" />

        {/* RIGHT: Supporting Body Copy & Scroll Prompt */}
        <div className="w-full lg:w-[24%] xl:max-w-[300px] flex flex-col justify-start pt-1 sm:pt-2 ml-auto pr-2 lg:pr-6">
          <div>
            <p className="text-[14px] sm:text-[15px] leading-[1.6] font-normal text-[#38484E]">
              {APPROACH_DATA.body}
            </p>
          </div>

          <div className="mt-5 sm:mt-6 flex items-center space-x-2 text-[12px] font-mono tracking-widest uppercase text-[#132126]/70">
            <span>SCROLL TO ENTER ECOSYSTEM</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#3D9E32] animate-pulse" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SOLAR MANUFACTURING CHAPTER (0.17 -> 0.40)                */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-20 md:top-24 left-0 right-0 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-6 pointer-events-none"
        style={{
          opacity: solarMotion.opacity,
          transform: `translateY(${solarMotion.translateY}px)`,
          pointerEvents: solarMotion.pointerEvents,
        }}
      >
        {/* Left Safe Zone: Sky / Mountain negative space */}
        <div className="w-full lg:w-[48%] xl:max-w-[540px] flex flex-col justify-start pl-1 lg:pl-3">
          <div className="flex items-center space-x-3 mb-2.5 sm:mb-3">
            <span className="w-[5px] h-[15px] bg-[#3D9E32] rounded-full inline-block shrink-0 shadow-[0_0_10px_#3D9E32]" />
            <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.2em] uppercase text-[#78E070] font-semibold drop-shadow-md">
              {solarData.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(32px,3.4vw,54px)] font-normal tracking-[-0.03em] leading-[1.04] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            {solarData.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-4 text-[14px] sm:text-[15.5px] leading-[1.65] font-normal text-white/85 max-w-[420px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] bg-black/35 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            {solarData.body}
          </p>

          {/* Active Process Step Sub-Narrative Badge (Appears 0.25 -> 0.395) */}
          {activeProcess && (
            <div className="mt-4 bg-[#101A1D]/80 backdrop-blur-md border border-[#3D9E32]/40 rounded-xl p-3 sm:p-4 max-w-[440px] shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3D9E32] text-white">
                    STEP {activeProcess.step.num}
                  </span>
                  <span className="text-[12px] font-mono tracking-wider uppercase text-[#78E070]">
                    {activeProcess.step.title}
                  </span>
                </div>
                {/* 4-dot indicator */}
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3].map((dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                        dotIdx === activeProcess.index
                          ? "bg-[#78E070] scale-125"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[12.5px] sm:text-[13px] leading-[1.5] text-white/80">
                {activeProcess.step.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. POWER GENERATION CHAPTER (0.40 -> 0.58)                   */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-20 md:top-24 left-0 right-0 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-end pointer-events-none"
        style={{
          opacity: powerMotion.opacity,
          transform: `translateY(${powerMotion.translateY}px)`,
          pointerEvents: powerMotion.pointerEvents,
        }}
      >
        {/* Right Safe Zone: Open mountain sky corridor */}
        <div className="w-full lg:w-[46%] xl:max-w-[500px] flex flex-col justify-start pr-1 lg:pr-3 text-left">
          <div className="flex items-center space-x-3 mb-2.5 sm:mb-3">
            <span className="w-[5px] h-[15px] bg-[#4DA860] rounded-full inline-block shrink-0 shadow-[0_0_10px_#4DA860]" />
            <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.2em] uppercase text-[#78E070] font-semibold drop-shadow-md">
              {powerData.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(32px,3.4vw,54px)] font-normal tracking-[-0.03em] leading-[1.04] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            {powerData.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-4 text-[14px] sm:text-[15.5px] leading-[1.65] font-normal text-white/85 max-w-[420px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] bg-black/35 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            {powerData.body}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. DATA CENTERS CHAPTER (0.58 -> 0.76)                       */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-20 md:top-24 left-0 right-0 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between pointer-events-none"
        style={{
          opacity: dataMotion.opacity,
          transform: `translateY(${dataMotion.translateY}px)`,
          pointerEvents: dataMotion.pointerEvents,
        }}
      >
        {/* Left-Center Safe Zone */}
        <div className="w-full lg:w-[48%] xl:max-w-[520px] flex flex-col justify-start pl-1 lg:pl-3">
          <div className="flex items-center space-x-3 mb-2.5 sm:mb-3">
            <span className="w-[5px] h-[15px] bg-[#57C088] rounded-full inline-block shrink-0 shadow-[0_0_10px_#57C088]" />
            <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.2em] uppercase text-[#78E070] font-semibold drop-shadow-md">
              {dataCenterData.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(32px,3.4vw,54px)] font-normal tracking-[-0.03em] leading-[1.04] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            {dataCenterData.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-4 text-[14px] sm:text-[15.5px] leading-[1.65] font-normal text-white/85 max-w-[420px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] bg-black/35 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            {dataCenterData.body}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. RECYCLING CHAPTER (0.76 -> 0.92)                          */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-20 md:top-24 left-0 right-0 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between pointer-events-none"
        style={{
          opacity: recyclingMotion.opacity,
          transform: `translateY(${recyclingMotion.translateY}px)`,
          pointerEvents: recyclingMotion.pointerEvents,
        }}
      >
        {/* Left Safe Zone: Balanced against circular tanks */}
        <div className="w-full lg:w-[48%] xl:max-w-[520px] flex flex-col justify-start pl-1 lg:pl-3">
          <div className="flex items-center space-x-3 mb-2.5 sm:mb-3">
            <span className="w-[5px] h-[15px] bg-[#3D9E32] rounded-full inline-block shrink-0 shadow-[0_0_10px_#3D9E32]" />
            <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.2em] uppercase text-[#78E070] font-semibold drop-shadow-md">
              {recyclingData.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(32px,3.4vw,54px)] font-normal tracking-[-0.03em] leading-[1.04] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            {recyclingData.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-4 text-[14px] sm:text-[15.5px] leading-[1.65] font-normal text-white/85 max-w-[420px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] bg-black/35 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            {recyclingData.body}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. CONNECTED VALUE CHAIN CONCLUSION (0.92 -> 1.00)           */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-20 md:top-24 left-0 right-0 w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col items-center justify-center text-center pointer-events-none"
        style={{
          opacity: conclusionMotion.opacity,
          transform: `translateY(${conclusionMotion.translateY}px)`,
          pointerEvents: conclusionMotion.pointerEvents,
        }}
      >
        <div className="max-w-[680px] flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-3">
            <span className="w-[6px] h-[16px] bg-[#78E070] rounded-full inline-block shrink-0 shadow-[0_0_12px_#78E070]" />
            <p className="text-[12px] font-mono tracking-[0.22em] uppercase text-[#78E070] font-semibold drop-shadow-md">
              {CONCLUSION_DATA.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(34px,3.8vw,58px)] font-normal tracking-[-0.03em] leading-[1.05] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
            {CONCLUSION_DATA.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>

          <p className="mt-4 text-[14px] sm:text-[16px] leading-[1.65] font-normal text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 max-w-[580px]">
            {CONCLUSION_DATA.body}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEV PROGRESS DEBUG BAR (Section 44 Requirement)               */}
      {/* Allows quick inspection of any story checkpoint               */}
      {/* ------------------------------------------------------------- */}
      {showDebug && (
        <div className="fixed top-3 right-4 z-50 pointer-events-auto bg-black/85 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 flex items-center space-x-1.5 shadow-2xl">
          <span className="text-[10px] font-mono text-white/50 mr-1 hidden sm:inline">
            STORY DEBUG:
          </span>
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((stepP) => {
            const pct = Math.round(stepP * 100);
            const isNear = Math.abs(progress - stepP) < 0.05;
            return (
              <button
                key={pct}
                type="button"
                onClick={() => onSeek(stepP)}
                className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors duration-150 ${
                  isNear
                    ? "bg-[#3D9E32] text-white font-bold"
                    : "text-white/60 hover:text-white hover:bg-white/15"
                }`}
                title={`Seek to ${pct}%`}
              >
                {pct}%
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
