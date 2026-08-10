import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";
import HeroCarouselSection from "./HeroCarouselSection";
import HeroSection from "./HeroSection";
import CoursesSection from "./CoursesSection";
import WhySection from "./WhySection";
import StatsSection from "./StatsSection";
import { AppImages } from "@/shared/config/images";



export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroCarouselSection />
      <HeroSection />
      <CoursesSection />
      <WhySection />
      <StatsSection />
      <Footer />
    </>
  );
}