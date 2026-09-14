import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Reveal } from "@/shared/ui";

import type { IProgramDetailProps } from "./ProgramDetail.types";

export default function ProgramDetail({ program }: IProgramDetailProps) {
  const eyebrow = [program.instrument, program.level].filter(Boolean).join(" · ") || "Programa formativo";

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pt-9 md:px-14">
        <nav className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
          <Link href="/programs" className="hover:text-foreground">Programas</Link>
          <span>/</span>
          <span className="text-foreground">{program.title}</span>
        </nav>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-[1600px] gap-10 px-[22px] md:px-14 lg:grid-cols-[420px_1fr] lg:gap-14">
        <div className="relative h-[380px] self-start overflow-hidden rounded-[26px] bg-muted lg:sticky lg:top-20 lg:h-[720px]">
          {program.image ? (
            <Image src={program.image} alt={program.imageAlt} fill priority sizes="(max-width: 1023px) 100vw, 420px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-muted-foreground"><Icon icon="ph:path" className="size-20" aria-hidden="true" /></span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent" />
        </div>

        <div>
          <Reveal as="p" className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-700">{eyebrow}</Reveal>
          <Reveal as="h1" delay={0.04} className="mt-4 text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[62px]">{program.title}</Reveal>
          <Reveal as="p" delay={0.08} className="mt-5 max-w-[560px] text-base leading-[1.65] text-muted-foreground md:text-[17px]">{program.description}</Reveal>
          <div className="my-12 h-px bg-border" />

          {program.objectives.length ? (
            <section aria-labelledby="program-objectives-title">
              <p id="program-objectives-title" className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Objetivos del programa</p>
              <div className="flex flex-col gap-2.5">
                {program.objectives.map((objective) => (
                  <div key={objective} className="flex items-start gap-3.5">
                    <Icon icon="ph:check-bold" className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <p className="text-[15px] leading-[1.5] text-muted-foreground">{objective}</p>
                  </div>
                ))}
              </div>
              <div className="my-11 h-px bg-border" />
            </section>
          ) : null}

          {program.courses.length ? (
            <section aria-labelledby="program-courses-title">
              <p id="program-courses-title" className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Cursos del programa</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {program.courses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`} className="group flex items-center justify-between gap-4 rounded-[18px] border border-border bg-card p-[22px] outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary">
                    <p className="text-sm font-semibold">{course.name}</p>
                    <Icon icon="ph:arrow-right" className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
                  </Link>
                ))}
              </div>
              <div className="my-11 h-px bg-border" />
            </section>
          ) : null}

          {program.priceLabel ? (
            <section aria-labelledby="program-price-title">
              <p id="program-price-title" className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Inversión</p>
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground">
                <Icon icon="ph:tag" className="size-4 text-primary-700" aria-hidden="true" />
                {program.priceLabel}
              </span>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
