"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { COMMITMENT_DATA } from "@/data/commitmentData";

interface CommitmentContentProps {
  progress: number; // 0.00 to 1.00
  reducedMotion: boolean;
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const CommitmentContent: React.FC<CommitmentContentProps> = ({
  progress,
  reducedMotion,
}) => {
  // 1. Eyebrow Reveal (0.20 -> 0.32)
  const eyebrowT = reducedMotion
    ? progress >= 0.15 ? 1 : 0
    : smoothstep(0.20, 0.32, progress);
  const eyebrowOpacity = eyebrowT;
  const eyebrowY = (1 - eyebrowT) * 12;

  // 2. Headline Line-by-Line Masked Reveal (0.26 -> 0.46)
  // Line 1: "A Cleaner" (0.26 -> 0.36)
  const l1T = reducedMotion ? (progress >= 0.22 ? 1 : 0) : smoothstep(0.26, 0.36, progress);
  // Line 2: "Tomorrow," (0.31 -> 0.41)
  const l2T = reducedMotion ? (progress >= 0.25 ? 1 : 0) : smoothstep(0.31, 0.41, progress);
  // Line 3: "Together." (0.36 -> 0.46)
  const l3T = reducedMotion ? (progress >= 0.28 ? 1 : 0) : smoothstep(0.36, 0.46, progress);

  // 3. Supporting Paragraph Reveal (0.38 -> 0.54)
  const bodyT = reducedMotion ? (progress >= 0.35 ? 1 : 0) : smoothstep(0.38, 0.54, progress);
  const bodyOpacity = bodyT;
  const bodyY = (1 - bodyT) * 14;

  // 4. CTA Reveal (0.48 -> 0.65)
  const ctaT = reducedMotion ? (progress >= 0.45 ? 1 : 0) : smoothstep(0.48, 0.65, progress);
  const ctaOpacity = ctaT;
  const ctaY = (1 - ctaT) * 16;

  return (
    <div className="w-full lg:w-[50%] xl:w-[46%] max-w-[620px] flex flex-col justify-start select-none z-20 pointer-events-auto">
      {/* 1. Small Eyebrow */}
      <div
        className="flex items-center space-x-3 mb-3 sm:mb-4 will-change-transform"
        style={{
          opacity: eyebrowOpacity,
          transform: `translate3d(0, ${eyebrowY}px, 0)`,
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#3D9E32] inline-block shrink-0 shadow-[0_0_8px_#78E070] animate-pulse" />
        <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.22em] uppercase text-[#D2E2E6] font-semibold">
          {COMMITMENT_DATA.eyebrow}
        </p>
      </div>

      {/* 2. Large Editorial Headline with Masked Reveals */}
      <h2
        className="font-editorial-heading text-[clamp(34px,5vw,84px)] font-normal tracking-[-0.035em] leading-[0.96] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
        aria-label="A Cleaner Tomorrow, Together."
      >
        {/* Line 1: A Cleaner */}
        <span className="line-mask-wrapper">
          <span
            className="block will-change-transform"
            style={{
              transform: `translate3d(0, ${(1 - l1T) * 105}%, 0)`,
              opacity: l1T,
            }}
          >
            {COMMITMENT_DATA.headline[0]}
          </span>
        </span>

        {/* Line 2: Tomorrow, */}
        <span className="line-mask-wrapper">
          <span
            className="block will-change-transform"
            style={{
              transform: `translate3d(0, ${(1 - l2T) * 105}%, 0)`,
              opacity: l2T,
            }}
          >
            {COMMITMENT_DATA.headline[1]}
          </span>
        </span>

        {/* Line 3: Together. (Convalt Green Accent) */}
        <span className="line-mask-wrapper">
          <span
            className="block will-change-transform text-[#78E070] drop-shadow-[0_0_24px_rgba(120,224,112,0.35)]"
            style={{
              transform: `translate3d(0, ${(1 - l3T) * 105}%, 0)`,
              opacity: l3T,
            }}
          >
            {COMMITMENT_DATA.headline[2]}
          </span>
        </span>
      </h2>

      {/* 3. Supporting Body Paragraph */}
      <div
        className="mt-3.5 sm:mt-5 will-change-transform"
        style={{
          opacity: bodyOpacity,
          transform: `translate3d(0, ${bodyY}px, 0)`,
        }}
      >
        <p className="text-[13.5px] sm:text-[15.5px] leading-[1.6] font-normal text-[#D2E2E6]/95 max-w-[480px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
          {COMMITMENT_DATA.body}
        </p>
      </div>

      {/* 4. Circular Arrow CTA */}
      <div
        className="mt-5 sm:mt-8 will-change-transform"
        style={{
          opacity: ctaOpacity,
          transform: `translate3d(0, ${ctaY}px, 0)`,
          pointerEvents: ctaOpacity > 0.1 ? "auto" : "none",
        }}
      >
        <a
          href={COMMITMENT_DATA.cta.href}
          data-cursor="hover"
          className="group inline-flex items-center space-x-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78E070] rounded-full p-1 -m-1 transition-all duration-300"
          aria-label="Let's Build A Cleaner Tomorrow"
        >
          {/* Circular Arrow Button Control */}
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-[#3D9E32]/80 bg-[#0E1A1A]/60 backdrop-blur-md shadow-[0_0_14px_rgba(61,158,50,0.25)] transition-all duration-300 group-hover:scale-108 group-hover:border-[#78E070] group-hover:shadow-[0_0_22px_rgba(120,224,112,0.45)] group-hover:bg-[#3D9E32]/15">
            <ArrowRight className="w-5 h-5 text-white transition-all duration-300 group-hover:text-[#78E070] group-hover:translate-x-1" />
          </div>

          {/* Two-Line CTA Label */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-white transition-colors duration-200 group-hover:text-[#78E070]">
              {COMMITMENT_DATA.cta.labelLine1}
            </span>
            <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-[#D2E2E6] transition-colors duration-200 group-hover:text-white">
              {COMMITMENT_DATA.cta.labelLine2}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
