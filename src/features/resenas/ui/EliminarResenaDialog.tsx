"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spinner,
} from "@/shared/ui";

import { useEliminarResena } from "../hooks/useResenas";
import type { IEliminarResenaDialogProps } from "./EliminarResenaDialog.types";

export default function EliminarResenaDialog({ item }: IEliminarResenaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarResena();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" disabled={mutation.isPending} aria-label={`Eliminar reseña de ${item.estudiante}`}>
          <Icon icon="ph:trash" className="text-destructive" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar reseña</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará la reseña de {item.estudiante} en &ldquo;{item.curso}&rdquo; permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(item.id, { onSuccess: () => setOpen(false) })}
          >
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:trash" aria-hidden="true" />}
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
