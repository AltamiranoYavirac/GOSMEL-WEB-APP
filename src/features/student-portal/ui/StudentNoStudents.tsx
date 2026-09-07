"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import SolicitarMatriculaDialog from "./SolicitarMatriculaDialog";
import type { IStudentNoStudentsProps } from "./StudentNoStudents.types";

export default function StudentNoStudents({ title = "No estás inscrito a ningún curso", description }: IStudentNoStudentsProps) {
  const [solicitudOpen, setSolicitudOpen] = useState(false);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-xl border border-accent-muted/40 bg-card p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
        <Icon icon="ph:student" className="size-7" aria-hidden="true" />
      </span>
      <div className="max-w-md space-y-1">
        <p className="font-heading text-xl font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">
          {description ??
            "Solicita tu matrícula en una de nuestras cátedras disponibles o contáctanos para más información."}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => setSolicitudOpen(true)}>
          <Icon icon="ph:plus" aria-hidden="true" />
          Solicitar matrícula
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">
            <Icon icon="ph:phone-call" aria-hidden="true" />
            Contáctanos
          </Link>
        </Button>
      </div>

      <SolicitarMatriculaDialog open={solicitudOpen} onOpenChange={setSolicitudOpen} />
    </div>
  );
}