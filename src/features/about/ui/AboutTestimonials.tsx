import { Reveal } from "@/shared/ui";

import type { IAboutTestimonialsProps } from "./AboutTestimonials.types";

export default function AboutTestimonials({ testimonials }: IAboutTestimonialsProps) {
  return (
    <section className="bg-background pt-[80px] md:pt-[130px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]">
          Testimonios
        </Reveal>
        <Reveal as="h2" delay={0.08} className="mb-11 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[44px]">
          Voces de la academia.
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.author}
              delay={index * 0.08}
              className="rounded-[22px] border border-border bg-card p-[34px] md:p-[38px]"
            >
              <p className="text-[17px] font-light italic leading-[1.55] md:text-[19px]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
                {testimonial.author} · {testimonial.role}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
