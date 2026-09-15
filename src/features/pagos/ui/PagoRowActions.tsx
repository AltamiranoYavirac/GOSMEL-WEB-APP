"use client";

import { Icon } from "@iconify/react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

import type { IPagoRow } from "../model/pago.types";
import AnularPagoDialog from "./AnularPagoDialog";
import AprobarPagoDialog from "./AprobarPagoDialog";
import RechazarPagoDialog from "./RechazarPagoDialog";
import ReciboPagoDialog from "./ReciboPagoDialog";

interface IPagoRowActionsProps {
  pago: IPagoRow;
}

const keepMenuOpenForDialog = (event: Event) => event.preventDefault();

export default function PagoRowActions({ pago }: IPagoRowActionsProps) {
  const pendiente = pago.estado === "pendiente_verificacion";
  const puedeAnularse = pendiente || pago.estado === "aprobado";
  const reciboDisponible = pago.estado === "aprobado" && Boolean(pago.numeroRecibo);

  if (!pendiente && !reciboDisponible && !puedeAnularse) {
    return <span className="text-xs text-muted-foreground">Sin acciones</span>;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {pendiente ? (
        <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted/30 p-0.5">
          <AprobarPagoDialog pago={pago} />
          <RechazarPagoDialog pago={pago} />
        </div>
      ) : null}

      {reciboDisponible ? (
        <ReciboPagoDialog
          pago={pago}
          trigger={
            <Button variant="outline" size="sm" className="border-border bg-background text-foreground hover:bg-muted">
              <Icon icon="ph:receipt" className="size-4" aria-hidden="true" />
              Recibo
            </Button>
          }
        />
      ) : null}

      {puedeAnularse ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`MÃ¡s acciones para el pago de ${pago.estudiante}`}
            >
              <Icon icon="ph:dots-three-vertical" className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <AnularPagoDialog
              pago={pago}
              trigger={
                <DropdownMenuItem variant="destructive" onSelect={keepMenuOpenForDialog}>
                  <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
                  Anular pago
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
