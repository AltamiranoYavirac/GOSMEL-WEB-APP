"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";
import { AsistenciasEditor } from "@/entities/asistencia";

import { horariosQueryKeys } from "../model/query-keys";
import type { ITomarAsistenciaDialogProps } from "./TomarAsistenciaDialog.types";

export default function TomarAsistenciaDialog({ sesion }: ITomarAsistenciaDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: horariosQueryKeys.sesiones() });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="outline">
          <Icon icon="ph:check-square" aria-hidden="true" />
          Asistencia
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[92vh] flex flex-col p-6">
        <AlertDialogHeader className="pb-3 border-b border-border/60">
          <AlertDialogTitle>Registro de asistencia</AlertDialogTitle>
          <AlertDialogDescription>
            {sesion.catedra} · {sesion.curso} · {formatDate(sesion.fecha)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AsistenciasEditor sesionId={sesion.id} enabled={open} onSaved={handleSaved} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
