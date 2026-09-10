"use client";

import { Button, Reveal } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import { usePublicDocentes } from "../hooks";
import TeacherCard from "./TeacherCard";
import type { ITeachersGridProps } from "./TeachersGrid.types";

export default function TeachersGrid({
  teachers: teachersProp,
  className,
}: ITeachersGridProps) {
  const {
    data: supabaseTeachers,
    isPending,
    isError,
    refetch,
  } = usePublicDocentes();

  const teachers = teachersProp ?? supabaseTeachers ?? [];
  const hasTeachers = teachers.length > 0;
  const isOddTotal = teachers.length % 2 !== 0;

  return (
    <section
      aria-labelledby="teachers-title"
      className={cn("bg-background", className)}
    >
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pb-[80px] pt-[70px] md:px-14 md:pb-[110px] md:pt-[110px]">
        <Reveal
          as="p"
          className="mb-[18px] font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary md:text-[11px] md:tracking-[0.24em]"
        >
          El equipo
        </Reveal>
        <Reveal as="div" delay={0.08}>
          <h1
            id="teachers-title"
            className="max-w-[680px] text-[38px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[54px]"
          >
            Los maestros detrás de cada instrumento.
          </h1>
        </Reveal>
        <Reveal
          as="p"
          delay={0.16}
          className="mt-5 max-w-[540px] text-base leading-[1.6] text-muted-foreground"
        >
          Un profesor dedicado por disciplina, formado en conservatorio y con
          años acompañando estudiantes de todos los niveles.
        </Reveal>

        {isPending && !teachersProp ? (
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-[320px] animate-pulse flex-col overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#121316] sm:flex-row"
              >
                <div className="h-[200px] w-full bg-zinc-800/50 sm:h-full sm:w-[46%]" />
                <div className="flex flex-1 flex-col justify-between p-7">
                  <div className="space-y-3">
                    <div className="h-3 w-20 rounded bg-zinc-800/60" />
                    <div className="h-6 w-40 rounded bg-zinc-800/80" />
                    <div className="h-3 w-56 rounded bg-zinc-800/50" />
                    <div className="h-4 w-4/5 rounded bg-zinc-800/40" />
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="h-6 w-32 rounded-full bg-zinc-800/50" />
                    <div className="h-4 w-20 rounded bg-zinc-800/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isError && !teachersProp ? (
          <div className="mt-14 flex flex-col items-center justify-center rounded-[22px] border border-red-500/20 bg-red-950/10 p-10 text-center">
            <p className="text-base text-zinc-300">
              Ocurrió un error al cargar la lista de profesores.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4 border-white/10 text-white"
            >
              Reintentar
            </Button>
          </div>
        ) : null}

        {!isPending && !isError && !hasTeachers ? (
          <div className="mt-14 flex flex-col items-center justify-center rounded-[22px] border border-white/[0.06] bg-[#121316] p-12 text-center">
            <p className="text-base text-muted-foreground">
              No hay profesores disponibles en este momento.
            </p>
          </div>
        ) : null}

        {hasTeachers ? (
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {teachers.map((teacher, index) => {
              const isLast = index === teachers.length - 1;
              const isCenteredLast = isOddTotal && isLast;

              return (
                <div
                  key={teacher.slug || teacher.id || index}
                  className={
                    isCenteredLast
                      ? "flex justify-center lg:col-span-2"
                      : "w-full"
                  }
                >
                  <div
                    className={
                      isCenteredLast
                        ? "w-full lg:max-w-[calc(50%-0.75rem)]"
                        : "h-full w-full"
                    }
                  >
                    <Reveal delay={index * 0.05} className="h-full">
                      <TeacherCard teacher={teacher} />
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}


