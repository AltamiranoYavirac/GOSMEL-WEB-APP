import { Reveal } from "@/shared/ui";

import { LANDING_HIGHLIGHTS } from "./LandingPage.constants";

export default function HighlightsSection() {
  return (
    <section
      aria-label="La experiencia GOSMEL"
      className="border-y border-warm-200 bg-warm-50"
    >
      <div className="mx-auto grid w-full max-w-[1600px] md:grid-cols-2">
        {LANDING_HIGHLIGHTS.map(({ title, description }, index) => (
          <Reveal
            key={title}
            as="article"
            delay={index * 0.08}
            className="border-warm-200 px-[22px] py-7 first:border-b md:px-14 md:py-9 md:first:border-r md:first:border-b-0 lg:px-12 xl:px-16 2xl:px-20"
          >
            <h2 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-2xl">
              {title}
            </h2>
            <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-warm-700 md:text-base">
              {description}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
