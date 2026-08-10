"use client";

import { Icon } from "@iconify/react";
import type { IAboutSecondaryVideoProps } from "./AboutSecondaryVideo.types";

const FEATURE_HIGHLIGHTS = [
  { icon: "ph:users-three", label: "Comunidad unida" },
  { icon: "ph:trophy", label: "Excelencia musical" },
];

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
          <span className="text-ginger text-sm font-semibold uppercase tracking-widest">
            Sobre Nosotros
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-cocoa dark:text-cream">
            {videoTitle}
          </h2>
          <p className="text-cocoa/60 dark:text-cream/60 text-lg font-light leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {FEATURE_HIGHLIGHTS.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-peach/30 dark:border-neutral-700/40"
              >
                <Icon icon={icon} width={22} height={22} className="text-ginger" />
                <span className="text-base font-medium text-cocoa dark:text-cream">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden border border-cocoa/10 dark:border-neutral-800 shadow-xl">
            <video
              src={videoUrl}
              poster={posterUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
