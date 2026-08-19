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
          <div key={value.title} className="flex flex-col gap-4">
            <MediaFrame
              variant="image"
              src={value.imageUrl}
              alt={value.title}
              aspect="tall"
              className="w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-scrim-strong to-transparent" />
            </MediaFrame>

            <div className="flex flex-col gap-2">
              <h3 className="text-primary font-bold text-lg uppercase tracking-widest">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
