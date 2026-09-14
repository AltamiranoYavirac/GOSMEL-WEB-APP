import { Icon } from "@iconify/react";

import { Reveal } from "@/shared/ui";

import ProgramCard from "./ProgramCard";
import type { IProgramsCatalogProps } from "./ProgramsCatalog.types";

export default function ProgramsCatalog({ programs }: IProgramsCatalogProps) {
  const total = String(programs.length).padStart(2, "0");

  return (
    <section aria-labelledby="programs-catalog-title" className="bg-warm-50 py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14 xl:px-20">
        <Reveal as="p" className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
          Rutas formativas · GOSMEL
        </Reveal>
        <Reveal as="h2" delay={0.05} className="max-w-[820px] text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-foreground">
          <span id="programs-catalog-title">Programas que combinan cursos en un solo camino.</span>
        </Reveal>
        <Reveal as="p" delay={0.08} className="mt-5 max-w-[680px] text-base leading-7 text-muted-foreground md:text-lg">
          Explora los programas publicados, sus objetivos y los cursos que los componen.
        </Reveal>

        {programs.length ? (
          <div className="mt-12 md:mt-16 lg:mt-20">
            {programs.map((program, index) => (
              <Reveal key={program.id} delay={Math.min(index * 0.025, 0.12)}>
                <ProgramCard
                  program={program}
                  number={String(index + 1).padStart(2, "0")}
                  total={total}
                  isFirst={index === 0}
                  isLast={index === programs.length - 1}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-12 text-center">
            <Icon icon="ph:path" className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-lg font-semibold">No hay programas publicados todavía.</p>
          </div>
        )}
      </div>
    </section>
  );
}
