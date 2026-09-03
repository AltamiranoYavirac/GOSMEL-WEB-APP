"use client";

import { Icon } from "@iconify/react";

import {
  Badge,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useEstudianteAsistencias } from "../hooks/useEstudianteAsistencias";
import { ASISTENCIA_ESTADO_BADGE } from "../model/teacher-dashboard.types";
import type { IEstudianteAsistenciaSheetProps } from "./EstudianteAsistenciaSheet.types";

export default function EstudianteAsistenciaSheet({
  inscripcionId,
  estudianteNombre,
  cursoNombre,
  open,
  onOpenChange,
}: IEstudianteAsistenciaSheetProps) {
  const { data = [], isPending } = useEstudianteAsistencias(inscripcionId, open);

  const total = data.length;
  const presentes = data.filter((a) => a.estado === "presente" || a.estado === "atraso").length;
  const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Icon icon="ph:calendar-check" className="size-5 text-primary" />
            Historial de Asistencia
          </SheetTitle>
          <SheetDescription>
            {estudianteNombre} · {cursoNombre}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-3.5">
            <div>
              <p className="text-xs text-muted-foreground">Porcentaje de asistencia</p>
              <p className="text-lg font-bold text-foreground">
                {porcentaje != null ? `${porcentaje}%` : "Sin registros"}
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{presentes} presentes / asistidos</p>
              <p>{total} sesiones registradas</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No hay registros de asistencia para este estudiante.
            </p>
          ) : (
            <div className="space-y-2.5">
              {data.map((item) => (
                <div
                  key={item.sesionId}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {formatDate(item.fecha)}
                      </span>
                      {item.horaInicio ? (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {item.horaInicio}–{item.horaFin}
                        </span>
                      ) : null}
                    </div>
                    {item.tema ? (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        Tema: {item.tema}
                      </p>
                    ) : null}
                    {item.observacion ? (
                      <p className="mt-0.5 text-[11px] italic text-primary">
                        Obs: {item.observacion}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant={ASISTENCIA_ESTADO_BADGE[item.estado].variant}>
                    {ASISTENCIA_ESTADO_BADGE[item.estado].label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
