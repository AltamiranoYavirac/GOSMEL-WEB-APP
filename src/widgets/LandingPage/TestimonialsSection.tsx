import { LANDING_TESTIMONIALS } from "./LandingPage.constants";

export default function TestimonialsSection() {
  return (
    <section className="bg-background px-[22px] pb-[70px] md:px-14 md:pb-0 md:pt-[110px]">
      <div className="mx-auto max-w-[1600px]">
        <h2 className="mb-6 text-[31px] font-semibold tracking-[-0.035em] md:mb-10 md:text-[44px]">
          Estudiantes
        </h2>
        <div className="grid gap-0.5 md:grid-cols-3">
          {LANDING_TESTIMONIALS.map(({ text, label }) => (
            <article key={label} className="landing-rise bg-card px-6 py-7 last:hidden md:px-[34px] md:py-[38px] md:last:block">
              <p className="text-lg leading-[1.5] md:text-[21px]">{text}</p>
              <p className="mt-[22px] font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:mt-7 md:text-[11px] md:tracking-[0.14em]">
                {label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
