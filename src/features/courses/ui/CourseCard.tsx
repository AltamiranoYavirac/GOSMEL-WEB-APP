import Image from "next/image";
import { Icon } from "@iconify/react";

import { COURSES } from "../model/courses.constants";

interface ICourseCardProps {
  course: (typeof COURSES)[number];
  index: number;
}

export default function CourseCard({ course, index }: ICourseCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/[0.07]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-80" />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span className="inline-flex items-center rounded-full border border-border/70 bg-card/85 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
            {course.category}
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-black/35 font-mono text-[10px] tracking-widest text-white backdrop-blur-sm">
            {number}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20">
          <Icon icon={course.icon} className="size-6" aria-hidden="true" />
        </div>

        <h3 className="font-heading text-2xl font-bold leading-tight text-card-foreground">
          {course.title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {course.learns.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
