"use client";

import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { BUSINESS_DATA, BUSINESS_LIST, BusinessId, BusinessItem } from "./businessData";
import { BusinessProcessRail } from "./BusinessProcessRail";

interface BusinessDetailUIProps {
  business: BusinessItem;
  opacity: number; // Controlled by master transition progress
  activeProcessStep: number;
  onSelectProcessStep: (step: number) => void;
  onSwitchBusiness: (id: BusinessId) => void;
  onBackToOverview: () => void;
}

export const BusinessDetailUI: React.FC<BusinessDetailUIProps> = ({
  business,
  opacity,
  activeProcessStep,
  onSelectProcessStep,
  onSwitchBusiness,
  onBackToOverview,
}) => {
  // Support Escape key to return to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBackToOverview();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBackToOverview]);

  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-30 flex flex-col justify-between pt-6 md:pt-10 pb-6 md:pb-8 transition-opacity duration-150"
      style={{
        opacity: Math.min(1, Math.max(0, opacity)),
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BAR: Back Button + Chapter Selector                     */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between pointer-events-auto">
        {/* Back to Ecosystem Button (Clean, Understated, No Modal "X") */}
        <button
          type="button"
          onClick={onBackToOverview}
          data-cursor="back"
          className="group inline-flex items-center space-x-2 text-[12px] sm:text-[13px] font-mono tracking-[0.16em] uppercase text-white/80 hover:text-white bg-black/40 hover:bg-black/60 px-3.5 py-1.5 rounded-full border border-white/15 transition-all duration-250 cursor-pointer focus:outline-none"
          aria-label="Back to Ecosystem Overview"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#78E070] transition-transform duration-250 group-hover:-translate-x-1" />
          <span>BACK TO ECOSYSTEM</span>
        </button>

        {/* Restrained Chapter Selector (01 SOLAR | 02 POWER | 03 DATA | 04 RECYCLING) */}
        <nav
          aria-label="Business chapters"
          className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10"
        >
          {BUSINESS_LIST.map((item) => {
            const isActive = item.id === business.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!isActive) onSwitchBusiness(item.id);
                }}
                data-cursor={isActive ? undefined : "view"}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10.5px] sm:text-[11.5px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
                  isActive
                    ? "bg-[#3D9E32] text-white font-bold shadow-[0_0_10px_rgba(61,158,50,0.5)]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Switch to ${item.label}`}
              >
                <span>{item.index} </span>
                <span className="hidden md:inline">{item.navLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN EDITORIAL CONTENT: Eyebrow + Headline & Body           */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-6 my-auto pointer-events-auto">
        {/* LEFT: Eyebrow + Multi-line Editorial Headline */}
        <div className="w-full lg:w-[48%] xl:max-w-[540px] flex flex-col justify-start">
          <div className="flex items-center space-x-3 mb-2.5 sm:mb-3">
            <span className="w-[5px] h-[15px] bg-[#3D9E32] rounded-full inline-block shrink-0 shadow-[0_0_8px_#3D9E32]" />
            <p className="text-[11px] sm:text-[12px] font-mono tracking-[0.2em] uppercase text-[#78E070] font-semibold drop-shadow-md">
              {business.eyebrow}
            </p>
          </div>

          <h2 className="font-editorial-heading text-[clamp(32px,3.2vw,52px)] font-normal tracking-[-0.03em] leading-[1.04] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {business.headline.map((line, idx) => (
              <span key={idx} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* RIGHT: Supporting Body Copy in Safe Negative Space */}
        <div className="w-full lg:w-[32%] xl:max-w-[380px] flex flex-col justify-start pt-1 sm:pt-2">
          <p className="text-[14px] sm:text-[15.5px] leading-[1.65] font-normal text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] bg-black/30 backdrop-blur-sm p-3.5 sm:p-4 rounded-xl border border-white/10">
            {business.body}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. BOTTOM: Business-specific Process Rail (Solar only)        */}
      {/* ------------------------------------------------------------- */}
      {business.processSteps && business.processSteps.length > 0 ? (
        <div className="w-full pointer-events-auto mt-auto pt-2">
          <BusinessProcessRail
            steps={business.processSteps}
            activeStep={activeProcessStep}
            onSelectStep={onSelectProcessStep}
          />
        </div>
      ) : (
        <div className="h-6" aria-hidden="true" />
      )}
    </div>
  );
};
