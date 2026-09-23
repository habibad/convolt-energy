"use client";

import { useEffect, useState } from "react";

export interface WebGLCapability {
  isSupported: boolean;
  isSoftwareRenderer: boolean;
  tier: "high" | "medium" | "low" | "fallback";
  maxDpr: number;
}

/**
 * useWebGLCapability:
 * Proactively inspects WebGL 2/1 context, checks for software fallbacks (SwiftShader/llvmpipe),
 * and provides appropriate DPR and rendering tier.
 */
export function useWebGLCapability(): WebGLCapability {
  const [capability, setCapability] = useState<WebGLCapability>({
    isSupported: true,
    isSoftwareRenderer: false,
    tier: "high",
    maxDpr: 1.5,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

      if (!gl) {
        setCapability({
          isSupported: false,
          isSoftwareRenderer: false,
          tier: "fallback",
          maxDpr: 1.0,
        });
        return;
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      let renderer = "";
      if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      }

      const isSoftware =
        /swiftshader|llvmpipe|softpipe|mesa|virtualbox/i.test(renderer);

      const isMobile =
        window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches;

      // Clean up WebGL context
      const loseContext = gl.getExtension("WEBGL_lose_context");
      if (loseContext) loseContext.loseContext();

      if (isSoftware) {
        setCapability({
          isSupported: true,
          isSoftwareRenderer: true,
          tier: "low",
          maxDpr: 1.0,
        });
      } else if (isMobile) {
        setCapability({
          isSupported: true,
          isSoftwareRenderer: false,
          tier: "medium",
          maxDpr: 1.25,
        });
      } else {
        setCapability({
          isSupported: true,
          isSoftwareRenderer: false,
          tier: "high",
          maxDpr: 1.5,
        });
      }
    } catch {
      setCapability({
        isSupported: false,
        isSoftwareRenderer: false,
        tier: "fallback",
        maxDpr: 1.0,
      });
    }
  }, []);

  return capability;
}
