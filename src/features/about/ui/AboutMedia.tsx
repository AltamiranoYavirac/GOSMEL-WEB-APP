"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";

import type { IAboutMediaProps } from "./AboutMedia.types";

const ASPECT: Record<IAboutMediaProps["aspect"], string> = {
  video: "aspect-[16/10]",
  portrait: "aspect-[9/16]",
};

export default function AboutMedia({
  src,
  poster,
  title,
  aspect,
  sizes,
  captionsSrc,
  className,
}: IAboutMediaProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <figure className={cn("m-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-muted",
          ASPECT[aspect]
        )}
      >
        {isPlaying ? (
          <video
            autoPlay
            controls
            playsInline
            preload="metadata"
            aria-label={title}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={src} type="video/mp4" />
            {captionsSrc ? (
              <track kind="captions" src={captionsSrc} srcLang="es" label="Español" default />
            ) : null}
            Tu navegador no puede reproducir este video.
          </video>
        ) : (
          <>
            <Image
              src={poster}
              alt={`Vista previa: ${title}`}
              fill
              sizes={sizes}
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Reproducir video: ${title}`}
              className="absolute inset-0 flex items-center justify-center bg-surface-dark/10 text-surface-dark-foreground outline-none transition-colors hover:bg-surface-dark/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            >
              <span className="flex min-h-11 items-center gap-3 rounded-lg border border-surface-dark-foreground/60 bg-surface-dark/80 px-4 text-sm font-semibold">
                <Icon icon="ph:play-fill" className="size-4" aria-hidden="true" />
                Reproducir
              </span>
            </button>
          </>
        )}
      </div>
    </figure>
  );
}
