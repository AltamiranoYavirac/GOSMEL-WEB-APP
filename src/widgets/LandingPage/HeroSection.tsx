import Link from "next/link";

import { AppImages } from "@/shared/config";
import { getCurrentYear } from "@/shared/lib";
import { Button, Reveal, RevealImage } from "@/shared/ui";

export default function HeroSection() {
  return (
    <section
      aria-labelledby="landing-hero-title"
      className="relative h-[600px] overflow-hidden md:h-[740px]"
    >
      <div className="md:hidden">
        <RevealImage
          src={AppImages.LANDING_HERO_MOBILE}
          alt="Estudiante de violín de GOSMEL durante una presentación"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="hidden md:block">
        <RevealImage
          src={AppImages.LANDING_HERO_DESKTOP}
          alt="Estudiantes de GOSMEL agradeciendo al público al final de un concierto"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/40 to-surface-dark/10" />

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[1600px] px-[22px] pb-8 text-surface-dark-foreground md:px-14 md:pb-[62px]">
        <Reveal
          as="p"
          delay={0.05}
          className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stage-accent md:mb-[22px] md:text-[11px] md:tracking-[0.24em]"
        >
          Matrículas abiertas {getCurrentYear()}
        </Reveal>
        <Reveal as="div" delay={0.16}>
          <h1
            id="landing-hero-title"
            className="max-w-[940px] text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] text-pretty md:text-[76px]"
          >
            Lo bello de la teoría en la práctica.
          </h1>
        </Reveal>
        <Reveal
          as="p"
          delay={0.27}
          className="mt-4 max-w-[560px] text-base leading-[1.55] text-surface-dark-muted md:mt-6 md:text-[19px]"
        >
          <span className="hidden md:inline">Academia de música en Quito. </span>
          Siete programas, clases personalizadas y un escenario real al cerrar cada etapa.
        </Reveal>
        <Reveal
          delay={0.38}
          className="mt-[26px] flex flex-col gap-2.5 md:mt-[34px] md:flex-row md:items-center md:gap-[30px]"
        >
          <Button
            asChild
            className="h-[52px] w-full rounded-full bg-surface-dark-foreground px-[30px] text-base font-semibold text-surface-dark hover:bg-surface-dark-foreground/85 md:w-auto md:text-[15px]"
          >
            <Link href="/courses">Ver los 7 programas</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[52px] w-full rounded-full border-surface-dark-foreground/30 bg-transparent text-base font-semibold text-surface-dark-foreground hover:bg-surface-dark-foreground/10 hover:text-surface-dark-foreground md:h-auto md:w-auto md:border-0 md:p-0 md:text-[15px] md:font-medium md:text-stage-accent md:hover:bg-transparent md:hover:text-stage-accent/80"
          >
            <Link href="/register">Inscríbete ahora<span className="hidden md:inline"> ›</span></Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
