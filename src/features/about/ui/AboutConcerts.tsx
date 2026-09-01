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
    <section className="bg-background pt-[70px] md:pt-[110px]">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-[22px] md:px-14 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <Reveal>
          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]">
            Conciertos
          </p>
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[40px]">
            {videoTitle}
          </h2>
          <p className="mt-5 max-w-[480px] text-[15px] leading-[1.65] text-muted-foreground md:text-base">
            {description}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <AboutMedia src={videoUrl} poster={posterUrl} title={videoTitle} aspect="video" />
        </Reveal>
      </div>
    </section>
  );
}
