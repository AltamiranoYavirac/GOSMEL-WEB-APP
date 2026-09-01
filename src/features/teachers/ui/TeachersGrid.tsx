import { Reveal } from "@/shared/ui";

import TeacherCard from "./TeacherCard";
import type { ITeachersGridProps } from "./TeachersGrid.types";

export default function TeachersGrid({ teachers }: ITeachersGridProps) {
  return (
    <section aria-labelledby="teachers-title" className="bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pb-[80px] pt-[70px] md:px-14 md:pb-[110px] md:pt-[110px]">
        <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]">
          El equipo
        </Reveal>
        <Reveal as="div" delay={0.08}>
          <h1
            id="teachers-title"
            className="max-w-[680px] text-[38px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[54px]"
          >
            Los maestros detrás de cada instrumento.
          </h1>
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-5 max-w-[540px] text-base leading-[1.6] text-muted-foreground">
          Un profesor dedicado por disciplina, formado en conservatorio y con años acompañando estudiantes de todos los niveles.
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <Reveal key={teacher.slug} delay={index * 0.06}>
              <TeacherCard teacher={teacher} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
