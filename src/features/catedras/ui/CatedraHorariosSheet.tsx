"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  Button,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Spinner,
  TimeInput,
} from "@/shared/ui";

import { useAgregarHorarioCatedra, useCatedraHorarios, useEliminarHorarioCatedra } from "../hooks/useCatedraHorarios";
import { DIA_SEMANA_OPCIONES } from "../model/CrearCatedraForm.config";
import type { ICatedraHorariosSheetProps } from "./CatedraHorariosSheet.types";

const DIA_LABEL = new Map(DIA_SEMANA_OPCIONES.map((opcion) => [Number(opcion.value), opcion.label]));

export default function CatedraHorariosSheet({ catedra, open, onOpenChange }: ICatedraHorariosSheetProps) {
  const [diaSemana, setDiaSemana] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const catedraId = catedra?.id ?? "";
  const horarios = useCatedraHorarios(catedraId, open);
  const agregar = useAgregarHorarioCatedra(catedraId);
  const eliminar = useEliminarHorarioCatedra(catedraId);

  const items = horarios.data ?? [];

  const onAgregar = () => {
    if (diaSemana === "" || !horaInicio || !horaFin) {
      toast.error("Completa día, hora de inicio y hora de fin.");
      return;
    }
    if (horaFin <= horaInicio) {
      toast.error("La hora de fin debe ser posterior a la de inicio.");
      return;
    }
    agregar.mutate(
      { diaSemana: Number(diaSemana), horaInicio, horaFin },
      {
        onSuccess: () => {
          setDiaSemana("");
          setHoraInicio("");
          setHoraFin("");
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Horarios de la cátedra</SheetTitle>
          <SheetDescription>
            {catedra ? `${catedra.codigo} · ${catedra.curso}` : ""} · Las sesiones se generan desde estas franjas.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 px-4 pb-4">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <Select value={diaSemana} onValueChange={setDiaSemana}>
                <SelectTrigger className="w-full" aria-label="Día de la semana">
                  <SelectValue placeholder="Día" />
                </SelectTrigger>
                <SelectContent>
                  {DIA_SEMANA_OPCIONES.map((opcion) => (
                    <SelectItem key={opcion.value} value={opcion.value}>{opcion.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TimeInput value={horaInicio} onChange={setHoraInicio} aria-label="Hora de inicio" className="min-w-0 flex-1" />
            <TimeInput value={horaFin} onChange={setHoraFin} aria-label="Hora de fin" className="min-w-0 flex-1" />
            <Button size="default" disabled={agregar.isPending} onClick={onAgregar}>
              {agregar.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:plus" aria-hidden="true" />}
              Agregar
            </Button>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 pr-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Horarios ({items.length})
              </p>

              {horarios.isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !items.length ? (
                <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No hay horarios registrados para esta cátedra.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon icon="ph:clock" className="size-4 shrink-0 text-primary" aria-hidden="true" />
                        <p className="text-sm font-medium">
                          {DIA_LABEL.get(item.diaSemana) ?? "Día"} · {item.horaInicio} – {item.horaFin}
                        </p>
                      </div>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        disabled={eliminar.isPending}
                        onClick={() => eliminar.mutate(item.id)}
                        aria-label={`Eliminar horario ${DIA_LABEL.get(item.diaSemana) ?? ""} ${item.horaInicio}`}
                      >
                        <Icon icon="ph:x" className="size-4 text-muted-foreground hover:text-destructive" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
