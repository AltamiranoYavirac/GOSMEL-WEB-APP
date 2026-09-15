import Image from "next/image";

import { buildCloudinaryImageUrl } from "@/shared/lib";
import { Reveal } from "@/shared/ui";

import type { IPublicGaleriaSectionProps } from "./PublicGaleriaSection.types";

export default function PublicGaleriaSection({ items }: IPublicGaleriaSectionProps) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="about-gallery-title" className="bg-warm-50 py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14 xl:px-20">
        <Reveal
          as="p"
          className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700"
        >
          Galería
        </Reveal>
        <Reveal as="h2" delay={0.06} className="mt-6">
          <span
            id="about-gallery-title"
            className="block text-[clamp(2.3rem,4.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground"
          >
            Momentos GOSMEL.
          </span>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-3 md:gap-4">
          {items.map((item, index) => {
            const src = buildCloudinaryImageUrl(item.publicId, "ar_4:3,c_fill,g_auto,w_900,q_auto,f_auto");
            if (!src) return null;

            return (
              <Reveal
                key={item.id}
                as="div"
                delay={Math.min(index * 0.05, 0.3)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
              >
                <Image
                  src={src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 767px) calc(50vw - 26px), (max-width: 1599px) 32vw, 500px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {item.titulo ? (
                  <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-surface-dark-foreground">
                    {item.titulo}
                  </p>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
