import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, Card, SectionHeader } from "@/shared/ui";

import { COURSES } from "@/features/courses";

const FEATURED_COURSES = COURSES.filter(({ title }) =>
  ["Piano", "Violín", "Guitarra", "Solfeo"].includes(title)
);

export default function CoursesSection() {
  return (
    <section className="relative py-32 bg-secondary-300/60 dark:bg-surface-dark" id="cursos">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Educación de Calidad"
          title="Nuestros Cursos Destacados"
          description="Ofrecemos un programa integral diseñado para desarrollar tus habilidades desde el primer día."
          size="md"
          lineAccent
          className="mb-20"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COURSES.map(({ icon, title, category, description }, index) => (
            <Link
              key={title}
              href="/courses"
              className="group block h-full"
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]">
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="inline-flex items-center rounded-full border border-white/60 dark:border-white/5 bg-background shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </span>
                    <span className="font-mono text-xs font-bold text-muted-foreground/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mb-5 inline-flex size-13 items-center justify-center rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] text-primary transition-all duration-300 group-hover:scale-105">
                    <Icon icon={icon} className="size-6" aria-hidden="true" />
                  </div>

                  <h4 className="mb-3 font-heading text-xl font-bold text-foreground">
                    {title}
                  </h4>

                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground font-light">
                    {description}
                  </p>
                </div>

                <div className="flex items-center border-t border-border/40 px-6 py-4">
                  <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary transition-transform duration-300 group-hover:translate-x-1">
                    Ver programa
                    <Icon
                      icon="ph:arrow-right"
                      width={14}
                      height={14}
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button
            asChild
            size="2xl"
            variant="outline"
            className="border-primary text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/courses">
              Ver todos los cursos
              <Icon icon="ph:arrow-right" width={18} height={18} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
