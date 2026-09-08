"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Skeleton,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useAsistenciasSesion } from "../hooks/useAsistenciasSesion";
import { useGuardarAsistenciasSesion } from "../hooks/useGuardarAsistenciasSesion";
import type { ITomarAsistenciaDialogProps } from "./TomarAsistenciaDialog.types";
import AsistenciasEditor from "./AsistenciasEditor";

export default function TomarAsistenciaDialog({ sesion }: ITomarAsistenciaDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useAsistenciasSesion(sesion.id, open);
  const mutation = useGuardarAsistenciasSesion(sesion.id);

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

        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data ? (
          <AsistenciasEditor key={sesion.id} data={data} mutation={mutation} onSaved={() => setOpen(false)} />
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
