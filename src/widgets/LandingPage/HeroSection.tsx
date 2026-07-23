import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { AppImages } from "@/shared/config";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-24 lg:pt-32 lg:pb-36 overflow-hidden bg-cream dark:bg-background">
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-peach/20 dark:from-neutral-800/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-cream dark:from-background to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-peach/30 dark:bg-neutral-800 text-burnt dark:text-butter font-medium text-xs border border-peach/50 dark:border-neutral-700 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-ginger" />
              Matrículas abiertas 2024
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-cocoa dark:text-cream">
              GOSMEL
              <span className="text-brand-gradient block mt-2 text-4xl lg:text-6xl font-light italic">
                Tu Pasión, Nuestra Música
              </span>
            </h1>

            <p className="text-lg text-cocoa/70 dark:text-cream/70 max-w-lg leading-relaxed font-light border-l-2 border-ginger/40 pl-6">
              Descubre tu pasión por la música con clases personalizadas para
              todas las edades. Aprende de los mejores y alcanza la excelencia
              artística en un entorno cálido y profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link
                href="#contacto"
                className="inline-flex justify-center items-center px-8 py-4 bg-ginger text-cream font-bold hover:bg-burnt hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest text-xs rounded-lg"
              >
                Inscríbete Ahora
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                href="#cursos"
                className="inline-flex justify-center items-center px-8 py-4 bg-transparent text-ginger font-semibold border border-ginger/50 hover:border-burnt hover:text-burnt hover:bg-ginger/5 transition-all duration-300 uppercase tracking-widest text-xs rounded-lg"
              >
                Ver Cursos
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-6 text-sm text-cocoa/50 dark:text-cream/50 border-t border-peach/40 dark:border-neutral-700/40 mt-8">
              <div className="flex -space-x-4">
                {["A", "B", "C"].map((initial) => (
                  <div
                    key={initial}
                    className="w-12 h-12 rounded-full border-2 border-cream dark:border-neutral-700 ring-2 ring-peach/30 dark:ring-neutral-700/30 bg-sand dark:bg-neutral-800 flex items-center justify-center text-cocoa/70 dark:text-cream/70 text-sm font-medium"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <p className="font-light">
                Más de{" "}
                <span className="font-bold text-ginger">500+</span>{" "}
                estudiantes felices
              </p>
            </div>
          </div>

          <div className="relative lg:h-[700px] w-full flex justify-center lg:justify-end">
            <div className="absolute top-10 right-10 w-80 h-80 bg-ginger/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-peach/20 dark:bg-neutral-800/40 rounded-full blur-[100px] -z-10" />
            <div className="relative w-full max-w-md lg:max-w-full h-full min-h-[400px] overflow-hidden shadow-xl border border-peach/40 dark:border-neutral-700/40 rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/20 via-transparent to-transparent z-10" />
              <Image
                src={AppImages.HERO_COVER}
                alt="Estudiante tocando violonchelo con pasión"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-12 left-8 bg-cream/80 dark:bg-neutral-900/80 backdrop-blur-md p-5 shadow-lg border border-peach/50 dark:border-neutral-700/40 border-l-4 border-l-ginger max-w-[240px] z-20 rounded-xl">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-ginger fill-ginger" />
                  ))}
                </div>
                <p className="text-xs font-medium text-cocoa/80 dark:text-cream/80 uppercase tracking-wider">
                  Excelencia Académica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
