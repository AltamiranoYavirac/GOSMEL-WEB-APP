"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Spinner,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useAsistenciasSesion } from "../hooks/useAsistenciasSesion";
import { useGuardarAsistenciasSesion } from "../hooks/useGuardarAsistenciasSesion";
import type { TEstadoAsistencia } from "../model/asistencia.types";
import type { ITomarAsistenciaDialogProps } from "./TomarAsistenciaDialog.types";

const ESTADO_ASISTENCIA_OPCIONES: { value: TEstadoAsistencia; label: string; badge: "default" | "secondary" | "outline" | "destructive" }[] = [
  { value: "presente", label: "Presente", badge: "default" },
  { value: "atraso", label: "Atraso", badge: "secondary" },
  { value: "justificado", label: "Justificado", badge: "outline" },
  { value: "ausente", label: "Ausente", badge: "destructive" },
];

export default function TomarAsistenciaDialog({ sesion }: ITomarAsistenciaDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useAsistenciasSesion(sesion.id, open);
  const mutation = useGuardarAsistenciasSesion(sesion.id);

  const [asistencias, setAsistencias] = useState<
    Array<{ inscripcionId: string; estado: TEstadoAsistencia; observacion: string }>
  >([]);

  useEffect(() => {
    if (data?.estudiantes) {
      setAsistencias(
        data.estudiantes.map((e) => ({
          inscripcionId: e.inscripcionId,
          estado: e.estado,
          observacion: e.observacion ?? "",
        }))
      );
    }
  }, [data]);

  const onChangeEstado = (inscripcionId: string, estado: TEstadoAsistencia) => {
    setAsistencias((prev) =>
      prev.map((item) => (item.inscripcionId === inscripcionId ? { ...item, estado } : item))
    );
  };

  const onChangeObservacion = (inscripcionId: string, observacion: string) => {
    setAsistencias((prev) =>
      prev.map((item) => (item.inscripcionId === inscripcionId ? { ...item, observacion } : item))
    );
  };

  const onGuardar = () => {
    mutation.mutate(asistencias, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="outline">
          <Icon icon="ph:check-square" aria-hidden="true" />
          Asistencia
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Registro de asistencia</AlertDialogTitle>
          <AlertDialogDescription>
            {sesion.catedra} · {sesion.curso} · {formatDate(sesion.fecha)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2">
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !data?.estudiantes.length ? (
            <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
              <p className="text-sm text-muted-foreground">No hay estudiantes matriculados en esta cátedra.</p>
            </div>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {data.estudiantes.map((est) => {
                const item = asistencias.find((a) => a.inscripcionId === est.inscripcionId);
                const estado = item?.estado ?? est.estado;
                const observacion = item?.observacion ?? "";

                return (
                  <li
                    key={est.inscripcionId}
                    className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{est.estudiante}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={estado}
                        onValueChange={(val) => onChangeEstado(est.inscripcionId, val as TEstadoAsistencia)}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ESTADO_ASISTENCIA_OPCIONES.map((op) => (
                            <SelectItem key={op.value} value={op.value} className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <Badge variant={op.badge} className="px-1.5 py-0 text-[10px]">
                                  {op.label}
                                </Badge>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        value={observacion}
                        onChange={(e) => onChangeObservacion(est.inscripcionId, e.target.value)}
                        placeholder="Nota u obs."
                        className="h-8 w-36 text-xs"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button
            onClick={onGuardar}
            disabled={mutation.isPending || isPending || !data?.estudiantes.length}
          >
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar asistencia
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
