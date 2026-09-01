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

import { useEliminarCatedra } from "../hooks/useEliminarCatedra";
import type { ICatedraRow } from "../model/catedra.types";

interface IEliminarCatedraDialogProps {
  catedra: ICatedraRow;
}

export default function EliminarCatedraDialog({ catedra }: IEliminarCatedraDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarCatedra();

  const onConfirm = () => {
    mutation.mutate(catedra.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Eliminar ${catedra.codigo}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar la cátedra «{catedra.codigo}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará el grupo de clase ({catedra.curso}) y sus sesiones programadas.
            Si tiene estudiantes matriculados activos, el sistema protegerá la información impidiendo el borrado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar cátedra"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
