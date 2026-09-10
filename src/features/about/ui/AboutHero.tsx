import { Reveal, RevealImage } from "@/shared/ui";

import type { IAboutHeroProps } from "./AboutHero.types";

export default function AboutHero({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
}: IAboutHeroProps) {
  return (
    <section
      aria-labelledby="about-title"
      className="grid border-b border-border bg-warm-50 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="relative min-h-[390px] overflow-hidden sm:min-h-[520px] lg:min-h-[680px]">
        <RevealImage
          src={image}
          alt={imageAlt}
          preload
          fetchPriority="high"
          sizes="(max-width: 1023px) 100vw, 60vw"
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-col justify-end border-t border-border px-[22px] py-14 md:px-14 md:py-20 lg:border-t-0 lg:border-l lg:px-[clamp(3rem,6vw,8rem)] lg:py-24">
        <Reveal
          as="p"
          className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700"
        >
          {eyebrow}
        </Reveal>
        <Reveal as="div" delay={0.06} className="mt-7">
          <h1
            id="about-title"
            className="max-w-[540px] text-[clamp(2.6rem,5.2vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground"
          >
            {title}
          </h1>
        </Reveal>
        <Reveal
          as="p"
          delay={0.12}
          className="mt-7 max-w-[490px] text-base leading-7 text-muted-foreground md:text-lg md:leading-8"
        >
          {description}
        </Reveal>
        <Reveal delay={0.16} className="mt-12 border-t border-border pt-5">
          <p className="max-w-[440px] text-sm font-semibold leading-6 text-foreground">
            Un espacio para aprender, compartir y subir al escenario con seguridad.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
