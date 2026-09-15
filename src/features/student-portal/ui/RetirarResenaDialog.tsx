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

import { useRetirarResenaPropia } from "../hooks/useRetirarResenaPropia";
import type { IRetirarResenaDialogProps } from "./RetirarResenaDialog.types";

export default function RetirarResenaDialog({ estudianteId, resena }: IRetirarResenaDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useRetirarResenaPropia(estudianteId);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`Retirar reseña de ${resena.curso}`}>
          <Icon icon="ph:trash" className="text-destructive" aria-hidden="true" />
          Retirar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retirar reseña</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará tu valoración de &ldquo;{resena.curso}&rdquo;. Podrás volver a escribirla después.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(resena.id, { onSuccess: () => setOpen(false) })}
          >
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:trash" aria-hidden="true" />}
            Retirar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
