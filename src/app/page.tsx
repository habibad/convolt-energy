import { Hero } from "@/components/home/hero/Hero";
import { ApproachSection } from "@/components/home/approach/ApproachSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#101A1D]">
      {/* Convalt Energy — Phase 01: Immersive 3D Hero Experience */}
      <Hero />

      {/* Convalt Energy — Phase 04: Our Approach / Integrated Value Chain */}
      <ApproachSection />
    </main>
  );
}
