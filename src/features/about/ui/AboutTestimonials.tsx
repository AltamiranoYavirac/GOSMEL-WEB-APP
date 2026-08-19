import { Card, SectionHeader } from "@/shared/ui";

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
          <Card key={t.author} className="rounded-2xl p-8 gap-6">
            <p className="text-muted-foreground text-base leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                — {t.author}, {t.role}
              </span>
            </div>
          </Card>
        ))}
      </div>

    </section>
  );
}
