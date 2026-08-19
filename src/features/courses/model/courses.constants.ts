import { AppImages } from "@/shared/config";

export const COURSE_FILTERS = ["Todos", "Instrumento", "Lenguaje musical"] as const;

export type TCourseFilter = (typeof COURSE_FILTERS)[number];

export const COURSES = [
  {
    icon: "ph:piano-keys",
    title: "Piano",
    category: "Instrumento",
    image: AppImages.COURSE_PIANO,
    imageAlt: "Estudiante practicando piano en GOSMEL",
    description:
      "Domina las teclas con técnica y expresión, desde tus primeras melodías hasta un repertorio más personal.",
    learns: ["Lectura musical", "Técnica y coordinación", "Repertorio y expresión"],
  },
  {
    icon: "mdi:violin",
    title: "Violín",
    category: "Instrumento",
    image: AppImages.COURSE_VIOLIN,
    imageAlt: "Violín y guitarra durante una práctica musical",
    description:
      "Desarrolla oído, precisión y sensibilidad con uno de los instrumentos más expresivos de la música.",
    learns: ["Postura y arco", "Afinación y oído", "Interpretación musical"],
  },
  {
    icon: "ph:guitar",
    title: "Guitarra",
    category: "Instrumento",
    image: AppImages.COURSE_GUITAR,
    imageAlt: "Guitarras acústicas en el aula de música",
    description:
      "Aprende acordes, punteos y teoría musical aplicada para tocar canciones y construir tu propio estilo.",
    learns: ["Acordes y ritmo", "Punteos y acompañamiento", "Repertorio popular"],
  },
  {
    icon: "mdi:guitar-electric",
    title: "Guitarra eléctrica",
    category: "Instrumento",
    image: AppImages.COURSE_ELECTRIC_GUITAR,
    imageAlt: "Guitarra eléctrica en una sesión de práctica",
    description:
      "Explora riffs, efectos y técnica para encontrar tu sonido y tocar con mayor seguridad.",
    learns: ["Riffs y escalas", "Técnica con púa", "Sonido y efectos"],
  },
  {
    icon: "ph:music-notes",
    title: "Solfeo",
    category: "Lenguaje musical",
    image: AppImages.COURSE_SOLFEO,
    imageAlt: "Material de estudio para solfeo y lenguaje musical",
    description:
      "Construye una base sólida para leer, comprender y expresar la música con mayor libertad.",
    learns: ["Lectura de partituras", "Ritmo y métrica", "Entrenamiento auditivo"],
  },
  {
    icon: "ph:guitar",
    title: "Charango",
    category: "Instrumento",
    image: AppImages.COURSE_CHARANGO,
    imageAlt: "Instrumentos de cuerda durante una práctica musical",
    description:
      "Conoce la sonoridad y la tradición de este instrumento andino mientras desarrollas técnica y musicalidad.",
    learns: ["Rasgueos tradicionales", "Acordes y afinación", "Repertorio andino"],
  },
  {
    icon: "mdi:flute",
    title: "Quena",
    category: "Instrumento",
    image: AppImages.COURSE_QUENA,
    imageAlt: "Estudiantes compartiendo una experiencia musical",
    description:
      "Descubre la interpretación de uno de los instrumentos ancestrales de los Andes y su particular color sonoro.",
    learns: ["Respiración y emisión", "Digitación y afinación", "Melodías andinas"],
  },
] as const;

export const COURSE_BENEFITS = [
  {
    icon: "ph:chalkboard-teacher",
    title: "Maestros que acompañan",
    description:
      "Aprende con orientación cercana y una metodología que se adapta a tu proceso.",
  },
  {
    icon: "ph:calendar-blank",
    title: "Un ritmo que se adapta a ti",
    description:
      "Avanza paso a paso, con objetivos claros y práctica que puedes llevar a tu rutina.",
  },
  {
    icon: "ph:microphone-stage",
    title: "La música también se vive",
    description:
      "Consolida lo aprendido compartiendo tu evolución en experiencias musicales reales.",
  },
] as const;