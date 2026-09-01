import { Reveal, RevealImage } from "@/shared/ui";

import type { IAboutHeroProps } from "./AboutHero.types";

export default function AboutHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  chips,
}: IAboutHeroProps) {
  return (
    <section aria-labelledby="about-title" className="grid lg:grid-cols-[1.15fr_1fr]">
      <div className="relative h-[360px] overflow-hidden sm:h-[460px] lg:h-[640px]">
        <RevealImage
          src={image}
          alt={imageAlt}
          priority
          fetchPriority="high"
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-dark/35" />
      </div>

      <div className="flex flex-col justify-center bg-card px-[22px] py-14 md:px-14 lg:py-20">
        <Reveal as="p" className="mb-[22px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]">
          {eyebrow}
        </Reveal>
        <Reveal as="div" delay={0.08}>
          <h1
            id="about-title"
            className="text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[46px]"
          >
            {title}
          </h1>
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-6 max-w-[460px] text-base leading-[1.65] text-muted-foreground">
          {description}
        </Reveal>
        <Reveal delay={0.24} className="mt-8 flex flex-wrap gap-3">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border px-[18px] py-2.5 text-[13px] font-medium"
            >
              {chip}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
