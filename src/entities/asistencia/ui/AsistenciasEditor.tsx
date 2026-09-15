"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { AlertDialogCancel, AlertDialogFooter, Button, Input, ScrollArea, Skeleton } from "@/shared/ui";

import { useAsistenciasSesion } from "../hooks/useAsistenciasSesion";
import { useGuardarAsistenciasSesion } from "../hooks/useGuardarAsistenciasSesion";
import { ESTADOS_ASISTENCIA } from "../model/asistencia.constants";
import type { TEstadoAsistencia } from "../model/asistencia.types";
import type { IAsistenciaOverride, IAsistenciasEditorProps } from "./AsistenciasEditor.types";

export function AsistenciasEditor({ sesionId, enabled = true, onSaved }: IAsistenciasEditorProps) {
  const { data, isPending } = useAsistenciasSesion(sesionId, enabled);
  const guardarMutation = useGuardarAsistenciasSesion(sesionId);
  const [overrides, setOverrides] = useState<Record<string, IAsistenciaOverride>>({});

  const handleEstadoChange = (inscripcionId: string, estado: TEstadoAsistencia) => {
    setOverrides((prev) => ({ ...prev, [inscripcionId]: { ...prev[inscripcionId], estado } }));
  };

  const handleObservacionChange = (inscripcionId: string, observacion: string) => {
    setOverrides((prev) => ({ ...prev, [inscripcionId]: { ...prev[inscripcionId], observacion } }));
  };

  const handleMarcarTodos = (estado: TEstadoAsistencia) => {
    const next: Record<string, IAsistenciaOverride> = {};
    (data?.estudiantes ?? []).forEach((estudiante) => {
      next[estudiante.inscripcionId] = {
        estado,
        observacion: overrides[estudiante.inscripcionId]?.observacion ?? (estudiante.observacion ?? ""),
      };
    });
    setOverrides(next);
  };

  const rows = (data?.estudiantes ?? []).map((estudiante) => {
    const override = overrides[estudiante.inscripcionId];
    return {
      inscripcionId: estudiante.inscripcionId,
      estudianteNombre: estudiante.estudianteNombre,
      estado: override?.estado ?? estudiante.estado,
      observacion: override?.observacion !== undefined ? override.observacion : (estudiante.observacion ?? ""),
    };
  });

  const presentesCount = rows.filter((row) => row.estado === "presente").length;
  const ausentesCount = rows.filter((row) => row.estado === "ausente").length;
  const atrasosCount = rows.filter((row) => row.estado === "atraso").length;
  const justificadosCount = rows.filter((row) => row.estado === "justificado").length;

  const handleGuardar = async () => {
    try {
      await guardarMutation.mutateAsync(
        rows.map((row) => ({
          inscripcionId: row.inscripcionId,
          estado: row.estado,
          observacion: row.observacion.trim() || null,
        })),
      );
      toast.success("Asistencia registrada correctamente");
      onSaved?.();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al guardar asistencia");
    }
  };

  if (isPending) {
    return (
      <div className="space-y-3 py-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="py-12 text-center space-y-2">
        <Icon icon="ph:users-three" className="size-10 text-muted-foreground/50 mx-auto" />
        <p className="text-sm font-medium text-foreground">Esta cátedra no tiene estudiantes matriculados activos.</p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Cuando se matriculen estudiantes en esta cátedra, aparecerán aquí para registrar su asistencia.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-3 py-3 flex min-h-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border/40">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-foreground">
              Estudiantes: <strong>{rows.length}</strong>
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-success-fg font-semibold">{presentesCount} presentes</span>
            {ausentesCount > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-destructive font-semibold">{ausentesCount} ausentes</span>
              </>
            )}
            {atrasosCount > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-warning-fg font-semibold">{atrasosCount} atrasos</span>
              </>
            )}
            {justificadosCount > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-info-fg font-semibold">{justificadosCount} justificados</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarcarTodos("presente")}
              className="h-8 text-xs gap-1.5"
            >
              <Icon icon="ph:checks-bold" className="size-3.5 text-success-fg" aria-hidden="true" />
              Todos presentes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleMarcarTodos("ausente")}
              className="h-8 text-xs gap-1.5"
            >
              <Icon icon="ph:x-bold" className="size-3.5 text-destructive" aria-hidden="true" />
              Todos ausentes
            </Button>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 max-h-[55vh] pr-3">
          <div className="space-y-3">
            {rows.map((row) => {
              const initials = row.estudianteNombre
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={row.inscripcionId}
                  className="rounded-2xl border border-border/60 bg-card p-4 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wider">
                        {initials || "E"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{row.estudianteNombre}</p>
                        <p className="text-xs text-muted-foreground">Alumno matriculado</p>
                      </div>
                    </div>

                    <div className="inline-flex rounded-xl bg-muted/60 p-1 border border-border/50 self-start sm:self-auto shrink-0">
                      {ESTADOS_ASISTENCIA.map((estado) => {
                        const isSelected = row.estado === estado.value;
                        return (
                          <button
                            key={estado.value}
                            type="button"
                            onClick={() => handleEstadoChange(row.inscripcionId, estado.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                              isSelected
                                ? estado.activeClass
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon icon={estado.icon} className="size-3.5" aria-hidden="true" />
                            <span>{estado.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative">
                    <Icon
                      icon="ph:note-pencil"
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                    <Input
                      type="text"
                      placeholder="Observación opcional (ej: permiso médico, llegó 15m tarde)..."
                      value={row.observacion}
                      onChange={(event) => handleObservacionChange(row.inscripcionId, event.target.value)}
                      className="h-8.5 w-full pl-8.5 text-xs bg-background/50 border-border/50 focus-visible:bg-background"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <AlertDialogFooter className="pt-3 border-t border-border/60 flex items-center justify-between sm:justify-end gap-2">
        <AlertDialogCancel className="h-9 text-xs">Cancelar</AlertDialogCancel>
        <Button onClick={handleGuardar} disabled={guardarMutation.isPending} className="h-9 text-xs gap-1.5">
          <Icon icon="ph:check-bold" className="size-3.5" aria-hidden="true" />
          Guardar Asistencia
        </Button>
      </AlertDialogFooter>
    </div>
  );
}
