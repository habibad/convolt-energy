"use client";

import React from "react";
import { APPROACH_DATA } from "@/data/home";

interface ApproachLabelsProps {
  visualActiveZone: number | "all" | null;
  onHoverZone: (zoneIndex: number | null) => void;
  onSelectZone: (zoneIndex: number) => void;
  labelRefs: React.RefObject<(HTMLElement | null)[]>;
  disabled?: boolean;
}

export const ApproachLabels: React.FC<ApproachLabelsProps> = ({
  visualActiveZone,
  onHoverZone,
  onSelectZone,
  labelRefs,
  disabled = false,
}) => {
  const businesses = APPROACH_DATA.businesses;

  const isZoneActive = (index: number) =>
    visualActiveZone === index || visualActiveZone === "all";

  const isZoneDimmed = (index: number) =>
    visualActiveZone !== null &&
    visualActiveZone !== "all" &&
    visualActiveZone !== index;

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* Desktop & Tablet Projected Spatial Labels                     */}
      {/* Clean, architectural, minimal aesthetics with dotted lines   */}
      {/* ------------------------------------------------------------- */}
      <ol className="hidden md:block absolute inset-0 pointer-events-none z-20 overflow-visible">
        {/* ----------------------------------------------------------- */}
        {/* 01 SOLAR MANUFACTURING                                      */}
        {/* ----------------------------------------------------------- */}
        <li
          ref={(el) => {
            if (labelRefs.current) labelRefs.current[0] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
            pointerEvents: "auto",
          }}
          className={`transition-opacity duration-300 ${
            isZoneActive(0)
              ? "opacity-100 z-30"
              : isZoneDimmed(0)
              ? "opacity-60 hover:opacity-100 z-10"
              : "opacity-85 hover:opacity-100 z-20"
          }`}
        >
          {/* Subtle Terminal Dot on building roof */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`block rounded-full transition-all duration-300 ${
                isZoneActive(0)
                  ? "w-2.5 h-2.5 bg-[#3D9E32] shadow-[0_0_8px_rgba(61,158,50,0.9)]"
                  : "w-2 h-2 bg-[#3D9E32]/75 shadow-none"
              }`}
            />
          </div>

          {/* Dotted Vertical Leader Line (58px) */}
          <svg
            className="absolute overflow-visible pointer-events-none"
            style={{ left: 0, top: -58, width: 2, height: 58 }}
          >
            <line
              x1="0"
              y1="58"
              x2="0"
              y2="0"
              stroke="#3D9E32"
              strokeWidth={isZoneActive(0) ? "1.75" : "1.25"}
              strokeDasharray="2 3"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                isZoneActive(0)
                  ? "drop-shadow-[0_0_4px_rgba(61,158,50,0.7)] opacity-100"
                  : "opacity-50"
              }`}
            />
          </svg>

          {/* Clean Typographic Label */}
          <div
            className="absolute pointer-events-auto"
            style={{ left: 0, top: -58, transform: "translate(0, -100%)" }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectZone(0)}
              onMouseEnter={() => onHoverZone(0)}
              onMouseLeave={() => onHoverZone(null)}
              onFocus={() => onHoverZone(0)}
              onBlur={() => onHoverZone(null)}
              data-cursor="view-details"
              className="group flex flex-col items-start text-left cursor-pointer focus:outline-none -translate-x-[4px] pb-1 select-none"
              aria-label="View Solar Manufacturing details"
            >
              {/* Green Dot + Number */}
              <div
                className="flex items-center space-x-1.5"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #fff) drop-shadow(0 0 6px rgba(255,255,255,0.95))",
                }}
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isZoneActive(0)
                      ? "w-2 h-2 bg-[#3D9E32] shadow-[0_0_6px_rgba(61,158,50,0.9)]"
                      : "w-1.5 h-1.5 bg-[#3D9E32]/80"
                  }`}
                />
                <span
                  className={`text-[12px] font-mono tracking-[0.14em] transition-colors duration-300 ${
                    isZoneActive(0)
                      ? "text-[#101A1D] font-bold"
                      : "text-[#101A1D]/80 font-semibold"
                  }`}
                >
                  01
                </span>
              </div>

              {/* Title */}
              <div
                className="mt-0.5 text-left text-[#101A1D] font-mono font-bold text-[12px] sm:text-[13px] tracking-[0.14em] leading-[1.25]"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #fff) drop-shadow(0 0 8px rgba(255,255,255,0.98))",
                }}
              >
                <span className="block whitespace-nowrap">SOLAR</span>
                <span className="block whitespace-nowrap">MANUFACTURING</span>
              </div>
            </button>
          </div>
        </li>

        {/* ----------------------------------------------------------- */}
        {/* 02 POWER GENERATION                                         */}
        {/* ----------------------------------------------------------- */}
        <li
          ref={(el) => {
            if (labelRefs.current) labelRefs.current[1] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
            pointerEvents: "auto",
          }}
          className={`transition-opacity duration-300 ${
            isZoneActive(1)
              ? "opacity-100 z-30"
              : isZoneDimmed(1)
              ? "opacity-60 hover:opacity-100 z-10"
              : "opacity-85 hover:opacity-100 z-20"
          }`}
        >
          {/* Subtle Terminal Dot on solar array */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`block rounded-full transition-all duration-300 ${
                isZoneActive(1)
                  ? "w-2.5 h-2.5 bg-[#3D9E32] shadow-[0_0_8px_rgba(61,158,50,0.9)]"
                  : "w-2 h-2 bg-[#3D9E32]/75 shadow-none"
              }`}
            />
          </div>

          {/* Dotted Vertical Leader Line (62px) */}
          <svg
            className="absolute overflow-visible pointer-events-none"
            style={{ left: 0, top: -62, width: 2, height: 62 }}
          >
            <line
              x1="0"
              y1="62"
              x2="0"
              y2="0"
              stroke="#3D9E32"
              strokeWidth={isZoneActive(1) ? "1.75" : "1.25"}
              strokeDasharray="2 3"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                isZoneActive(1)
                  ? "drop-shadow-[0_0_4px_rgba(61,158,50,0.7)] opacity-100"
                  : "opacity-50"
              }`}
            />
          </svg>

          {/* Clean Typographic Label */}
          <div
            className="absolute pointer-events-auto"
            style={{ left: 0, top: -62, transform: "translate(0, -100%)" }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectZone(1)}
              onMouseEnter={() => onHoverZone(1)}
              onMouseLeave={() => onHoverZone(null)}
              onFocus={() => onHoverZone(1)}
              onBlur={() => onHoverZone(null)}
              data-cursor="view-details"
              className="group flex flex-col items-start text-left cursor-pointer focus:outline-none -translate-x-[4px] pb-1 select-none"
              aria-label="View Power Generation details"
            >
              {/* Green Dot + Number */}
              <div
                className="flex items-center space-x-1.5"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #fff) drop-shadow(0 0 6px rgba(255,255,255,0.95))",
                }}
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isZoneActive(1)
                      ? "w-2 h-2 bg-[#3D9E32] shadow-[0_0_6px_rgba(61,158,50,0.9)]"
                      : "w-1.5 h-1.5 bg-[#3D9E32]/80"
                  }`}
                />
                <span
                  className={`text-[12px] font-mono tracking-[0.14em] transition-colors duration-300 ${
                    isZoneActive(1)
                      ? "text-[#101A1D] font-bold"
                      : "text-[#101A1D]/80 font-semibold"
                  }`}
                >
                  02
                </span>
              </div>

              {/* Title */}
              <div
                className="mt-0.5 text-left text-[#101A1D] font-mono font-bold text-[12px] sm:text-[13px] tracking-[0.14em] leading-[1.25]"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #fff) drop-shadow(0 0 8px rgba(255,255,255,0.98))",
                }}
              >
                <span className="block whitespace-nowrap">POWER</span>
                <span className="block whitespace-nowrap">GENERATION</span>
              </div>
            </button>
          </div>
        </li>

        {/* ----------------------------------------------------------- */}
        {/* 03 DATA CENTERS                                             */}
        {/* ----------------------------------------------------------- */}
        <li
          ref={(el) => {
            if (labelRefs.current) labelRefs.current[2] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
            pointerEvents: "auto",
          }}
          className={`transition-opacity duration-300 ${
            isZoneActive(2)
              ? "opacity-100 z-30"
              : isZoneDimmed(2)
              ? "opacity-60 hover:opacity-100 z-10"
              : "opacity-85 hover:opacity-100 z-20"
          }`}
        >
          {/* Subtle Terminal Dot on data center building */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`block rounded-full transition-all duration-300 ${
                isZoneActive(2)
                  ? "w-2.5 h-2.5 bg-[#3D9E32] shadow-[0_0_8px_rgba(61,158,50,0.9)]"
                  : "w-2 h-2 bg-[#3D9E32]/75 shadow-none"
              }`}
            />
          </div>

          {/* Dotted Horizontal Leader Line (64px) */}
          <svg
            className="absolute overflow-visible pointer-events-none"
            style={{ left: 0, top: 0, width: 64, height: 2 }}
          >
            <line
              x1="0"
              y1="0"
              x2="64"
              y2="0"
              stroke="#3D9E32"
              strokeWidth={isZoneActive(2) ? "1.75" : "1.25"}
              strokeDasharray="2 3"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                isZoneActive(2)
                  ? "drop-shadow-[0_0_4px_rgba(61,158,50,0.7)] opacity-100"
                  : "opacity-50"
              }`}
            />
          </svg>

          {/* Clean Typographic Label */}
          <div
            className="absolute pointer-events-auto"
            style={{ left: 64, top: 0, transform: "translate(0, -50%)" }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectZone(2)}
              onMouseEnter={() => onHoverZone(2)}
              onMouseLeave={() => onHoverZone(null)}
              onFocus={() => onHoverZone(2)}
              onBlur={() => onHoverZone(null)}
              data-cursor="view-details"
              className="group flex flex-col items-start text-left cursor-pointer focus:outline-none pl-2 py-1 select-none"
              aria-label="View Data Centers details"
            >
              {/* Green Dot + Number */}
              <div
                className="flex items-center space-x-1.5"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #000) drop-shadow(0 0 6px rgba(0,0,0,0.95))",
                }}
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isZoneActive(2)
                      ? "w-2 h-2 bg-[#3D9E32] shadow-[0_0_6px_rgba(61,158,50,0.9)]"
                      : "w-1.5 h-1.5 bg-[#3D9E32]/80"
                  }`}
                />
                <span
                  className={`text-[12px] font-mono tracking-[0.14em] transition-colors duration-300 ${
                    isZoneActive(2)
                      ? "text-[#FFFFFF] font-bold"
                      : "text-[#FFFFFF]/80 font-semibold"
                  }`}
                >
                  03
                </span>
              </div>

              {/* Title */}
              <div
                className="mt-0.5 text-left text-[#FFFFFF] font-mono font-bold text-[12px] sm:text-[13px] tracking-[0.14em] leading-tight"
                style={{
                  filter:
                    "drop-shadow(0 2px 4px #000) drop-shadow(0 0 8px rgba(0,0,0,0.98))",
                }}
              >
                <span className="block whitespace-nowrap">DATA CENTERS</span>
              </div>
            </button>
          </div>
        </li>

        {/* ----------------------------------------------------------- */}
        {/* 04 RECYCLING                                                */}
        {/* ----------------------------------------------------------- */}
        <li
          ref={(el) => {
            if (labelRefs.current) labelRefs.current[3] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            willChange: "transform",
            pointerEvents: "auto",
          }}
          className={`transition-opacity duration-300 ${
            isZoneActive(3)
              ? "opacity-100 z-30"
              : isZoneDimmed(3)
              ? "opacity-60 hover:opacity-100 z-10"
              : "opacity-85 hover:opacity-100 z-20"
          }`}
        >
          {/* Subtle Terminal Dot on recycling facility */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`block rounded-full transition-all duration-300 ${
                isZoneActive(3)
                  ? "w-2.5 h-2.5 bg-[#3D9E32] shadow-[0_0_8px_rgba(61,158,50,0.9)]"
                  : "w-2 h-2 bg-[#3D9E32]/75 shadow-none"
              }`}
            />
          </div>

          {/* Dotted Horizontal Leader Line (64px) */}
          <svg
            className="absolute overflow-visible pointer-events-none"
            style={{ left: -64, top: 0, width: 64, height: 2 }}
          >
            <line
              x1="64"
              y1="0"
              x2="0"
              y2="0"
              stroke="#3D9E32"
              strokeWidth={isZoneActive(3) ? "1.75" : "1.25"}
              strokeDasharray="2 3"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                isZoneActive(3)
                  ? "drop-shadow-[0_0_4px_rgba(61,158,50,0.7)] opacity-100"
                  : "opacity-50"
              }`}
            />
          </svg>

          {/* Clean Typographic Label */}
          <div
            className="absolute pointer-events-auto"
            style={{ left: -64, top: 0, transform: "translate(-100%, -50%)" }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelectZone(3)}
              onMouseEnter={() => onHoverZone(3)}
              onMouseLeave={() => onHoverZone(null)}
              onFocus={() => onHoverZone(3)}
              onBlur={() => onHoverZone(null)}
              data-cursor="view-details"
              className="group flex flex-col items-start text-left cursor-pointer focus:outline-none pr-2 py-1 select-none"
              aria-label="View Recycling details"
            >
              {/* Green Dot + Number */}
              <div
                className="flex items-center space-x-1.5"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px #000) drop-shadow(0 0 6px rgba(0,0,0,0.95))",
                }}
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    isZoneActive(3)
                      ? "w-2 h-2 bg-[#3D9E32] shadow-[0_0_6px_rgba(61,158,50,0.9)]"
                      : "w-1.5 h-1.5 bg-[#3D9E32]/80"
                  }`}
                />
                <span
                  className={`text-[12px] font-mono tracking-[0.14em] transition-colors duration-300 ${
                    isZoneActive(3)
                      ? "text-[#FFFFFF] font-bold"
                      : "text-[#FFFFFF]/80 font-semibold"
                  }`}
                >
                  04
                </span>
              </div>

              {/* Title */}
              <div
                className="mt-0.5 text-left text-[#FFFFFF] font-mono font-bold text-[12px] sm:text-[13px] tracking-[0.14em] leading-tight"
                style={{
                  filter:
                    "drop-shadow(0 2px 4px #000) drop-shadow(0 0 8px rgba(0,0,0,0.98))",
                }}
              >
                <span className="block whitespace-nowrap">RECYCLING</span>
              </div>
            </button>
          </div>
        </li>
      </ol>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Semantic Bar (< 768px) with direct tap affordance       */}
      {/* ------------------------------------------------------------- */}
      <ol className="md:hidden flex flex-wrap justify-center gap-1.5 mt-3 px-2 w-full">
        {businesses.map((biz) => {
          const isActive = isZoneActive(biz.index);

          return (
            <li key={biz.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onHoverZone(biz.index);
                  onSelectZone(biz.index);
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all duration-300 flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-[#3D9E32] text-white shadow-md font-semibold"
                    : "bg-white/60 text-[#38484E] hover:bg-white/90"
                }`}
                aria-label={`View ${biz.title} details`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-white" : "bg-[#52636A]"
                  }`}
                />
                <span>0{biz.index + 1}</span>
                <span>{biz.shortName}</span>
                {isActive && (
                  <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded text-white/90 font-mono tracking-normal ml-1">
                    ENTER
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
};
