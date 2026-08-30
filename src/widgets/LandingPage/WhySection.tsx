import Image from "next/image";
import { Icon } from "@iconify/react";

import { AppImages } from "@/shared/config";
import { SectionHeader } from "@/shared/ui";
import { WHY_FEATURES } from "./WhySection.constants";

export default function WhySection() {
  return (
    <section className="py-28 bg-background border-t border-border/80" id="ventajas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-10">
            <SectionHeader
              align="left"
              size="md"
              eyebrow="Propuesta Pedagógica"
              title={
                <>
                  ¿Por qué elegir <span className="text-primary">GOSMEL?</span>
                </>
              }
              description="Combinamos rigor técnico con un enfoque cálido y práctico para que disfrutes tu aprendizaje musical desde la primera sesión."
            />

            <div className="space-y-6">
              {WHY_FEATURES.map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="p-6 sm:p-7 rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)] group flex items-start gap-5"
                >
                  <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-105 shrink-0 mt-0.5">
                    <Icon icon={icon} className="size-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -top-10 -right-10 size-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden bg-background border border-white/60 dark:border-white/5 p-3 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)]">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden group">
                <Image
                  src={AppImages.HERO_COVER}
                  alt="Estudiante interpretando violonchelo en GOSMEL"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/20 to-transparent" />

                <div className="absolute inset-x-4 bottom-4 p-6 rounded-2xl bg-surface-dark/60 dark:bg-black/60 backdrop-blur-xl border border-white/15 text-surface-dark-foreground space-y-2 shadow-lg">
                  <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-wider font-bold">
                    <Icon icon="ph:sparkle-fill" className="size-4" aria-hidden="true" />
                    <span>Experiencia Escénica</span>
                  </div>
                  <p className="text-sm font-light text-surface-dark-muted leading-relaxed italic">
                    &ldquo;La música es una experiencia viva: te preparamos para tocar con seguridad, sensibilidad y pasión.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
