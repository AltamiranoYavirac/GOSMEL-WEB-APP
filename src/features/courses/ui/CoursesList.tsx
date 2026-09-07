import { Reveal } from "@/shared/ui";

import { COURSES } from "../model/courses.constants";
import CourseCard from "./CourseCard";
import type { ICoursesListProps } from "./CoursesList.types";

export default function CoursesList({ teachersByCourse }: ICoursesListProps) {
  return (
    <section className="bg-surface-dark pb-[70px] pt-[52px] md:pb-[110px] md:pt-[70px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal as="p" className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.22em]">
          Siete disciplinas · una academia
        </Reveal>
        <Reveal as="h2" delay={0.08} className="mb-[34px] max-w-[720px] text-[31px] font-semibold tracking-[-0.035em] text-surface-dark-foreground md:mb-12 md:text-[44px]">
          Instrumento o lenguaje musical, a tu ritmo.
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {COURSES.map((course, index) => {
            const number = String(index + 1).padStart(2, "0");
            const teachers = teachersByCourse[course.slug] ?? [];

            return (
              <Reveal key={course.slug} delay={index * 0.08}>
                <CourseCard
                  course={course}
                  teachers={teachers}
                  number={number}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
