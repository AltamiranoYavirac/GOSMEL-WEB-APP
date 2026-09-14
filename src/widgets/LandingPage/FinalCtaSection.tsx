import Link from "next/link";

import { getPublicSiteAssets } from "@/entities/site-asset";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { Button, Reveal, RevealImage } from "@/shared/ui";

export default async function FinalCtaSection() {
  const { data: assets } = await getPublicSiteAssets();
  const image = buildCloudinaryImageUrl(assets?.landing_cta?.publicId, "ar_16:9,c_fill,g_south,w_1920,q_auto,f_auto");

  return (
    <section aria-labelledby="landing-cta-title" className="relative h-[420px] overflow-hidden bg-surface-dark md:mt-[100px] md:h-[520px] lg:h-[560px]">
      {image ? <RevealImage src={image} alt={assets?.landing_cta?.alt ?? ""} sizes="100vw" className="object-cover object-center" /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/35 to-surface-dark/15 md:bg-gradient-to-r md:from-surface-dark/90 md:via-surface-dark/55 md:to-surface-dark/25" />
      <div className="absolute inset-0 mx-auto flex w-full max-w-[1600px] flex-col justify-end px-[22px] pb-8 text-surface-dark-foreground md:justify-center md:px-14 md:pb-0">
        <Reveal as="h2" className="max-w-[620px] text-[36px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[58px]">
          <span id="landing-cta-title">Empieza donde estás. Llega a donde quieras.</span>
        </Reveal>
        <Reveal delay={0.12} className="mt-[26px] flex flex-col gap-2.5 md:mt-9 md:flex-row md:items-center md:gap-7">
          <Button asChild className="h-[52px] w-full rounded-full bg-surface-dark-foreground px-8 text-base font-semibold text-surface-dark hover:bg-surface-dark-foreground/85 md:w-auto">
            <Link href="/courses">Ver cursos</Link>
          </Button>
          <Button asChild variant="outline" className="h-[52px] w-full rounded-full border-surface-dark-foreground/30 bg-transparent text-base font-semibold text-surface-dark-foreground hover:bg-surface-dark-foreground/10 hover:text-surface-dark-foreground md:h-auto md:w-auto md:border-0 md:p-0">
            <Link href="/register">Inscríbete ahora<span className="hidden md:inline"> ›</span></Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
