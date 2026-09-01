import {
  AboutBehindScenes,
  AboutConcerts,
  AboutHero,
  AboutTestimonials,
  AboutValues,
  ABOUT_TESTIMONIALS,
  ABOUT_VALUES,
} from "@/features/about";
import { AppImages } from "@/shared/config";
import { CtaPanel } from "@/widgets/CtaPanel";

export const metadata = {
  title: "Nosotros | GOSMEL Music Academy",
  description: "Conoce la esencia, la misión y los valores de GOSMEL Music Academy.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 bg-background">
      <AboutHero
        image={AppImages.PAGE_HERO_ABOUT}
        imageAlt="Estudiantes de GOSMEL agradeciendo al público al final de un concierto"
        eyebrow="Sobre nosotros"
        title="Una academia donde la música se vive."
        description="Más que aprender notas, construyes herramientas para expresarte con confianza y disfrutar cada etapa del proceso."
        chips={["Comunidad unida", "Excelencia musical"]}
      />
      <AboutConcerts
        videoUrl={AppImages.ABOUT_VIDEO}
        posterUrl={AppImages.ABOUT_VIDEO_POSTER}
        videoTitle="La música también se vive en escena."
        description="Cada etapa cierra con una presentación en público: la oportunidad perfecta para consolidar lo aprendido, ganar confianza y celebrar tu evolución musical."
      />
      <AboutBehindScenes
        videoUrl={AppImages.ABOUT_VIDEO_PORTRAIT}
        posterUrl={AppImages.ABOUT_VIDEO_PORTRAIT_POSTER}
        videoTitle="Así se prepara cada presentación."
        description="Del salón de práctica al escenario: un vistazo cercano al proceso que viven nuestros estudiantes antes de cada concierto."
      />
      <AboutValues values={ABOUT_VALUES} />
      <AboutTestimonials testimonials={ABOUT_TESTIMONIALS} />
      <CtaPanel
        titleId="about-cta-title"
        title="Tu próxima canción empieza aquí."
        description="Cuéntanos qué te gustaría aprender y te ayudamos a encontrar el curso que mejor se adapta a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Hablar con nosotros", href: "/contact" }}
      />
    </div>
  );
}
