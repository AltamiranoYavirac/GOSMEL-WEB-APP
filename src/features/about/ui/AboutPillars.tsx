import type { IAboutPillarsProps } from "./AboutPillars.types";

export default function AboutPillars({ pillars }: IAboutPillarsProps) {
  return (
    <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.tag}
          className="bg-cream/60 dark:bg-neutral-900 border border-cocoa/10 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-3"
        >
          <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
            {pillar.tag}
          </span>
          <p className="text-cocoa/80 dark:text-neutral-300 text-sm leading-relaxed">
            {pillar.description}
          </p>
        </div>
      ))}
    </section>
  );
}