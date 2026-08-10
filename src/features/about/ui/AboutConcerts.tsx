"use client";

import type { IAboutConcertsProps } from "./AboutConcerts.types";

export default function AboutConcerts({
  videoUrl,
  posterUrl,
  videoTitle,
  description,
}: IAboutConcertsProps) {
  return (
    <section className="w-full flex flex-col items-center gap-10">

      <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
        <span className="text-ginger text-sm font-semibold uppercase tracking-widest">
          Conciertos
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-cocoa dark:text-cream">
          {videoTitle}
        </h2>
        <p className="text-cocoa/60 dark:text-cream/60 text-lg font-light leading-relaxed">
          {description}
        </p>
      </div>

      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-cocoa/10 dark:border-neutral-800 shadow-xl">
        <video
          src={videoUrl}
          poster={posterUrl}
          controls
          playsInline
          className="w-full aspect-video object-cover"
        />
      </div>

    </section>
  );
}
