"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import gsap from "gsap";
import { VideoModal } from "./VideoModal";
import { HeroChapter } from "@/data/home";

interface HeroContentProps {
  introReady: boolean;
  activeChapter: HeroChapter;
  scrollProgress: number; // 0.0 to 1.0
  onExploreClick: () => void;
  onChapterLearnMore?: (slug: string) => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  introReady,
  activeChapter,
  scrollProgress,
  onExploreClick,
  onChapterLearnMore,
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

  // Masked line-by-line editorial reveal when intro finishes or chapter changes
  useEffect(() => {
    if (!introReady) return;

    const ctx = gsap.context(() => {
      // Clear any prior tweens on the text targets
      gsap.killTweensOf([
        eyebrowRef.current,
        line1Ref.current,
        line2Ref.current,
        line3Ref.current,
        bodyRef.current,
        ctaContainerRef.current,
      ]);

      // 1. Eyebrow reveal
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
      );

      // 2. Headline 3 lines masked upward entrance
      gsap.fromTo(
        [line1Ref.current, line2Ref.current, line3Ref.current],
        { y: "115%" },
        {
          y: "0%",
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
        }
      );

      // 3. Body copy upward entrance
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65, delay: 0.08, ease: "power2.out" }
      );

      // 4. CTA buttons fade + subtle slide
      gsap.fromTo(
        ctaContainerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.12, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeChapter.id, introReady]);

  const isLightUi = activeChapter.theme === "light-ui";

  const handlePrimaryCtaClick = () => {
    if (activeChapter.id === "01") {
      onExploreClick();
    } else if (onChapterLearnMore) {
      onChapterLearnMore(activeChapter.slug);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none relative z-20 w-full h-full flex flex-col justify-between"
      >
        {/* Left-third Fixed Editorial Coordinates */}
        <div className="pt-[clamp(120px,21vh,220px)] px-[clamp(20px,4vw,64px)] max-w-[1540px] mx-auto w-full">
          <div className="max-w-[580px] p-2 sm:p-0 rounded-2xl">
            {/* Eyebrow */}
            <div className="overflow-hidden mb-2.5 sm:mb-4">
              <p
                ref={eyebrowRef}
                className={`text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-eyebrow uppercase transition-colors duration-500 ${
                  isLightUi
                    ? "text-[#F4F3EF]/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                    : "text-[#101A1D]/80 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
                }`}
              >
                {activeChapter.eyebrow}
              </p>
            </div>

            {/* 3-Line Headline with Overflow-Hidden Wrappers */}
            <h1
              className={`font-editorial-heading text-[clamp(44px,6.8vw,96px)] font-normal tracking-[-0.045em] leading-[0.93] select-none transition-colors duration-500 ${
                isLightUi ? "text-[#F4F3EF] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" : "text-[#101A1D]"
              }`}
            >
              <span className="line-mask-wrapper">
                <span ref={line1Ref} className="block transform translate-y-0">
                  {activeChapter.headline[0]}
                </span>
              </span>
              <span className="line-mask-wrapper">
                <span ref={line2Ref} className="block transform translate-y-0">
                  {activeChapter.headline[1]}
                </span>
              </span>
              <span className="line-mask-wrapper">
                <span ref={line3Ref} className="block transform translate-y-0">
                  {activeChapter.headline[2]}
                </span>
              </span>
            </h1>

            {/* Paragraph / Body Copy */}
            <div className="mt-5 sm:mt-8 max-w-[420px]">
              <p
                ref={bodyRef}
                className={`text-[14px] sm:text-[16px] md:text-[17px] leading-[1.55] font-normal transition-colors duration-500 ${
                  isLightUi
                    ? "text-[#F4F3EF]/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                    : "text-[#101A1D]/90 sm:text-[#101A1D]/85 drop-shadow-[0_1px_3px_rgba(255,255,255,0.7)]"
                }`}
              >
                {activeChapter.body}
              </p>
            </div>

            {/* CTAs */}
            <div
              ref={ctaContainerRef}
              className="mt-6 sm:mt-10 flex flex-wrap items-center gap-3.5 sm:gap-6 pointer-events-auto"
            >
              {/* Primary CTA */}
              <button
                onClick={handlePrimaryCtaClick}
                className={`group relative inline-flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[14px] font-medium tracking-wide shadow-md transition-all duration-350 cursor-pointer ${
                  isLightUi
                    ? "bg-[#F4F3EF] text-[#101A1D] hover:bg-white"
                    : "bg-[#101A1D] text-[#F4F3EF] hover:bg-[#152327]"
                }`}
              >
                <span className="mr-2">{activeChapter.cta.primary}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-350 ease-out group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA (Scene 01 only) */}
              {activeChapter.id === "01" && (
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="group inline-flex items-center space-x-2.5 sm:space-x-3 text-[13px] sm:text-[14px] font-medium text-[#101A1D] hover:text-[#101A1D]/80 transition-colors duration-300 py-2 px-3 sm:px-0 rounded-full bg-white/40 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-black/10 sm:border-none shadow-sm sm:shadow-none cursor-pointer"
                >
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#101A1D]/35 flex items-center justify-center group-hover:border-[#101A1D] group-hover:scale-105 transition-all duration-300 bg-white/40 sm:bg-white/20 backdrop-blur-sm">
                    <Play className="w-3.5 h-3.5 fill-[#101A1D] text-[#101A1D] ml-0.5" />
                  </span>
                  <span>{activeChapter.cta.secondary}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom-Left Supporting Message / Manifesto (Fades gracefully past Scene 01) */}
        <div
          className={`pb-8 sm:pb-12 pl-[clamp(24px,4vw,64px)] pr-4 max-w-[1540px] mx-auto w-full transition-opacity duration-500 ${
            activeChapter.id === "01" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            ref={manifestoRef}
            className="text-[10px] sm:text-[11px] font-medium tracking-manifesto leading-[1.75] uppercase text-[#F4F3EF]/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] select-none"
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
