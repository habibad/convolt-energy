"use client";

import React from "react";
import { COMMITMENT_DATA } from "@/data/commitmentData";

interface CommitmentPrinciplesProps {
  progress: number; // 0.00 to 1.00
  reducedMotion: boolean;
}

function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const CommitmentPrinciples: React.FC<CommitmentPrinciplesProps> = ({
  progress,
  reducedMotion,
}) => {
  // Principles reveal sequentially between 0.52 -> 0.70
  // Item 0: PEOPLE (0.52 -> 0.60)
  // Item 1: INNOVATION (0.55 -> 0.63)
  // Item 2: CIRCULARITY (0.58 -> 0.66)
  // Item 3: LASTING IMPACT (0.61 -> 0.69)
  // Manifesto Statement (0.64 -> 0.72)

  const items = COMMITMENT_DATA.principles;

  return (
    <aside
      aria-label="Commitment Core Principles"
      className="hidden md:flex flex-col items-start justify-start select-none z-20 pointer-events-none lg:pr-4 md:self-end lg:self-auto bg-black/20 lg:bg-transparent backdrop-blur-[2px] lg:backdrop-blur-none p-3 lg:p-0 rounded-lg"
    >
      {/* Editorial Vertical Stack with Fine Left Rule */}
      <div className="border-l border-white/30 pl-4 sm:pl-5 flex flex-col space-y-3 sm:space-y-3.5">
        {items.map((principle, index) => {
          const startP = 0.52 + index * 0.03;
          const endP = startP + 0.08;
          const t = reducedMotion
            ? progress >= 0.45 ? 1 : 0
            : smoothstep(startP, endP, progress);

          const opacity = t;
          const translateY = (1 - t) * 8;

          return (
            <div
              key={principle}
              className="will-change-transform"
              style={{
                opacity,
                transform: `translate3d(0, ${translateY}px, 0)`,
              }}
            >
              <span className="text-[12px] sm:text-[13px] font-mono font-semibold tracking-[0.22em] uppercase text-[#E2ECE9] hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {principle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Additional Manifesto Statement Below */}
      {(() => {
        const manifestoT = reducedMotion
          ? progress >= 0.55 ? 1 : 0
          : smoothstep(0.64, 0.72, progress);

        return (
          <div
            className="mt-6 sm:mt-9 pl-4 sm:pl-5 border-l border-transparent will-change-transform"
            style={{
              opacity: manifestoT,
              transform: `translate3d(0, ${(1 - manifestoT) * 10}px, 0)`,
            }}
          >
            <p className="text-[10px] sm:text-[10.5px] font-mono font-medium tracking-[0.20em] uppercase text-[#9CB1B5] leading-[1.6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {COMMITMENT_DATA.manifesto.map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        );
      })()}
    </aside>
  );
};
