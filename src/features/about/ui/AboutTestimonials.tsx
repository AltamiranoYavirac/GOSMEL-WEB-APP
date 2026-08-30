import { SectionHeader } from "@/shared/ui";

import type { IAboutTestimonialsProps } from "./AboutTestimonials.types";

export default function AboutTestimonials({ testimonials }: IAboutTestimonialsProps) {
  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-10">
      <SectionHeader
        eyebrow="Testimonios"
        title="Voces de la Academia"
        size="md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="rounded-3xl p-8 bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]"
          >
            <p className="text-muted-foreground text-base leading-relaxed italic font-light">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                — {t.author}, {t.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
