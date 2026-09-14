"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Spinner } from "@/shared/ui";

import { useEliminarTestimonio } from "../hooks/useEliminarTestimonio";
import type { IEliminarTestimonioDialogProps } from "./EliminarTestimonioDialog.types";

export default function EliminarTestimonioDialog({ item }: IEliminarTestimonioDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarTestimonio();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild><Button variant="ghost" size="icon-xs" aria-label={`Eliminar testimonio de ${item.autor}`}><Icon icon="ph:trash" className="text-destructive" aria-hidden="true" /></Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Eliminar testimonio</AlertDialogTitle><AlertDialogDescription>Esta acción elimina definitivamente el testimonio de {item.autor}.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel><Button variant="destructive" disabled={mutation.isPending} onClick={() => mutation.mutate(item.id, { onSuccess: () => setOpen(false) })}>{mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:trash" aria-hidden="true" />}Eliminar</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
