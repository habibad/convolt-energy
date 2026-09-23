"use client";

import React from "react";
import { APPROACH_DATA } from "@/data/home";

interface ApproachLabelsProps {
  visualActiveZone: number | "all" | null;
  onHoverZone: (zoneIndex: number | null) => void;
}

export const ApproachLabels: React.FC<ApproachLabelsProps> = ({
  visualActiveZone,
  onHoverZone,
}) => {
  const businesses = APPROACH_DATA.businesses;

  // Spatial coordinates for desktop overlay around 3D canvas perimeter
  const desktopPositions = [
    "top-4 left-4 sm:top-8 sm:left-8",        // 0: Solar Manufacturing (North-West)
    "top-4 right-4 sm:top-8 sm:right-8",      // 1: Power Generation (North-East)
    "bottom-4 right-4 sm:bottom-8 sm:right-8",// 2: Data Centers (South-East)
    "bottom-4 left-4 sm:bottom-8 sm:left-8",  // 3: Recycling (South-West)
  ];

  return (
    <>
      {/* 1. Desktop Spatial Overlay (Positioned around 3D canvas perimeter) */}
      <ol className="hidden md:block absolute inset-0 pointer-events-none z-20">
        {businesses.map((biz) => {
          const isActive =
            visualActiveZone === biz.index || visualActiveZone === "all";

          return (
            <li
              key={biz.id}
              className={`absolute ${desktopPositions[biz.index]} pointer-events-auto transition-all duration-350`}
            >
              <button
                type="button"
                onMouseEnter={() => onHoverZone(biz.index)}
                onMouseLeave={() => onHoverZone(null)}
                onFocus={() => onHoverZone(biz.index)}
                onBlur={() => onHoverZone(null)}
                className={`group flex items-center space-x-2.5 px-3 py-1.5 rounded-full text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white/80 backdrop-blur-md shadow-sm border border-black/10"
                    : "bg-transparent hover:bg-white/50 border border-transparent"
                }`}
                aria-label={`${biz.title}: ${biz.tagline}`}
              >
                {/* Active Indicator Pulse Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#63A75B] scale-125 shadow-[0_0_8px_rgba(99,167,91,0.6)]"
                      : "bg-[#7E8F95]/50 group-hover:bg-[#7E8F95]"
                  }`}
                />

                {/* Index & Title */}
                <span
                  className={`text-[10px] sm:text-[11px] font-mono tracking-[0.14em] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-[#101A1D] font-medium"
                      : "text-[#55656C] group-hover:text-[#101A1D]"
                  }`}
                >
                  {biz.index < 9 ? `0${biz.index + 1}` : biz.index + 1} {biz.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* 2. Mobile/Tablet Compact Segmented Bar (Below 3D model) */}
      <ol className="md:hidden flex flex-wrap justify-center gap-2 mt-4 px-2 w-full">
        {businesses.map((biz) => {
          const isActive =
            visualActiveZone === biz.index || visualActiveZone === "all";

          return (
            <li key={`mobile-${biz.id}`}>
              <button
                type="button"
                onClick={() =>
                  onHoverZone(visualActiveZone === biz.index ? null : biz.index)
                }
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-[#101A1D] text-[#F4F3EF] shadow-sm"
                    : "bg-black/5 text-[#55656C]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-[#63A75B]" : "bg-black/20"
                  }`}
                />
                <span>{biz.shortName}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
};
