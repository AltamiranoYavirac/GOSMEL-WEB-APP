import { AppImages } from "@/shared/config";

export const COURSES = [
  {
    icon: "ph:piano-keys",
    slug: "piano",
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
    slug: "violin",
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
    slug: "guitarra",
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
    slug: "guitarra-electrica",
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
    slug: "solfeo",
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
    slug: "charango",
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
    slug: "quena",
    title: "Quena",
    category: "Instrumento",
    image: AppImages.COURSE_QUENA,
    imageAlt: "Estudiantes compartiendo una experiencia musical",
    description:
      "Descubre la interpretación de uno de los instrumentos ancestrales de los Andes y su particular color sonoro.",
    learns: ["Respiración y emisión", "Digitación y afinación", "Melodías andinas"],
  },
] as const;

export const COURSE_BENTO_SPANS: Record<string, string> = {
  Piano: "sm:col-span-2 sm:row-span-2",
  "Violín": "sm:col-span-2",
  Solfeo: "sm:col-span-2",
};

export interface ICourseGalleryItem {
  src: string;
  alt: string;
}

export interface ICourseDetail {
  teacherSlug: string;
  audience: { age: string; level: string };
  classInfo: { format: string; schedule: string; closing: string };
  gallery: [ICourseGalleryItem, ICourseGalleryItem];
  testimonial: { quote: string; author: string; role: string };
  ctaTitle: string;
}

const DEFAULT_CLASS_INFO = {
  format: "Clases individuales",
  schedule: "Flexible, lunes a sábado",
  closing: "Presentación en público",
};

const DEFAULT_AUDIENCE = {
  age: "Todas las edades, desde niños hasta adultos.",
  level: "De principiante a avanzado, a tu propio ritmo.",
};

export const COURSE_DETAILS: Record<string, ICourseDetail> = {
  piano: {
    teacherSlug: "andrea-salazar",
    audience: DEFAULT_AUDIENCE,
    classInfo: DEFAULT_CLASS_INFO,
    gallery: [
      { src: AppImages.LANDING_PROGRAM_PIANO, alt: "Estudiante practicando piano" },
      { src: AppImages.COURSE_PIANO, alt: "Manos de una estudiante sobre las teclas del piano" },
    ],
    testimonial: {
      quote:
        "Empecé sin saber leer una sola nota y hoy toco piezas que creía imposibles. El proceso fue exigente, pero siempre a mi ritmo.",
      author: "Renata Ibarra",
      role: "Estudiante de Piano",
    },
    ctaTitle: "Da tus primeros pasos con el piano.",
  },
  violin: {
    teacherSlug: "camila-vega",
    audience: DEFAULT_AUDIENCE,
    classInfo: DEFAULT_CLASS_INFO,
    gallery: [
      { src: AppImages.LANDING_PROGRAM_VIOLIN, alt: "Estudiante practicando violín" },
      { src: AppImages.COURSE_VIOLIN, alt: "Estudiante de violín acompañado en guitarra" },
    ],
    testimonial: {
      quote:
        "GOSMEL no solo me enseñó técnica, me enseñó a encontrar mi propia voz en un mundo saturado de ruido. Fue un punto de inflexión en mi carrera.",
      author: "El Mau",
      role: "Estudiante de Violín",
    },
    ctaTitle: "Da tus primeros pasos con el violín.",
  },
  guitarra: {
    teacherSlug: "diego-fuentes",
    audience: DEFAULT_AUDIENCE,
    classInfo: DEFAULT_CLASS_INFO,
    gallery: [
      { src: AppImages.LANDING_PROGRAM_GUITAR, alt: "Clase de guitarra en GOSMEL" },
      { src: AppImages.COURSE_GUITAR, alt: "Guitarras acústicas en el aula" },
    ],
    testimonial: {
      quote:
        "En pocos meses pasé de rasgueos sueltos a acompañar canciones completas. Diego siempre parte de lo que quiero tocar.",
      author: "Joaquín Peña",
      role: "Estudiante de Guitarra",
    },
    ctaTitle: "Da tus primeros pasos con la guitarra.",
  },
  "guitarra-electrica": {
    teacherSlug: "mateo-rueda",
    audience: DEFAULT_AUDIENCE,
    classInfo: DEFAULT_CLASS_INFO,
    gallery: [
      { src: AppImages.COURSE_ELECTRIC_GUITAR, alt: "Guitarra eléctrica en una sesión de práctica" },
      { src: AppImages.LANDING_STAGE, alt: "Estudiante tocando en el recital de la academia" },
    ],
    testimonial: {
      quote:
        "Aprendí a sacar mi propio sonido sin copiar a nadie. Las clases mezclan técnica con muchísima práctica real.",
      author: "Camilo Andrade",
      role: "Estudiante de Guitarra eléctrica",
    },
    ctaTitle: "Da tus primeros pasos con la guitarra eléctrica.",
  },
  solfeo: {
    teacherSlug: "valentina-rios",
    audience: {
      age: "Todas las edades; ideal como base antes o junto a un instrumento.",
      level: "Desde cero: no necesitas conocimientos previos.",
    },
    classInfo: {
      format: "Clases individuales o en grupo reducido",
      schedule: "Flexible, lunes a sábado",
      closing: "Evaluación de lectura y ritmo",
    },
    gallery: [
      { src: AppImages.COURSE_SOLFEO, alt: "Material de estudio de solfeo" },
      { src: AppImages.LANDING_PROCESS, alt: "Profesora acompañando a un estudiante" },
    ],
    testimonial: {
      quote:
        "Entender la teoría cambió por completo cómo estudio mi instrumento. Ahora leo una partitura y sé qué está pasando.",
      author: "Daniela Suárez",
      role: "Estudiante de Solfeo",
    },
    ctaTitle: "Construye tu base musical con el solfeo.",
  },
  charango: {
    teacherSlug: "pablo-quishpe",
    audience: DEFAULT_AUDIENCE,
    classInfo: DEFAULT_CLASS_INFO,
    gallery: [
      { src: AppImages.COURSE_CHARANGO, alt: "Instrumentos de cuerda andinos" },
      { src: AppImages.LANDING_TEACHERS, alt: "Estudiante interpretando en el auditorio" },
    ],
    testimonial: {
      quote:
        "Siempre quise tocar música andina y encontré un maestro que la vive. Cada clase termina con una pieza nueva.",
      author: "Nayra Loza",
      role: "Estudiante de Charango",
    },
    ctaTitle: "Da tus primeros pasos con el charango.",
  },
  quena: {
    teacherSlug: "sofia-cachimuel",
    audience: DEFAULT_AUDIENCE,
    classInfo: DEFAULT_CLASS_INFO,
    gallery: [
      { src: AppImages.COURSE_QUENA, alt: "Estudiantes compartiendo una experiencia musical" },
      { src: AppImages.ABOUT_INNOVATION, alt: "Práctica de conjunto en GOSMEL" },
    ],
    testimonial: {
      quote:
        "El sonido de la quena me atrapó desde la primera clase. Sofía enseña la respiración con muchísima paciencia.",
      author: "Tomás Iza",
      role: "Estudiante de Quena",
    },
    ctaTitle: "Da tus primeros pasos con la quena.",
  },
};