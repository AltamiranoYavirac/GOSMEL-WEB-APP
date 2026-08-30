import { getCurrentYear } from "@/shared/lib";
import type { IHeroSlide } from "./HeroCarouselSection.types";

export const SLIDE_META: Omit<IHeroSlide, "image" | "alt">[] = [
  {
    badge: `Matrículas abiertas ${getCurrentYear()}`,
    title: "GOSMEL",
    subtitle: "Tu Pasión, Nuestra Música",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Clases personalizadas",
    title: "Aprende con",
    subtitle: "Los Mejores Maestros",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Piano • Guitarra • Violín • Canto",
    title: "Todos los",
    subtitle: "Instrumentos en un Solo Lugar",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Para todas las edades",
    title: "Excelencia",
    subtitle: "Académica desde el Primer Día",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Música en conjunto",
    title: "Toca con",
    subtitle: "Otros Músicos",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Conciertos y recitales",
    title: "Demuestra tu",
    subtitle: "Talento en Escena",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Canto • Técnica vocal",
    title: "Descubre el",
    subtitle: "Poder de tu Voz",
    cta: { label: "Inscríbete Ahora", href: "/register" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
];
