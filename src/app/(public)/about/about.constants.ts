import { IAboutPillar, IAboutTestimonial, IAboutValue } from "@/features/about";
import { AppImages } from "@/shared/config";

export const metadata = {
  title: "Sobre Nosotros | GOSMEL Academia de Música",
  description: "Conoce la esencia, misión y valores de GOSMEL Academia de Música.",
};

export const PILLARS: IAboutPillar[] = [
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

export const VALUES: IAboutValue[] = [
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

export const TESTIMONIALS: IAboutTestimonial[] = [
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