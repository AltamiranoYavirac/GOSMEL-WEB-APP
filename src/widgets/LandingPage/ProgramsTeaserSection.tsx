import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Reveal } from "@/shared/ui";

import type { IProgramsTeaserSectionProps } from "./ProgramsTeaserSection.types";

export default function ProgramsTeaserSection({ programs }: IProgramsTeaserSectionProps) {
  if (!programs.length) return null;

  return (
    <section id="programas" className="bg-background py-[72px] md:py-[112px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal className="flex items-end justify-between border-b border-warm-300 pb-6 md:pb-8">
          <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">Rutas formativas</p><h2 className="mt-3 text-[34px] font-semibold tracking-[-0.035em] md:text-[48px]">Programas</h2></div>
          <Link href="/programs" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-700 hover:text-primary-900">Ver todos →</Link>
        </Reveal>
        <div className="grid gap-5 pt-8 md:grid-cols-3">
          {programs.slice(0, 3).map((program, index) => (
            <Reveal key={program.id} delay={index * 0.06} as="article" className="overflow-hidden rounded-2xl border border-border bg-card">
              <Link href={`/programs/${program.slug}`} className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="relative aspect-[4/3] bg-muted">
                  {program.image ? <Image src={program.image} alt={program.imageAlt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" /> : <Icon icon="ph:path" className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />}
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary">{[program.instrument, program.level].filter(Boolean).join(" · ") || "Programa formativo"}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{program.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{program.description}</p>
                  {program.priceLabel ? (
                    <span className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground">
                      <Icon icon="ph:tag" className="size-4 text-primary-700" aria-hidden="true" />
                      {program.priceLabel}
                    </span>
                  ) : null}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
