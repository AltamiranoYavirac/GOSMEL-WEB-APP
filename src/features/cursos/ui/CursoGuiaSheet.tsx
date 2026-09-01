"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
} from "@/shared/ui";

import { useCursoGuia } from "../hooks/useCursoGuia";
import { MODALIDAD_BADGE, NIVEL_BADGE } from "../model/curso.types";
import { CATEDRA_ESTADO_BADGE } from "../model/curso-guia.types";
import CrearModuloDialog from "./CrearModuloDialog";
import EditarModuloDialog from "./EditarModuloDialog";
import CrearLeccionDialog from "./CrearLeccionDialog";
import EditarLeccionDialog from "./EditarLeccionDialog";
import GestionarHabilidadesDialog from "./GestionarHabilidadesDialog";
import type { ICursoGuiaSheetProps } from "./CursoGuiaSheet.types";

export default function CursoGuiaSheet({ cursoId, cursoNombre }: ICursoGuiaSheetProps) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useCursoGuia(cursoId, open);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:book-open-text" aria-hidden="true" />
          Directrices
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <div>
              <SheetTitle>Directrices · {cursoNombre}</SheetTitle>
              <SheetDescription>Guía del curso, temario oficial y docentes asignados.</SheetDescription>
            </div>
            <GestionarHabilidadesDialog cursoId={cursoId} cursoNombre={cursoNombre} />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4">
          {isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !data ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No se pudo cargar la guía de este curso.
            </p>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={NIVEL_BADGE[data.nivel].variant}>{NIVEL_BADGE[data.nivel].label}</Badge>
                  <Badge variant={MODALIDAD_BADGE[data.modalidad].variant}>
                    {MODALIDAD_BADGE[data.modalidad].label}
                  </Badge>
                  {data.duracionSemanas ? (
                    <span className="text-xs text-muted-foreground">{data.duracionSemanas} semanas</span>
                  ) : null}
                  {data.horasTotales ? (
                    <span className="text-xs text-muted-foreground">{data.horasTotales} h totales</span>
                  ) : null}
                </div>
                {data.resumen ? <p className="mt-3 text-sm text-muted-foreground">{data.resumen}</p> : null}
                <p className="mt-2 text-sm leading-relaxed text-foreground">{data.descripcion}</p>
              </div>

              <section>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Icon icon="ph:chalkboard-teacher" className="size-4" aria-hidden="true" />
                  Docentes asignados
                </h3>
                {data.catedras.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Este curso aún no tiene cátedras con docentes asignados.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.catedras.map((catedra) => (
                      <li
                        key={catedra.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-3 py-2.5"
                      >
                        <div className="flex min-w-0 flex-col">
                          <span className="font-mono text-xs font-semibold text-primary">{catedra.codigo}</span>
                          <span className="truncate text-sm">{catedra.docente ?? "Sin docente"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={MODALIDAD_BADGE[catedra.modalidad].variant}>
                            {MODALIDAD_BADGE[catedra.modalidad].label}
                          </Badge>
                          <Badge variant={CATEDRA_ESTADO_BADGE[catedra.estado].variant}>
                            {CATEDRA_ESTADO_BADGE[catedra.estado].label}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <Icon icon="ph:list-checks" className="size-4" aria-hidden="true" />
                    Temario oficial (D-12)
                  </h3>
                  <CrearModuloDialog cursoId={cursoId} nextOrden={data.modulos.length} />
                </div>

                {data.modulos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Este curso aún no tiene módulos en su temario.</p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="gap-2">
                    {data.modulos.map((modulo, index) => (
                      <AccordionItem key={modulo.id} value={modulo.id}>
                        <div className="flex items-center justify-between pr-2">
                          <AccordionTrigger className="flex-1">
                            <span>
                              Módulo {String(index + 1).padStart(2, "0")} · {modulo.titulo}
                            </span>
                          </AccordionTrigger>
                          <div className="flex items-center gap-1">
                            <EditarModuloDialog
                              cursoId={cursoId}
                              modulo={{
                                id: modulo.id,
                                titulo: modulo.titulo,
                                descripcion: modulo.descripcion,
                                orden: index,
                              }}
                            />
                            <CrearLeccionDialog
                              cursoId={cursoId}
                              moduloId={modulo.id}
                              nextOrden={modulo.lecciones.length}
                            />
                          </div>
                        </div>
                        <AccordionContent>
                          {modulo.descripcion ? (
                            <p className="mb-3 text-sm text-muted-foreground">{modulo.descripcion}</p>
                          ) : null}
                          {modulo.lecciones.length === 0 ? (
                            <p className="text-xs text-muted-foreground">Sin lecciones registradas en este módulo.</p>
                          ) : (
                            <ul className="space-y-1.5">
                              {modulo.lecciones.map((leccion, leccionIndex) => (
                                <li
                                  key={leccion.id}
                                  className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2.5 py-2"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">{leccion.titulo}</p>
                                    </div>
                                    {leccion.descripcion ? (
                                      <p className="text-xs text-muted-foreground">{leccion.descripcion}</p>
                                    ) : null}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {leccion.duracionMinutos ? (
                                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                                        {leccion.duracionMinutos} min
                                      </span>
                                    ) : null}
                                    <EditarLeccionDialog
                                      cursoId={cursoId}
                                      leccion={{
                                        id: leccion.id,
                                        titulo: leccion.titulo,
                                        descripcion: leccion.descripcion,
                                        duracionMinutos: leccion.duracionMinutos,
                                        orden: leccionIndex,
                                      }}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </section>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}