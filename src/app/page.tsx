import { Hero } from "@/components/home/hero/Hero";
import { ApproachSection } from "@/components/home/approach/ApproachSection";
import { CommitmentSection } from "@/components/home/commitment/CommitmentSection";
import { FinalCTASection } from "@/components/home/final-cta/FinalCTASection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#101A1D]">
      {/* Convalt Energy — Phase 01: Immersive 3D Hero Experience */}
      <Hero />

      {/* Convalt Energy — Phase 04: Our Approach / Integrated Value Chain */}
      <ApproachSection />

      {/* Convalt Energy — Phase 05: Our Commitment Cinematic Closing */}
      <CommitmentSection />

      {/* Convalt Energy — Phase 06: Final CTA + Footer Cinematic Closing Sequence */}
      <FinalCTASection />
    </main>
  );
}
