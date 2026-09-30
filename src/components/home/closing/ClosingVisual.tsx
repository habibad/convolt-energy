"use client";

import React, { useMemo } from "react";
import Image from "next/image";

interface ClosingVisualProps {
  progress: number; // 0.00 to 1.00 across the entire closing sequence
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const ClosingVisual: React.FC<ClosingVisualProps> = ({
  progress,
  pointerX,
  pointerY,
  reducedMotion,
}) => {
  // Parallax offsets (continuous subtle camera glide 0.00 -> 1.00)
  const driftY = reducedMotion ? 0 : progress * -20;
  const zoomScale = reducedMotion ? 1.0 : 1.04 - progress * 0.04;
  const pX = reducedMotion ? 0 : pointerX * 16;
  const pY = reducedMotion ? 0 : pointerY * 12;

  // 1. Entrance Seam from Our Approach: smooth crossfade from #0E1A1A (0.00 -> 0.08)
  const seamOpacity = Math.max(0, 1 - progress / 0.08);

  // 2. Lighting Morphing: Golden Hour (Act 1) -> Dusk Twilight (Act 2 & 3)
  // Golden hour warmth dominates during 0.00 -> 0.44, then deepens into dusk (0.44 -> 0.58)
  const goldenWarmth = 1 - smoothstep(0.42, 0.58, progress);
  const duskDepth = smoothstep(0.44, 0.60, progress);

  // 3. Sky Topographic Contour Lines become more visible in dusk (matching reference)
  const contourOpacity = 0.08 + duskDepth * 0.22;

  // 4. Glowing Energy Road Path (viewBox 0 0 1672 941)
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
        {/* Approved High-Resolution Master Background Image (Loaded ONCE, NEVER unpins) */}
        <picture>
          <source
            srcSet="/media/commitment/our-commitment-bg.webp"
            type="image/webp"
          />
          <Image
            src="/media/commitment/our-commitment-bg.png"
            alt="Convalt Energy clean-energy campus in mountain valley from sunset to dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
        </picture>

        {/* 2. Golden-Hour Sunlight & Sky Warmth Layer (Act 1: Commitment) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: goldenWarmth }}
        >
          {/* Subtle Warm Amber Sunlight Gradient at Top-Center */}
          <div
            className="absolute top-0 inset-x-0 h-[45%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245, 178, 90, 0.22) 0%, rgba(210, 140, 60, 0.08) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
          {/* Soft Horizon Warmth */}
          <div
            className="absolute top-[28%] inset-x-0 h-[30%] pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255, 215, 130, 0.20) 0%, transparent 80%)",
            }}
          />
        </div>

        {/* 3. Dusk Twilight Atmospheric Grading Layer (Act 2 & 3: Final CTA) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: duskDepth }}
        >
          {/* Deep Cool Dusk Twilight Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(8, 18, 20, 0.15) 0%, rgba(8, 18, 20, 0.55) 70%, rgba(6, 13, 15, 0.85) 100%)",
            }}
          />
          {/* Dark Forest & Lower Mountain Shadows */}
          <div
            className="absolute bottom-0 inset-x-0 h-[50%] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(8, 18, 20, 0) 0%, rgba(8, 18, 20, 0.70) 60%, rgba(8, 18, 20, 0.95) 100%)",
            }}
          />
        </div>

        {/* 4. Top-Left Sky Topographic Contour Lines (Fades in during Dusk) */}
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-[55vw] h-[55vh] pointer-events-none mix-blend-screen transition-opacity duration-300"
          style={{ opacity: contourOpacity }}
          aria-hidden="true"
        >
          <path
            d="M -50,60 C 150,40, 280,120, 420,90 C 560,60, 640,140, 760,110"
            fill="none"
            stroke="#3D9E32"
            strokeWidth="0.85"
            strokeDasharray="4 6"
          />
          <path
            d="M -50,110 C 180,90, 320,170, 480,140 C 640,110, 720,200, 820,160"
            fill="none"
            stroke="#78E070"
            strokeWidth="0.65"
          />
          <path
            d="M -50,170 C 120,150, 260,230, 410,200 C 560,170, 650,260, 780,220"
            fill="none"
            stroke="#4A7E5E"
            strokeWidth="0.75"
          />
        </svg>

        {/* 5. Glowing Green Energy Route Pulse Along Mountain Road */}
        <svg
          viewBox="0 0 1672 941"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen transition-opacity duration-300"
          style={{ opacity: 0.65 + duskDepth * 0.25 }}
          aria-hidden="true"
        >
          <defs>
            {/* Soft Green Energy Route Glow Filter */}
            <filter id="closingRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Traveling linear gradient along the path */}
            <linearGradient id="closingEnergyGradient" x1="100%" y1="50%" x2="0%" y2="50%">
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
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.30"
            filter="url(#closingRouteGlow)"
          />

          {/* Core Green Route Stroke */}
          <path
            d={energyPathD}
            fill="none"
            stroke="#78E070"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Animated Energy Traveling Pulse */}
          <path
            d={energyPathD}
            fill="none"
            stroke="url(#closingEnergyGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="90 320"
            className="animate-energy-pulse"
          />
        </svg>

        {/* 6. Overall Base Vignette to keep text readably crisp */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(8, 18, 20, 0.45) 0%, rgba(8, 18, 20, 0.15) 30%, rgba(8, 18, 20, 0.35) 70%, rgba(8, 18, 20, 0.85) 100%)",
          }}
        />
      </div>

      {/* 7. Seamless Crossfade from Our Approach (#0E1A1A) */}
      <div
        className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-150"
        style={{
          opacity: seamOpacity,
          background:
            "linear-gradient(180deg, #0E1A1A 0%, rgba(14,26,26,0.85) 50%, rgba(14,26,26,0) 100%)",
        }}
      />
    </div>
  );
};
