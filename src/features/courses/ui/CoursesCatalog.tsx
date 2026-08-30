"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

import { COURSE_BENEFITS, COURSE_FILTERS, COURSES, type TCourseFilter } from "../model/courses.constants";
import CourseCard from "./CourseCard";

const ROMAN_NUMERALS = ["I", "II", "III"] as const;

export default function CoursesCatalog() {
  const [filter, setFilter] = useState<TCourseFilter>("Todos");

  const filtered =
    filter === "Todos" ? COURSES : COURSES.filter((course) => course.category === filter);

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <section className="relative border-b border-border px-4 pb-12 pt-32 sm:px-6 md:pb-16 md:pt-40 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  Cursos · GOSMEL
                </span>
                <span className="hidden h-px w-12 bg-border sm:block" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Catálogo 2026
                </span>
              </div>

              <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                <span className="block font-light italic text-primary">Elige</span>
                <span>tu camino musical.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
                Siete disciplinas, una academia y una sola convicción: aprender se disfruta cuando el
                proceso te representa.
              </p>
            </div>

            <div className="flex items-end gap-3 self-start lg:flex-col lg:items-end lg:self-end">
              <span className="font-mono text-7xl font-light leading-none text-accent-muted md:text-8xl">
                07
              </span>
              <span className="pb-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground lg:pb-0">
                disciplinas
              </span>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 overflow-x-auto pb-2">
            <Icon
              icon="ph:funnel"
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="shrink-0 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Filtrar
            </span>
            <span className="h-px w-8 shrink-0 bg-border" />
            <div className="flex shrink-0 items-center gap-2">
              {COURSE_FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                    filter === value
                      ? "border border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "border border-white/60 dark:border-white/5 bg-background shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.5)] text-muted-foreground hover:text-foreground"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <p className="py-16 text-center font-heading text-xl text-muted-foreground">
              No hay cursos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course, index) => (
                <CourseCard key={course.title} course={course} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative bg-surface-dark px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-30 text-secondary-500"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-16 grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                La experiencia
              </span>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-[1.1] text-surface-dark-foreground md:text-5xl lg:text-6xl">
                Una academia donde la música{" "}
                <span className="text-brand-gradient font-light italic">se vive</span>.
              </h2>
            </div>
            <p className="max-w-md text-base font-light leading-relaxed text-surface-dark-muted">
              Más que aprender notas, construyes herramientas para expresarte con confianza y
              disfrutar cada etapa del proceso.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-surface-dark-border bg-surface-dark-border md:grid-cols-3">
            {COURSE_BENEFITS.map((benefit, index) => (
              <div key={benefit.title} className="bg-surface-dark p-8 md:p-10">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-heading text-5xl font-light italic text-primary">
                    {ROMAN_NUMERALS[index]}
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-full border border-surface-dark-border bg-surface-dark-foreground/5 text-surface-dark-muted">
                    <Icon icon={benefit.icon} className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mb-3 font-heading text-2xl font-bold text-surface-dark-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-surface-dark-muted">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

