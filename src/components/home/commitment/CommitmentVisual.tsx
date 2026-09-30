"use client";

import React, { useMemo } from "react";
import Image from "next/image";

interface CommitmentVisualProps {
  progress: number; // 0.00 to 1.00
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

export const CommitmentVisual: React.FC<CommitmentVisualProps> = ({
  progress,
  pointerX,
  pointerY,
  reducedMotion,
}) => {
  // Parallax offsets (restrained to avoid jarring or oversized motion)
  const driftY = reducedMotion ? 0 : progress * -18; // Slow upward drift
  const zoomScale = reducedMotion ? 1.0 : 1.04 - progress * 0.04; // Gentle slow zoom 1.04 -> 1.00
  const pX = reducedMotion ? 0 : pointerX * 16;
  const pY = reducedMotion ? 0 : pointerY * 12;

  // Seam from Our Approach: smooth crossfade from #0E1A1A into golden-hour sky (0.00 -> 0.12)
  const seamOpacity = Math.max(0, 1 - progress / 0.12);

  // Atmospheric haze visibility lifts subtly after 0.12
  const hazeOpacity = Math.min(0.45, Math.max(0.15, 0.2 + progress * 0.25));

  // Road SVG path matching the winding route from our-commitment-bg.png (viewBox 0 0 1672 941)
  // Starts distant right near tree line, loops through campus, curves along front
  const energyPathD = useMemo(
    () =>
      "M 1480 470 C 1420 480, 1360 485, 1310 495 C 1240 510, 1180 540, 1140 560 C 1090 585, 1050 630, 1000 700 C 960 750, 930 765, 870 760 C 830 755, 800 710, 780 670 C 760 630, 720 620, 680 635 C 640 650, 620 700, 590 735 C 550 780, 510 790, 460 760 C 420 735, 380 690, 330 700 C 280 710, 220 735, 160 750",
    []
  );

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0E1A1A]">
      {/* 1. Deep 2.5D Background Stage with Subtle Scale & Drift */}
      <div
        className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${pX.toFixed(1)}px, ${(driftY + pY).toFixed(
            1
          )}px, 0) scale(${zoomScale.toFixed(4)})`,
        }}
      >
        {/* Approved High-Resolution Master Background Image */}
        <picture>
          <source
            srcSet="/media/commitment/our-commitment-bg.webp"
            type="image/webp"
          />
          <Image
            src="/media/commitment/our-commitment-bg.png"
            alt="Convalt Energy clean-energy campus in mountain valley at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </picture>

        {/* 2. Restrained Green Energy Route Pulse Overlay */}
        <svg
          viewBox="0 0 1672 941"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80 mix-blend-screen"
          aria-hidden="true"
        >
          <defs>
            {/* Soft Green Energy Route Glow Filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur1" />
              <feGaussianBlur stdDeviation="14" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Traveling linear gradient along the path */}
            <linearGradient id="energyTravelingGradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#78E070" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#A8F59C" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3D9E32" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Underline Soft Bloom */}
          <path
            d={energyPathD}
            fill="none"
            stroke="#78E070"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.35"
            filter="url(#routeGlow)"
          />

          {/* Core Energy Line */}
          <path
            d={energyPathD}
            fill="none"
            stroke="url(#energyTravelingGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="60 380"
            className="animate-energy-pulse"
          />
        </svg>

        {/* 3. Subtle Warm Architectural Building Lights Breathing */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-1000"
          style={{
            background:
              "radial-gradient(ellipse 35% 18% at 58% 66%, rgba(255,190,90,0.18) 0%, rgba(255,180,70,0.06) 45%, transparent 75%)",
            animation: "buildingBreathing 6s ease-in-out infinite alternate",
          }}
        />

        {/* 4. Atmospheric Golden Valley Mist Drift Layer */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle 600px at 50% 30%, rgba(255,170,80,0.22) 0%, rgba(255,140,50,0.08) 50%, transparent 80%)",
            opacity: hazeOpacity,
            animation: "mistDrift 14s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* 5. Left Readability Contrast Gradient (Preserves mountain contrast for headline) */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-[54%] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,26,26,0.85) 0%, rgba(14,26,26,0.60) 32%, rgba(14,26,26,0.20) 65%, transparent 100%)",
        }}
      />

      {/* 6. Top Cinematic Seam from Our Approach (0.00 -> 0.12) */}
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none z-20 transition-opacity duration-150"
        style={{
          opacity: seamOpacity,
          background:
            "linear-gradient(180deg, #0E1A1A 0%, rgba(14,26,26,0.6) 60%, transparent 100%)",
        }}
      />

      {/* 7. Bottom Forest Transition Gradient into Impact Strip */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 sm:h-64 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(0deg, #0E1A1A 0%, rgba(14,26,26,0.88) 35%, rgba(14,26,26,0.40) 70%, transparent 100%)",
        }}
      />

      <style jsx>{`
        @keyframes energyTraveling {
          0% {
            stroke-dashoffset: 880;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-energy-pulse {
          animation: energyTraveling 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes buildingBreathing {
          0% {
            opacity: 0.75;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes mistDrift {
          0% {
            transform: translate3d(-10px, 0, 0);
          }
          100% {
            transform: translate3d(15px, -5px, 0);
          }
        }
      `}</style>
    </div>
  );
};
