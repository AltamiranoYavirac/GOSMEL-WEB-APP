import { AppImages } from "@/shared/config";
import type { IInstrumentFamily } from "./InstrumentsTabsSection.types";

export const INSTRUMENT_FAMILIES: IInstrumentFamily[] = [
  {
    id: "piano",
    name: "Piano & Teclados",
    icon: "ph:piano-keys",
    title: "El Alma Armónica de la Música",
    tagline: "Desde lectura de partituras hasta repertorio clásico y contemporáneo",
    description:
      "Desarrolla coordinación bilateral, técnica pianística, dinámicas expresivas y lectura fluida con un enfoque pedagógico progresivo adaptado a tu edad y metas.",
    image: AppImages.WHY_PIANO,
    imageAlt: "Manos de estudiante tocando las teclas de un piano acústico",
    features: [
      "Lectura a primera vista y armonía aplicada",
      "Independencia de manos y digitación profesional",
      "Repertorio clásico, popular, jazz y bandas sonoras",
      "Preparación para audiciones y recitales en vivo",
    ],
    courseHref: "/courses",
  },
  {
    id: "guitarra",
    name: "Cuerdas & Guitarra",
    icon: "ph:guitar",
    title: "Versatilidad, Ritmo y Sentimiento",
    tagline: "Guitarra acústica, eléctrica, violín y charango",
    description:
      "Domina acordes, escalas, arpegios y técnicas solistas. Ya sea con cuerdas de nylon, metal o frotadas, aprenderás a proyectar tu sonido con precisión y musicalidad.",
    image: AppImages.WHY_GUITAR,
    imageAlt: "Profesor de música guiando la postura de acordes de guitarra",
    features: [
      "Técnica de púa, fingerpicking y postura ergonómica",
      "Improvisación, acompañamiento y solos melódicos",
      "Teoría de acordes, escalas modales y afinaciones",
      "Ensamble y participación en bandas de la academia",
    ],
    courseHref: "/courses",
  },
  {
    id: "canto",
    name: "Canto & Voz",
    icon: "ph:microphone-stage",
    title: "Tu Propio Instrumento Natural",
    tagline: "Técnica vocal, afinación, respiración y proyección",
    description:
      "Descubre el rango pleno de tu voz con ejercicios de apoyo diafragmático, colocación, resonadores y cuidado vocal para cantar con libertad y seguridad escénica.",
    image: AppImages.ABOUT_PASSION,
    imageAlt: "Estudiante de canto interpretando con técnica y emoción",
    features: [
      "Control diafragmático y respiración intercostal",
      "Ampliación del registro vocal y afinación precisa",
      "Interpretación, dicción y presencia en escenario",
      "Estilos pop, lírico, baladas y música contemporánea",
    ],
    courseHref: "/courses",
  },
  {
    id: "solfeo",
    name: "Solfeo & Teoría",
    icon: "ph:music-notes-plus",
    title: "El Lenguaje Universal de la Música",
    tagline: "Lectura rítmica, entrenamiento auditivo y composición",
    description:
      "Entiende la estructura detrás de cada obra musical. El solfeo te da la llave para leer cualquier partitura y comunicarte con soltura con otros músicos.",
    image: AppImages.COURSE_SOLFEO,
    imageAlt: "Partituras y material pedagógico de solfeo en GOSMEL",
    features: [
      "Lectura métrica, rítmica y entonación de intervalos",
      "Dictado melódico, armónico y transcripción",
      "Armonía funcional, análisis y arreglos musicales",
      "Base sólida complementaria a cualquier instrumento",
    ],
    courseHref: "/courses",
  },
];
