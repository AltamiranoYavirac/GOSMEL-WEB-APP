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

import { useEliminarMetrica } from "../hooks/useEliminarMetrica";
import type { IEliminarMetricaDialogProps } from "./EliminarMetricaDialog.types";

export default function EliminarMetricaDialog({ item }: IEliminarMetricaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarMetrica();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Eliminar métrica ${item.etiqueta}`}>
          <Icon icon="ph:trash" className="text-destructive" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar métrica</AlertDialogTitle>
          <AlertDialogDescription>Se eliminará &ldquo;{item.etiqueta}&rdquo; permanentemente.</AlertDialogDescription>
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
