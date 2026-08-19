import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, Card, SectionHeader } from "@/shared/ui";

import { COURSES } from "@/features/courses";

const FEATURED_COURSES = COURSES.filter(({ title }) =>
  ["Piano", "Violín", "Guitarra", "Solfeo"].includes(title)
);

export default function CoursesSection() {
  return (
    <section className="relative py-32 bg-muted" id="cursos">
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
              <Card className="relative flex h-full flex-col overflow-hidden rounded-3xl border-border bg-card p-0 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/[0.07]">
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="inline-flex items-center rounded-full border border-border/60 bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Icon icon={icon} className="size-6" aria-hidden="true" />
                  </div>

                  <h4 className="mb-3 font-heading text-xl font-bold text-card-foreground">
                    {title}
                  </h4>

                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>

                <div className="flex items-center border-t border-border/60 bg-muted/40 px-6 py-4">
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
              </Card>
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
