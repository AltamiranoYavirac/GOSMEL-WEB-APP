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

import { useEliminarDocente } from "../hooks/useEliminarDocente";

interface IEliminarDocenteDialogProps {
  perfilId: string;
  nombre: string;
}

export default function EliminarDocenteDialog({ perfilId, nombre }: IEliminarDocenteDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarDocente();

  const onConfirm = () => {
    mutation.mutate(perfilId);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" aria-label={`Eliminar a ${nombre}`}>
          <Icon icon="ph:trash" aria-hidden="true" />
          Borrar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar a {nombre}?</AlertDialogTitle>
          <AlertDialogDescription>
            Se quitará su rol de docente. Si no tiene cátedras asignadas se eliminará de la base; de lo contrario
            quedará oculto conservando sus datos.
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