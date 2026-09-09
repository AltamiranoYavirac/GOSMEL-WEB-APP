"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
} from "@/shared/ui";

import { useCalificacionesEvaluacion } from "../hooks/useCalificacionesEvaluacion";
import { useGuardarCalificaciones } from "../hooks/useGuardarCalificaciones";
import { TIPO_EVALUACION_BADGE } from "../model/evaluacion.types";
import type { ICalificarEvaluacionSheetProps } from "./CalificarEvaluacionSheet.types";
import CalificacionesEditor from "./CalificacionesEditor";

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