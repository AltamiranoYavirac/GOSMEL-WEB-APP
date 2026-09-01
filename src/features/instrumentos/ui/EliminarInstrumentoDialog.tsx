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

import { useEliminarInstrumento } from "../hooks/useEliminarInstrumento";
import type { IInstrumentoRow } from "../model/instrumento.types";

interface IEliminarInstrumentoDialogProps {
  instrumento: IInstrumentoRow;
}

export default function EliminarInstrumentoDialog({ instrumento }: IEliminarInstrumentoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarInstrumento();

  const onConfirm = () => {
    mutation.mutate(instrumento.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Eliminar ${instrumento.nombre}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar el instrumento «{instrumento.nombre}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará del catálogo de instrumentos. Si existen cursos que lo utilizan, el sistema evitará el borrado accidental.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar instrumento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
