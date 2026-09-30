"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { FINAL_CTA_DATA } from "@/data/finalCtaData";

interface FinalCTAContentProps {
  progress: number; // 0.00 to 1.00
  reducedMotion: boolean;
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const FinalCTAContent: React.FC<FinalCTAContentProps> = ({
  progress,
  reducedMotion,
}) => {
  // 1. Eyebrow Reveal (0.12 -> 0.24)
  const eyebrowT = reducedMotion
    ? progress >= 0.10 ? 1 : 0
    : smoothstep(0.12, 0.24, progress);
  const eyebrowOpacity = eyebrowT;
  const eyebrowY = (1 - eyebrowT) * 10;

  // 2. Headline Line-by-Line Reveal (0.20 -> 0.42)
  // Line 1: "Let's Build" (0.20 -> 0.32)
  const l1T = reducedMotion ? (progress >= 0.18 ? 1 : 0) : smoothstep(0.20, 0.32, progress);
  // Line 2: "What's Next." (0.28 -> 0.42)
  const l2T = reducedMotion ? (progress >= 0.22 ? 1 : 0) : smoothstep(0.28, 0.42, progress);

  // 3. Supporting Paragraph (0.36 -> 0.50)
  const bodyT = reducedMotion ? (progress >= 0.30 ? 1 : 0) : smoothstep(0.36, 0.50, progress);
  const bodyOpacity = bodyT;
  const bodyY = (1 - bodyT) * 12;

  // 4. CTA Button (0.45 -> 0.62)
  const ctaT = reducedMotion ? (progress >= 0.38 ? 1 : 0) : smoothstep(0.45, 0.62, progress);
  const ctaOpacity = ctaT;
  const ctaY = (1 - ctaT) * 14;

  // 5. Right Principles Staggered (0.50 -> 0.68)
  const principles = FINAL_CTA_DATA.principles;

  return (
    <div className="relative w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-8 pt-6 sm:pt-10 z-20 pointer-events-auto select-none">
      {/* ------------------------------------------------------------- */}
      {/* LEFT: Eyebrow + Masked Headline + Body + CTA                  */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full lg:w-[54%] xl:w-[50%] max-w-[620px] flex flex-col justify-start">
        {/* Eyebrow */}
        <div
          className="flex items-center space-x-2.5 mb-3 sm:mb-4 will-change-transform"
          style={{
            opacity: eyebrowOpacity,
            transform: `translate3d(0, ${eyebrowY}px, 0)`,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#3D9E32] inline-block shrink-0 shadow-[0_0_8px_#78E070] animate-pulse" />
          <p className="text-[10.5px] sm:text-[11.5px] font-mono tracking-[0.22em] uppercase text-[#D2E2E6] font-semibold">
            {FINAL_CTA_DATA.eyebrow}
          </p>
        </div>

        {/* Editorial Headline */}
        <h2
          className="font-editorial-heading text-[clamp(42px,5.2vw,86px)] font-normal tracking-[-0.035em] leading-[0.96] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
          aria-label="Let's Build What's Next."
        >
          {/* Line 1: Let's Build */}
          <span className="line-mask-wrapper">
            <span
              className="block will-change-transform"
              style={{
                transform: `translate3d(0, ${(1 - l1T) * 105}%, 0)`,
                opacity: l1T,
              }}
            >
              {FINAL_CTA_DATA.headline[0]}
            </span>
          </span>

          {/* Line 2: What's Next. ("Next." in Convalt Green #78E070) */}
          <span className="line-mask-wrapper">
            <span
              className="block will-change-transform"
              style={{
                transform: `translate3d(0, ${(1 - l2T) * 105}%, 0)`,
                opacity: l2T,
              }}
            >
              What&apos;s{" "}
              <span className="text-[#78E070] drop-shadow-[0_0_24px_rgba(120,224,112,0.35)]">
                Next.
              </span>
            </span>
          </span>
        </h2>

        {/* Supporting Copy */}
        <div
          className="mt-4 sm:mt-5 will-change-transform"
          style={{
            opacity: bodyOpacity,
            transform: `translate3d(0, ${bodyY}px, 0)`,
          }}
        >
          <p className="text-[14px] sm:text-[15.5px] leading-[1.65] font-normal text-[#D2E2E6]/95 max-w-[460px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            {FINAL_CTA_DATA.body}
          </p>
        </div>

        {/* Circular Arrow CTA */}
        <div
          className="mt-6 sm:mt-8 will-change-transform"
          style={{
            opacity: ctaOpacity,
            transform: `translate3d(0, ${ctaY}px, 0)`,
            pointerEvents: ctaOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <a
            href={FINAL_CTA_DATA.cta.href}
            data-cursor="hover"
            className="group inline-flex items-center space-x-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78E070] rounded-full p-1 -m-1 transition-all duration-300"
            aria-label="Let's Connect — Explore Opportunities Together"
          >
            {/* Outlined Circle Button */}
            <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#3D9E32]/80 bg-[#081214]/60 backdrop-blur-md shadow-[0_0_14px_rgba(61,158,50,0.25)] transition-all duration-300 group-hover:scale-108 group-hover:border-[#78E070] group-hover:shadow-[0_0_22px_rgba(120,224,112,0.45)] group-hover:bg-[#3D9E32]/15">
              <ArrowRight className="w-5 h-5 text-white transition-all duration-300 group-hover:text-[#78E070] group-hover:translate-x-1" />
            </div>

            {/* Label Stack */}
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] sm:text-[12px] font-mono font-bold tracking-[0.18em] uppercase text-white transition-colors duration-200 group-hover:text-[#78E070]">
                {FINAL_CTA_DATA.cta.primary}
              </span>
              <span className="text-[10px] sm:text-[10.5px] font-mono font-medium tracking-[0.16em] uppercase text-[#9AA7AE] transition-colors duration-200 group-hover:text-white">
                {FINAL_CTA_DATA.cta.secondary}
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT: Thin Vertical Divider + Editorial Principles Stack     */}
      {/* ------------------------------------------------------------- */}
      <aside
        aria-label="Core Capabilities"
        className="flex flex-col items-start justify-start lg:pt-3 select-none pointer-events-none mt-6 lg:mt-0"
      >
        <div className="border-l border-white/25 pl-4 sm:pl-5 flex flex-col space-y-2 sm:space-y-2.5">
          {principles.map((principle, index) => {
            const startP = 0.50 + index * 0.035;
            const endP = startP + 0.08;
            const t = reducedMotion
              ? progress >= 0.40 ? 1 : 0
              : smoothstep(startP, endP, progress);

            const opacity = t;
            const translateY = (1 - t) * 8;

            return (
              <div
                key={principle}
                className="will-change-transform"
                style={{
                  opacity,
                  transform: `translate3d(0, ${translateY}px, 0)`,
                }}
              >
                <span className="text-[11px] sm:text-[12px] font-mono font-semibold tracking-[0.24em] uppercase text-[#E2ECE9] hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  {principle}
                </span>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
};
