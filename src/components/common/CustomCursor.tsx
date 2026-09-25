"use client";

import React, { useEffect, useRef, useState } from "react";

export type CursorType = "default" | "hover" | "view-details" | "back" | "view";

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [isPressed, setIsPressed] = useState(false);

  // Position state refs for requestAnimationFrame lerp
  const mouseRef = useRef({ x: -100, y: -100 });
  const followerRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorTypeRef = useRef<CursorType>("default");
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        '[data-cursor="view-details"], [data-cursor="back"], [data-cursor="view"], a, button, [role="button"], input, select, textarea, [data-cursor="hover"], .cursor-pointer'
      );

      if (!target) {
        cursorTypeRef.current = "default";
        setCursorType("default");
        return;
      }

      const explicitCursor = target.getAttribute("data-cursor");
      if (explicitCursor === "view-details") {
        cursorTypeRef.current = "view-details";
        setCursorType("view-details");
      } else if (explicitCursor === "back") {
        cursorTypeRef.current = "back";
        setCursorType("back");
      } else if (explicitCursor === "view") {
        cursorTypeRef.current = "view";
        setCursorType("view");
      } else {
        cursorTypeRef.current = "hover";
        setCursorType("hover");
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      cursorTypeRef.current = "default";
      setCursorType("default");
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    const tick = () => {
      const cType = cursorTypeRef.current;
      const isSpecial = cType === "view-details" || cType === "back" || cType === "view";
      const isHov = cType === "hover";

      // On special interactive hotspots, center the circle exactly on pointer
      const targetX = isSpecial ? mouseRef.current.x : isHov ? mouseRef.current.x + 5 : mouseRef.current.x;
      const targetY = isSpecial ? mouseRef.current.y : isHov ? mouseRef.current.y + 7 : mouseRef.current.y;

      const lerpSpeed = isSpecial ? 0.22 : isHov ? 0.24 : 0.12;

      followerRef.current.x += (targetX - followerRef.current.x) * lerpSpeed;
      followerRef.current.y += (targetY - followerRef.current.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${followerRef.current.x}px, ${followerRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isViewDetails = cursorType === "view-details";
  const isBack = cursorType === "back";
  const isView = cursorType === "view";
  const isStandardHover = cursorType === "hover";

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
      {/* Outer Interactive Follower Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-[width,height,background-color,border-color,box-shadow,transform] duration-250 ease-out flex items-center justify-center ${
          isViewDetails
            ? "w-[82px] h-[82px] border-2 border-[#3D9E32] bg-[#0E1A1A]/85 backdrop-blur-[6px] shadow-[0_0_24px_rgba(61,158,50,0.5)] scale-100"
            : isBack
            ? "w-[70px] h-[70px] border border-[#3D9E32]/80 bg-[#0E1A1A]/85 backdrop-blur-[6px] shadow-[0_0_18px_rgba(61,158,50,0.4)] scale-100"
            : isView
            ? "w-[64px] h-[64px] border border-[#3D9E32]/80 bg-[#0E1A1A]/85 backdrop-blur-[6px] shadow-[0_0_16px_rgba(61,158,50,0.4)] scale-100"
            : isStandardHover
            ? "w-[54px] h-[54px] border-2 border-white/90 bg-white/[0.08] backdrop-blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110"
            : isPressed
            ? "w-7 h-7 border border-white/60 bg-white/20 scale-90"
            : "w-9 h-9 border border-white/40 bg-transparent scale-100"
        }`}
        style={{
          willChange: "transform",
          mixBlendMode: isViewDetails || isBack || isView ? "normal" : "difference",
        }}
      >
        {/* VIEW DETAILS Label */}
        {isViewDetails && (
          <div className="flex flex-col items-center justify-center leading-[1.08] pointer-events-none select-none">
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-white">VIEW</span>
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#78E070]">DETAILS</span>
          </div>
        )}

        {/* BACK Label */}
        {isBack && (
          <div className="flex items-center justify-center pointer-events-none select-none">
            <span className="text-[10.5px] font-mono font-bold tracking-[0.18em] text-[#78E070]">BACK</span>
          </div>
        )}

        {/* VIEW Label */}
        {isView && (
          <div className="flex items-center justify-center pointer-events-none select-none">
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-white">VIEW</span>
          </div>
        )}

        {/* Standard Hover Halo */}
        {isStandardHover && (
          <div className="w-10 h-10 rounded-full border border-white/25 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
};
