import { Reveal } from "@/shared/ui";

import { LANDING_STATS } from "./LandingPage.constants";

export default function PhilosophySection() {
  return (
    <section className="bg-background px-[22px] pb-[66px] pt-[76px] text-foreground md:px-14 md:pb-[110px] md:pt-[130px]">
      <div className="mx-auto max-w-[1600px] text-left md:text-center">
        <Reveal
          as="h2"
          className="mx-auto max-w-[900px] text-[33px] font-semibold leading-[1.12] tracking-[-0.035em] md:text-[58px] md:leading-[1.1]"
        >
          La formación musical nace del equilibrio entre el{" "}
          <span className="text-primary">conocimiento</span> y la{" "}
          <span className="text-primary">experiencia</span>.
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="mx-auto mt-[46px] grid max-w-[1100px] grid-cols-2 md:mt-20 md:grid-cols-4 [&>div:nth-child(even)]:border-l [&>div:nth-child(n+3)]:border-t md:[&>div:nth-child(n+3)]:border-t-0 md:[&>div+div]:border-l">
            {LANDING_STATS.map(({ value, label }) => (
              <div key={label} className="border-border px-0 py-5 even:pl-6 md:px-6 md:py-0 md:even:pl-6">
                <dd className="text-[40px] font-semibold leading-none tracking-[-0.05em] md:whitespace-nowrap md:text-[62px]">
                  {value}
                </dd>
                <dt className="mt-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground md:mt-3.5 md:text-[11px] md:tracking-[0.16em]">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
