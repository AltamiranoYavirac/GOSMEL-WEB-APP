import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Reveal } from "@/shared/ui";

import type { IProgramsSectionProps } from "./ProgramsSection.types";

export default function ProgramsSection({ programs }: IProgramsSectionProps) {
  if (!programs.length) return null;

  return (
    <section id="programas" className="bg-background py-[72px] md:py-[112px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal className="border-b border-warm-300 pb-6 md:pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">Rutas formativas</p>
          <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.035em] md:text-[48px]">Programas</h2>
        </Reveal>
        <div>
          {programs.map((program, index) => (
            <article key={program.id} className="grid items-center gap-8 border-b border-warm-300 py-12 lg:grid-cols-2 lg:gap-16">
              <Reveal className={index % 2 ? "lg:order-2" : ""}>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                  {[program.instrument, program.level].filter(Boolean).join(" · ") || "Programa formativo"}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <h3 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[52px]">{program.title}</h3>
                  {program.priceLabel ? (
                    <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground">
                      <Icon icon="ph:tag" className="size-4 text-primary-700" aria-hidden="true" />
                      {program.priceLabel}
                    </span>
                  ) : null}
                </div>
                {program.description ? <p className="mt-5 max-w-[560px] text-[17px] leading-[1.65] text-warm-700">{program.description}</p> : null}
                {program.objectives.length ? (
                  <div className="mt-6">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">Objetivos</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {program.objectives.map((objective) => (
                        <li key={objective} className="rounded-full bg-accent-muted px-4 py-2 text-[13px] font-medium">{objective}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {program.courses.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {program.courses.map((course) => (
                      <li key={course.id}><Link href={`/courses/${course.slug}`} className="inline-flex min-h-9 items-center rounded-full border border-border px-3 text-sm font-medium hover:border-primary hover:text-primary">{course.name}</Link></li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
              <Reveal delay={0.1} className={`relative aspect-[4/3] overflow-hidden rounded-[20px] border border-warm-300 bg-warm-100 ${index % 2 ? "lg:order-1" : ""}`}>
                {program.image ? <Image src={program.image} alt={program.imageAlt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" /> : null}
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
