import { Reveal } from "@/shared/ui";

import AboutMedia from "./AboutMedia";
import type { IAboutConcertsProps } from "./AboutConcerts.types";

export default function AboutConcerts({
  videoUrl,
  posterUrl,
  videoTitle,
  description,
}: IAboutConcertsProps) {
  return (
    <section aria-labelledby="about-concerts-title" className="bg-surface-dark py-16 md:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-[22px] text-surface-dark-foreground md:px-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:px-20">
        <Reveal>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-stage-accent">
            Conciertos
          </p>
          <h2
            id="about-concerts-title"
            className="mt-6 max-w-[520px] text-[clamp(2.1rem,4vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
          >
            {videoTitle}
          </h2>
          <p className="mt-6 max-w-[480px] text-base leading-7 text-surface-dark-muted md:text-lg md:leading-8">
            {description}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <AboutMedia
            src={videoUrl}
            poster={posterUrl}
            title={videoTitle}
            aspect="video"
            sizes="(max-width: 1023px) calc(100vw - 44px), (max-width: 1599px) 55vw, 860px"
          />
        </Reveal>
      </div>
    </section>
  );
}
