"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-[#101A1D] rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close video modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 text-[11px] tracking-[0.2em] uppercase text-[#63A75B]">
            <span>CONVALT ENERGY MEDIA</span>
          </div>
          <h3 id="video-modal-title" className="text-2xl font-light text-[#F4F3EF]">
            The Clean Energy Infrastructure Vision
          </h3>
          <p className="text-sm text-[#9AA7AE] max-w-xl">
            A comprehensive preview of Convalt&apos;s integrated manufacturing, power generation, and sustainable ecosystem.
          </p>

          <div className="aspect-video w-full rounded-xl bg-black/60 border border-white/5 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#13211F]/80 to-transparent pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 relative z-10">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-[#F4F3EF] ml-1" />
            </div>
            <p className="text-[#F4F3EF] text-sm font-medium tracking-wide relative z-10">
              Official Documentary Feature
            </p>
            <p className="text-xs text-[#9AA7AE] mt-1 relative z-10">
              High-definition production media will stream upon launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
