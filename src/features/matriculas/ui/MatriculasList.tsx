"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { useInscripcionesPendientes, type IInscripcionPendiente } from "@/entities/matricula";
import { AdminPageHeader, Badge, Button, DataLabel, Skeleton } from "@/shared/ui";
import { formatDate, initialsOf } from "@/shared/lib/formatters";

import AprobarMatriculaDialog from "./AprobarMatriculaDialog";
import RechazarMatriculaDialog from "./RechazarMatriculaDialog";

export default function MatriculasList() {
  const { data, isPending } = useInscripcionesPendientes();
  const rows = data ?? [];

  const [aprobar, setAprobar] = useState<IInscripcionPendiente | null>(null);
  const [rechazar, setRechazar] = useState<IInscripcionPendiente | null>(null);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admisiones · GOSMEL"
        title="Matrículas por aprobar"
        description="Inscripciones que esperan tu decisión antes de activarse."
        icon="ph:user-plus"
      />

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-warning-tint px-4 py-2 text-xs font-bold text-warning-fg">
          Pendientes · {rows.length}
        </span>
      </div>

      {isPending ? (
        <div className="space-y-3.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
          <Icon icon="ph:tray" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin matrículas pendientes</p>
          <p className="text-sm text-muted-foreground">Cuando se generen inscripciones aparecerán aquí.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-5 rounded-2xl border border-warning-border bg-card p-6 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex size-11 items-center justify-center rounded-full bg-warning-tint text-sm font-bold text-warning-fg">
                    {initialsOf(row.estudiante)}
                  </span>
                  <div>
                    <div className="text-[16.5px] font-bold text-foreground">{row.estudiante}</div>
                    <div className="text-[12.5px] text-muted-foreground">
                      {row.cursoNombre ?? "Curso"}
                      {row.catedraCodigo ? ` · ${row.catedraCodigo}` : ""}
                    </div>
                  </div>
                  <Badge variant="warning">Pendiente</Badge>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <DataLabel>Fecha de inscripción</DataLabel>
                    <div className="mt-1 text-[13px] font-semibold text-foreground">
                      {formatDate(row.fechaInscripcion)}
                    </div>
                  </div>
                  <div>
                    <DataLabel>Fecha de inicio</DataLabel>
                    <div className="mt-1 text-[13px] font-semibold text-foreground">
                      {formatDate(row.fechaInicio)}
                    </div>
                  </div>
                  <div>
                    <DataLabel>Origen</DataLabel>
                    <div className="mt-1 text-[13px] font-semibold text-foreground">
                      {row.desdeSolicitud ? "Desde solicitud (admisión)" : "Matrícula directa"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  className="border-danger-border text-danger-fg hover:bg-danger-tint"
                  onClick={() => setRechazar(row)}
                >
                  Rechazar
                </Button>
                <Button className="bg-success text-warm-950 hover:bg-success/90" onClick={() => setAprobar(row)}>
                  Aprobar matrícula
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AprobarMatriculaDialog inscripcion={aprobar} onClose={() => setAprobar(null)} />
      <RechazarMatriculaDialog inscripcion={rechazar} onClose={() => setRechazar(null)} />
    </div>
  );
}
