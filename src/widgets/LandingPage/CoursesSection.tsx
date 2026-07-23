import Link from "next/link";
import { Piano, Guitar, Music2, Mic, ArrowRight } from "lucide-react";

const COURSES = [
  {
    icon: Piano,
    title: "Piano Clásico",
    description:
      "Domina las teclas con técnica y expresión. Desde Mozart hasta jazz contemporáneo.",
  },
  {
    icon: Guitar,
    title: "Guitarra",
    description:
      "Acústica o eléctrica. Aprende acordes, punteos y teoría musical aplicada.",
  },
  {
    icon: Music2,
    title: "Violín",
    description:
      "Desarrolla tu oído y precisión con uno de los instrumentos más elegantes de la orquesta.",
  },
  {
    icon: Mic,
    title: "Canto y Voz",
    description:
      "Entrena tu voz, mejora tu respiración y encuentra tu propio estilo interpretativo.",
  },
];

export default function CoursesSection() {
  return (
    <section className="py-32 bg-sand dark:bg-neutral-900 relative" id="cursos">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-peach dark:via-neutral-700 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-ginger font-bold tracking-[0.2em] uppercase text-xs mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-ginger" />
            Educación de Calidad
            <span className="w-8 h-px bg-ginger" />
          </h2>
          <h3 className="text-3xl md:text-5xl text-cocoa dark:text-cream mb-6">
            Nuestros Cursos Destacados
          </h3>
          <p className="text-cocoa/60 dark:text-cream/60 font-light text-lg">
            Ofrecemos un programa integral diseñado para desarrollar tus
            habilidades desde el primer día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSES.map(({ icon: Icon, title, description }) => (
            <Link
              key={title}
              href="/courses"
              className="group relative bg-card-gradient p-1 hover:-translate-y-2 transition-all duration-500 h-full rounded-2xl"
            >
              <div className="absolute inset-0 bg-ginger/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-2xl" />
              <div className="relative bg-cream dark:bg-neutral-800 h-full p-6 flex flex-col border border-peach/50 dark:border-neutral-700/40 group-hover:border-ginger/50 transition-colors duration-300 overflow-hidden rounded-2xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-ginger/8 rounded-bl-[4rem] transition-all duration-500 group-hover:bg-ginger/15" />
                <div className="relative z-10 w-14 h-14 bg-peach/30 dark:bg-neutral-700/50 flex items-center justify-center mb-6 group-hover:bg-ginger transition-all duration-300 shadow-inner rounded-xl">
                  <Icon
                    size={28}
                    className="text-ginger group-hover:text-cream transition-colors"
                  />
                </div>
                <h4 className="relative z-10 text-xl font-bold text-cocoa dark:text-cream mb-3 group-hover:text-burnt dark:group-hover:text-butter transition-colors">
                  {title}
                </h4>
                <p className="relative z-10 text-cocoa/55 dark:text-cream/55 text-sm mb-8 leading-relaxed flex-grow font-light border-b border-peach/30 dark:border-neutral-700/30 pb-4">
                  {description}
                </p>
                <div className="relative z-10 inline-flex items-center text-ginger font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform mt-auto">
                  Ver programa
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/courses"
            className="inline-flex justify-center items-center px-12 py-5 bg-transparent text-ginger font-bold border border-ginger hover:bg-ginger hover:text-cream transition-all duration-300 uppercase tracking-widest text-xs rounded-lg"
          >
            Ver todos los cursos
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
