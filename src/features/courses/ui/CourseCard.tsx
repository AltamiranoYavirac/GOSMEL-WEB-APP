import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";

import type { ICourseCardProps } from "./CourseCard.types";

export default function CourseCard({
  course,
  teachers,
  number,
  isFirst,
  isLast,
}: ICourseCardProps) {
  const courseHref = `/courses/${course.slug}`;
  const isEven = Number(number) % 2 === 0;

  return (
    <article
      className={`grid min-w-0 grid-cols-1 gap-8 border-t border-border py-16 md:gap-10 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14 lg:py-24 xl:gap-20 ${
        isFirst ? "border-t-0 pt-0" : ""
      } ${isLast ? "pb-0" : ""}`}
    >
      <div
        className={`flex min-w-0 flex-col lg:py-4 ${
          isEven ? "lg:col-start-2" : "lg:col-start-1"
        }`}
      >
        <div>
          <p className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
            <span className="tabular-nums">{number} / 07</span>
            <span aria-hidden="true" className="h-px w-7 bg-primary-700/45" />
            <span>{course.category}</span>
          </p>

          <h3 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-foreground">
            {course.title}
          </h3>

          <p className="mt-5 max-w-[38rem] text-base leading-[1.75] text-muted-foreground md:text-lg">
            {course.description}
          </p>

          <p className="mb-4 mt-7 text-sm font-semibold text-foreground md:mt-8">
            Lo que aprenderás
          </p>
          <ul className="flex flex-col gap-3">
            {course.learns.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-primary-700">
                  <Icon icon="ph:check" className="size-5" aria-hidden="true" />
                </span>
                <span className="text-base leading-6 text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-start gap-6 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:mt-10">
          <div className="flex flex-wrap items-center gap-2">
            {teachers.map((teacher) => (
              <Link
                key={teacher.slug}
                href={`/teachers/${teacher.slug}`}
                aria-label={`Ver perfil de ${teacher.name}`}
                className="flex min-h-11 items-center gap-3 rounded-lg px-1.5 pr-3 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-primary-tint hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-warm-50"
              >
                <Avatar className="size-9" aria-hidden="true">
                  <AvatarImage src={teacher.photo} alt={teacher.photoAlt} />
                  <AvatarFallback>
                    {teacher.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{teacher.name}</span>
              </Link>
            ))}
          </div>

          <Link
            href={courseHref}
            className="group/link inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-primary-700 px-5 text-sm font-bold text-primary-700 outline-none transition-colors hover:bg-primary-700 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-warm-50"
          >
            Ver curso
            <Icon icon="ph:arrow-right" className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Link
        href={courseHref}
        aria-label={`Ver el curso de ${course.title}`}
        className={`relative aspect-[4/3] min-w-0 overflow-hidden rounded-xl border border-border bg-muted outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-warm-50 lg:row-start-1 ${
          isEven ? "lg:col-start-1" : "lg:col-start-2"
        }`}
      >
        <Image
          src={course.catalogImage}
          alt={course.catalogImageAlt}
          fill
          loading="lazy"
          sizes="(max-width: 767px) calc(100vw - 44px), (max-width: 1023px) calc(100vw - 112px), (max-width: 1599px) 52vw, 760px"
          className="object-cover transition-opacity duration-200 hover:opacity-95"
        />
      </Link>
    </article>
  );
}
