"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/shared/ui";

import { useEliminarEstudiante } from "../hooks/useEliminarEstudiante";
import type { IEstudianteRow } from "../model/estudiante.types";

interface IEliminarEstudianteDialogProps {
  estudiante: IEstudianteRow;
}

export default function EliminarEstudianteDialog({ estudiante }: IEliminarEstudianteDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarEstudiante();

  const onConfirm = () => {
    mutation.mutate({ id: estudiante.id, perfilId: estudiante.perfilId });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" aria-label={`Eliminar a ${estudiante.nombreCompleto}`}>
          <Icon icon="ph:trash" aria-hidden="true" />
          Borrar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar a {estudiante.nombreCompleto}?</AlertDialogTitle>
          <AlertDialogDescription>
            Se quitará su rol de estudiante. Si no tiene historial (inscripciones ni cuotas) se eliminará de la base;
            de lo contrario quedará inactivo conservando sus datos.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={mutation.isPending}>
            {mutation.isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}