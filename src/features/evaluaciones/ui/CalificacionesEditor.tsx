"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { Button, Input, ScrollArea, Spinner } from "@/shared/ui";

import type { ICalificacionesEditorProps } from "./CalificacionesEditor.types";

export default function CalificacionesEditor({ data, notaMaxima, mutation, onSaved }: ICalificacionesEditorProps) {
  const [calificaciones, setCalificaciones] = useState(() =>
    (data.estudiantes ?? []).map((e) => ({
      inscripcionId: e.inscripcionId,
      nota: e.nota,
      observacion: e.observacion ?? "",
    }))
  );

  const onChangeNota = (inscripcionId: string, value: string) => {
    const num = value === "" ? null : Number(value);
    setCalificaciones((prev) =>
      prev.map((item) => (item.inscripcionId === inscripcionId ? { ...item, nota: num } : item))
    );
  };

  const onChangeObs = (inscripcionId: string, observacion: string) => {
    setCalificaciones((prev) =>
      prev.map((item) => (item.inscripcionId === inscripcionId ? { ...item, observacion } : item))
    );
  };

  const onGuardar = () => {
    mutation.mutate(calificaciones, {
      onSuccess: onSaved,
    });
  };

  return (
    <>
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-3 pr-3">
          {data.estudiantes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
              <p className="text-sm text-muted-foreground">No hay estudiantes matriculados en esta cátedra.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {data.estudiantes.map((est) => {
                const item = calificaciones.find((c) => c.inscripcionId === est.inscripcionId);
                const notaValue = item?.nota != null ? String(item.nota) : "";
                const obsValue = item?.observacion ?? "";

                return (
                  <li
                    key={est.inscripcionId}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{est.estudiante}</p>
                      {est.calificadaEn ? (
                        <span className="text-[10px] text-muted-foreground">
                          Calificado el {new Date(est.calificadaEn).toLocaleDateString("es")}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max={notaMaxima}
                        value={notaValue}
                        onChange={(e) => onChangeNota(est.inscripcionId, e.target.value)}
                        placeholder="0.0"
                        className="h-8 w-20 text-center font-mono text-xs font-semibold"
                      />
                      <Input
                        value={obsValue}
                        onChange={(e) => onChangeObs(est.inscripcionId, e.target.value)}
                        placeholder="Comentario..."
                        className="h-8 w-32 text-xs"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onGuardar} disabled={mutation.isPending || data.estudiantes.length === 0}>
          {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
          Guardar calificaciones
        </Button>
      </div>
    </>
  );
}
