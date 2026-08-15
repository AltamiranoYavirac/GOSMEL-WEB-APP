import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import type { IAboutCTAProps } from "./AboutCTA.types";

export default function AboutCTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: IAboutCTAProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-primary-200/60 bg-card-gradient px-8 py-20 md:px-14 text-center dark:border-warm-700/60 dark:bg-warm-900">
      <div className="bg-dot-pattern absolute inset-0 text-primary-500 dark:text-secondary-500" aria-hidden="true" />

      <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" aria-hidden="true" />

      <div className="relative mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary-100 text-primary-700 ring-1 ring-primary-300/70 dark:bg-primary-tint dark:text-primary-foreground dark:ring-primary-400/30">
        <Icon icon="mdi:music-clef-treble" className="size-7" aria-hidden="true" />
      </div>

      <h2 className="relative text-4xl md:text-6xl font-bold leading-tight text-foreground max-w-3xl mx-auto">
        {title}
      </h2>

      <div className="relative mx-auto my-8 flex max-w-xs items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-warm-300 dark:bg-warm-600" />
        <span className="size-1.5 rounded-full bg-primary-500" />
        <span className="h-px flex-1 bg-warm-300 dark:bg-warm-600" />
      </div>

      <p className="relative text-lg font-light leading-relaxed text-muted-foreground max-w-xl mx-auto">
        {description}
      </p>

      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="2xl" className="uppercase tracking-widest text-sm">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        <Button
          asChild
          size="2xl"
          variant="outline"
          className="border-warm-700/40 bg-transparent text-warm-900 uppercase tracking-widest text-sm hover:bg-warm-200/60 hover:text-warm-900 dark:border-warm-200/40 dark:bg-transparent dark:text-warm-50 dark:hover:bg-warm-700/40 dark:hover:text-warm-50"
        >
          <Link href={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>
    </section>
  );
}