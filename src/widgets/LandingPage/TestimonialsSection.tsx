import { getPublicTestimonios } from "@/features/testimonios/server";
import { Reveal } from "@/shared/ui";

import TestimonialsCarousel from "./TestimonialsCarousel";

export default async function TestimonialsSection() {
  const { data: testimonios, error } = await getPublicTestimonios();
  if (error) throw new Error(error);
  if (!testimonios.length) return null;

  return (
    <section className="bg-background px-[22px] pb-[70px] md:px-14 md:pb-0 md:pt-[110px]">
      <div className="mx-auto max-w-[1600px]">
        <Reveal
          as="h2"
          className="mb-6 text-[31px] font-semibold tracking-[-0.035em] md:mb-10 md:text-[44px]"
        >
          Estudiantes
        </Reveal>
        <TestimonialsCarousel testimonios={testimonios} />
      </div>
    </section>
  );
}
