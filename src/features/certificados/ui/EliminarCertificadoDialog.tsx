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

import { useEliminarCertificado } from "../hooks/useCertificados";
import type { ICertificadoRow } from "../model/certificado.types";

interface IEliminarCertificadoDialogProps {
  certificado: ICertificadoRow;
}

export default function EliminarCertificadoDialog({ certificado }: IEliminarCertificadoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useEliminarCertificado();

  const onConfirm = () => {
    mutation.mutate(certificado.id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" aria-label={`Eliminar certificado ${certificado.codigoVerificacion}`}>
          <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ¿Eliminar certificado «{certificado.codigoVerificacion}»?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se anulará el certificado digital emitido a <strong>{certificado.estudiante}</strong> para el curso {certificado.curso}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Eliminando..." : "Eliminar certificado"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
