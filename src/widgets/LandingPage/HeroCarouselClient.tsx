"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/ui/carousel";
import type { ICarouselImage } from "@/features/carousel";
import type { IHeroSlide } from "./HeroCarouselSection.types";

const SLIDE_META: Omit<IHeroSlide, "image" | "alt">[] = [
  {
    badge: `Matrículas abiertas ${new Date().getFullYear()}`,
    title: "GOSMEL",
    subtitle: "Tu Pasión, Nuestra Música",
    cta: { label: "Inscríbete Ahora", href: "/contact" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Clases personalizadas",
    title: "Aprende con",
    subtitle: "los Mejores Maestros",
    cta: { label: "Inscríbete Ahora", href: "/contact"  },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Piano · Guitarra · Violín · Chelo",
    title: "Todos los",
    subtitle: "Instrumentos, Un Solo Lugar",
    cta: { label: "Inscríbete Ahora", href: "/contact" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Para todas las edades",
    title: "Excelencia",
    subtitle: "Académica desde el Primer Día",
    cta: { label: "Inscríbete Ahora", href: "/contact" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Música en conjunto",
    title: "Toca con",
    subtitle: "Otros Músicos",
    cta: { label: "Inscríbete Ahora", href: "/contact" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Conciertos y recitales",
    title: "Demuestra tu",
    subtitle: "Talento en Escena",
    cta: { label: "Inscríbete Ahora", href: "/contact" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
  {
    badge: "Canto · Voz · Técnica vocal",
    title: "También",
    subtitle: "Clases de Canto",
    cta: { label: "Inscríbete Ahora", href: "/contact" },
    ctaSecondary: { label: "Ver Cursos", href: "/courses" },
  },
];

interface IHeroCarouselClientProps {
  images: ICarouselImage[];
}

export default function HeroCarouselClient({ images }: IHeroCarouselClientProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides: IHeroSlide[] = images.map((img, i) => ({
    image: img.secureUrl,
    alt: img.alt,
    ...(SLIDE_META[i % SLIDE_META.length]),
  }));

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
    <header className="relative w-full h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative h-screen w-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              <div className="absolute inset-0 flex items-center z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-foreground/5 backdrop-blur-sm text-foreground/90 font-medium text-xs border border-foreground/10 tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {slide.badge}
                    </div>

                    <div>
                      <h1 className="text-5xl lg:text-8xl font-bold leading-tight text-foreground drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <span className="block mt-2 text-4xl lg:text-6xl font-light italic text-primary drop-shadow-md">
                        {slide.subtitle}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Link
                        href={slide.cta.href}
                        className="inline-flex justify-center items-center px-8 py-4 bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest text-xs rounded-lg shadow-lg shadow-primary/30"
                      >
                        {slide.cta.label}
                        <Icon
                          icon="ph:arrow-right"
                          width={16}
                          height={16}
                          className="ml-2"
                          aria-hidden="true"
                        />
                      </Link>
                      <Link
                        href={slide.ctaSecondary.href}
                        className="inline-flex justify-center items-center px-8 py-4 bg-foreground/5 backdrop-blur-sm text-foreground font-semibold border border-foreground/20 hover:bg-foreground/10 hover:border-foreground/40 transition-all duration-300 uppercase tracking-widest text-xs rounded-lg"
                      >
                        {slide.ctaSecondary.label}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-foreground/10 mt-6"> 
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-foreground hover:bg-background/80 hover:scale-110 transition-all duration-300"
          aria-label="Diapositiva anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 256 256"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={32}
            aria-hidden="true"
          >
            <polyline points="160 208 80 128 160 48" />
          </svg>
        </button>

        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-foreground hover:bg-background/80 hover:scale-110 transition-all duration-300"
          aria-label="Siguiente diapositiva"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={22}
            height={22}
            viewBox="0 0 256 256"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={32}
            aria-hidden="true"
          >
            <polyline points="96 208 176 128 96 48" />
          </svg>
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </header>
  );
}
