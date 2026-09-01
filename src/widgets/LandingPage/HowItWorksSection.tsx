import { AppImages } from "@/shared/config";
import { Reveal, RevealImage } from "@/shared/ui";

import { LANDING_STEPS } from "./LandingPage.constants";

export default function HowItWorksSection() {
  return (
    <section className="bg-card dark:bg-background">
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[1.02fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[9/10]">
          <RevealImage
            src={AppImages.LANDING_PROCESS}
            alt="Profesora acompañando en guitarra a un estudiante de violín"
            sizes="(max-width: 1023px) 100vw, (max-width: 1600px) 51vw, 820px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-[22px] pb-[70px] pt-[52px] lg:px-[60px] lg:py-24">
          <Reveal
            as="p"
            className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary lg:mb-[22px] lg:text-[11px] lg:tracking-[0.22em]"
          >
            Cómo funciona
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="mb-[30px] text-[33px] font-semibold leading-[1.06] tracking-[-0.035em] lg:mb-10 lg:text-[46px]"
          >
            Cuatro pasos, a tu ritmo
          </Reveal>

          <div className="[&>div:last-child]:border-b [&>div:last-child>span]:text-primary">
            {LANDING_STEPS.map(({ title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 0.08}
                className="flex gap-[18px] border-t border-border py-5 lg:gap-6 lg:py-[22px]"
              >
                <span className="pt-1 font-mono text-[10px] font-medium text-muted-foreground lg:text-[11px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] lg:text-[19px]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-[1.55] text-muted-foreground lg:text-[14.5px]">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
