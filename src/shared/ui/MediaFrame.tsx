import Image from "next/image";

import { cn } from "@/shared/lib/utils";

import { mediaFrameVariants } from "./MediaFrame.variants";
import type { IMediaFrameProps } from "./MediaFrame.types";

export default function MediaFrame({
  variant = "image",
  src,
  alt,
  poster,
  aspect = "video",
  sizes,
  className,
  children,
}: IMediaFrameProps) {
  return (
    <div className={cn(mediaFrameVariants({ variant, aspect }), className)}>
      {variant === "video" ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      {children}
    </div>
  );
}
