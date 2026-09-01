import { cn } from "@/shared/lib/utils";

import type { IAboutMediaProps } from "./AboutMedia.types";

const ASPECT: Record<IAboutMediaProps["aspect"], string> = {
  video: "aspect-[16/10]",
  portrait: "aspect-[9/16]",
};

export default function AboutMedia({ src, poster, title, aspect, className }: IAboutMediaProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-border bg-card md:rounded-[24px]",
        ASPECT[aspect],
        className,
      )}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        aria-label={title}
      />
    </div>
  );
}
