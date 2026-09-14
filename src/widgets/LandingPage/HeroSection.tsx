import { getImageProps } from "next/image";
import Link from "next/link";

import { getPublicSiteAssets } from "@/entities/site-asset";
import { buildCloudinaryImageUrl, getCurrentYear } from "@/shared/lib";
import { Button, Reveal } from "@/shared/ui";

export default async function HeroSection() {
  const { data: assets } = await getPublicSiteAssets();
  const desktopAsset = assets?.landing_hero_desktop;
  const mobileAsset = assets?.landing_hero_mobile;
  const desktopImage = buildCloudinaryImageUrl(desktopAsset?.publicId, "ar_4:3,c_fill,g_auto,w_1600,q_auto,f_auto");
  const mobileImage = buildCloudinaryImageUrl(mobileAsset?.publicId, "ar_13:20,c_fill,g_auto,w_960,q_auto,f_auto") ?? desktopImage;
  const commonImageProps = {
    alt: mobileAsset?.alt || desktopAsset?.alt || "",
    sizes: "(min-width: 1640px) 928px, (min-width: 1024px) calc(58vw - 24px), 100vw",
  };
  const desktopProps = desktopImage
    ? getImageProps({ ...commonImageProps, src: desktopImage, width: 1600, height: 1200, quality: 75 }).props
    : null;
  const mobileProps = mobileImage
    ? getImageProps({ ...commonImageProps, src: mobileImage, width: 960, height: 1477, quality: 75 }).props
    : null;

  return (
    <section aria-labelledby="landing-hero-title" className="bg-background lg:px-5">
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[minmax(0,21fr)_minmax(0,29fr)]">
        <div className="flex items-center px-[22px] py-10 md:px-14 md:py-14 lg:px-20 lg:py-20 xl:py-24">
          <div className="w-full max-w-[660px]">
            <Reveal as="p" delay={0.05} className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary-700 md:mb-5 md:text-xs">
              Matrículas abiertas {getCurrentYear()}
            </Reveal>
            <Reveal as="div" delay={0.12}>
              <h1 id="landing-hero-title" className="max-w-[640px] text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] text-pretty md:text-[64px] lg:text-[58px] xl:text-[68px]">
                Lo bello de la teoría en la práctica.
              </h1>
            </Reveal>
            <Reveal as="p" delay={0.19} className="mt-5 max-w-[570px] text-base leading-[1.65] text-warm-700 md:mt-6 md:text-lg">
              Academia de música en Quito con cursos personalizados, programas formativos y un escenario real al cerrar cada etapa.
            </Reveal>
            <Reveal delay={0.26} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-8 md:gap-5">
              <Button asChild className="h-12 w-full rounded-lg bg-primary-500 px-7 text-base font-bold text-primary-950 hover:bg-primary-600 sm:w-auto">
                <Link href="/courses">Ver cursos y programas</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 w-full rounded-lg border-warm-300 bg-background px-7 text-base font-semibold sm:w-auto">
                <Link href="/register">Inscríbete ahora</Link>
              </Button>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.12} className="relative aspect-[13/20] w-full overflow-hidden bg-warm-100 sm:aspect-[4/3] lg:aspect-[4/3] 2xl:h-[660px] 2xl:aspect-auto">
          {mobileProps ? (
            <picture>
              {desktopProps?.srcSet ? <source media="(min-width: 1024px)" srcSet={desktopProps.srcSet} /> : null}
              <source media="(max-width: 1023px)" srcSet={mobileProps.srcSet} />
              {/* getImageProps + picture is the Next.js art-direction pattern. */}
              <img {...mobileProps} alt={mobileProps.alt} fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
            </picture>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
