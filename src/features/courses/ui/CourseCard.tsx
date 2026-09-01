import Image from "next/image";
import { Icon } from "@iconify/react";

import type { IPublicCourse } from "../model/public-course.types";

interface ICourseCardProps {
  course: IPublicCourse;
  index: number;
}

export default function CourseCard({ course, index }: ICourseCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={course.imagen}
          alt={course.imagenAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span className="inline-flex items-center rounded-full border border-white/60 dark:border-white/5 bg-background/90 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
            {course.categoria}
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-black/40 font-mono text-[10px] font-bold tracking-widest text-white backdrop-blur-sm shadow-md">
            {number}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-5 inline-flex size-13 items-center justify-center rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] text-primary transition-all duration-300 group-hover:scale-105">
          <Icon icon={course.icono} className="size-6" aria-hidden="true" />
        </div>

        <h3 className="font-heading text-2xl font-bold leading-tight text-foreground">
          {course.titulo}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground font-light">
          {course.descripcion}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {course.aprende.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/50 dark:border-white/5 bg-background shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(169,146,125,0.15)] dark:shadow-[-1px_-1px_3px_rgba(255,255,255,0.02),1px_1px_3px_rgba(0,0,0,0.4)] px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}