"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FOOTER_DATA } from "@/data/footerData";

export const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    // Success feedback
    setStatus("success");
    setEmail("");
  };

  const newsletter = FOOTER_DATA.newsletter;

  return (
    <div className="flex flex-col justify-start w-full">
      <h3 className="text-[11px] sm:text-[11.5px] font-mono font-semibold tracking-[0.20em] uppercase text-white mb-2.5">
        {newsletter.title}
      </h3>

      <p className="text-[13px] sm:text-[13.5px] leading-[1.55] font-normal text-[#9AA7AE] mb-4 max-w-[340px]">
        {newsletter.description}
      </p>

      {/* Pill Form Container matching reference */}
      <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
        <div className="relative flex items-center w-full rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 focus-within:border-[#78E070]/70 focus-within:shadow-[0_0_16px_rgba(120,224,112,0.2)] hover:border-white/35">
          <label htmlFor="newsletter-email" className="sr-only">
            {newsletter.placeholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholder}
            required
            className="w-full bg-transparent px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-[13.5px] text-white placeholder-[#889FA3] focus:outline-none pr-12"
          />

          {/* Connected Circular Arrow Submit Button */}
          <button
            type="submit"
            data-cursor="hover"
            aria-label="Submit newsletter subscription"
            className="absolute right-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/40 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:border-[#78E070] hover:text-[#78E070] focus:outline-none cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Consent Checkbox */}
        <div className="mt-3 flex items-center space-x-2.5 select-none">
          <label
            htmlFor="newsletter-consent"
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <input
              id="newsletter-consent"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-3.5 h-3.5 rounded-[3px] border border-white/30 peer-checked:bg-[#3D9E32] peer-checked:border-[#3D9E32] flex items-center justify-center transition-colors">
              {agreed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-[11px] font-normal text-[#9AA7AE] group-hover:text-[#D2E2E6] transition-colors">
              {newsletter.consentText}
            </span>
          </label>
        </div>

        {status === "success" && (
          <p className="mt-2 text-[11px] font-mono text-[#78E070]">
            Thank you for subscribing to Convalt updates.
          </p>
        )}
      </form>
    </div>
  );
};
