import { getCarouselImages } from "@/features/carousel";
import HeroCarouselClient from "./HeroCarouselClient";

export default async function HeroCarouselSection() {
  const images = await getCarouselImages();
  return <HeroCarouselClient images={images} />;
}
