import {
  AboutSecondaryVideo,
  AboutConcerts,
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
        <AboutSecondaryVideo
          videoUrl={AppImages.ABOUT_VIDEO_PORTRAIT}
          posterUrl={AppImages.ABOUT_VIDEO_PORTRAIT_POSTER}
          videoTitle="Una academia con alma"
          description="En GOSMEL Music Academy formamos músicos desde 2015 con una metodología que combina la tradición de los conservatorios con un enfoque moderno y humano. Nuestros maestros, graduados de prestigiosos conservatorios, guían a cada estudiante en un viaje personal de descubrimiento musical, desde los fundamentos hasta el escenario."
        />
        <AboutConcerts
          videoUrl={AppImages.ABOUT_VIDEO}
          posterUrl={AppImages.ABOUT_VIDEO_POSTER}
          videoTitle="Nuestros Conciertos"
          description="En GOSMEL cada etapa culmina con un concierto en vivo. Nuestros estudiantes suben al escenario para mostrar lo aprendido y vivir la experiencia real de una presentación."
        />
        <AboutPillars pillars={PILLARS} />
        <AboutValues values={VALUES} />
        <AboutTestimonials testimonials={TESTIMONIALS} />
        <AboutCTA
          title="¿Estás listo para encontrar tu esencia?"
          description="Las inscripciones para el próximo semestre están abiertas. Únete a la élite musical."
          primaryLabel="¡Inscribete ahora!"
          primaryHref="/contact"
          secondaryLabel="Ver Cursos"
          secondaryHref="/courses"
        />
      </main>

      <Footer />
    </>
  );
}