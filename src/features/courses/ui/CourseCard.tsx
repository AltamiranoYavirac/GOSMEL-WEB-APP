import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";

import type { ICourseCardProps } from "./CourseCard.types";

export default function CourseCard({ course, teachers, number }: ICourseCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-border bg-card shadow-sm transition-all duration-500 hover:border-primary/40 hover:shadow-md sm:flex-row">
      <div className="relative h-[220px] w-full sm:h-auto sm:min-h-[300px] sm:w-[42%]">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/45 to-surface-dark/5" />
        <div className="absolute inset-x-5 bottom-5">
          <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-stage-accent md:text-[11px]">
            {number} · {course.category}
          </p>
          <h3 className="text-[23px] font-semibold tracking-[-0.03em] text-surface-dark-foreground md:text-[26px]">
            {course.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <p className="line-clamp-2 text-[13px] leading-[1.6] text-muted-foreground md:line-clamp-3 md:text-[14px]">
            {course.description}
          </p>

          <p className="mb-3 mt-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary-700 md:text-[11px]">
            Lo que aprenderás
          </p>
          <ul className="flex flex-col gap-2.5">
            {course.learns.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary-700">
                  <Icon icon="ph:check-bold" className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-[13px] leading-[1.5] text-foreground md:text-[14px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {teachers.map((teacher) => (
              <div key={teacher.slug} className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarImage src={teacher.photo} alt={teacher.photoAlt} />
                  <AvatarFallback>
                    {teacher.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[13px] font-medium text-foreground">
                  {teacher.name}
                </span>
              </div>
            ))}
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="group/link flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary-700 transition-colors hover:text-primary"
          >
            Ver curso
            <Icon icon="ph:arrow-right" className="size-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
