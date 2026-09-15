import { getPublicCourses } from "@/features/courses";
import { getPublicPrograms } from "@/features/programas";

import CoursesSection from "./CoursesSection";
import ExperienceGallerySection from "./ExperienceGallerySection";
import FaqSection from "./FaqSection";
import FinalCtaSection from "./FinalCtaSection";
import HeroSection from "./HeroSection";
import HighlightsSection from "./HighlightsSection";
import HowItWorksSection from "./HowItWorksSection";
import MetricsSection from "./MetricsSection";
import PhilosophySection from "./PhilosophySection";
import ProgramsTeaserSection from "./ProgramsTeaserSection";
import TestimonialsSection from "./TestimonialsSection";

export default async function LandingPage() {
  const [coursesResult, programsResult] = await Promise.all([
    getPublicCourses(),
    getPublicPrograms(),
  ]);

  if (coursesResult.error) throw new Error(coursesResult.error);
  if (programsResult.error) throw new Error(programsResult.error);

  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <PhilosophySection
        coursesCount={coursesResult.data?.length ?? 0}
        programsCount={programsResult.data?.length ?? 0}
      />
      <MetricsSection />
      <ExperienceGallerySection />
      <CoursesSection courses={coursesResult.data ?? []} />
      <ProgramsTeaserSection programs={programsResult.data ?? []} />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
