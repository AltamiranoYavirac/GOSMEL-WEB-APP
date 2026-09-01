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

import { useEliminarMaterial } from "../hooks/useEliminarMaterial";
import type { IMaterialRow } from "../model/material.types";

interface IEliminarMaterialDialogProps {
  material: IMaterialRow;
}

export default function EliminarMaterialDialog({ material }: IEliminarMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarMaterial();

  const onConfirm = () => {
    mutation.mutate(material.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Eliminar ${material.titulo}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar el material «{material.titulo}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará este recurso didáctico ({material.tipo.toUpperCase()}) y ya no estará disponible para estudiantes o docentes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar material"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
