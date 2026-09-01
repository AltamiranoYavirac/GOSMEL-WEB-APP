import { cn } from "@/shared/lib/utils";
import { Reveal } from "@/shared/ui";

import { COURSE_BENTO_SPANS, COURSES } from "../model/courses.constants";
import CourseBentoCard from "./CourseBentoCard";

export default function CoursesBento() {
  return (
    <section className="bg-background pb-[70px] pt-[52px] md:pb-[110px] md:pt-[70px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal as="p" className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.22em]">
          Siete disciplinas · una academia
        </Reveal>
        <Reveal as="h2" delay={0.08} className="mb-[34px] max-w-[720px] text-[31px] font-semibold tracking-[-0.035em] md:mb-12 md:text-[44px]">
          Instrumento o lenguaje musical, a tu ritmo.
        </Reveal>

        <div className="grid auto-rows-[260px] grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((course, index) => {
            const spanClass = COURSE_BENTO_SPANS[course.title];

            return (
              <Reveal
                key={course.title}
                delay={index * 0.08}
                className={cn("h-full", spanClass)}
              >
                <CourseBentoCard
                  course={course}
                  number={String(index + 1).padStart(2, "0")}
                  featured={Boolean(spanClass)}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
