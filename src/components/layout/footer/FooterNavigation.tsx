"use client";

import React from "react";
import { FOOTER_DATA } from "@/data/footerData";
import { FooterNewsletter } from "./FooterNewsletter";

// Clean vector SVG icons matching the reference glyphs exactly
const SocialIcons = {
  linkedin: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
    </svg>
  ),
  youtube: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: () => (
    <svg
      className="w-5 h-5 stroke-current fill-none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
};

export const FooterNavigation: React.FC = () => {
  const brand = FOOTER_DATA.brand;
  const columns = FOOTER_DATA.columns;

  return (
    <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-12 pt-8 sm:pt-12 pb-6 z-20 pointer-events-auto select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0 items-start">
        {/* ----------------------------------------------------------- */}
        {/* COLUMN 1: BRAND (lg:col-span-3)                             */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-3 flex flex-col justify-start pr-4 sm:pr-8">
          <span className="text-[20px] sm:text-[22px] font-mono font-bold tracking-[0.24em] uppercase text-white">
            {brand.name}
          </span>

          <p className="mt-2.5 sm:mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#9AA7AE] max-w-[220px]">
            {brand.tagline.map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </p>

          {/* Social Icons matching reference */}
          <div className="mt-5 sm:mt-6 flex items-center space-x-4">
            {brand.socials.map((social) => {
              const IconComp = SocialIcons[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  aria-label={social.label}
                  className="text-white/80 hover:text-white transition-opacity duration-200"
                >
                  <IconComp />
                </a>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* COLUMN 2: EXPLORE (lg:col-span-2)                           */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-2 lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 flex flex-col justify-start">
          <h3 className="text-[11px] sm:text-[11.5px] font-mono font-semibold tracking-[0.20em] uppercase text-white mb-3 sm:mb-4">
            {columns[0].title}
          </h3>
          <ul className="flex flex-col space-y-2 sm:space-y-2.5">
            {columns[0].links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  data-cursor="hover"
                  className="text-[13px] sm:text-[13.5px] text-[#9AA7AE] hover:text-white transition-all duration-200 inline-block hover:translate-x-0.5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* COLUMN 3: BUSINESS AREAS (lg:col-span-2)                    */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-2 lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 flex flex-col justify-start">
          <h3 className="text-[11px] sm:text-[11.5px] font-mono font-semibold tracking-[0.20em] uppercase text-white mb-3 sm:mb-4">
            {columns[1].title}
          </h3>
          <ul className="flex flex-col space-y-2 sm:space-y-2.5">
            {columns[1].links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  data-cursor="hover"
                  className="text-[13px] sm:text-[13.5px] text-[#9AA7AE] hover:text-white transition-all duration-200 inline-block hover:translate-x-0.5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* COLUMN 4: COMPANY (lg:col-span-2)                           */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-2 lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 flex flex-col justify-start">
          <h3 className="text-[11px] sm:text-[11.5px] font-mono font-semibold tracking-[0.20em] uppercase text-white mb-3 sm:mb-4">
            {columns[2].title}
          </h3>
          <ul className="flex flex-col space-y-2 sm:space-y-2.5">
            {columns[2].links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  data-cursor="hover"
                  className="text-[13px] sm:text-[13.5px] text-[#9AA7AE] hover:text-white transition-all duration-200 inline-block hover:translate-x-0.5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* COLUMN 5: STAY IN TOUCH (lg:col-span-3)                     */}
        {/* ----------------------------------------------------------- */}
        <div className="lg:col-span-3 lg:border-l lg:border-white/10 lg:pl-6 xl:pl-8 flex flex-col justify-start">
          <FooterNewsletter />
        </div>
      </div>
    </div>
  );
};
