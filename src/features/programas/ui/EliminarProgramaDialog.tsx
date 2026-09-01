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

import { useEliminarPrograma } from "../hooks/useEliminarPrograma";
import type { IProgramaRow } from "../model/programa.types";

interface IEliminarProgramaDialogProps {
  programa: IProgramaRow;
}

export default function EliminarProgramaDialog({ programa }: IEliminarProgramaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarPrograma();

  const onConfirm = () => {
    mutation.mutate(programa.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Eliminar ${programa.nombre}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar el programa «{programa.nombre}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se desvincularán los cursos asociados a este programa formativo. Los cursos individuales no serán borrados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar programa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
