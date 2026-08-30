import FaqSection from "./FaqSection";
import FinalCtaSection from "./FinalCtaSection";
import HeroSection from "./HeroSection";
import HighlightsSection from "./HighlightsSection";
import HowItWorksSection from "./HowItWorksSection";
import PhilosophySection from "./PhilosophySection";
import ProgramsSection from "./ProgramsSection";
import TestimonialsSection from "./TestimonialsSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <PhilosophySection />
      <ProgramsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
