import Image from "next/image";
import Link from "next/link";

import type { ITeacherCardProps } from "./TeacherCard.types";

export default function TeacherCard({ teacher }: ITeacherCardProps) {
  return (
    <Link
      href={`/teachers/${teacher.slug}`}
      className="group flex flex-col gap-3.5 outline-none"
    >
      <div className="relative h-[260px] overflow-hidden rounded-[20px]">
        <Image
          src={teacher.photo}
          alt={teacher.photoAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {teacher.photoIsReference ? (
          <span className="absolute right-3 top-3 rounded-[5px] border border-dashed border-primary/50 px-1.5 py-1 font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-stage-accent">
            Foto ref.
          </span>
        ) : null}
      </div>
      <div>
        <p className="text-[18px] font-bold tracking-[-0.02em] transition-colors group-hover:text-primary">
          {teacher.name}
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{teacher.instrument}</p>
      </div>
    </Link>
  );
}
