"use client";

import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Position state refs for requestAnimationFrame lerp
  const mouseRef = useRef({ x: -100, y: -100 });
  const followerRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
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
        'a, button, [role="button"], input, select, textarea, [data-cursor="hover"], .cursor-pointer'
      );
      const hovered = !!target;
      isHoveredRef.current = hovered;
      setIsHovered(hovered);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      isHoveredRef.current = false;
      setIsHovered(false);
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

    // Physics animation loop:
    // When idle: follower ring lags behind smoothly (~0.12)
    // On link hover: follower ring accelerates (~0.24) and rushes over to encircle the pointer icon right in the center
    const tick = () => {
      const isHov = isHoveredRef.current;

      // When hovering on a link/button, the pointer hand cursor has its visual center at (+5px, +7px) relative to the hotspot
      const targetX = isHov ? mouseRef.current.x + 5 : mouseRef.current.x;
      const targetY = isHov ? mouseRef.current.y + 7 : mouseRef.current.y;

      const lerpSpeed = isHov ? 0.24 : 0.12;

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

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Outer Follower Ring ("Goal mouse effect" that rushes over and encircles the mouse pointer icon) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-250 ease-out flex items-center justify-center ${
          isHovered
            ? "w-[54px] h-[54px] border-2 border-white/90 bg-white/[0.08] backdrop-blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110"
            : isPressed
            ? "w-7 h-7 border border-white/60 bg-white/20 scale-90"
            : "w-9 h-9 border border-white/40 bg-transparent scale-100"
        }`}
        style={{
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      >
        {/* Subtle decorative inner halo on hover */}
        {isHovered && (
          <div className="w-10 h-10 rounded-full border border-white/25 pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
};
