"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui/carousel";
import { Badge, Button } from "@/shared/ui";
import { SLIDE_META } from "./HeroCarouselSection.constants";
import type { IHeroCarouselClientProps, IHeroSlide } from "./HeroCarouselSection.types";

export default function HeroCarouselClient({ images }: IHeroCarouselClientProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides: IHeroSlide[] = images.length > 0
    ? images.map((img, i) => ({
        image: img.secureUrl,
        alt: img.alt,
        ...(SLIDE_META[i % SLIDE_META.length]),
      }))
    : SLIDE_META.map((meta) => ({
        ...meta,
        image: "https://res.cloudinary.com/dv9lm0fnm/image/upload/v1781123573/Gosmel-cover.jpg",
        alt: "GOSMEL Music Academy",
      }));

  const activeSlide = slides[current] ?? slides[0];

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 5500);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="bg-dot-pattern absolute inset-0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-muted/15 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/80 text-primary border border-border text-xs uppercase tracking-widest font-bold backdrop-blur-md">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeSlide.badge}</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
                GOSMEL
                <span className="text-brand-gradient block text-3xl sm:text-4xl lg:text-5xl font-light italic mt-2">
                  &ldquo;Lo bello de la teoría en la práctica&rdquo;
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light max-w-xl border-l-2 border-primary/50 pl-5">
                Desarrollamos tu talento musical desde la primera lección con metodología práctica, personal docente titulado y salas acondicionadas.
              </p>
            </div>

            <div className="pt-2">
              <Button
                asChild
                size="2xl"
                className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold gap-3 h-14 px-8 shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-all"
              >
                <Link href={activeSlide.cta.href}>
                  <span>{activeSlide.cta.label}</span>
                  <Icon icon="ph:arrow-right-bold" className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-border/70 flex flex-wrap items-center gap-6 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="size-4 text-primary" aria-hidden="true" />
                <span>Docentes Titulados</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="size-4 text-primary" aria-hidden="true" />
                <span>Horarios Flexibles</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" className="size-4 text-primary" aria-hidden="true" />
                <span>Recitales en Escena</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -top-6 -right-6 size-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 size-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/30 dark:bg-card/40 backdrop-blur-2xl p-3 shadow-[0_16px_40px_-12px_rgba(73,17,28,0.12)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]">
              <Carousel
                setApi={setApi}
                opts={{ loop: true, align: "start" }}
                className="w-full h-full rounded-2xl overflow-hidden"
              >
                <CarouselContent className="h-full -ml-0">
                  {slides.map((slide, index) => (
                    <CarouselItem key={index} className="pl-0 relative h-full w-full">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                        <Image
                          src={slide.image}
                          alt={slide.alt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={index === 0}
                        />
                        <div className="absolute top-4 right-4 z-10">
                          <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border border-white/20 text-xs font-mono px-3 py-1 shadow-md">
                            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                          </Badge>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 pt-24 pb-7 px-6 sm:px-8 bg-gradient-to-t from-black/85 via-black/45 to-transparent backdrop-blur-[2px] z-10 space-y-1.5 pr-28">
                          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary drop-shadow-xs">
                            {slide.badge}
                          </span>
                          <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight drop-shadow-md">
                            {slide.title} {slide.subtitle}
                          </h3>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="absolute right-7 bottom-7 z-20 flex items-center gap-2">
                  <CarouselPrevious
                    size="icon"
                    variant="outline"
                    className="static translate-y-0 size-10 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 text-white hover:bg-white/40 dark:hover:bg-black/60 hover:text-primary transition-all shadow-md"
                    aria-label="Diapositiva anterior"
                  />
                  <CarouselNext
                    size="icon"
                    variant="outline"
                    className="static translate-y-0 size-10 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 text-white hover:bg-white/40 dark:hover:bg-black/60 hover:text-primary transition-all backdrop-blur-md shadow-md"
                    aria-label="Siguiente diapositiva"
                  />
                </div>

                <div className="absolute left-8 bottom-8 z-20 hidden sm:flex items-center gap-1.5">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Ir a diapositiva ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        current === index
                          ? "w-6 bg-primary"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
