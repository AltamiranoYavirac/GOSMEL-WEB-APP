"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Checkbox,
  Label,
  Spinner,
  Textarea,
} from "@/shared/ui";
import { useDarDeBajaEstudiante } from "../hooks/useDarDeBajaEstudiante";
import type { IBajaEstudianteDialogProps } from "./BajaEstudianteDialog.types";

export default function BajaEstudianteDialog({
  inscripcionId,
  estudianteNombre,
  open,
  onOpenChange,
  onSuccess,
}: IBajaEstudianteDialogProps) {
  const [motivo, setMotivo] = useState("");
  const [condonar, setCondonar] = useState(false);
  const bajaMutation = useDarDeBajaEstudiante();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bajaMutation.mutate(
      {
        inscripcionId,
        motivo,
        condonarCuotasPendientes: condonar,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setMotivo("");
          setCondonar(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 dark:text-rose-400">
              Tramitar Baja Administrativa
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de tramitar el retiro de <strong>{estudianteNombre}</strong>? Esta acción
              finalizará su matrícula y su acuerdo de pago activo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="motivo-baja">Motivo del Retiro</Label>
              <Textarea
                id="motivo-baja"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej. Cambio de ciudad, incompatibilidad de horarios..."
                rows={3}
              />
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-border/40">
              <Checkbox
                id="condonar-cuotas"
                checked={condonar}
                onCheckedChange={(c) => setCondonar(Boolean(c))}
              />
              <div className="grid gap-1 leading-none">
                <Label htmlFor="condonar-cuotas" className="cursor-pointer font-semibold text-xs">
                  Condonar cuotas impagas pendientes
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Si se marca, las cuotas pendientes del acuerdo pasarán a estado condonado para no generar cartera vencida.
                </p>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={bajaMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button variant="destructive" type="submit" disabled={bajaMutation.isPending}>
              {bajaMutation.isPending && <Spinner className="size-4 mr-2" />}
              Confirmar Retiro
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
