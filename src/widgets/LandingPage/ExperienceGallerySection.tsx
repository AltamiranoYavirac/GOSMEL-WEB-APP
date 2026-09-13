import Image from "next/image";

import { AppImages } from "@/shared/config";
import { Reveal } from "@/shared/ui";

import { LANDING_HIGHLIGHTS } from "./LandingPage.constants";

const EXPERIENCE_IMAGES = [
  {
    ...LANDING_HIGHLIGHTS[0],
    src: AppImages.LANDING_STAGE,
    alt: "Estudiante de guitarra tocando en el recital de la academia",
    position: "center 28%",
  },
  {
    ...LANDING_HIGHLIGHTS[1],
    src: AppImages.LANDING_TEACHERS,
    alt: "Estudiante de canto interpretando con micrófono en el auditorio",
    position: "58% center",
  },
] as const;

export default function ExperienceGallerySection() {
  return (
    <section
      aria-labelledby="landing-experience-title"
      className="bg-background px-[22px] pb-[76px] md:px-14 md:pb-[120px]"
    >
      <h2 id="landing-experience-title" className="sr-only">
        La experiencia GOSMEL en imágenes
      </h2>

      <div className="mx-auto grid w-full max-w-[1600px] gap-14 md:grid-cols-12 md:items-start md:gap-x-8 lg:gap-x-12">
        {EXPERIENCE_IMAGES.map(
          ({ src, alt, position, title, description }, index) => (
            <Reveal
              key={title}
              as="article"
              delay={index * 0.1}
              className={
                index === 0
                  ? "md:col-span-7"
                  : "md:col-span-5 md:mt-24 lg:mt-32"
              }
            >
              <figure>
                <div className="relative aspect-[3/2] overflow-hidden rounded-[18px] border border-warm-300 bg-warm-100 md:rounded-[20px]">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 767px) 100vw, min(58vw, 920px)"
                        : "(max-width: 767px) 100vw, min(42vw, 640px)"
                    }
                    className="object-cover"
                    style={{ objectPosition: position }}
                  />
                </div>
                <figcaption className="border-t-2 border-primary-500 pt-5 md:pt-6">
                  <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-foreground md:text-[32px]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[600px] text-base leading-relaxed text-warm-700 md:text-[17px]">
                    {description}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ),
        )}
      </div>
    </section>
  );
}
