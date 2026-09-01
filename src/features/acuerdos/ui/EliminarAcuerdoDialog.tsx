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
import { formatCurrency } from "@/shared/lib/formatters";

import { useEliminarAcuerdo } from "../hooks/useEliminarAcuerdo";
import type { IAcuerdoRow } from "../model/acuerdo.types";

interface IEliminarAcuerdoDialogProps {
  acuerdo: IAcuerdoRow;
}

export default function EliminarAcuerdoDialog({ acuerdo }: IEliminarAcuerdoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarAcuerdo();

  const onConfirm = () => {
    mutation.mutate(acuerdo.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-destructive hover:bg-destructive/10"
          aria-label={`Eliminar acuerdo de ${acuerdo.estudiante}`}
        >
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar acuerdo de {formatCurrency(acuerdo.montoMensual)}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará el acuerdo de pago de <strong>{acuerdo.estudiante}</strong>.
            Si el acuerdo tiene cuotas con pagos abonados, el sistema protegerá la información contable impidiendo el borrado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar acuerdo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
