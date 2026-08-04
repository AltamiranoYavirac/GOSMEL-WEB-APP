"use client";

import { Icon } from "@iconify/react";
import type { IAboutVideoProps } from "./AboutVideo.types";

export default function AboutVideo({
  videoUrl,
  posterUrl,
  videoTitle,
}: IAboutVideoProps) {
  return (
    <section className="w-full flex flex-col items-center gap-6">

      <div className="flex flex-col items-center gap-2">
        <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
          Nuestra Esencia
        </span>
      </div>

      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-cocoa/10 dark:border-neutral-800">

        {videoUrl ? (
          <video
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-video object-cover"
          />
        ) : (
          <>
            <img
              src={posterUrl}
              alt={videoTitle}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-ginger flex items-center justify-center bg-black/40">
                <Icon icon="mdi:play" width={32} height={32} className="text-ginger ml-1" />
              </div>
            </div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">
            Video de presentación
          </p>
          <p className="text-white font-semibold text-sm">{videoTitle}</p>
        </div>

      </div>

      <div className="text-neutral-400 animate-bounce">
        <Icon icon="mdi:chevron-double-down" width={24} height={24} />
      </div>

    </section>
  );
}