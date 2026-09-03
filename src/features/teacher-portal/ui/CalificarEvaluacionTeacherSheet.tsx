"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Input,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useGuardarTeacherCalificaciones } from "../hooks/useGuardarTeacherCalificaciones";
import { useTeacherCalificaciones } from "../hooks/useTeacherCalificaciones";
import { EVALUACION_TIPO_BADGE } from "../model/teacher-dashboard.types";
import type { ICalificarEvaluacionTeacherSheetProps } from "./CalificarEvaluacionTeacherSheet.types";

interface ICalificacionOverride {
  nota?: string;
  observacion?: string;
}

export default function CalificarEvaluacionTeacherSheet({
  evaluacionId,
  open,
  onOpenChange,
}: ICalificarEvaluacionTeacherSheetProps) {
  const { data, isPending } = useTeacherCalificaciones(evaluacionId, open);
  const guardarMutation = useGuardarTeacherCalificaciones();
  const [overrides, setOverrides] = useState<Record<string, ICalificacionOverride>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setOverrides({});
    }
    onOpenChange(nextOpen);
  };

  const handleNotaChange = (inscripcionId: string, nota: string) => {
    setOverrides((prev) => ({
      ...prev,
      [inscripcionId]: {
        ...prev[inscripcionId],
        nota,
      },
    }));
  };

  const handleObservacionChange = (inscripcionId: string, observacion: string) => {
    setOverrides((prev) => ({
      ...prev,
      [inscripcionId]: {
        ...prev[inscripcionId],
        observacion,
      },
    }));
  };

  const rows = (data?.estudiantes ?? []).map((e) => {
    const override = overrides[e.inscripcionId];
    return {
      inscripcionId: e.inscripcionId,
      estudianteNombre: e.estudianteNombre,
      nota: override?.nota !== undefined ? override.nota : (e.nota != null ? String(e.nota) : ""),
      observacion: override?.observacion !== undefined ? override.observacion : (e.observacion ?? ""),
    };
  });

  const handleGuardar = async () => {
    if (!data) return;

    for (const r of rows) {
      if (r.nota.trim() !== "") {
        const num = Number(r.nota);
        if (Number.isNaN(num) || num < 0 || num > data.notaMaxima) {
          toast.error(`La nota de ${r.estudianteNombre} debe estar entre 0 y ${data.notaMaxima}`);
          return;
        }
      }
    }

    try {
      await guardarMutation.mutateAsync({
        evaluacionId,
        calificaciones: rows.map((r) => ({
          inscripcionId: r.inscripcionId,
          nota: r.nota.trim() !== "" ? Number(r.nota) : null,
          observacion: r.observacion.trim() || null,
        })),
      });
      toast.success("Calificaciones guardadas correctamente");
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar calificaciones";
      toast.error(msg);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Icon icon="ph:exam" className="size-5 text-primary" />
            Calificar Evaluación
          </SheetTitle>
          {data ? (
            <SheetDescription>
              {data.titulo} · {data.cursoNombre} ({data.catedraCodigo})
            </SheetDescription>
          ) : (
            <SheetDescription>Cargando información de la evaluación...</SheetDescription>
          )}
        </SheetHeader>

        {data ? (
          <div className="px-4 pt-3 pb-1">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant={EVALUACION_TIPO_BADGE[data.tipo].variant}>
                  {EVALUACION_TIPO_BADGE[data.tipo].label}
                </Badge>
                {data.fecha ? <span>{formatDate(data.fecha)}</span> : null}
              </div>
              <div className="flex items-center gap-3 font-medium">
                <span>Nota máx: <strong>{data.notaMaxima}</strong></span>
                <span>Ponderación: <strong>{data.ponderacion}%</strong></span>
              </div>
            </div>
          </div>
        ) : null}

        <ScrollArea className="flex-1 px-4 py-4">
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : !data || rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Esta cátedra no tiene estudiantes matriculados activos.
            </p>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <div
                  key={row.inscripcionId}
                  className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {row.estudianteNombre}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max={data.notaMaxima}
                        placeholder="Nota"
                        value={row.nota}
                        onChange={(e) => handleNotaChange(row.inscripcionId, e.target.value)}
                        className="h-8 w-20 text-center font-mono text-xs"
                      />
                      <span className="text-[11px] text-muted-foreground">/{data.notaMaxima}</span>
                    </div>

                    <Input
                      type="text"
                      placeholder="Observación..."
                      value={row.observacion}
                      onChange={(e) => handleObservacionChange(row.inscripcionId, e.target.value)}
                      className="h-8 w-44 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border/60 px-4 py-3 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleGuardar}
            disabled={guardarMutation.isPending || rows.length === 0}
          >
            Guardar Calificaciones
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
