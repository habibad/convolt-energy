"use client";

import { useEffect, useRef, useState } from "react";

interface PointerParallaxState {
  x: number; // Current smoothed x [-1, 1]
  y: number; // Current smoothed y [-1, 1]
  targetX: number;
  targetY: number;
  isHovered: boolean;
}

/**
 * usePointerParallax:
 * Provides smooth, frame-rate independent pointer coordinates for 3D camera and layer parallax.
 * Automatically damps to neutral center when pointer exits or on touch devices.
 */
export function usePointerParallax(damping = 0.05) {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const stateRef = useRef<PointerParallaxState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovered: false,
  });

  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Disable on coarse pointer devices (touchscreens/mobile)
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;

      // Normalize to -1 -> +1
      const nx = (e.clientX - halfWidth) / halfWidth;
      const ny = (e.clientY - halfHeight) / halfHeight;

      stateRef.current.targetX = Math.max(-1, Math.min(1, nx));
      stateRef.current.targetY = Math.max(-1, Math.min(1, ny));
      stateRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      // Smoothly return toward center
      stateRef.current.targetX = 0;
      stateRef.current.targetY = 0;
      stateRef.current.isHovered = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      const state = stateRef.current;
      // Exponential smoothing
      state.x += (state.targetX - state.x) * damping;
      state.y += (state.targetY - state.y) * damping;

      // Only trigger state update when delta is noticeable
      setCoords({
        x: parseFloat(state.x.toFixed(4)),
        y: parseFloat(state.y.toFixed(4)),
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [damping]);

  return coords;
}
