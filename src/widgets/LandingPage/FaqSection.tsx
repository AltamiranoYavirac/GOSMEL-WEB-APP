import { Reveal } from "@/shared/ui";

import { LANDING_FAQS } from "./LandingPage.constants";

export default function FaqSection() {
  return (
    <section className="bg-background px-[22px] pb-[70px] md:px-14 md:pb-0 md:pt-[110px]">
      <div className="mx-auto grid max-w-[1600px] gap-6 md:grid-cols-[340px_1fr] md:gap-14">
        <Reveal
          as="h2"
          className="text-[31px] font-semibold leading-[1.08] tracking-[-0.035em] md:text-[40px]"
        >
          Preguntas frecuentes
        </Reveal>
        <div>
          {LANDING_FAQS.map(({ question, answer }, index) => (
            <Reveal key={question} delay={index * 0.08}>
              <details
                open={index === 0}
                className={`group border-t border-border py-5 md:py-[22px]${
                  index === LANDING_FAQS.length - 1 ? " border-b" : ""
                }`}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-base font-semibold marker:content-none [&::-webkit-details-marker]:hidden md:text-[17px]">
                  {question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl font-normal leading-none text-muted-foreground transition-transform group-open:rotate-45 group-open:text-primary"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[660px] text-[14.5px] leading-[1.7] text-muted-foreground md:mt-3.5 md:text-[15px]">
                  {answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
