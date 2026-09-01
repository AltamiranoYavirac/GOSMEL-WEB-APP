"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

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
  SheetTrigger,
  Skeleton,
  Spinner,
} from "@/shared/ui";

import { useCalificacionesEvaluacion } from "../hooks/useCalificacionesEvaluacion";
import { useGuardarCalificaciones } from "../hooks/useGuardarCalificaciones";
import { TIPO_EVALUACION_BADGE } from "../model/evaluacion.types";
import type { ICalificarEvaluacionSheetProps } from "./CalificarEvaluacionSheet.types";

interface ICalificacionesEditorProps {
  data: NonNullable<ReturnType<typeof useCalificacionesEvaluacion>["data"]>;
  notaMaxima: number;
  mutation: ReturnType<typeof useGuardarCalificaciones>;
  onSaved: () => void;
}

function CalificacionesEditor({ data, notaMaxima, mutation, onSaved }: ICalificacionesEditorProps) {
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

export default function CalificarEvaluacionSheet({ evaluacion }: ICalificarEvaluacionSheetProps) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useCalificacionesEvaluacion(evaluacion.id, open);
  const mutation = useGuardarCalificaciones(evaluacion.id);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:pencil-line" aria-hidden="true" />
          Calificar
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between pr-6">
            <div>
              <SheetTitle>Planilla de calificaciones</SheetTitle>
              <SheetDescription>{evaluacion.titulo} · {evaluacion.catedra}</SheetDescription>
            </div>
            <Badge variant={TIPO_EVALUACION_BADGE[evaluacion.tipo].variant}>
              {TIPO_EVALUACION_BADGE[evaluacion.tipo].label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4 rounded-lg bg-muted/40 p-3 text-xs">
            <div>
              <span className="text-muted-foreground">Nota máxima: </span>
              <span className="font-semibold text-foreground">{evaluacion.notaMaxima}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ponderación: </span>
              <span className="font-semibold text-foreground">{evaluacion.ponderacion}%</span>
            </div>
          </div>

          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : data ? (
            <CalificacionesEditor
              key={evaluacion.id}
              data={data}
              notaMaxima={evaluacion.notaMaxima}
              mutation={mutation}
              onSaved={() => setOpen(false)}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}