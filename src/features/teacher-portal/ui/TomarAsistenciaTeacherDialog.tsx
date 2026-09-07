"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  ScrollArea,
  Skeleton,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useGuardarTeacherAsistencias } from "../hooks/useGuardarTeacherAsistencias";
import { useTeacherSesionAsistencia } from "../hooks/useTeacherSesionAsistencia";
import type { TEstadoAsistencia } from "../model/teacher-dashboard.types";
import type { ITomarAsistenciaTeacherDialogProps } from "./TomarAsistenciaTeacherDialog.types";

interface IAsistenciaOverride {
  estado?: TEstadoAsistencia;
  observacion?: string;
}

const ESTADOS_ASISTENCIA: {
  value: TEstadoAsistencia;
  label: string;
  icon: string;
  activeClass: string;
}[] = [
  {
    value: "presente",
    label: "Presente",
    icon: "ph:check-circle-bold",
    activeClass: "bg-emerald-600 text-white shadow-xs",
  },
  {
    value: "atraso",
    label: "Atraso",
    icon: "ph:clock-countdown-bold",
    activeClass: "bg-amber-600 text-white shadow-xs",
  },
  {
    value: "justificado",
    label: "Justificado",
    icon: "ph:file-text-bold",
    activeClass: "bg-sky-600 text-white shadow-xs",
  },
  {
    value: "ausente",
    label: "Ausente",
    icon: "ph:x-circle-bold",
    activeClass: "bg-rose-600 text-white shadow-xs",
  },
];

export default function TomarAsistenciaTeacherDialog({
  sesionId,
  open,
  onOpenChange,
}: ITomarAsistenciaTeacherDialogProps) {
  const { data, isPending } = useTeacherSesionAsistencia(sesionId, open);
  const guardarMutation = useGuardarTeacherAsistencias();
  const [overrides, setOverrides] = useState<Record<string, IAsistenciaOverride>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setOverrides({});
    }
    onOpenChange(nextOpen);
  };

  const handleEstadoChange = (inscripcionId: string, estado: TEstadoAsistencia) => {
    setOverrides((prev) => ({
      ...prev,
      [inscripcionId]: {
        ...prev[inscripcionId],
        estado,
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

  const handleMarcarTodos = (estado: TEstadoAsistencia) => {
    const next: Record<string, IAsistenciaOverride> = {};
    (data?.estudiantes ?? []).forEach((e) => {
      next[e.inscripcionId] = {
        estado,
        observacion: overrides[e.inscripcionId]?.observacion ?? (e.observacion ?? ""),
      };
    });
    setOverrides(next);
  };

  const rows = (data?.estudiantes ?? []).map((e) => {
    const override = overrides[e.inscripcionId];
    return {
      inscripcionId: e.inscripcionId,
      estudianteNombre: e.estudianteNombre,
      estado: override?.estado ?? e.estado,
      observacion: override?.observacion !== undefined ? override.observacion : (e.observacion ?? ""),
    };
  });

  const presentesCount = rows.filter((r) => r.estado === "presente").length;
  const ausentesCount = rows.filter((r) => r.estado === "ausente").length;
  const atrasosCount = rows.filter((r) => r.estado === "atraso").length;
  const justificadosCount = rows.filter((r) => r.estado === "justificado").length;

  const handleGuardar = async () => {
    try {
      await guardarMutation.mutateAsync({
        sesionId,
        asistencias: rows.map((r) => ({
          inscripcionId: r.inscripcionId,
          estado: r.estado,
          observacion: r.observacion.trim() || null,
        })),
      });
      toast.success("Asistencia registrada correctamente");
      handleOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar asistencia";
      toast.error(msg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full sm:max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col p-6">
        <AlertDialogHeader className="pb-3 border-b border-border/60">
          <AlertDialogTitle className="flex items-center gap-2.5 text-lg font-bold">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon icon="ph:check-square-bold" className="size-5" />
            </div>
            <span>Tomar Asistencia de Clase</span>
          </AlertDialogTitle>
          {data ? (
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
              <span className="font-semibold text-foreground">{data.catedraCodigo}</span> · {data.cursoNombre} — {formatDate(data.fecha)} ({data.horaInicio} – {data.horaFin})
            </AlertDialogDescription>
          ) : (
            <AlertDialogDescription>Cargando información de la sesión...</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {isPending ? (
          <div className="space-y-3 py-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : !data || rows.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Icon icon="ph:users-three" className="size-10 text-muted-foreground/50 mx-auto" />
            <p className="text-sm font-medium text-foreground">
              Esta cátedra no tiene estudiantes matriculados activos.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Cuando el administrador asigne estudiantes a esta cátedra, aparecerán aquí para registrar su asistencia.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col space-y-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border/40">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium text-foreground">Estudiantes: <strong>{rows.length}</strong></span>
                <span className="text-muted-foreground">·</span>
                <span className="text-emerald-500 font-semibold">{presentesCount} presentes</span>
                {ausentesCount > 0 && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-rose-500 font-semibold">{ausentesCount} ausentes</span>
                  </>
                )}
                {atrasosCount > 0 && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-amber-500 font-semibold">{atrasosCount} atrasos</span>
                  </>
                )}
                {justificadosCount > 0 && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sky-500 font-semibold">{justificadosCount} justificados</span>
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
                  <Icon icon="ph:checks-bold" className="size-3.5 text-emerald-500" />
                  Todos presentes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarcarTodos("ausente")}
                  className="h-8 text-xs gap-1.5"
                >
                  <Icon icon="ph:x-bold" className="size-3.5 text-rose-500" />
                  Todos ausentes
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 pr-3 max-h-[55vh]">
              <div className="space-y-3">
                {rows.map((row) => {
                  const initials = row.estudianteNombre
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
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
                            <p className="font-semibold text-sm text-foreground truncate">
                              {row.estudianteNombre}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Alumno matriculado
                            </p>
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
                                <Icon icon={estado.icon} className="size-3.5" />
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
                        />
                        <Input
                          type="text"
                          placeholder="Observación opcional (ej: permiso médico, llegó 15m tarde)..."
                          value={row.observacion}
                          onChange={(e) => handleObservacionChange(row.inscripcionId, e.target.value)}
                          className="h-8.5 w-full pl-8.5 text-xs bg-background/50 border-border/50 focus-visible:bg-background"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        <AlertDialogFooter className="pt-3 border-t border-border/60 flex items-center justify-between sm:justify-end gap-2">
          <AlertDialogCancel className="h-9 text-xs">Cancelar</AlertDialogCancel>
          <Button
            onClick={handleGuardar}
            disabled={guardarMutation.isPending || rows.length === 0}
            className="h-9 text-xs gap-1.5"
          >
            <Icon icon="ph:check-bold" className="size-3.5" />
            Guardar Asistencia
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
