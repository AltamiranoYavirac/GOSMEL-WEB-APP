import { AppImages } from "@/shared/config";

import type { ITeacher } from "./teachers.types";

export const TEACHERS: ITeacher[] = [
  {
    slug: "andrea-salazar",
    name: "Andrea Salazar",
    instrument: "Piano",
    courseSlug: "piano",
    photo: AppImages.LANDING_PROGRAM_PIANO,
    photoAlt: "Andrea Salazar, profesora de piano de GOSMEL",
    photoIsReference: true,
    headline: "Profesora de Piano",
    bio: "Pianista y docente formada en el Conservatorio Superior Nacional. Andrea trabaja la técnica sin perder de vista la musicalidad: cada ejercicio tiene un para qué y un repertorio detrás.",
    tags: ["12 años de experiencia", "Repertorio clásico y popular"],
    education: [
      {
        title: "Conservatorio Superior Nacional de Música",
        detail: "Licenciatura en Interpretación de Piano",
      },
      {
        title: "Pedagogía del piano",
        detail: "Formación complementaria en enseñanza inicial",
      },
    ],
    teachesNote:
      "Clases individuales para todas las edades, desde el primer contacto con el teclado hasta repertorio avanzado.",
    philosophy:
      "El piano se aprende con las manos y con la cabeza. Mi trabajo es que cada estudiante entienda lo que toca, no solo que lo repita.",
    studentTestimonials: [
      {
        quote:
          "Andrea nunca te apura. Cuando algo no sale, cambia el enfoque hasta que lo entiendo.",
        author: "Renata Ibarra",
        role: "Alumna",
      },
      {
        quote:
          "Llevo dos años y cada mes tengo una pieza nueva que me reta. Sus clases están muy bien pensadas.",
        author: "Sebastián Mora",
        role: "Alumno",
      },
    ],
  },
  {
    slug: "camila-vega",
    name: "Camila Vega",
    instrument: "Violín",
    courseSlug: "violin",
    photo: AppImages.LANDING_PROGRAM_VIOLIN,
    photoAlt: "Camila Vega, profesora de violín de GOSMEL",
    photoIsReference: false,
    headline: "Profesora de Violín",
    bio: "Formada en el Conservatorio Superior Nacional, Camila acompaña a estudiantes de todas las edades a construir una relación honesta con el instrumento: primero el oído, luego la técnica, después la música.",
    tags: ["10 años de experiencia", "Música de cámara"],
    education: [
      {
        title: "Conservatorio Superior Nacional de Música",
        detail: "Licenciatura en Interpretación de Violín",
      },
      {
        title: "Especialización en Música de Cámara",
        detail: "Formación complementaria en ensamble",
      },
    ],
    teachesNote:
      "Clases individuales para todas las edades, de nivel principiante a avanzado.",
    philosophy:
      "El violín premia la paciencia antes que el talento. Mi trabajo no es apurar a nadie: es que cada estudiante escuche, por primera vez, cuánto puede decir con cuatro cuerdas.",
    studentTestimonials: [
      {
        quote:
          "Camila tiene una paciencia enorme. Empecé sin saber nada y en un año ya tocaba en el concierto de la academia.",
        author: "Renata Ibarra",
        role: "Alumna",
      },
      {
        quote:
          "Sus clases son exigentes pero nunca te sientes solo. Ella corrige con la misma calma con la que explica.",
        author: "Joaquín Peña",
        role: "Alumno",
      },
    ],
  },
  {
    slug: "diego-fuentes",
    name: "Diego Fuentes",
    instrument: "Guitarra",
    courseSlug: "guitarra",
    photo: AppImages.LANDING_PROGRAM_GUITAR,
    photoAlt: "Diego Fuentes, profesor de guitarra de GOSMEL",
    photoIsReference: true,
    headline: "Profesor de Guitarra",
    bio: "Guitarrista con recorrido en música popular y de concierto. Diego parte siempre de las canciones que el estudiante quiere tocar y construye la técnica desde ahí.",
    tags: ["9 años de experiencia", "Guitarra acústica y clásica"],
    education: [
      {
        title: "Escuela de Música Contemporánea",
        detail: "Interpretación en Guitarra",
      },
      {
        title: "Armonía y acompañamiento",
        detail: "Formación complementaria en música popular",
      },
    ],
    teachesNote:
      "Clases individuales de guitarra acústica y clásica, para todas las edades y niveles.",
    philosophy:
      "Nadie aprende guitarra tocando escalas aburridas. Empezamos por una canción real y, sin darte cuenta, ya estás estudiando técnica.",
    studentTestimonials: [
      {
        quote:
          "En tres meses ya acompañaba canciones completas. Diego siempre encuentra la manera de que practiques con ganas.",
        author: "Joaquín Peña",
        role: "Alumno",
      },
      {
        quote:
          "Me gusta que no impone un estilo. Me ayudó a encontrar el mío.",
        author: "Lucía Torres",
        role: "Alumna",
      },
    ],
  },
  {
    slug: "mateo-rueda",
    name: "Mateo Rueda",
    instrument: "Guitarra eléctrica",
    courseSlug: "guitarra-electrica",
    photo: AppImages.COURSE_ELECTRIC_GUITAR,
    photoAlt: "Mateo Rueda, profesor de guitarra eléctrica de GOSMEL",
    photoIsReference: true,
    headline: "Profesor de Guitarra eléctrica",
    bio: "Guitarrista de banda y productor. Mateo combina técnica con púa, teoría aplicada y trabajo de sonido para que cada estudiante encuentre su voz eléctrica.",
    tags: ["8 años de experiencia", "Rock, blues y funk"],
    education: [
      {
        title: "Escuela de Música Contemporánea",
        detail: "Guitarra eléctrica e improvisación",
      },
      {
        title: "Producción musical",
        detail: "Formación complementaria en home studio",
      },
    ],
    teachesNote:
      "Clases individuales de guitarra eléctrica, desde primeros riffs hasta improvisación.",
    philosophy:
      "El tono está en los dedos, no en los pedales. Primero suenas bien tú, después vemos los efectos.",
    studentTestimonials: [
      {
        quote:
          "Aprendí a improvisar sin miedo. Las clases tienen mucha práctica real, no solo teoría.",
        author: "Camilo Andrade",
        role: "Alumno",
      },
      {
        quote:
          "Mateo me ayudó a armar mi primer setup y a entender qué buscaba en el sonido.",
        author: "Andrés Vaca",
        role: "Alumno",
      },
    ],
  },
  {
    slug: "valentina-rios",
    name: "Valentina Ríos",
    instrument: "Solfeo",
    courseSlug: "solfeo",
    photo: AppImages.COURSE_SOLFEO,
    photoAlt: "Valentina Ríos, profesora de solfeo de GOSMEL",
    photoIsReference: true,
    headline: "Profesora de Solfeo y Lenguaje Musical",
    bio: "Directora coral y docente de lenguaje musical. Valentina hace que la teoría deje de ser abstracta: todo se canta, se palmea y se conecta con lo que el estudiante ya escucha.",
    tags: ["11 años de experiencia", "Dirección coral"],
    education: [
      {
        title: "Conservatorio Superior Nacional de Música",
        detail: "Licenciatura en Educación Musical",
      },
      {
        title: "Dirección coral",
        detail: "Especialización complementaria",
      },
    ],
    teachesNote:
      "Clases individuales o en grupo reducido de solfeo, lectura y entrenamiento auditivo.",
    philosophy:
      "La teoría no sirve de nada si no la puedes escuchar. En mis clases primero suena, después se escribe.",
    studentTestimonials: [
      {
        quote:
          "Entender el ritmo y la lectura cambió por completo cómo estudio mi instrumento.",
        author: "Daniela Suárez",
        role: "Alumna",
      },
      {
        quote:
          "Valentina hace divertida una materia que yo creía imposible.",
        author: "Martín Cevallos",
        role: "Alumno",
      },
    ],
  },
  {
    slug: "pablo-quishpe",
    name: "Pablo Quishpe",
    instrument: "Charango",
    courseSlug: "charango",
    photo: AppImages.COURSE_CHARANGO,
    photoAlt: "Pablo Quishpe, profesor de charango de GOSMEL",
    photoIsReference: true,
    headline: "Profesor de Charango",
    bio: "Charanguista con años de trabajo en música andina de raíz y de proyección. Pablo enseña técnica tradicional y repertorio propio de la región.",
    tags: ["14 años de experiencia", "Música andina de raíz"],
    education: [
      {
        title: "Formación tradicional",
        detail: "Aprendizaje directo con maestros charanguistas",
      },
      {
        title: "Taller de música andina",
        detail: "Repertorio y arreglos de conjunto",
      },
    ],
    teachesNote:
      "Clases individuales de charango, con foco en rasgueos, afinación y repertorio andino.",
    philosophy:
      "El charango carga una historia. Enseñar bien es transmitir la técnica y también de dónde viene cada rasgueo.",
    studentTestimonials: [
      {
        quote:
          "Siempre quise tocar música andina y encontré un maestro que la vive de verdad.",
        author: "Nayra Loza",
        role: "Alumna",
      },
      {
        quote:
          "Cada clase salgo con una pieza nueva y con contexto de dónde nació.",
        author: "Iván Farinango",
        role: "Alumno",
      },
    ],
  },
  {
    slug: "sofia-cachimuel",
    name: "Sofía Cachimuel",
    instrument: "Quena",
    courseSlug: "quena",
    photo: AppImages.COURSE_QUENA,
    photoAlt: "Sofía Cachimuel, profesora de quena de GOSMEL",
    photoIsReference: true,
    headline: "Profesora de Quena",
    bio: "Intérprete de instrumentos de viento andinos. Sofía trabaja la respiración y la emisión con mucha calma, porque son la base de todo lo demás.",
    tags: ["9 años de experiencia", "Vientos andinos"],
    education: [
      {
        title: "Formación tradicional",
        detail: "Estudio de quena, zampoña y toyos",
      },
      {
        title: "Ensamble de vientos andinos",
        detail: "Repertorio y práctica de conjunto",
      },
    ],
    teachesNote:
      "Clases individuales de quena, desde la primera emisión de sonido hasta melodías de repertorio.",
    philosophy:
      "La quena se toca con el aire y con la escucha. Si la respiración está tranquila, el sonido aparece solo.",
    studentTestimonials: [
      {
        quote:
          "El sonido de la quena me atrapó desde la primera clase. Sofía enseña la respiración con muchísima paciencia.",
        author: "Tomás Iza",
        role: "Alumno",
      },
      {
        quote:
          "Pensé que nunca lograría un sonido estable y en un mes ya tocaba melodías completas.",
        author: "Elena Pineda",
        role: "Alumna",
      },
    ],
  },
];

export function getTeacherBySlug(slug: string): ITeacher | undefined {
  return TEACHERS.find((teacher) => teacher.slug === slug);
}

export function getTeacherByCourseSlug(courseSlug: string): ITeacher | undefined {
  return TEACHERS.find((teacher) => teacher.courseSlug === courseSlug);
}
