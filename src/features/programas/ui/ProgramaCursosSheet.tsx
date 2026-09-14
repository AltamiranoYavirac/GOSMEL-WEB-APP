"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Badge,
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
  SheetTrigger,
  Skeleton,
  Spinner,
} from "@/shared/ui";

import { useProgramaDetalle } from "../hooks/useProgramaDetalle";
import { useProgramaOptions } from "../hooks/useProgramaOptions";
import { useAsociarCursoPrograma } from "../hooks/useAsociarCursoPrograma";
import { useDesasociarCursoPrograma } from "../hooks/useDesasociarCursoPrograma";
import { useMoverCursoPrograma } from "../hooks/useMoverCursoPrograma";
import type { IProgramaCursosSheetProps } from "./ProgramaCursosSheet.types";

export default function ProgramaCursosSheet({
  programaId,
  programaNombre,
}: IProgramaCursosSheetProps) {
  const [open, setOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const detalle = useProgramaDetalle(programaId, open);
  const options = useProgramaOptions(open);
  const asociar = useAsociarCursoPrograma(programaId);
  const desasociar = useDesasociarCursoPrograma(programaId);
  const mover = useMoverCursoPrograma(programaId);

  const cursosVinculados = detalle.data?.cursos ?? [];
  const cursosDisponibles = (options.data?.cursos ?? []).filter(
    (c) => !cursosVinculados.some((item) => item.cursoId === c.id)
  );

  const onAgregarCurso = () => {
    if (!cursoSeleccionado) return;
    asociar.mutate(
      { cursoId: cursoSeleccionado, orden: Math.max(-1, ...cursosVinculados.map((item) => item.orden)) + 1 },
      {
        onSuccess: () => setCursoSeleccionado(""),
      }
    );
  };

  const onMover = (index: number, direccion: -1 | 1) => {
    const origen = cursosVinculados[index];
    const destino = cursosVinculados[index + direccion];
    if (!origen || !destino) return;
    mover.mutate({
      origen: { cursoId: origen.cursoId, orden: origen.orden },
      destino: { cursoId: destino.cursoId, orden: destino.orden },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:books" aria-hidden="true" />
          Cursos ({detalle.data?.cursos.length ?? 0})
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Cursos del programa</SheetTitle>
          <SheetDescription>{programaNombre} · El orden define la secuencia formativa.</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 px-4 pb-4">
          <div className="flex items-center gap-2">
            <Select value={cursoSeleccionado} onValueChange={setCursoSeleccionado}>
              <SelectTrigger className="min-w-0 flex-1">
                <SelectValue placeholder="Seleccionar curso para vincular" />
              </SelectTrigger>
              <SelectContent>
                {cursosDisponibles.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="default"
              disabled={!cursoSeleccionado || asociar.isPending}
              onClick={onAgregarCurso}
            >
              {asociar.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:plus" aria-hidden="true" />}
              Vincular
            </Button>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 pr-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cursos asociados ({detalle.data?.cursos.length ?? 0})
              </p>

              {detalle.isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !detalle.data?.cursos.length ? (
                <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
                  <p className="text-sm text-muted-foreground">No hay cursos vinculados a este programa.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {detalle.data.cursos.map((item, index) => (
                    <li
                      key={item.cursoId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.nombre}</p>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            {item.nivel ? <Badge variant="outline">{item.nivel}</Badge> : null}
                            {item.modalidad ? <Badge variant="ghost">{item.modalidad}</Badge> : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <div className="flex flex-col">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            disabled={index === 0 || mover.isPending}
                            onClick={() => onMover(index, -1)}
                            aria-label={`Subir ${item.nombre}`}
                          >
                            <Icon icon="ph:caret-up" className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            disabled={index === cursosVinculados.length - 1 || mover.isPending}
                            onClick={() => onMover(index, 1)}
                            aria-label={`Bajar ${item.nombre}`}
                          >
                            <Icon icon="ph:caret-down" className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          disabled={desasociar.isPending || mover.isPending}
                          onClick={() => desasociar.mutate(item.cursoId)}
                          aria-label={`Desvincular ${item.nombre}`}
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
