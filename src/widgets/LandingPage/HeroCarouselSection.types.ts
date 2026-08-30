import type { ICarouselImage } from "@/features/carousel";

export interface IHeroSlide {
  image: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface IHeroCarouselClientProps {
  images: ICarouselImage[];
}
