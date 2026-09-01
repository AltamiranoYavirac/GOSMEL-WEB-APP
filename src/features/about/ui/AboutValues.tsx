import Image from "next/image";

import { Reveal } from "@/shared/ui";

import type { IAboutValuesProps } from "./AboutValues.types";

export default function AboutValues({ values }: IAboutValuesProps) {
  return (
    <section className="bg-background pt-[80px] md:pt-[130px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]">
          Valores fundamentales
        </Reveal>
        <Reveal as="h2" delay={0.08} className="mb-11 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[44px]">
          La esencia de GOSMEL.
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {values.map((value, index) => (
            <Reveal
              key={value.title}
              delay={index * 0.08}
              className="relative h-[380px] overflow-hidden rounded-[22px] md:h-[440px]"
            >
              <Image
                src={value.imageUrl}
                alt={value.imageAlt}
                fill
                sizes="(max-width: 639px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/92 via-surface-dark/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-[26px] text-surface-dark-foreground">
                <h3 className="mb-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-stage-accent">
                  {value.title}
                </h3>
                <p className="text-[14.5px] leading-[1.55] text-surface-dark-muted">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
