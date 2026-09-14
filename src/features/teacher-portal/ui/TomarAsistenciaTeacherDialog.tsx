"use client";

import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";
import { AsistenciasEditor, useAsistenciasSesion } from "@/entities/asistencia";

import { teacherQueryKeys } from "../model/query-keys";
import type { ITomarAsistenciaTeacherDialogProps } from "./TomarAsistenciaTeacherDialog.types";

export default function TomarAsistenciaTeacherDialog({
  sesionId,
  open,
  onOpenChange,
}: ITomarAsistenciaTeacherDialogProps) {
  const queryClient = useQueryClient();
  const { data } = useAsistenciasSesion(sesionId, open);

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: teacherQueryKeys.sesiones() });
    queryClient.invalidateQueries({ queryKey: teacherQueryKeys.estudiantes() });
    queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard() });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full sm:max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col p-6">
        <AlertDialogHeader className="pb-3 border-b border-border/60">
          <AlertDialogTitle className="flex items-center gap-2.5 text-lg font-bold">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon icon="ph:check-square-bold" className="size-5" aria-hidden="true" />
            </div>
            <span>Tomar Asistencia de Clase</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            {data
              ? `${data.codigo} · ${data.curso} — ${formatDate(data.fecha)} (${data.horaInicio} - ${data.horaFin})`
              : "Cargando información de la sesión..."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AsistenciasEditor sesionId={sesionId} enabled={open} onSaved={handleSaved} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
