"use client";

import React from "react";
import { FOOTER_DATA } from "@/data/footerData";
import { FooterNavigation } from "./FooterNavigation";
import { FooterTerrain } from "./FooterTerrain";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const bottomBar = FOOTER_DATA.bottomBar;
  const reducedMotion = useReducedMotion();

  return (
    <footer
      id="site-footer"
      aria-label="Convalt Energy Footer"
      className="relative w-full bg-[#081214] text-white overflow-hidden select-none"
    >
      {/* 1. Subtle Background Topographic Contour Lines */}
      <svg
        viewBox="0 0 1536 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] mix-blend-screen"
        aria-hidden="true"
      >
        <path
          d="M 0,80 Q 280,180 580,70 T 1100,120 T 1536,90"
          fill="none"
          stroke="#3D9E32"
          strokeWidth="0.8"
          strokeDasharray="4 6"
        />
        <path
          d="M 0,160 Q 320,60 680,180 T 1200,90 T 1536,150"
          fill="none"
          stroke="#78E070"
          strokeWidth="0.65"
        />
        <path
          d="M 0,260 Q 240,320 540,220 T 1040,280 T 1536,210"
          fill="none"
          stroke="#4A7E5E"
          strokeWidth="0.75"
        />
        <path
          d="M 0,380 Q 380,440 760,330 T 1280,410 T 1536,360"
          fill="none"
          stroke="#2A5438"
          strokeWidth="0.8"
        />
      </svg>

      {/* 2. Main 5-Column Navigation Section */}
      <div className="relative z-20">
        <FooterNavigation />
      </div>

      {/* 3. Glowing Wireframe Energy Terrain Wave in Lower Area */}
      <FooterTerrain reducedMotion={reducedMotion} />

      {/* 4. Bottom Legal & Copyright Bar */}
      <div className="relative z-20 w-full border-t border-white/10 bg-[#060D0F]/90 backdrop-blur-sm py-4 sm:py-5">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Brand Left */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase text-[#889FA3]">
            <span className="font-bold text-white tracking-[0.20em]">
              {bottomBar.brand}
            </span>
            <span className="text-white/20">—</span>
            <span className="text-[#A2B5B8]">{bottomBar.motto}</span>
          </div>

          {/* Legal Links Right */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-3 sm:space-x-4 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] text-[#889FA3]">
            <span>
              &copy; {currentYear} {bottomBar.brand}. All rights reserved.
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            {bottomBar.links.map((link, idx) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  data-cursor="hover"
                  className="hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </a>
                {idx < bottomBar.links.length - 1 && (
                  <span className="text-white/20 hidden sm:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
