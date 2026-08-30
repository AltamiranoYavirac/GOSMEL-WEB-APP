import type { IAboutPillarsProps } from "./AboutPillars.types";

export default function AboutPillars({ pillars }: IAboutPillarsProps) {
  return (
    <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {pillars.map((pillar) => (
        <div
          key={pillar.tag}
          className="rounded-3xl p-8 bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]"
        >
          <span className="text-primary text-xs font-bold uppercase tracking-widest">
            {pillar.tag}
          </span>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-light">
            {pillar.description}
          </p>
        </div>
      ))}
    </section>
  );
}
