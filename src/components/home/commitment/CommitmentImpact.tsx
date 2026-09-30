"use client";

import React from "react";
import { Sun, Home, Cloud, Leaf, ChevronDown } from "lucide-react";
import { COMMITMENT_DATA } from "@/data/commitmentData";

interface CommitmentImpactProps {
  progress: number; // 0.00 to 1.00
  reducedMotion: boolean;
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const CommitmentImpact: React.FC<CommitmentImpactProps> = ({
  progress,
  reducedMotion,
}) => {
  // Reveal between 0.68 -> 0.85
  const impactT = reducedMotion
    ? progress >= 0.60 ? 1 : 0
    : smoothstep(0.68, 0.85, progress);
  const opacity = impactT;
  const translateY = (1 - impactT) * 16;

  // Icon mapping matching the approved visual direction
  const renderIcon = (type: string) => {
    switch (type) {
      case "sun":
        return <Sun className="w-5 h-5 text-white/90" strokeWidth={1.5} />;
      case "home":
        return <Home className="w-5 h-5 text-white/90" strokeWidth={1.5} />;
      case "co2":
        return (
          <div className="relative flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white/90" strokeWidth={1.5} />
            <span className="absolute text-[8px] font-mono font-bold text-white tracking-tighter pt-0.5">
              CO₂
            </span>
          </div>
        );
      case "leaf":
        return <Leaf className="w-5 h-5 text-white/90" strokeWidth={1.5} />;
      default:
        return <Sun className="w-5 h-5 text-white/90" strokeWidth={1.5} />;
    }
  };

  return (
    <div
      className="w-full flex flex-col z-20 pointer-events-auto select-none will-change-transform"
      style={{
        opacity,
        transform: `translate3d(0, ${translateY}px, 0)`,
        pointerEvents: opacity > 0.1 ? "auto" : "none",
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Four-Column Refined Impact Strip                           */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full border-t border-white/15 bg-gradient-to-b from-[#0E1A1A]/85 via-[#0E1A1A]/95 to-[#0A1315] backdrop-blur-md">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 sm:py-5 lg:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 md:gap-0">
            {COMMITMENT_DATA.impactItems.map((item, idx) => {
              const isLast = idx === COMMITMENT_DATA.impactItems.length - 1;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-start pl-2 pr-3 sm:px-6 lg:px-8 ${
                    !isLast ? "md:border-r md:border-white/10" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="mb-1.5 sm:mb-3 flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/[0.05] border border-white/10 shadow-sm">
                      {renderIcon(item.icon)}
                    </div>
                  </div>

                  {/* Quantitative Stat (from approved visual mockup) */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-[20px] sm:text-[26px] lg:text-[32px] font-mono font-medium tracking-tight text-white leading-none">
                      {item.stat}
                    </span>
                  </div>

                  {/* Title & Detail */}
                  <div className="mt-1 flex flex-col text-left">
                    <span className="text-[11.5px] sm:text-[13px] font-medium text-[#D2E2E6] leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#889FA3] leading-tight mt-0.5 whitespace-pre-line">
                      {item.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Lower Transition Band with Topographic Contours (Sec. 16)   */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full overflow-hidden bg-[#0A1315] border-t border-white/10 py-2.5 sm:py-3.5 select-none">
        {/* Subtle SVG Topographic Contour Pattern in Background */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          aria-hidden="true"
        >
          <path
            d="M 0,20 Q 200,60 400,25 T 800,45 T 1200,15 T 1440,30"
            fill="none"
            stroke="#3D9E32"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <path
            d="M 0,40 Q 250,10 500,50 T 950,20 T 1350,55 T 1440,40"
            fill="none"
            stroke="#78E070"
            strokeWidth="0.6"
          />
          <path
            d="M 0,65 Q 180,45 380,70 T 820,35 T 1180,60 T 1440,50"
            fill="none"
            stroke="#4A6E59"
            strokeWidth="0.7"
          />
        </svg>

        {/* Content Row: Brand Tagline Left & Scroll Discovery Right */}
        <div className="relative max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left z-10">
          {/* Left Brand + Tagline Stack */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-[9.5px] sm:text-[11px] font-mono tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#889FA3]">
            <span className="font-bold text-white tracking-[0.20em]">
              {COMMITMENT_DATA.footer.brand}
            </span>
            <span className="text-white/20">—</span>
            <span className="text-[#A2B5B8]">
              {COMMITMENT_DATA.footer.tagline.join("   ")}
            </span>
            <span className="text-white/20 hidden sm:inline">—</span>
          </div>

          {/* Right: Scroll To Discover / Arrow */}
          <div className="flex items-center space-x-2 text-[9.5px] sm:text-[10.5px] font-mono tracking-[0.16em] uppercase text-[#889FA3]/80">
            <span>{COMMITMENT_DATA.footer.action}</span>
            <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border border-white/20 flex items-center justify-center">
              <ChevronDown className="w-3 h-3 text-white animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
