import {
  AboutVideo,
  AboutPillars,
  AboutValues,
  AboutTestimonials,
  AboutCTA,
} from "@/features/about";
import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";
import { AppImages } from "@/shared/config/images";
import { PILLARS, TESTIMONIALS, VALUES } from "./about.constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8f6ef] dark:bg-neutral-950 px-4 pt-28 pb-16 flex flex-col items-center gap-16">
        <AboutVideo
          posterUrl={AppImages.HERO_COVER}
          videoTitle="Explora la Academia GOSMEL"
        />
        <AboutPillars pillars={PILLARS} />
        <AboutValues values={VALUES} />
        <AboutTestimonials testimonials={TESTIMONIALS} />
        <AboutCTA
          title="¿Estás listo para encontrar tu esencia?"
          description="Las inscripciones para el próximo semestre están abiertas. Únete a la élite musical."
          primaryLabel="¡Inscribete ahora!"
          primaryHref="/register"
          secondaryLabel="Ver Cursos"
          secondaryHref="/courses"
        />
      </main>

      <Footer />
    </>
  );
}