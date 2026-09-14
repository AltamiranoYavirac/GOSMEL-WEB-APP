import Image from "next/image";

import { getPublicSiteAssets } from "@/entities/site-asset";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { Reveal } from "@/shared/ui";

import { LANDING_HIGHLIGHTS } from "./LandingPage.constants";

export default async function ExperienceGallerySection() {
  const { data: assets } = await getPublicSiteAssets();
  const images = [
    {
      ...LANDING_HIGHLIGHTS[0],
      src: buildCloudinaryImageUrl(assets?.landing_stage?.publicId, "ar_3:2,c_fill,g_auto,w_1400,q_auto,f_auto"),
      alt: assets?.landing_stage?.alt ?? "",
    },
    {
      ...LANDING_HIGHLIGHTS[1],
      src: buildCloudinaryImageUrl(assets?.landing_teachers?.publicId, "ar_3:2,c_fill,g_auto,w_1400,q_auto,f_auto"),
      alt: assets?.landing_teachers?.alt ?? "",
    },
  ].filter((item): item is typeof item & { src: string } => Boolean(item.src));

  if (!images.length) return null;

  return (
    <section aria-labelledby="landing-experience-title" className="bg-background px-[22px] pb-[76px] md:px-14 md:pb-[120px]">
      <h2 id="landing-experience-title" className="sr-only">La experiencia GOSMEL en imágenes</h2>
      <div className="mx-auto grid w-full max-w-[1600px] gap-14 md:grid-cols-12 md:items-start md:gap-x-8 lg:gap-x-12">
        {images.map(({ src, alt, title, description }, index) => (
          <Reveal key={title} as="article" delay={index * 0.1} className={index === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24 lg:mt-32"}>
            <figure>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[18px] border border-warm-300 bg-warm-100 md:rounded-[20px]">
                <Image src={src} alt={alt} fill sizes={index === 0 ? "(max-width: 767px) 100vw, 58vw" : "(max-width: 767px) 100vw, 42vw"} className="object-cover" />
              </div>
              <figcaption className="border-t-2 border-primary-500 pt-5 md:pt-6">
                <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-foreground md:text-[32px]">{title}</h3>
                <p className="mt-2 max-w-[600px] text-base leading-relaxed text-warm-700 md:text-[17px]">{description}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
