"use client";

import React, { useEffect, useRef } from "react";

interface FooterTerrainProps {
  reducedMotion?: boolean;
}

export const FooterTerrain: React.FC<FooterTerrainProps> = ({
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isVisible = true;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Terrain grid configuration
    const NUM_CURVES = 14; // Horizontal longitudinal wave curves
    const NUM_COLS = 54; // Vertical transverse connecting points

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (!reducedMotion) {
        time += 0.004; // Very slow, graceful 12-15s cycle
      }

      ctx.clearRect(0, 0, width, height);

      // Precalculate 2D grid heights
      const grid: { x: number; y: number }[][] = [];

      for (let r = 0; r < NUM_CURVES; r++) {
        const rowPoints: { x: number; y: number }[] = [];
        const depthNorm = r / (NUM_CURVES - 1); // 0 (back) to 1 (front)

        // Baseline Y position
        const baseY = height * 0.42 + depthNorm * height * 0.45;

        for (let c = 0; c <= NUM_COLS; c++) {
          const xNorm = c / NUM_COLS;
          const x = xNorm * width;

          // Multi-frequency harmonic wave (creates organic hills matching the reference)
          const wave1 = Math.sin(xNorm * Math.PI * 3.2 + time + depthNorm * 1.5) * (26 + depthNorm * 12);
          const wave2 = Math.cos(xNorm * Math.PI * 5.5 - time * 0.7) * (14 + depthNorm * 8);
          const wave3 = Math.sin(xNorm * Math.PI * 1.8 + time * 0.4) * 18;

          // Taper edges softly
          const edgeTaper = Math.sin(xNorm * Math.PI);

          const y = baseY - (wave1 + wave2 + wave3) * edgeTaper;
          rowPoints.push({ x, y });
        }
        grid.push(rowPoints);
      }

      // 1. Draw Longitudinal Wireframe Curves (Back to Front)
      for (let r = 0; r < NUM_CURVES; r++) {
        const row = grid[r];
        const depthNorm = r / (NUM_CURVES - 1);
        const isCrest = r === 2 || r === 3; // The glowing ridge line

        ctx.beginPath();
        ctx.moveTo(row[0].x, row[0].y);
        for (let c = 1; c < row.length; c++) {
          const prev = row[c - 1];
          const curr = row[c];
          const mx = (prev.x + curr.x) / 2;
          const my = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }

        if (isCrest) {
          // Bright glowing green energy crest line
          ctx.strokeStyle = "rgba(120, 224, 112, 0.75)";
          ctx.lineWidth = 1.6;
          ctx.shadowColor = "#78E070";
          ctx.shadowBlur = 8;
        } else {
          // Muted dark evergreen wireframe lines
          const alpha = 0.12 + depthNorm * 0.22;
          ctx.strokeStyle = `rgba(61, 158, 50, ${alpha.toFixed(2)})`;
          ctx.lineWidth = 0.85;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }

      // Reset shadow
      ctx.shadowBlur = 0;

      // 2. Draw Transverse Grid Connecting Ribs
      for (let c = 0; c <= NUM_COLS; c += 2) {
        ctx.beginPath();
        ctx.moveTo(grid[0][c].x, grid[0][c].y);
        for (let r = 1; r < NUM_CURVES; r++) {
          ctx.lineTo(grid[r][c].x, grid[r][c].y);
        }
        const xNorm = c / NUM_COLS;
        const edgeAlpha = Math.sin(xNorm * Math.PI) * 0.16;
        ctx.strokeStyle = `rgba(74, 147, 66, ${edgeAlpha.toFixed(2)})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      if (!reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reducedMotion]);

  return (
    <div
      className="absolute bottom-10 inset-x-0 h-40 sm:h-48 md:h-56 pointer-events-none select-none z-10 overflow-hidden mix-blend-screen"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none opacity-90"
      />
    </div>
  );
};
