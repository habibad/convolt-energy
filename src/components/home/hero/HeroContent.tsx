"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import gsap from "gsap";
import { VideoModal } from "./VideoModal";

interface HeroContentProps {
  introReady: boolean;
  scrollProgress: number; // 0.0 to 1.0 from master ScrollTrigger
  onExploreClick: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  introReady,
  scrollProgress,
  onExploreClick,
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  // Cinematic masked line-by-line editorial entrance
  useEffect(() => {
    if (!introReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.35, // Choreographed to follow camera pull-back
      });

      // Eyebrow reveal
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        // 3 Headline lines inside overflow-hidden wrappers
        .fromTo(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { y: "115%" },
          {
            y: "0%",
            duration: 1.15,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.55"
        )
        // Body copy upward mask reveal
        .fromTo(
          bodyRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.95 },
          "-=0.7"
        )
        // CTA buttons fade + 15px translation
        .fromTo(
          ctaContainerRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        // Bottom left manifesto reveal
        .fromTo(
          manifestoRef.current,
          { opacity: 0, y: 12 },
          { opacity: 0.9, y: 0, duration: 0.9 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [introReady]);

  // Dynamic ScrollTrigger scrub response:
  // Headline gently lifts upward by 18-25px, body opacity softly reduces
  const headlineLiftY = -Math.min(26, scrollProgress * 55);
  const bodyOpacity = Math.max(0.2, 1 - scrollProgress * 1.5);
  const ctaOpacity = Math.max(0, 1 - scrollProgress * 2.2);

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none relative z-20 w-full h-full flex flex-col justify-between"
      >
        {/* Left-third Hero Content Block */}
        <div
          className="pt-[clamp(120px,21vh,220px)] px-[clamp(20px,4vw,64px)] max-w-[1540px] mx-auto w-full transition-transform duration-100 ease-out"
          style={{ transform: `translate3d(0, ${headlineLiftY}px, 0)` }}
        >
          <div className="max-w-[580px] p-2 sm:p-0 rounded-2xl">
            {/* Eyebrow */}
            <div className="overflow-hidden mb-2.5 sm:mb-4">
              <p
                ref={eyebrowRef}
                className="opacity-0 text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-eyebrow uppercase text-[#101A1D]/80 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
              >
                Clean Energy. Brighter Tomorrow.
              </p>
            </div>

            {/* 3-Line Headline with Overflow-Hidden Wrappers */}
            <h1 className="font-editorial-heading text-[clamp(44px,6.8vw,96px)] font-normal text-[#101A1D] tracking-[-0.045em] leading-[0.93] select-none">
              <span className="line-mask-wrapper">
                <span ref={line1Ref} className="block transform translate-y-[115%]">
                  Powering
                </span>
              </span>
              <span className="line-mask-wrapper">
                <span ref={line2Ref} className="block transform translate-y-[115%]">
                  a Cleaner
                </span>
              </span>
              <span className="line-mask-wrapper">
                <span ref={line3Ref} className="block transform translate-y-[115%]">
                  Tomorrow
                </span>
              </span>
            </h1>

            {/* Paragraph / Body Copy */}
            <div className="mt-5 sm:mt-8 max-w-[420px]">
              <p
                ref={bodyRef}
                className="opacity-0 text-[14px] sm:text-[16px] md:text-[17px] leading-[1.55] font-normal text-[#101A1D]/90 sm:text-[#101A1D]/85 transition-opacity duration-150 drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]"
                style={{ opacity: bodyOpacity }}
              >
                From solar manufacturing to power generation, data centers and recycling —
                Convalt Energy builds a more sustainable world through innovation and scale.
              </p>
            </div>

            {/* CTAs */}
            <div
              ref={ctaContainerRef}
              className="opacity-0 mt-6 sm:mt-10 flex flex-wrap items-center gap-3.5 sm:gap-6 pointer-events-auto transition-opacity duration-150"
              style={{ opacity: ctaOpacity }}
            >
              {/* Primary CTA */}
              <button
                onClick={onExploreClick}
                className="group relative inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#101A1D] text-[#F4F3EF] text-[13px] sm:text-[14px] font-medium tracking-wide shadow-md hover:bg-[#152327] transition-all duration-350 cursor-pointer"
              >
                <span className="mr-2">Explore Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-350 ease-out group-hover:translate-x-1 text-[#F4F3EF]" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="group inline-flex items-center space-x-2.5 sm:space-x-3 text-[13px] sm:text-[14px] font-medium text-[#101A1D] hover:text-[#101A1D]/80 transition-colors duration-300 py-2 px-3 sm:px-0 rounded-full bg-white/40 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-black/10 sm:border-none shadow-sm sm:shadow-none cursor-pointer"
              >
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#101A1D]/35 flex items-center justify-center group-hover:border-[#101A1D] group-hover:scale-105 transition-all duration-300 bg-white/40 sm:bg-white/20 backdrop-blur-sm">
                  <Play className="w-3.5 h-3.5 fill-[#101A1D] text-[#101A1D] ml-0.5" />
                </span>
                <span>Watch Full Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom-Left Supporting Message / Manifesto (High contrast over dark forest) */}
        <div className="pb-8 sm:pb-12 pl-[clamp(24px,4vw,64px)] pr-4 max-w-[1540px] mx-auto w-full">
          <div
            ref={manifestoRef}
            className="opacity-0 text-[10px] sm:text-[11px] font-medium tracking-manifesto leading-[1.75] uppercase text-[#F4F3EF]/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] select-none"
          >
            <div>Sustainable</div>
            <div>Innovation</div>
            <div>Real Impact</div>
          </div>
        </div>
      </div>

      {/* Video Modal Hook */}
      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
    </>
  );
};
