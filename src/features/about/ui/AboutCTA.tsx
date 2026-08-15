import Link from "next/link";

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
    <section className="w-full rounded-3xl bg-surface-dark px-8 py-16 flex flex-col items-center gap-6 text-center">

      <h2 className="text-3xl md:text-4xl font-bold text-surface-dark-foreground max-w-lg leading-tight">
        {title}
      </h2>

      <p className="text-surface-dark-muted text-base max-w-md leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <Button asChild size="2xl" className="uppercase tracking-widest text-sm">
          <Link href={primaryHref}>{primaryLabel}</Link>
        </Button>
        <Button
          asChild
          size="2xl"
          variant="outline"
          className="border-surface-dark-foreground/40 text-surface-dark-foreground uppercase tracking-widest text-sm hover:bg-surface-dark-foreground/10 hover:text-surface-dark-foreground"
        >
          <Link href={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>

    </section>
  );
}
