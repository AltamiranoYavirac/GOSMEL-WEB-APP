"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Button,
  Input,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Spinner,
} from "@/shared/ui";

import { useProgramaDetalle } from "../hooks/useProgramaDetalle";
import {
  useAgregarObjetivoPrograma,
  useEliminarObjetivoPrograma,
  useMoverObjetivoPrograma,
} from "../hooks/useObjetivosPrograma";
import type { IProgramaObjetivosSheetProps } from "./ProgramaObjetivosSheet.types";

export default function ProgramaObjetivosSheet({
  programaId,
  programaNombre,
}: IProgramaObjetivosSheetProps) {
  const [open, setOpen] = useState(false);
  const [nuevoObjetivo, setNuevoObjetivo] = useState("");
  const detalle = useProgramaDetalle(programaId, open);
  const agregar = useAgregarObjetivoPrograma(programaId);
  const eliminar = useEliminarObjetivoPrograma(programaId);
  const mover = useMoverObjetivoPrograma(programaId);

  const objetivos = detalle.data?.objetivos ?? [];

  const onAgregar = () => {
    const texto = nuevoObjetivo.trim();
    if (!texto) return;
    agregar.mutate(
      { objetivo: texto, orden: Math.max(-1, ...objetivos.map((item) => item.orden)) + 1 },
      { onSuccess: () => setNuevoObjetivo("") }
    );
  };

  const onMover = (index: number, direccion: -1 | 1) => {
    const origen = objetivos[index];
    const destino = objetivos[index + direccion];
    if (!origen || !destino) return;
    mover.mutate({
      origen: { id: origen.id, orden: origen.orden },
      destino: { id: destino.id, orden: destino.orden },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:list-checks" aria-hidden="true" />
          Objetivos ({objetivos.length})
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Objetivos del programa</SheetTitle>
          <SheetDescription>{programaNombre} · El orden define cómo se listan en la landing.</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 px-4 pb-4">
          <div className="flex items-center gap-2">
            <Input
              value={nuevoObjetivo}
              onChange={(event) => setNuevoObjetivo(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onAgregar();
                }
              }}
              placeholder="Ej. Tocar un repertorio completo en público"
              className="min-w-0 flex-1"
            />
            <Button
              size="default"
              disabled={!nuevoObjetivo.trim() || agregar.isPending}
              onClick={onAgregar}
            >
              {agregar.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:plus" aria-hidden="true" />}
              Agregar
            </Button>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 pr-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Objetivos ({objetivos.length})
              </p>

              {detalle.isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !objetivos.length ? (
                <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No hay objetivos registrados para este programa.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {objetivos.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <p className="text-sm font-medium">{item.objetivo}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <div className="flex flex-col">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            disabled={index === 0 || mover.isPending}
                            onClick={() => onMover(index, -1)}
                            aria-label={`Subir objetivo ${index + 1}`}
                          >
                            <Icon icon="ph:caret-up" className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            disabled={index === objetivos.length - 1 || mover.isPending}
                            onClick={() => onMover(index, 1)}
                            aria-label={`Bajar objetivo ${index + 1}`}
                          >
                            <Icon icon="ph:caret-down" className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          disabled={eliminar.isPending || mover.isPending}
                          onClick={() => eliminar.mutate(item.id)}
                          aria-label={`Eliminar objetivo ${index + 1}`}
                        >
                          <Icon icon="ph:x" className="size-4 text-muted-foreground hover:text-destructive" aria-hidden="true" />
                        </Button>
                      </div>
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
