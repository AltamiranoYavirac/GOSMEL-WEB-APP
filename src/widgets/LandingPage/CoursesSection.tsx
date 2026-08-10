import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, Card, IconTile, SectionHeader } from "@/shared/ui";

import { COURSES } from "./CoursesSection.constants";

export default function CoursesSection() {
  return (
    <section className="py-32 bg-muted relative" id="cursos">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Educación de Calidad"
          title="Nuestros Cursos Destacados"
          description="Ofrecemos un programa integral diseñado para desarrollar tus habilidades desde el primer día."
          size="md"
          lineAccent
          className="mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSES.map(({ icon, title, description }) => (
            <Link
              key={title}
              href="/courses"
              className="group relative rounded-2xl hover:-translate-y-2 transition-all duration-500 h-full"
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-2xl" />
              <Card className="relative h-full p-6 border border-accent/50 dark:border-neutral-700/40 group-hover:border-primary/50 transition-colors duration-300 overflow-hidden rounded-2xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/8 rounded-bl-[4rem] transition-all duration-500 group-hover:bg-primary/15" />
                <IconTile
                  icon={icon}
                  size="md"
                  iconSize={28}
                  iconClassName="text-primary group-hover:text-primary-foreground transition-colors"
                  className="mb-6 group-hover:bg-primary transition-all duration-300 shadow-inner"
                />
                <h4 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {title}
                </h4>
                <p className="relative z-10 text-muted-foreground text-sm mb-8 leading-relaxed flex-grow font-light border-b border-border pb-4">
                  {description}
                </p>
                <div className="relative z-10 inline-flex items-center text-primary font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform mt-auto">
                  Ver programa
                  <Icon
                    icon="ph:arrow-right"
                    width={14}
                    height={14}
                    className="ml-1"
                    aria-hidden="true"
                  />
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
            className="uppercase tracking-widest text-xs font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
