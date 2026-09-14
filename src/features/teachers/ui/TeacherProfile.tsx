import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { Button, Reveal } from "@/shared/ui";

import { PORTAFOLIO_TIPO_LABEL, RED_SOCIAL } from "../model/teachers.constants";
import type { ITeacherProfileProps } from "./TeacherProfile.types";

export default function TeacherProfile({ teacher }: ITeacherProfileProps) {
  const redes = Object.entries(teacher.redesSociales).filter(([key, url]) => RED_SOCIAL[key] && url);
  const tieneFrase = Boolean(teacher.fraseDestacada?.trim());

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pt-9 md:px-14">
        <nav className="flex items-center gap-2.5 text-[12px] font-medium text-muted-foreground">
          <Link href="/teachers" className="transition-colors hover:text-foreground">
            Profesores
          </Link>
          <span>/</span>
          <span className="text-foreground">{teacher.name}</span>
        </nav>
      </div>

      <section className="mx-auto mt-6 w-full max-w-[1600px] px-[22px] md:px-14">
        <div className="grid gap-0.5 overflow-hidden rounded-[26px] lg:grid-cols-2">
          <div className="relative h-[360px] sm:h-[460px] lg:h-[520px]">
            {teacher.photo ? (
              <Image
                src={teacher.photo}
                alt={teacher.photoAlt}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <Icon icon="ph:user" className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <Reveal className="flex flex-col justify-center bg-card px-[22px] py-12 md:px-12 md:py-14 lg:px-[52px]">
            <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
              {teacher.headline}
            </p>
            <h1 className="text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[48px]">
              {teacher.name}
            </h1>
            <p className="mt-5 text-[15px] leading-[1.65] text-muted-foreground md:text-base">
              {teacher.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {teacher.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-muted px-4 py-2 text-[13px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Button
              asChild
              className="mt-7 h-[52px] w-fit rounded-full px-[28px] text-[14px] font-semibold"
            >
              <Link href="/contact">Reservar clase con {teacher.name.split(" ")[0]}</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-[80px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Reveal className="rounded-[22px] border border-border bg-card p-8 md:p-9">
            <p className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
              Formación
            </p>
            <div className="flex flex-col gap-[18px]">
              {teacher.education.length > 0 ? (
                teacher.education.map((item) => (
                  <div key={item.title}>
                    <p className="text-[15px] font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-[13.5px] text-muted-foreground">{item.detail}</p>
                  </div>
                ))
              ) : (
                <p className="text-[13.5px] text-muted-foreground">Sin formación registrada.</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-[22px] border border-border bg-card p-8 md:p-9">
            <p className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
              Instrumentos que enseña
            </p>
            <div className="flex flex-wrap gap-2.5">
              {teacher.instruments.length > 0 ? (
                teacher.instruments.map((item) => (
                  <span
                    key={item.nombre}
                    className={cn(
                      "rounded-full px-[18px] py-2 text-[13px]",
                      item.esPrincipal
                        ? "bg-primary-tint font-semibold text-primary"
                        : "bg-accent-muted font-medium"
                    )}
                  >
                    {item.nombre}
                  </span>
                ))
              ) : (
                <p className="text-[13.5px] text-muted-foreground">Sin instrumentos registrados.</p>
              )}
            </div>

            {redes.length > 0 ? (
              <div className="mt-[22px] border-t border-border/60 pt-[18px]">
                <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
                  Redes
                </p>
                <div className="flex flex-wrap gap-2">
                  {redes.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-[12.5px] font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Icon icon={RED_SOCIAL[key].icon} className="size-4" aria-hidden="true" />
                      {RED_SOCIAL[key].label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </Reveal>
        </div>
      </section>

      {tieneFrase ? (
        <section className="mx-auto mt-[80px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
          <Reveal className="mx-auto max-w-[860px] rounded-[26px] border border-border bg-card px-6 py-12 md:px-16 md:py-14">
            <span aria-hidden="true" className="block text-[60px] leading-[0.4] text-primary">
              &ldquo;
            </span>
            <p className="mt-4 text-[20px] font-light italic leading-[1.5] md:text-[25px]">
              {teacher.fraseDestacada}
            </p>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary">
              {teacher.name}
            </p>
          </Reveal>
        </section>
      ) : null}

      {teacher.reconocimientos.length > 0 ? (
        <section className="mx-auto mt-[80px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
          <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
            Reconocimientos
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {teacher.reconocimientos.map((item, index) => (
              <Reveal
                key={`${item.titulo}-${item.anio ?? index}`}
                delay={index * 0.06}
                className="rounded-[22px] border border-border bg-card p-8 md:p-[30px]"
              >
                <p className="text-[16px] font-semibold">
                  {item.titulo}
                  {item.anio ? ` · ${item.anio}` : ""}
                </p>
                {item.entidadOtorgante ? (
                  <p className="mt-1 text-[13px] font-medium text-primary">{item.entidadOtorgante}</p>
                ) : null}
                {item.descripcion ? (
                  <p className="mt-3 text-[13.5px] leading-[1.6] text-muted-foreground">
                    {item.descripcion}
                  </p>
                ) : null}
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {teacher.portafolio.length > 0 ? (
        <section className="mx-auto mt-[80px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
          <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
            Portafolio
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {teacher.portafolio.map((item, index) => (
              <Reveal
                key={`${item.titulo ?? item.tipo}-${index}`}
                delay={index * 0.06}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-border bg-card p-6 md:p-7"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary md:text-[11px]">
                    {PORTAFOLIO_TIPO_LABEL[item.tipo]}
                  </span>
                  <span className="mt-1 truncate text-[15px] font-semibold">
                    {item.titulo ?? "Sin título"}
                  </span>
                </div>
                {item.urlExterna ? (
                  <a
                    href={item.urlExterna}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Ver
                    <Icon icon="ph:arrow-up-right" className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {teacher.studentTestimonials.length > 0 ? (
        <section className="mx-auto mt-[80px] w-full max-w-[1600px] px-[22px] md:mt-[110px] md:px-14">
          <Reveal as="p" className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px]">
            Sus alumnos dicen
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {teacher.studentTestimonials.map((testimonial, index) => (
              <Reveal
                key={`${testimonial.author}-${index}`}
                delay={index * 0.08}
                className="rounded-[22px] border border-border bg-card p-8 md:p-[30px]"
              >
                <p className="text-[16px] font-light italic leading-[1.55] md:text-[17px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
                  {testimonial.author} · {testimonial.role}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
