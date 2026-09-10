import { Reveal } from "@/shared/ui";

import type { IAboutTestimonialsProps } from "./AboutTestimonials.types";

export default function AboutTestimonials({ testimonials }: IAboutTestimonialsProps) {
  return (
    <section aria-labelledby="about-testimonials-title" className="bg-warm-50 py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14 xl:px-20">
        <Reveal
          as="p"
          className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700"
        >
          Testimonios
        </Reveal>
        <Reveal as="h2" delay={0.06} className="mt-6">
          <span
            id="about-testimonials-title"
            className="block text-[clamp(2.3rem,4.5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-foreground"
          >
            Voces de la academia.
          </span>
        </Reveal>

        <div className="mt-14 grid border-t border-border md:mt-20 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Reveal
              key={testimonial.author}
              delay={index * 0.06}
              className={`border-b border-border py-10 md:py-14 ${
                index === 0 ? "md:border-r md:pr-12" : "md:pl-12"
              }`}
            >
              <blockquote>
                <p className="max-w-[620px] text-[clamp(1.45rem,2.3vw,2.25rem)] font-medium leading-[1.28] tracking-[-0.025em] text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="mt-8 border-t border-border pt-4 text-sm font-semibold text-primary-700">
                  {testimonial.author}
                  <span className="font-normal text-muted-foreground"> · {testimonial.role}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
