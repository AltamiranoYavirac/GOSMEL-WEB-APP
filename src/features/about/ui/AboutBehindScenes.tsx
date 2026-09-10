import { Reveal } from "@/shared/ui";

import AboutMedia from "./AboutMedia";
import type { IAboutBehindScenesProps } from "./AboutBehindScenes.types";

export default function AboutBehindScenes({
  videoUrl,
  posterUrl,
  videoTitle,
  description,
}: IAboutBehindScenesProps) {
  return (
    <section aria-labelledby="about-process-title" className="border-b border-border bg-warm-50 py-16 md:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-[22px] md:px-14 lg:grid-cols-[0.7fr_1fr] lg:gap-24">
        <Reveal delay={0.08} className="order-2 mx-auto w-full max-w-[330px] lg:order-1 lg:max-w-[360px]">
          <AboutMedia
            src={videoUrl}
            poster={posterUrl}
            title={videoTitle}
            aspect="portrait"
            sizes="(max-width: 767px) min(100vw - 44px, 330px), 360px"
          />
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
            Detrás de escena
          </p>
          <h2
            id="about-process-title"
            className="mt-6 max-w-[520px] text-[clamp(2.1rem,4vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground"
          >
            {videoTitle}
          </h2>
          <p className="mt-6 max-w-[490px] text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {description}
          </p>
          <div className="mt-10 max-w-[490px] border-t border-border pt-5 text-sm leading-6 text-foreground">
            La confianza se construye en cada ensayo, antes de que llegue el momento de tocar frente al público.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
