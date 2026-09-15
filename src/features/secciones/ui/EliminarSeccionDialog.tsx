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

import { useEliminarSeccion } from "../hooks/useEliminarSeccion";
import type { IEliminarSeccionDialogProps } from "./EliminarSeccionDialog.types";

export default function EliminarSeccionDialog({ item }: IEliminarSeccionDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarSeccion();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Eliminar sección ${item.titulo}`}>
          <Icon icon="ph:trash" className="text-destructive" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar sección</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará &ldquo;{item.titulo}&rdquo; y su imagen de Cloudinary permanentemente.
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
