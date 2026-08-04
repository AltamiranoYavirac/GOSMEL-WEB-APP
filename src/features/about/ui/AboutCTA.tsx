import Link from "next/link";
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
    <section className="w-full rounded-3xl bg-cocoa dark:bg-neutral-900 border border-cocoa/10 dark:border-neutral-800 px-8 py-16 flex flex-col items-center gap-6 text-center">

      <h2 className="text-3xl md:text-4xl font-bold text-white max-w-lg leading-tight">
        {title}
      </h2>

      <p className="text-neutral-300 text-sm max-w-md leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <Link
          href={primaryHref}
          className="bg-ginger text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:brightness-110 transition"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="border border-white/40 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:bg-white/10 transition"
        >
          {secondaryLabel}
        </Link>
      </div>

    </section>
  );
}