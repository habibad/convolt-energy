"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BusinessProcessStep } from "./businessData";

interface BusinessProcessRailProps {
  steps: BusinessProcessStep[];
  activeStep: number;
  onSelectStep: (stepIndex: number) => void;
}

export const BusinessProcessRail: React.FC<BusinessProcessRailProps> = ({
  steps,
  activeStep,
  onSelectStep,
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const displayStepIdx = hoveredStep ?? activeStep;
  const currentStep = steps[displayStepIdx] || steps[0];

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 pointer-events-auto select-none">
      {/* Container with restrained backdrop */}
      <div className="relative rounded-2xl bg-[#0E1A1A]/75 border border-white/10 p-4 sm:p-5 backdrop-blur-xl shadow-2xl transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          {/* Header & Active Step Detail */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 min-w-[280px]">
            {/* Active Thumbnail Preview */}
            <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-white/15 shadow-md">
              <Image
                src={currentStep.media}
                alt={currentStep.title}
                fill
                sizes="96px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white tracking-widest">
                {currentStep.num}
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D9E32] animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#78E070] font-semibold">
                  OUR MANUFACTURING PROCESS
                </span>
              </div>
              <h4 className="text-[14px] sm:text-[15px] font-semibold text-white tracking-tight mt-0.5">
                {currentStep.title}
              </h4>
              <p className="text-[12px] text-white/70 line-clamp-1 max-w-[340px] sm:max-w-[420px] mt-0.5">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Interactive Steps Horizontal Strip */}
          <div className="w-full lg:w-auto flex items-center justify-start sm:justify-end gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {steps.map((step, idx) => {
              const isActive = idx === activeStep;
              const isHov = idx === hoveredStep;

              return (
                <button
                  key={step.index}
                  type="button"
                  onClick={() => onSelectStep(idx)}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`relative px-3 sm:px-4 py-2 rounded-xl text-left transition-all duration-250 cursor-pointer focus:outline-none flex items-center space-x-2 shrink-0 ${
                    isActive
                      ? "bg-[#3D9E32]/25 border border-[#3D9E32] text-white shadow-[0_0_12px_rgba(61,158,50,0.3)]"
                      : isHov
                      ? "bg-white/10 border border-white/20 text-white"
                      : "bg-white/5 border border-white/5 text-white/60 hover:text-white"
                  }`}
                  aria-label={`Process step ${step.num}: ${step.title}`}
                >
                  <span
                    className={`text-[11px] font-mono font-bold tracking-wider ${
                      isActive ? "text-[#78E070]" : "text-white/40"
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="text-[12px] font-medium tracking-wide whitespace-nowrap">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
