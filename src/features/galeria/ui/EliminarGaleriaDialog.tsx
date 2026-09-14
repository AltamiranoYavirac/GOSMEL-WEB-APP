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

import { useEliminarGaleriaMedio } from "../hooks/useEliminarGaleriaMedio";
import type { IEliminarGaleriaDialogProps } from "./EliminarGaleriaDialog.types";

export default function EliminarGaleriaDialog({ item }: IEliminarGaleriaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarGaleriaMedio();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Eliminar ${item.titulo ?? "medio"}`}>
          <Icon icon="ph:trash" className="text-destructive" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar medio</AlertDialogTitle>
          <AlertDialogDescription>La fila y la imagen de Cloudinary se eliminarán permanentemente.</AlertDialogDescription>
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
