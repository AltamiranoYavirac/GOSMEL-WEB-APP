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

import { useEliminarCurso } from "../hooks/useEliminarCurso";
import type { ICursoRow } from "../model/curso.types";

interface IEliminarCursoDialogProps {
  curso: ICursoRow;
}

export default function EliminarCursoDialog({ curso }: IEliminarCursoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarCurso();

  const onConfirm = () => {
    mutation.mutate(curso.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Eliminar ${curso.nombre}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar el curso «{curso.nombre}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará el curso junto con su temario (módulos, lecciones y habilidades asociadas).
            Si tiene cátedras con alumnos activos, el sistema protegerá la información impidiendo el borrado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar curso"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
