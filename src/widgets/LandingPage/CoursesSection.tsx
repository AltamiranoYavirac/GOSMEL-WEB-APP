import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Reveal } from "@/shared/ui";

import type { ICoursesSectionProps } from "./CoursesSection.types";

export default function CoursesSection({ courses }: ICoursesSectionProps) {
  if (!courses.length) return null;

  return (
    <section id="cursos" className="bg-warm-50 py-[72px] md:py-[112px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal className="flex items-end justify-between border-b border-warm-300 pb-6 md:pb-8">
          <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary">Aprende a tu ritmo</p><h2 className="mt-3 text-[34px] font-semibold tracking-[-0.035em] md:text-[48px]">Cursos destacados</h2></div>
          <Link href="/courses" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-700 hover:text-primary-900">Ver todos →</Link>
        </Reveal>
        <div className="grid gap-5 pt-8 md:grid-cols-3">
          {courses.slice(0, 3).map((course, index) => (
            <Reveal key={course.id} delay={index * 0.06} as="article" className="overflow-hidden rounded-2xl border border-border bg-card">
              <Link href={`/courses/${course.slug}`} className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="relative aspect-[4/3] bg-muted">
                  {course.image ? <Image src={course.image} alt={course.imageAlt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" /> : <Icon icon={course.icon} className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />}
                </div>
                <div className="p-5"><p className="font-mono text-xs uppercase tracking-wider text-primary">{course.category}</p><h3 className="mt-2 text-2xl font-semibold">{course.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{course.description}</p></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
