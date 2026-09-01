import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";

import type { ICourseBentoCardProps } from "./CourseBentoCard.types";

export default function CourseBentoCard({
  course,
  number,
  spanClass,
  featured = false,
}: ICourseBentoCardProps) {
  const { slug, title, category, description, image, imageAlt, learns } = course;

  return (
    <Link
      href={`/courses/${slug}`}
      className={cn(
        "group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-[18px] p-6 text-surface-dark-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:rounded-[22px] md:p-7",
        spanClass,
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/35 to-surface-dark/5" />

      <div className="relative">
        <p className="mb-2 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-stage-accent md:text-[10px] md:tracking-[0.18em]">
          {number} · {category}
        </p>
        <h3 className="text-[23px] font-semibold tracking-[-0.03em] md:text-[26px]">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-3 max-w-[420px] text-[13px] leading-[1.5] text-surface-dark-muted md:mt-2 md:text-[13.5px]">
          {description}
        </p>
        {featured ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {learns.map((item) => (
              <li
                key={item}
                className="rounded-full bg-surface-dark-foreground/10 px-3 py-1.5 text-[11.5px] font-medium text-surface-dark-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Link>
  );
}
