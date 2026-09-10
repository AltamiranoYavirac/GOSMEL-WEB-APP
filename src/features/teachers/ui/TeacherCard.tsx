import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";

import type { ITeacherCardProps } from "./TeacherCard.types";

export default function TeacherCard({ teacher, className }: ITeacherCardProps) {
  const instrument = teacher.instrument?.trim();
  const formacion =
    teacher.formacionTexto ||
    (teacher.education && teacher.education.length > 0
      ? `${teacher.education[0].title} - ${teacher.education[0].detail}`
      : teacher.tituloProfesional || null);

  const quote = teacher.fraseDestacada || teacher.philosophy || null;

  const aniosExpText =
    teacher.aniosExperiencia != null
      ? `${teacher.aniosExperiencia} años de experiencia`
      : teacher.tags?.find((t) => t.toLowerCase().includes("experiencia")) || null;

  return (
    <Link
      href={`/teachers/${teacher.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#121316] outline-none transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] sm:flex-row",
        className
      )}
    >
      <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-zinc-900 sm:h-auto sm:w-[46%]">
        {teacher.photo ? (
          <Image
            src={teacher.photo}
            alt={teacher.photoAlt || teacher.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800/80 via-zinc-900 to-[#121316] p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-primary/70 transition-colors group-hover:border-primary/40 group-hover:text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <path d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
                <path
                  fillRule="evenodd"
                  d="M12 1.5a10.5 10.5 0 00-7.425 17.925C5.83 17.2 8.68 16.5 12 16.5s6.17.7 7.425 2.925A10.5 10.5 0 0012 1.5zM3.46 16.96A9.002 9.002 0 0112 3a9 9 0 018.54 13.96C18.9 14.88 15.7 15 12 15s-6.9-.12-8.54 1.96z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="mt-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              GOSMEL
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 md:p-8">

        <div>
          {instrument ? (
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary sm:text-[11px]">
              {instrument}
            </p>
          ) : null}

          <h2 className="mt-1 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-primary sm:text-[22px] md:text-[24px]">
            {teacher.name}
          </h2>

          {formacion ? (
            <p className="mt-1.5 text-[12px] leading-snug text-zinc-400 sm:text-[13px]">
              {formacion}
            </p>
          ) : null}

          {quote ? (
            <p className="mt-4 text-[13px] italic leading-relaxed text-zinc-300 sm:text-[14px]">
              “{quote}”
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 pt-2">
          {aniosExpText ? (
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-300 sm:text-[12px]">
              {aniosExpText}
            </span>
          ) : (
            <div />
          )}

          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-colors group-hover:text-primary/80">
            <span>Ver perfil</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

