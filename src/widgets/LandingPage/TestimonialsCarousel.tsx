"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Autoplay from "embla-carousel-autoplay";

import { buildCloudinaryImageUrl } from "@/shared/lib";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

import type { ITestimonialsCarouselProps } from "./TestimonialsCarousel.types";

export default function TestimonialsCarousel({ testimonios }: ITestimonialsCarouselProps) {
  const hasOverflow = testimonios.length > 3;
  const plugins = useMemo(
    () => (hasOverflow ? [Autoplay({ delay: 10000, stopOnInteraction: false, stopOnMouseEnter: true })] : []),
    [hasOverflow]
  );

  return (
    <Carousel
      opts={{
        loop: hasOverflow,
        slidesToScroll: 1,
        breakpoints: { "(min-width: 768px)": { slidesToScroll: 3 } },
      }}
      plugins={plugins}
    >
      <CarouselContent className="-ml-0.5">
        {testimonios.map(({ id, cita, autor, rol, fotoPublicId, puntuacion }) => {
          const photo = buildCloudinaryImageUrl(fotoPublicId, "ar_1:1,c_fill,g_auto,w_160,q_auto,f_auto");

          return (
            <CarouselItem key={id} className="pl-0.5 md:basis-1/3">
              <article className="flex h-full flex-col bg-card px-6 py-7 md:px-8.5 md:py-9.5">
                {puntuacion ? (
                  <div className="mb-4 flex gap-1 text-primary" aria-label={`${puntuacion} de 5 estrellas`}>
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Icon
                        key={star}
                        icon={star < puntuacion ? "ph:star-fill" : "ph:star"}
                        className="size-4"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ) : null}
                <p className="text-lg leading-normal md:text-[21px]">{cita}</p>
                <div className="mt-5.5 flex items-center gap-3 md:mt-7">
                  {photo ? (
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image src={photo} alt={`Foto de ${autor}`} fill sizes="44px" className="object-cover" />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-foreground md:text-[11px] md:tracking-[0.14em]">
                      {autor}
                    </p>
                    {rol ? (
                      <p className="text-xs text-muted-foreground">{rol}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden md:-left-14 md:flex" />
      <CarouselNext className="hidden md:-right-14 md:flex" />
    </Carousel>
  );
}
