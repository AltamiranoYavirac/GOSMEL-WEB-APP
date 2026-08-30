import { MediaFrame, SectionHeader } from "@/shared/ui";

import type { IAboutValuesProps } from "./AboutValues.types";

export default function AboutValues({ values }: IAboutValuesProps) {
  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-10">
      <SectionHeader
        eyebrow="Valores Fundamentales"
        title={
          <>
            La Esencia de <span className="text-primary">GOSMEL</span>
          </>
        }
        size="sm"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col gap-4 p-5 rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]"
          >
            <MediaFrame
              variant="image"
              src={value.imageUrl}
              alt={value.title}
              aspect="tall"
              className="w-full rounded-2xl overflow-hidden shadow-none border-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent backdrop-blur-[1px]" />
            </MediaFrame>

            <div className="flex flex-col gap-2 p-1">
              <h3 className="text-primary font-bold text-base uppercase tracking-wider">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-light">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
