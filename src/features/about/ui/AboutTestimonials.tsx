import type { IAboutTestimonialsProps } from "./AboutTestimonials.types";

export default function AboutTestimonials({ testimonials }: IAboutTestimonialsProps) {
  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
          Testimonios
        </span>
        <h2 className="text-3xl font-bold text-cocoa dark:text-white">
          Voces de la Academia
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="bg-cream/60 dark:bg-neutral-900 border border-cocoa/10 dark:border-neutral-800 rounded-2xl p-8 flex flex-col gap-6"
          >
            <p className="text-cocoa/80 dark:text-neutral-300 text-sm leading-relaxed italic">
              "{t.quote}"
            </p>
            <div>
              <span className="text-ginger text-xs font-bold uppercase tracking-widest">
                — {t.author}, {t.role}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}