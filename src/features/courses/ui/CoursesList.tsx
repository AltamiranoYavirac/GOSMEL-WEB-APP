import { Reveal } from "@/shared/ui";

import { COURSES } from "../model/courses.constants";
import CourseCard from "./CourseCard";
import type { ICoursesListProps } from "./CoursesList.types";

export default function CoursesList({ teachersByCourse }: ICoursesListProps) {
  return (
    <section
      aria-labelledby="courses-catalog-title"
      className="bg-warm-50 py-16 md:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14 xl:px-20">
        <Reveal
          as="p"
          className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700"
        >
          Siete disciplinas · una academia
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className="max-w-[820px] text-[clamp(2rem,4.5vw,4rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-foreground"
        >
          <span id="courses-catalog-title">Instrumento o lenguaje musical, a tu ritmo.</span>
        </Reveal>
        <Reveal
          as="p"
          delay={0.08}
          className="mt-5 max-w-[680px] text-base leading-7 text-muted-foreground md:text-lg"
        >
          Explora cada programa, conoce a sus docentes y descubre las habilidades que desarrollarás durante el proceso.
        </Reveal>

        <div className="mt-12 md:mt-16 lg:mt-20">
          {COURSES.map((course, index) => {
            const number = String(index + 1).padStart(2, "0");
            const teachers = teachersByCourse[course.slug] ?? [];

            return (
              <Reveal key={course.slug} delay={Math.min(index * 0.025, 0.12)}>
                <CourseCard
                  course={course}
                  teachers={teachers}
                  number={number}
                  isFirst={index === 0}
                  isLast={index === COURSES.length - 1}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
