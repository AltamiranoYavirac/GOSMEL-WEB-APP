import {
  AboutSecondaryVideo,
  AboutConcerts,
  AboutPillars,
  AboutValues,
  AboutTestimonials,
  AboutCTA,
} from "@/features/about";
import { AppImages } from "@/shared/config/images";
import { PILLARS, TESTIMONIALS, VALUES } from "./about.constants";

export default function AboutPage() {
  return (
    <div className="px-4 pt-28 pb-16 flex flex-col items-center gap-16">
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
        title="Sube al escenario con tu propia voz"
        description="Reserva una clase de prueba gratuita y descubre cómo suena tu camino musical junto a nuestros maestros."
        primaryLabel="Reservar clase de prueba"
        primaryHref="/register"
        secondaryLabel="Conocer a los maestros"
        secondaryHref="/about"
      />
    </div>
  );
}