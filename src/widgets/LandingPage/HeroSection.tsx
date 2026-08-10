import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { AppImages } from "@/shared/config";
import { getCurrentYear } from "@/shared/lib";
import { Badge, Button } from "@/shared/ui";

export default function HeroSection() {
  return (
    <section className="relative pt-24 pb-24 lg:pt-32 lg:pb-36 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 dark:from-neutral-800/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <Badge
              variant="outline"
              className="h-auto gap-3 px-4 py-1.5 rounded-full bg-accent/30 dark:bg-neutral-800 text-primary font-medium text-xs uppercase tracking-wider"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Matrículas abiertas {getCurrentYear()}
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-foreground">
              GOSMEL
              <span className="text-brand-gradient block mt-2 text-4xl lg:text-6xl font-light italic">
                &ldquo;Lo bello de la teoría en la práctica&rdquo;
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-light border-l-2 border-primary/40 pl-6">
              En Gosmel Academia de Música creemos que la formación musical nace del equilibrio entre el conocimiento y la experiencia. A través de una enseñanza cercana, estructurada y práctica, desarrollamos las habilidades técnicas, artísticas y creativas de cada estudiante, respetando su ritmo y objetivos.
              Transformamos el aprendizaje en una experiencia significativa que forma músicos y artistas preparados para expresarse con seguridad, sensibilidad y excelencia.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Button asChild size="2xl" className="gap-2 uppercase tracking-widest text-xs font-bold">
                <Link href="/register">
                  Inscríbete Ahora
                  <Icon icon="ph:arrow-right" width={16} height={16} aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="2xl"
                variant="outline"
                className="gap-2 uppercase tracking-widest text-xs font-semibold border-primary/50 text-primary hover:bg-primary/5"
              >
                <Link href="#cursos">Ver Cursos</Link>
              </Button>
            </div>
          </div>

          <div className="relative lg:h-[700px] w-full flex justify-center lg:justify-end">
            <div className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/20 dark:bg-neutral-800/40 rounded-full blur-[100px] -z-10" />
            <div className="relative w-full max-w-md lg:max-w-full h-full min-h-[400px] overflow-hidden shadow-xl border border-accent/40 dark:border-neutral-700/40 rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent z-10" />
              <Image
                src={AppImages.HERO_COVER}
                alt="Estudiante tocando violonchelo con pasión"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
