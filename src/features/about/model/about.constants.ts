import { AppImages } from "@/shared/config";

import type { IAboutTestimonial, IAboutValue } from "./about.types";

export const ABOUT_VALUES: IAboutValue[] = [
  {
    title: "Pasión",
    description:
      "El motor de nuestra creatividad y la chispa de vida a cada nota que interpretamos.",
    imageUrl: AppImages.ABOUT_PASSION,
    imageAlt: "Estudiante de canto interpretando con pasión",
  },
  {
    title: "Disciplina",
    description:
      "El camino riguroso hacia la maestría. Sin constancia, no existe el verdadero arte.",
    imageUrl: AppImages.ABOUT_DISCIPLINE,
    imageAlt: "Estudiante practicando piano con disciplina",
  },
  {
    title: "Innovación",
    description:
      "Evolucionando el sonido del mañana mediante la exploración de nuevas fronteras sonoras.",
    imageUrl: AppImages.ABOUT_INNOVATION,
    imageAlt: "Profesora acompañando en guitarra a un estudiante de violín",
  },
];

export const ABOUT_TESTIMONIALS: IAboutTestimonial[] = [
  {
    quote:
      "GOSMEL no solo me enseñó técnica, me enseñó a encontrar mi propia voz en un mundo saturado de ruido. Fue un punto de inflexión en mi carrera.",
    author: "El Mau",
    role: "Estudiante de Violín",
  },
  {
    quote:
      "La disciplina que aprendí aquí es la base de todo lo que he logrado hoy en los escenarios internacionales. Una experiencia transformadora.",
    author: "El Fify",
    role: "Estudiante de Guitarra",
  },
];
