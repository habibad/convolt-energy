"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import gsap from "gsap";

interface HeroHeaderProps {
  introReady: boolean;
  theme?: "dark-ui" | "light-ui";
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  introReady,
  theme = "dark-ui",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isLightUi = theme === "light-ui";

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Team", href: "#team" },
    { label: "Media", href: "#media" },
    { label: "Press Releases", href: "#press" },
    { label: "Resources", href: "#resources" },
    { label: "Contact", href: "#contact" },
  ];

  // Cinematic header intro reveal: logo -> nav items (staggered) -> CTA
  useEffect(() => {
    if (!introReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.1 }
      )
        .fromTo(
          navItemsRef.current ? navItemsRef.current.children : [],
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.7 },
          "-=0.4"
        );
    }, headerRef);

    return () => ctx.revert();
  }, [introReady]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 h-[80px] md:h-[88px] w-full transition-colors duration-500 pointer-events-auto"
    >
      <div className="max-w-[1540px] mx-auto h-full px-[clamp(20px,4vw,64px)] flex items-center justify-between">
        {/* Convalt Energy Brand Logo */}
        <div ref={logoRef} className="opacity-0 flex items-center">
          <a
            href="/"
            className="group flex flex-col items-start select-none focus:outline-none"
            aria-label="Convalt Energy Home"
          >
            <div
              className={`flex items-center tracking-tight text-[19px] sm:text-[21px] font-semibold transition-colors duration-500 ${
                isLightUi ? "text-[#F4F3EF]" : "text-[#101A1D]"
              }`}
            >
              <span className="font-bold tracking-tight">CONVALT</span>
              {/* Green accent orb dot matching brand identity */}
              <span className="inline-block w-[7px] h-[7px] rounded-full bg-[#63A75B] mx-[3px] shadow-[0_0_8px_rgba(99,167,91,0.6)]" />
            </div>
            <span
              className={`text-[10px] sm:text-[11px] font-medium tracking-[0.28em] -mt-[3px] uppercase transition-colors duration-500 ${
                isLightUi ? "text-[#F4F3EF]/75" : "text-[#101A1D]/75"
              }`}
            >
              ENERGY
            </span>
          </a>
        </div>

        {/* Center / Right Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul ref={navItemsRef} className="flex items-center space-x-7 xl:space-x-9">
            {navLinks.map((link) => (
              <li key={link.label} className="opacity-0">
                <a
                  href={link.href}
                  className={`relative group py-2 text-[13px] xl:text-[14px] font-medium transition-colors duration-350 ${
                    isLightUi
                      ? "text-[#F4F3EF]/75 hover:text-[#F4F3EF]"
                      : "text-[#101A1D]/75 hover:text-[#101A1D]"
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Subtle 1px underline reveal */}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-350 ease-out group-hover:w-full ${
                      isLightUi ? "bg-[#F4F3EF]" : "bg-[#101A1D]"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Far Right Action CTA */}
        <div ref={ctaRef} className="hidden sm:flex items-center opacity-0">
          <a
            href="#contact"
            className={`group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[13px] font-medium tracking-wide shadow-sm transition-all duration-350 ${
              isLightUi
                ? "bg-white/15 text-[#F4F3EF] hover:bg-white/25 border border-white/20 backdrop-blur-sm"
                : "bg-[#101A1D] text-[#F4F3EF] hover:bg-[#152327]"
            }`}
          >
            <span className="relative z-10 mr-2">Let&apos;s Connect</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-350 ease-out group-hover:translate-x-1 text-[#F4F3EF]" />
            {!isLightUi && (
              <span className="absolute inset-0 rounded-full border border-white/10" />
            )}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 focus:outline-none transition-colors duration-500 ${
              isLightUi ? "text-[#F4F3EF]" : "text-[#101A1D]"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`sm:hidden absolute top-[80px] left-0 right-0 px-6 py-8 shadow-xl flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
            isLightUi
              ? "bg-[#101A1D]/95 backdrop-blur-md border-b border-white/10 text-[#F4F3EF]"
              : "bg-[#F4F3EF]/95 backdrop-blur-md border-b border-black/10 text-[#101A1D]"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-1 hover:text-[#63A75B] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-current/10">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`inline-flex w-full items-center justify-center py-3 rounded-full text-sm font-medium ${
                isLightUi
                  ? "bg-[#63A75B] text-white"
                  : "bg-[#101A1D] text-[#F4F3EF]"
              }`}
            >
              <span>Let&apos;s Connect</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
