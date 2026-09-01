import { AppImages } from "@/shared/config";

export const LANDING_HIGHLIGHTS = [
  {
    image: AppImages.LANDING_STAGE,
    imageAlt: "Estudiante de guitarra tocando en el recital de la academia",
    imagePosition: "center 28%",
    title: "Cada etapa cierra en escena",
    description:
      "La oportunidad de consolidar lo aprendido, ganar confianza y celebrar tu evolución musical.",
  },
  {
    image: AppImages.LANDING_TEACHERS,
    imageAlt: "Estudiante de canto interpretando con micrófono en el auditorio",
    imagePosition: "58% center",
    title: "Maestros de conservatorio",
    description:
      "Instructores graduados de conservatorios de prestigio con años de experiencia pedagógica y artística.",
  },
] as const;

export const LANDING_STATS = [
  { value: "5+", label: "Años de experiencia" },
  { value: "07", label: "Programas" },
  { value: "100%", label: "Clases personalizadas" },
  { value: "Lun—Sáb", label: "Horarios" },
] as const;

export const LANDING_PROGRAM_ORDER = [
  "Piano",
  "Violín",
  "Guitarra",
  "Solfeo",
  "Guitarra eléctrica",
  "Charango",
  "Quena",
] as const;

export const LANDING_PROGRAM_IMAGES = {
  Piano: AppImages.LANDING_PROGRAM_PIANO,
  Violín: AppImages.LANDING_PROGRAM_VIOLIN,
  Guitarra: AppImages.LANDING_PROGRAM_GUITAR,
  Solfeo: AppImages.LANDING_PROGRAM_SOLFEO,
  "Guitarra eléctrica": null,
  Charango: null,
  Quena: null,
} as const;

export const LANDING_PROGRAM_IMAGE_ALTS = {
  Piano: "Estudiante interpretando piano en una presentación de GOSMEL",
  Violín: "Estudiante de violín durante una presentación de GOSMEL",
  Guitarra: "Profesora acompañando a un estudiante durante una clase de guitarra",
  Solfeo: "Teclado con una partitura de estudio sobre el atril",
  "Guitarra eléctrica": "Programa de guitarra eléctrica de GOSMEL",
  Charango: "Programa de charango de GOSMEL",
  Quena: "Programa de quena de GOSMEL",
} as const;

export const LANDING_PROGRAM_DESCRIPTIONS = {
  Piano: "Técnica y expresión, desde tus primeras melodías hasta un repertorio más personal.",
  Violín: "Oído, precisión y sensibilidad con uno de los instrumentos más expresivos.",
  Guitarra: "Acordes, punteos y teoría aplicada para tocar canciones y construir tu estilo.",
  Solfeo: "La base para leer, comprender y expresar la música con mayor libertad.",
  "Guitarra eléctrica": "Riffs, efectos y técnica para encontrar tu sonido y tocar con mayor seguridad.",
  Charango: "La sonoridad y la tradición de este instrumento andino, con técnica y musicalidad.",
  Quena: "Uno de los instrumentos ancestrales de los Andes y su particular color sonoro.",
} as const;

export const LANDING_STEPS = [
  {
    title: "Elige tu programa",
    description: "Instrumento o lenguaje musical. Siete caminos posibles.",
  },
  {
    title: "Agenda tu horario",
    description: "Lunes a sábado, adaptado a tu ritmo de vida y compromisos.",
  },
  {
    title: "Avanza acompañado",
    description: "Clases personalizadas con objetivos claros en cada etapa.",
  },
  {
    title: "Sube al escenario",
    description: "Cada etapa cierra con una presentación en público.",
  },
] as const;

export const LANDING_TESTIMONIALS = [
  {
    text: "Cada clase propone objetivos claros y un acompañamiento cercano para avanzar con confianza.",
    label: "Experiencia · Aprendizaje",
  },
  {
    text: "La teoría se vuelve práctica en cada ensayo, y el escenario permite reconocer todo lo aprendido.",
    label: "Proceso · Escenario",
  },
  {
    text: "El proceso musical se adapta al ritmo de cada estudiante y celebra cada nueva etapa.",
    label: "Comunidad · GOSMEL",
  },
] as const;

export const LANDING_FAQS = [
  {
    question: "¿Desde qué edad se puede empezar?",
    answer:
      "Trabajamos con estudiantes de distintas edades y ajustamos el plan a su ritmo, experiencia y objetivos. Podemos orientarte hacia el programa más adecuado antes de la inscripción.",
  },
  {
    question: "¿Necesito saber leer música?",
    answer:
      "No hace falta. El programa de Solfeo construye esa base desde cero, y en los cursos de instrumento la lectura musical forma parte del plan de estudio.",
  },
  {
    question: "¿Debo tener mi propio instrumento?",
    answer:
      "Depende del programa y de la etapa de aprendizaje. Al contactarnos te indicaremos qué instrumento y recursos necesitarás para comenzar.",
  },
  {
    question: "¿Qué días hay clases?",
    answer:
      "De lunes a sábado, con horarios adaptados a tu ritmo de vida y compromisos.",
  },
  {
    question: "¿Cuánto cuesta la matrícula?",
    answer:
      "El valor depende del programa y la modalidad elegida. Escríbenos para recibir la información vigente de matrícula y mensualidad.",
  },
] as const;
