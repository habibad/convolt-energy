"use client";

import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";

interface HeroScrollCueProps {
  introReady: boolean;
  scrollProgress: number;
  onClick?: () => void;
}

export const HeroScrollCue: React.FC<HeroScrollCueProps> = ({
  introReady,
  scrollProgress,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Entrance animation at ~1.7s
  useEffect(() => {
    if (!introReady) return;

    const ctx = gsap.context(() => {
      // Fade in container
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 1.45,
          ease: "power3.out",
        }
      );

      // Subtle, refined 1.8s micro-motion
      gsap.to(arrowRef.current, {
        y: 4,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [introReady]);

  // Fades out gracefully as the visitor initiates scroll
  const opacity = Math.max(0, 1 - scrollProgress * 3.5);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className="opacity-0 fixed bottom-8 sm:bottom-12 right-[clamp(24px,4vw,64px)] z-30 pointer-events-auto cursor-pointer select-none transition-opacity duration-200"
      style={{ opacity, pointerEvents: opacity < 0.1 ? "none" : "auto" }}
    >
      <div className="group flex items-center space-x-3.5">
        {/* Outlined 50-52px circle with minimal down arrow */}
        <div className="relative w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-full border border-white/40 flex items-center justify-center transition-all duration-300 group-hover:border-white bg-black/25 group-hover:bg-black/40 backdrop-blur-md shadow-lg">
          {/* Animated circumference accent */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
            viewBox="0 0 52 52"
          >
            <circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="150"
              strokeDashoffset={150 - Math.min(150, scrollProgress * 150)}
              className="opacity-75 transition-all duration-150"
            />
          </svg>

          <div ref={arrowRef} className="text-white">
            <ArrowDown className="w-4 h-4 text-white stroke-[2]" />
          </div>
        </div>

        {/* Text prompt: SCROLL TO EXPLORE (Desktop) / SWIPE TO EXPLORE (Mobile) */}
        <div className="flex flex-col drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-white/90 group-hover:text-white transition-colors">
            Scroll to explore
          </span>
          <span className="inline-block sm:hidden text-[10px] font-medium tracking-[0.20em] uppercase text-white/90">
            Swipe to explore
          </span>
        </div>
      </div>
    </div>
  );
};
