"use client";

import React, { useMemo } from "react";
import Image from "next/image";

interface FinalCTAVisualProps {
  progress: number; // 0.00 to 1.00
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
}

export const FinalCTAVisual: React.FC<FinalCTAVisualProps> = ({
  progress,
  pointerX,
  pointerY,
  reducedMotion,
}) => {
  // Parallax offsets (restrained to maintain visual stability)
  const driftY = reducedMotion ? 0 : progress * -12;
  const zoomScale = reducedMotion ? 1.0 : 1.02 - progress * 0.02;
  const pX = reducedMotion ? 0 : pointerX * 14;
  const pY = reducedMotion ? 0 : pointerY * 10;

  // Seamless top entrance from Our Commitment (0.00 -> 0.15)
  const seamOpacity = Math.max(0, 1 - progress / 0.15);

  // Road SVG path matching the winding route from the master plate
  const energyPathD = useMemo(
    () =>
      "M 1480 470 C 1420 480, 1360 485, 1310 495 C 1240 510, 1180 540, 1140 560 C 1090 585, 1050 630, 1000 700 C 960 750, 930 765, 870 760 C 830 755, 800 710, 780 670 C 760 630, 720 620, 680 635 C 640 650, 620 700, 590 735 C 550 780, 510 790, 460 760 C 420 735, 380 690, 330 700 C 280 710, 220 735, 160 750",
    []
  );

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#081214]">
      {/* 1. Deep 2.5D Background Image Container with Subtle Parallax */}
      <div
        className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] will-change-transform transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${pX.toFixed(1)}px, ${(driftY + pY).toFixed(
            1
          )}px, 0) scale(${zoomScale.toFixed(4)})`,
        }}
      >
        <picture>
          <source
            srcSet="/media/commitment/our-commitment-bg.webp"
            type="image/webp"
          />
          <Image
            src="/media/commitment/our-commitment-bg.png"
            alt="Convalt Energy clean-energy campus and valley at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
        </picture>

        {/* 2. Top-Left Sky Topographic Contour Lines (visible in reference) */}
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-[55vw] h-[55vh] pointer-events-none opacity-25 mix-blend-screen"
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

        {/* 3. Glowing Green Energy Route Pulse Overlay */}
        <svg
          viewBox="0 0 1672 941"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-75 mix-blend-screen"
          aria-hidden="true"
        >
          <defs>
            <filter id="ctaRouteGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="ctaEnergyGradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#78E070" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#A8F59C" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3D9E32" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Soft Bloom */}
          <path
            d={energyPathD}
            fill="none"
            stroke="#78E070"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.3"
            filter="url(#ctaRouteGlow)"
          />

          {/* Traveling Pulse */}
          <path
            d={energyPathD}
            fill="none"
            stroke="url(#ctaEnergyGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="70 420"
            className="animate-cta-energy"
          />
        </svg>

        {/* 4. Warm Building-Light Breathing */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge"
          style={{
            background:
              "radial-gradient(ellipse 35% 18% at 58% 66%, rgba(255,190,90,0.16) 0%, rgba(255,180,70,0.05) 45%, transparent 75%)",
            animation: "buildingBreathing 6s ease-in-out infinite alternate",
          }}
        />

        {/* 5. Atmospheric Dusk Haze */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-35"
          style={{
            background:
              "radial-gradient(circle 700px at 55% 32%, rgba(255,160,70,0.2) 0%, rgba(255,120,40,0.06) 50%, transparent 80%)",
            animation: "mistDrift 14s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* 6. Left Editorial Contrast Gradient (Mountain Contrast Safe Zone) */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-[58%] pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,18,20,0.92) 0%, rgba(8,18,20,0.68) 35%, rgba(8,18,20,0.22) 70%, transparent 100%)",
        }}
      />

      {/* 7. Top Entrance Seam from Our Commitment (0.00 -> 0.15) */}
      <div
        className="absolute top-0 inset-x-0 h-28 pointer-events-none z-20 transition-opacity duration-150"
        style={{
          opacity: seamOpacity,
          background:
            "linear-gradient(180deg, #0A1315 0%, rgba(10,19,21,0.65) 60%, transparent 100%)",
        }}
      />

      {/* 8. Bottom Forest Natural Transition Gradient into Footer (#081214) */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 sm:h-56 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(0deg, #081214 0%, rgba(8,18,20,0.95) 40%, rgba(8,18,20,0.45) 75%, transparent 100%)",
        }}
      />

      <style jsx>{`
        @keyframes ctaEnergyTraveling {
          0% {
            stroke-dashoffset: 920;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-cta-energy {
          animation: ctaEnergyTraveling 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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
