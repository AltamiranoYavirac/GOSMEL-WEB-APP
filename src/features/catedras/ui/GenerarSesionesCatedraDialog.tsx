"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
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
  Label,
  Spinner,
} from "@/shared/ui";
import { useGenerarSesionesCatedra } from "../hooks/useGenerarSesionesCatedra";
import type { IGenerarSesionesCatedraDialogProps } from "./GenerarSesionesCatedraDialog.types";

export default function GenerarSesionesCatedraDialog({
  catedra,
  open,
  onOpenChange,
  onSuccess,
}: IGenerarSesionesCatedraDialogProps) {
  const today = new Date().toISOString().slice(0, 10);
  const future = new Date();
  future.setMonth(future.getMonth() + 4);
  const nextSemester = future.toISOString().slice(0, 10);

  const [fechaDesde, setFechaDesde] = useState(today);
  const [fechaHasta, setFechaHasta] = useState(nextSemester);

  const genMutation = useGenerarSesionesCatedra();

  if (!catedra) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaDesde || !fechaHasta) return;

    genMutation.mutate(
      {
        catedraId: catedra.id,
        fechaDesde,
        fechaHasta,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:calendar-check" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">Generar Sesiones del Ciclo</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Cátedra <strong>{catedra.codigo}</strong> ({catedra.curso}). Se generarán automáticamente las clases según los días y horas de su horario configurado.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="space-y-4 py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gen-desde" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Fecha de Inicio del Ciclo
                </Label>
                <Input
                  id="gen-desde"
                  type="date"
                  required
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gen-hasta" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Fecha de Fin del Ciclo
                </Label>
                <Input
                  id="gen-hasta"
                  type="date"
                  required
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-3">
              <Icon icon="ph:info" width={20} height={20} className="text-primary shrink-0" />
              <span>Las clases que ya existan en esas fechas no se duplicarán. Solo se añadirán las fechas faltantes del calendario.</span>
            </div>
          </div>

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={genMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={genMutation.isPending} className="h-10 px-6 font-semibold">
              {genMutation.isPending && <Spinner className="size-4 mr-2" />}
              Generar Calendario
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
