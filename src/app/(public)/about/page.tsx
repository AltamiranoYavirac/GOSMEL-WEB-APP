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
import type { IAboutPillar, IAboutValue, IAboutTestimonial } from "@/features/about";

export const metadata = {
  title: "Sobre Nosotros | GOSMEL Academia de Música",
  description: "Conoce la esencia, misión y valores de GOSMEL Academia de Música.",
};

const PILLARS: IAboutPillar[] = [
  {
    tag: "El Legado",
    description:
      "La chispa vital que da vida a cada una de nuestras interpretaciones.",
  },
  {
    tag: "Nuestra Misión",
    description:
      "El camino riguroso y constante hacia la verdadera maestría artística.",
  },
  {
    tag: "La Visión",
    description:
      "Explorando nuevas fronteras sonoras para definir el sonido del mañana.",
  },
];

const VALUES: IAboutValue[] = [
  {
    title: "Pasión",
    description:
      "El motor de nuestra creatividad y la chispa de vida a cada nota que interpretamos.",
    imageUrl: AppImages.ABOUT_PASSION,
  },
  {
    title: "Disciplina",
    description:
      "El camino riguroso hacia la maestría. Sin constancia, no existe el verdadero arte.",
    imageUrl: AppImages.ABOUT_DISCIPLINE,
  },
  {
    title: "Innovación",
    description:
      "Evolucionando el sonido del mañana mediante la exploración de nuevas fronteras sonoras.",
    imageUrl: AppImages.ABOUT_INNOVATION,
  },
];

const TESTIMONIALS: IAboutTestimonial[] = [
  {
    quote:
      "GOSMEL no solo me enseñó técnica, me enseñó a encontrar mi propia voz en un mundo saturado de ruido. Fue un punto de inflexión en mi carrera.",
    author: "El Mau",
    role: "Estudiante de Violin",
  },
  {
    quote:
      "La disciplina que aprendí aquí es la base de todo lo que he logrado hoy en los escenarios internacionales. Una experiencia transformadora.",
    author: "El Fify",
    role: "Estudiante de Guitarra",
  },
];

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
          primaryHref="/contact"
          secondaryLabel="Ver Cursos"
          secondaryHref="/courses"
        />
      </main>

      <Footer />
    </>
  );
}