import Image from "next/image";

import { LANDING_HIGHLIGHTS } from "./LandingPage.constants";

export default function HighlightsSection() {
  return (
    <section aria-label="La experiencia GOSMEL" className="grid gap-0.5 bg-background md:grid-cols-2">
      {LANDING_HIGHLIGHTS.map(({ image, imageAlt, imagePosition, title, description }) => (
        <article key={title} className="relative h-[340px] overflow-hidden md:h-[420px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/20 to-transparent" />
          <div className="landing-rise absolute inset-x-0 bottom-0 px-[22px] pb-[26px] text-surface-dark-foreground md:px-9 md:pb-9">
            <h2 className="text-[27px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[34px]">
              {title}
            </h2>
            <p className="mt-2 max-w-[420px] text-sm leading-[1.6] text-surface-dark-muted md:mt-2.5 md:text-[15px]">
              {description}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
