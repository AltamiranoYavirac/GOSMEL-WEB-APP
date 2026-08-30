import { Icon } from "@iconify/react";

import { MediaFrame, SectionHeader } from "@/shared/ui";

import type { IAboutSecondaryVideoProps } from "./AboutSecondaryVideo.types";
import { FEATURE_HIGHLIGHTS } from "./AboutSecondaryVideo.constants";

export default function AboutSecondaryVideo({
  videoUrl,
  posterUrl,
  videoTitle,
  description,
}: IAboutSecondaryVideoProps) {
  return (
    <section className="w-full flex flex-col items-center gap-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl w-full">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <SectionHeader
            eyebrow="Sobre Nosotros"
            title={videoTitle}
            description={description}
            size="lg"
            align="left"
          />
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {FEATURE_HIGHLIGHTS.map(({ icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.5)] transition-all"
              >
                <Icon icon={icon} width={20} height={20} className="text-primary shrink-0" aria-hidden="true" />
                <span className="text-xs uppercase tracking-wider font-bold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <MediaFrame
            variant="video"
            src={videoUrl}
            poster={posterUrl}
            alt={videoTitle}
            aspect="portrait"
            className="w-full max-w-sm rounded-3xl border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)]"
          />
        </div>
      </div>
    </section>
  );
}
