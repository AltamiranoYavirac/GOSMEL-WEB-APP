import Image from "next/image";

import { Reveal } from "@/shared/ui";

import type { IAboutValuesProps } from "./AboutValues.types";

export default function AboutValues({ values }: IAboutValuesProps) {
  return (
    <section aria-labelledby="about-values-title" className="bg-background py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14 xl:px-20">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <Reveal
            as="p"
            className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700"
          >
            Valores fundamentales
          </Reveal>
          <Reveal as="h2" delay={0.06}>
            <span
              id="about-values-title"
              className="block max-w-[760px] text-[clamp(2.4rem,5vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground"
            >
              La esencia de GOSMEL.
            </span>
          </Reveal>
        </div>

        <div className="mt-14 md:mt-20">
          {values.map((value, index) => {
            const isEven = index % 2 === 1;
            const valueId = `about-value-${index + 1}`;

            return (
              <article
                key={value.title}
                aria-labelledby={valueId}
                className={`grid min-w-0 grid-cols-1 gap-8 border-t border-border py-16 md:gap-12 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-24 ${
                  index === values.length - 1 ? "pb-0" : ""
                }`}
              >
                <div className={`min-w-0 ${isEven ? "lg:col-start-2" : "lg:col-start-1"}`}>
                  <Reveal>
                    <p className="font-mono text-sm font-semibold tracking-[0.1em] text-primary-700">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3
                      id={valueId}
                      className="mt-5 text-[clamp(2rem,3.5vw,3.75rem)] font-semibold leading-none tracking-[-0.05em] text-foreground"
                    >
                      {value.title}
                    </h3>
                    <p className="mt-6 max-w-[500px] text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                      {value.description}
                    </p>
                  </Reveal>
                </div>

                <Reveal
                  delay={0.08}
                  className={`relative aspect-[4/5] min-w-0 overflow-hidden rounded-xl border border-border bg-muted ${
                    isEven ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-2"
                  }`}
                >
                  <Image
                    src={value.imageUrl}
                    alt={value.imageAlt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 44px), (max-width: 1023px) calc(100vw - 112px), (max-width: 1599px) 48vw, 720px"
                    className="object-cover"
                  />
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
