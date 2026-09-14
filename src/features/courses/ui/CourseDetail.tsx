import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Reveal } from "@/shared/ui";

import type { ICourseDetailProps } from "./CourseDetail.types";

export default function CourseDetail({ course }: ICourseDetailProps) {
  const classRows = [
    { label: "Formato", value: course.classFormat },
    { label: "Horario", value: course.schedule },
    { label: "Inversión", value: course.priceLabel ?? "" },
    { label: "Cierre de etapa", value: course.stageClosing },
  ].filter((row) => row.value);

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pt-9 md:px-14">
        <nav className="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
          <Link href="/courses" className="hover:text-foreground">Cursos</Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </nav>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-[1600px] gap-10 px-[22px] md:px-14 lg:grid-cols-[420px_1fr] lg:gap-14">
        <div className="relative h-[380px] self-start overflow-hidden rounded-[26px] bg-muted lg:sticky lg:top-20 lg:h-[720px]">
          {course.image ? (
            <Image src={course.image} alt={course.imageAlt} fill priority sizes="(max-width: 1023px) 100vw, 420px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-muted-foreground"><Icon icon={course.icon} className="size-20" aria-hidden="true" /></span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent" />
        </div>

        <div>
          <Reveal as="h1" className="text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[62px]">{course.title}</Reveal>
          <Reveal as="p" delay={0.08} className="mt-5 max-w-[560px] text-base leading-[1.65] text-muted-foreground md:text-[17px]">{course.description}</Reveal>
          <div className="my-12 h-px bg-border" />

          {course.modules.length ? (
            <section aria-labelledby="course-learns-title">
              <p id="course-learns-title" className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Lo que aprenderás</p>
              <div className="flex flex-col gap-7">
                {course.modules.map((modulo) => (
                  <div key={modulo.id}>
                    <p className="text-sm font-semibold">{modulo.title}</p>
                    {modulo.description ? <p className="mt-1 text-sm leading-[1.5] text-muted-foreground">{modulo.description}</p> : null}
                    {modulo.lessons.length ? (
                      <div className="mt-3 flex flex-col gap-2.5">
                        {modulo.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-start gap-3.5">
                            <Icon icon="ph:check-bold" className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                            <p className="text-[15px] leading-[1.5] text-muted-foreground">{lesson.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="my-11 h-px bg-border" />
            </section>
          ) : null}

          {course.audienceAge || course.audienceLevel ? (
            <section aria-labelledby="course-audience-title">
              <p id="course-audience-title" className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Para quién es este curso</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.audienceAge ? <div className="rounded-[18px] border border-border bg-card p-[22px]"><p className="mb-1.5 text-sm font-semibold">Edad</p><p className="text-sm leading-[1.5] text-muted-foreground">{course.audienceAge}</p></div> : null}
                {course.audienceLevel ? <div className="rounded-[18px] border border-border bg-card p-[22px]"><p className="mb-1.5 text-sm font-semibold">Nivel</p><p className="text-sm leading-[1.5] text-muted-foreground">{course.audienceLevel}</p></div> : null}
              </div>
              <div className="my-11 h-px bg-border" />
            </section>
          ) : null}

          {classRows.length ? (
            <section aria-labelledby="course-classes-title">
              <p id="course-classes-title" className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Cómo son las clases</p>
              {classRows.map((row, index) => (
                <div key={row.label} className={`flex items-center justify-between gap-5 py-4 ${index < classRows.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-sm font-medium">{row.label}</span>
                  <span className="text-right text-sm text-muted-foreground">{row.value}</span>
                </div>
              ))}
            </section>
          ) : null}
        </div>
      </div>

      {course.gallery.length ? (
        <section className="mx-auto mt-[100px] w-full max-w-[1600px] px-[22px] md:mt-[130px] md:px-14" aria-labelledby="course-gallery-title">
          <Reveal as="p" className="mb-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary"><span id="course-gallery-title">Galería</span></Reveal>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {course.gallery.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.08} className="relative h-[300px] overflow-hidden rounded-[22px] md:h-[420px]">
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {course.testimonial ? (
        <section className="mx-auto mt-[90px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
          <Reveal className="mx-auto max-w-[820px] rounded-[26px] border border-border bg-card px-6 py-12 md:px-[60px] md:py-[52px]">
            <p className="text-[19px] font-light italic leading-[1.5] md:text-2xl">&ldquo;{course.testimonial.quote}&rdquo;</p>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">{course.testimonial.author} · {course.testimonial.role}</p>
          </Reveal>
        </section>
      ) : null}

      {course.teachers.length ? (
        <section className="mx-auto mt-[90px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14" aria-labelledby="course-teachers-title">
          <Reveal as="p" className="mb-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary"><span id="course-teachers-title">Docentes</span></Reveal>
          <div className="mx-auto grid max-w-[920px] gap-3 sm:grid-cols-2">
            {course.teachers.map((teacher) => (
              <Reveal key={teacher.id}>
                <Link href={`/teachers/${teacher.slug}`} className="grid min-h-28 grid-cols-[80px_1fr] items-center gap-4 rounded-[22px] border border-border bg-card p-4 hover:border-primary/50">
                  <div className="relative size-20 overflow-hidden rounded-[18px] bg-muted">
                    {teacher.photo ? <Image src={teacher.photo} alt={teacher.photoAlt} fill sizes="80px" className="object-cover" /> : <Icon icon="ph:user" className="m-6 size-8 text-muted-foreground" aria-hidden="true" />}
                  </div>
                  <div><p className="font-bold">{teacher.name}</p><p className="mt-1 text-sm text-muted-foreground">{teacher.headline}</p></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
