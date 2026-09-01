import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, Reveal } from "@/shared/ui";

import type { ICourseDetailProps } from "./CourseDetail.types";

export default function CourseDetail({ course, detail, teacher }: ICourseDetailProps) {
  const classRows = [
    { label: "Formato", value: detail.classInfo.format },
    { label: "Horario", value: detail.classInfo.schedule },
    { label: "Cierre de etapa", value: detail.classInfo.closing },
  ];

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pt-9 md:px-14">
        <nav className="flex items-center gap-2.5 text-[12px] font-medium text-muted-foreground">
          <Link href="/courses" className="transition-colors hover:text-foreground">
            Cursos
          </Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </nav>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-[1600px] gap-10 px-[22px] md:px-14 lg:grid-cols-[420px_1fr] lg:gap-14">
        <div className="relative h-[380px] self-start overflow-hidden rounded-[26px] lg:sticky lg:top-20 lg:h-[720px]">
          <Image
            src={course.image}
            alt={course.imageAlt}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 420px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent" />
          <span className="absolute left-[22px] top-[22px] rounded-full bg-surface-dark/55 px-[15px] py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-stage-accent backdrop-blur-sm">
            {course.category}
          </span>
        </div>

        <div>
          <Reveal as="h1" className="text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[62px]">
            {course.title}
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-5 max-w-[560px] text-[16px] leading-[1.65] text-muted-foreground md:text-[17px]">
            {course.description}
          </Reveal>
          <Reveal delay={0.14} className="mt-6 flex flex-wrap gap-2.5">
            {course.learns.map((item) => (
              <span key={item} className="rounded-full bg-accent-muted px-4 py-2 text-[13px] font-medium">
                {item}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.2}>
            <Button asChild className="mt-7 h-[52px] w-fit rounded-full px-[28px] text-[14px] font-semibold">
              <Link href="/contact">Reservar clase de prueba</Link>
            </Button>
          </Reveal>

          <div className="my-12 h-px bg-border" />

          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
            Lo que aprenderás
          </p>
          <div className="flex flex-col gap-4">
            {course.learns.map((item) => (
              <div key={item} className="flex items-start gap-3.5">
                <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Icon icon="ph:check-bold" className="size-3.5" aria-hidden="true" />
                </span>
                <p className="text-[15px] leading-[1.5] text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>

          <div className="my-11 h-px bg-border" />

          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
            Para quién es este curso
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-border bg-card p-[22px]">
              <p className="mb-1.5 text-[14px] font-semibold">Edad</p>
              <p className="text-[14px] leading-[1.5] text-muted-foreground">{detail.audience.age}</p>
            </div>
            <div className="rounded-[18px] border border-border bg-card p-[22px]">
              <p className="mb-1.5 text-[14px] font-semibold">Nivel</p>
              <p className="text-[14px] leading-[1.5] text-muted-foreground">{detail.audience.level}</p>
            </div>
          </div>

          <div className="my-11 h-px bg-border" />

          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
            Cómo son las clases
          </p>
          <div className="flex flex-col">
            {classRows.map((row, index) => (
              <div
                key={row.label}
                className={`flex items-center justify-between py-4 ${
                  index < classRows.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-[14px] font-medium">{row.label}</span>
                <span className="text-[14px] text-muted-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto mt-[100px] w-full max-w-[1600px] px-[22px] md:mt-[130px] md:px-14">
        <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
          Galería
        </Reveal>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[1.3fr_1fr]">
          {detail.gallery.map((item, index) => (
            <Reveal
              key={item.src}
              delay={index * 0.08}
              className="relative h-[300px] overflow-hidden rounded-[22px] md:h-[420px]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-[90px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
        <Reveal className="mx-auto max-w-[820px] rounded-[26px] border border-border bg-card px-6 py-12 md:px-[60px] md:py-[52px]">
          <p className="text-[19px] font-light italic leading-[1.5] md:text-[24px]">
            &ldquo;{detail.testimonial.quote}&rdquo;
          </p>
          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
            {detail.testimonial.author} · {detail.testimonial.role}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-[90px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
        <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
          Tu profesor
        </Reveal>
        <Reveal>
          <Link
            href={`/teachers/${teacher.slug}`}
            className="mx-auto grid max-w-[820px] grid-cols-[88px_1fr] items-center gap-5 rounded-[22px] border border-border bg-card p-5 sm:grid-cols-[120px_1fr_auto] sm:gap-6 sm:p-[22px] sm:pr-7"
          >
            <div className="relative size-[88px] overflow-hidden rounded-[18px] sm:size-[120px]">
              <Image src={teacher.photo} alt={teacher.photoAlt} fill sizes="120px" className="object-cover" />
            </div>
            <div>
              <p className="text-[18px] font-bold tracking-[-0.02em] sm:text-[20px]">{teacher.name}</p>
              <p className="mt-1 text-[14px] text-muted-foreground">{teacher.headline}</p>
            </div>
            <span className="col-span-2 text-[13px] font-semibold text-primary sm:col-span-1">
              Ver perfil →
            </span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
