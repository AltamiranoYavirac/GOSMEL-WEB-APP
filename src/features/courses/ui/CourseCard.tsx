import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";

import type { ICourseCardProps } from "./CourseCard.types";

export default function CourseCard({ course, number, total, isFirst, isLast }: ICourseCardProps) {
  const courseHref = `/courses/${course.slug}`;
  const isEven = Number(number) % 2 === 0;

  return (
    <article className={`grid min-w-0 grid-cols-1 gap-8 border-t border-border py-16 md:gap-10 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14 lg:py-24 xl:gap-20 ${isFirst ? "border-t-0 pt-0" : ""} ${isLast ? "pb-0" : ""}`}>
      <div className={`flex min-w-0 flex-col lg:py-4 ${isEven ? "lg:col-start-2" : "lg:col-start-1"}`}>
        <div>
          <p className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
            <span className="tabular-nums">{number} / {total}</span>
            <span aria-hidden="true" className="h-px w-7 bg-primary-700/45" />
            <span>{course.category}</span>
          </p>
          <h3 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground">{course.title}</h3>
          <p className="mt-5 max-w-[38rem] text-base leading-[1.75] text-muted-foreground md:text-lg">{course.description}</p>
          {course.learns.length ? (
            <>
              <p className="mb-4 mt-7 text-sm font-semibold text-foreground md:mt-8">Lo que aprenderás</p>
              <ul className="flex flex-col gap-3">
                {course.learns.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Icon icon="ph:check" className="mt-0.5 size-5 shrink-0 text-primary-700" aria-hidden="true" />
                    <span className="text-base leading-6 text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col items-start gap-6 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mt-10">
          <div className="flex flex-wrap items-center gap-2">
            {course.teachers.map((teacher) => (
              <Link key={teacher.id} href={`/teachers/${teacher.slug}`} className="flex min-h-11 items-center gap-3 rounded-lg px-1.5 pr-3 text-sm font-semibold outline-none hover:bg-primary-tint focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="size-9" aria-hidden="true">
                  {teacher.photo ? <AvatarImage src={teacher.photo} alt={teacher.photoAlt} /> : null}
                  <AvatarFallback>{teacher.name.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
                </Avatar>
                <span>{teacher.name}</span>
              </Link>
            ))}
          </div>
          {course.priceLabel ? (
            <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground">
              <Icon icon="ph:tag" className="size-4 text-primary-700" aria-hidden="true" />
              {course.priceLabel}
            </span>
          ) : null}
          <Link href={courseHref} className="group/link inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-primary-700 px-5 text-sm font-bold text-primary-700 outline-none hover:bg-primary-700 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary">
            Ver curso
            <Icon icon="ph:arrow-right" className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Link href={courseHref} aria-label={`Ver el curso de ${course.title}`} className={`relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl border border-border bg-muted outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary lg:row-start-1 ${isEven ? "lg:col-start-1" : "lg:col-start-2"}`}>
        {course.image ? (
          <Image src={course.image} alt={course.imageAlt} fill loading="lazy" sizes="(max-width: 1023px) 100vw, 52vw" className="object-cover transition-opacity duration-200 hover:opacity-95" />
        ) : (
          <span className="flex h-full items-center justify-center text-muted-foreground"><Icon icon={course.icon} className="size-16" aria-hidden="true" /></span>
        )}
      </Link>
    </article>
  );
}
