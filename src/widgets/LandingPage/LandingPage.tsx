import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";
import HeroCarouselSection from "./HeroCarouselSection";
import HeroSection from "./HeroSection";
import CoursesSection from "./CoursesSection";
import WhySection from "./WhySection";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroCarouselSection />
      <HeroSection />
      <CoursesSection />
      <WhySection />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}
