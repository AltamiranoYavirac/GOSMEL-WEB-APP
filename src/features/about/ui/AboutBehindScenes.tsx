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
    <section className="bg-background pt-[70px] md:pt-[110px]">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-[22px] md:px-14 lg:grid-cols-[0.85fr_1fr] lg:gap-14">
        <Reveal delay={0.12} className="order-2 flex justify-center lg:order-1">
          <AboutMedia
            src={videoUrl}
            poster={posterUrl}
            title={videoTitle}
            aspect="portrait"
            className="w-[280px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55)] md:rounded-[28px]"
          />
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]">
            Detrás de escena
          </p>
          <h2 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] md:text-[36px]">
            {videoTitle}
          </h2>
          <p className="mt-5 max-w-[460px] text-[15px] leading-[1.65] text-muted-foreground md:text-base">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
