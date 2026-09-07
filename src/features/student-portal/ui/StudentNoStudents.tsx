import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import type { IStudentNoStudentsProps } from "./StudentNoStudents.types";

export default function StudentNoStudents({ title = "No estás inscrito a ningún curso", description }: IStudentNoStudentsProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-xl border border-accent-muted/40 bg-card p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
        <Icon icon="ph:student" className="size-7" aria-hidden="true" />
      </span>
      <div className="max-w-md space-y-1">
        <p className="font-heading text-xl font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">
          {description ??
            "Contáctanos para conocer nuestros cursos e inscribirte. Cuando la academia te asigne como estudiante, verás aquí tu información académica."}
        </p>
      </div>
      <Button asChild>
        <Link href="/contact">
          <Icon icon="ph:phone-call" aria-hidden="true" />
          Contáctanos
        </Link>
      </Button>
    </div>
  );
}