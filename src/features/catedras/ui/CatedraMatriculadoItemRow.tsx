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
  AlertDialogTrigger,
  Badge,
  Button,
} from "@/shared/ui";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";

import { useEliminarInscripcionCatedra } from "../hooks/useEliminarInscripcionCatedra";
import type { ICatedraEstudianteItem } from "../model/catedra-estudiantes.types";

interface ICatedraMatriculadoItemRowProps {
  catedraId: string;
  catedraCodigo: string;
  estudiante: ICatedraEstudianteItem;
}

export default function CatedraMatriculadoItemRow({
  catedraId,
  catedraCodigo,
  estudiante,
}: ICatedraMatriculadoItemRowProps) {
  const [open, setOpen] = useState(false);
  const eliminarMutation = useEliminarInscripcionCatedra(catedraId);

  const handleEliminar = () => {
    eliminarMutation.mutate(estudiante.inscripcionId, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-background/80 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="size-9 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0 text-xs">
          <Icon icon="ph:student" className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-foreground truncate">
            {estudiante.estudianteNombre}
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {estudiante.cedula ? <span>CI: {estudiante.cedula}</span> : null}
            {estudiante.email ? <span className="truncate">{estudiante.email}</span> : null}
            <span>Inscrito: {formatDate(estudiante.fechaInscripcion)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <div className="text-right">
          <Badge variant="outline" className="text-xs font-mono">
            {estudiante.montoMensual != null
              ? `${formatCurrency(estudiante.montoMensual)} / mes`
              : "Sin mensualidad"}
          </Badge>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
              aria-label={`Eliminar a ${estudiante.estudianteNombre} de la cátedra`}
            >
              <Icon icon="ph:trash" className="size-3.5" aria-hidden="true" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-full max-w-md p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive flex items-center gap-2">
                <Icon icon="ph:warning-circle" className="size-5 shrink-0" aria-hidden="true" />
                ¿Eliminar estudiante de la cátedra?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Se dará de baja la matrícula de <strong>{estudiante.estudianteNombre}</strong> en la cátedra <strong>{catedraCodigo}</strong>. El cupo se liberará y el curso ya no aparecerá en el portal del estudiante.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={eliminarMutation.isPending}>Cancelar</AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                onClick={handleEliminar}
                disabled={eliminarMutation.isPending}
              >
                {eliminarMutation.isPending ? "Eliminando..." : "Eliminar de la cátedra"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
