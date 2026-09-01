import { Reveal, RevealImage } from "@/shared/ui";

import type { IPageHeroProps } from "./PageHero.types";

export default function PageHero({
  image,
  imageAlt,
  titleId,
  eyebrow,
  title,
  description,
  chips,
}: IPageHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="relative h-[420px] overflow-hidden md:h-[560px]"
    >
      <RevealImage
        src={image}
        alt={imageAlt}
        fetchPriority="high"
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/40 to-surface-dark/10" />

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[1600px] px-[22px] pb-9 text-surface-dark-foreground md:px-14 md:pb-[62px]">
        <Reveal
          as="p"
          delay={0.05}
          className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stage-accent md:mb-[22px] md:text-[11px] md:tracking-[0.24em]"
        >
          {eyebrow}
        </Reveal>
        <Reveal as="div" delay={0.16}>
          <h1
            id={titleId}
            className="max-w-[940px] text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] text-pretty md:text-[76px]"
          >
            {title}
          </h1>
        </Reveal>
        <Reveal
          as="p"
          delay={0.27}
          className="mt-4 max-w-[560px] text-base leading-[1.55] text-surface-dark-muted md:mt-6 md:text-[19px]"
        >
          {description}
        </Reveal>
        {chips && chips.length > 0 ? (
          <Reveal delay={0.36} className="mt-6 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-surface-dark-foreground/10 px-4 py-2 text-[12.5px] font-medium text-surface-dark-foreground"
              >
                {chip}
              </span>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
