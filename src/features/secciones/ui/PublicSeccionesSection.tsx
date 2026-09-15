import Image from "next/image";

import { buildCloudinaryImageUrl } from "@/shared/lib";
import { Reveal } from "@/shared/ui";

import type { IPublicSeccionesSectionProps } from "./PublicSeccionesSection.types";

export default function PublicSeccionesSection({ items }: IPublicSeccionesSectionProps) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="about-sections-title" className="bg-background py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14 xl:px-20">
        <Reveal
          as="p"
          className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700"
        >
          La academia
        </Reveal>
        <Reveal as="h2" delay={0.06} className="mt-6">
          <span
            id="about-sections-title"
            className="block max-w-[900px] text-[clamp(2.3rem,4.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground"
          >
            Nuestra historia, misión y visión.
          </span>
        </Reveal>

        <div className="mt-14 md:mt-20">
          {items.map((item, index) => {
            const image = buildCloudinaryImageUrl(item.imagenPublicId, "ar_4:3,c_fill,g_auto,w_1200,q_auto,f_auto");
            const paragraphs = item.contenido.split(/\n{2,}/).filter(Boolean);

            return (
              <article
                key={item.id}
                aria-labelledby={`about-section-${item.clave}`}
                className={`grid min-w-0 grid-cols-1 gap-8 border-t border-border py-12 md:gap-12 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 ${
                  index === items.length - 1 ? "pb-0" : ""
                }`}
              >
                <div className="min-w-0">
                  <Reveal>
                    <h3
                      id={`about-section-${item.clave}`}
                      className="text-[clamp(1.8rem,3vw,3.25rem)] font-semibold leading-none tracking-[-0.05em] text-foreground"
                    >
                      {item.titulo}
                    </h3>
                    <div className="mt-6 space-y-4">
                      {paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="max-w-[560px] text-base leading-7 text-muted-foreground md:text-lg md:leading-8"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </div>

                {image ? (
                  <Reveal
                    delay={0.08}
                    className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <Image
                      src={image}
                      alt={item.imagenTextoAlt ?? item.titulo}
                      fill
                      sizes="(max-width: 767px) calc(100vw - 44px), (max-width: 1023px) calc(100vw - 112px), (max-width: 1599px) 48vw, 720px"
                      className="object-cover"
                    />
                  </Reveal>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
