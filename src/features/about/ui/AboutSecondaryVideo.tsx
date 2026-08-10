import { Icon } from "@iconify/react";

import { Badge, MediaFrame, SectionHeader } from "@/shared/ui";

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
              <Badge
                key={label}
                variant="outline"
                className="gap-2 px-4 py-2 h-auto rounded-full border-accent-muted/40"
              >
                <Icon icon={icon} width={22} height={22} className="text-primary" aria-hidden="true" />
                <span className="text-base font-medium text-foreground">{label}</span>
              </Badge>
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
            className="w-full max-w-sm"
          />
        </div>
      </div>

    </section>
  );
}
