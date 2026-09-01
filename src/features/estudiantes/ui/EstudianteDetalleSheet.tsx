"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
} from "@/shared/ui";
import { formatCurrency, formatDate, formatMonthPeriod } from "@/shared/lib/formatters";

import { useEstudianteDetalle } from "../hooks/useEstudianteDetalle";
import { useUpdateInscripcionEstado } from "../hooks/useUpdateInscripcionEstado";
import { CUOTA_ESTADO_BADGE, INSCRIPCION_ESTADO_BADGE } from "../model/estudiante-detalle.types";
import AsignarCursoEstudianteDialog from "./AsignarCursoEstudianteDialog";

interface IEstudianteDetalleSheetProps {
  estudianteId: string;
  estudianteNombre: string;
}

export default function EstudianteDetalleSheet({ estudianteId, estudianteNombre }: IEstudianteDetalleSheetProps) {
  const [open, setOpen] = useState(false);
  const [asigOpen, setAsigOpen] = useState(false);
  const { data, isPending } = useEstudianteDetalle(estudianteId, open);
  const mutation = useUpdateInscripcionEstado(estudianteId);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Icon icon="ph:eye" aria-hidden="true" />
            Detalle
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-2xl md:max-w-3xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SheetTitle className="text-lg font-bold">{estudianteNombre}</SheetTitle>
                <SheetDescription className="text-xs">
                  Expediente integral: cursos matriculados, docente asignado y estado financiero.
                </SheetDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={() => setAsigOpen(true)}
              >
                <Icon icon="ph:plus-circle" width={14} height={14} aria-hidden="true" />
                Asignar Cátedra
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            {isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : !data ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No se pudo cargar el detalle de este estudiante.
              </p>
            ) : (
              <div className="space-y-6">
                <section className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Contacto</p>
                    <p className="text-sm">{data.email ?? "—"}</p>
                    <p className="text-sm">{data.celular ?? "—"}</p>
                    <p className="text-sm">Cédula: {data.cedula ?? "—"}</p>
                    <p className="text-sm">Nacimiento: {data.fechaNacimiento ? formatDate(data.fechaNacimiento) : "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Academia</p>
                    <p className="text-sm">Instrumentos: {data.instrumentos.length > 0 ? data.instrumentos.join(", ") : "—"}</p>
                    <p className="text-sm">Representante: {data.representante ?? "—"}</p>
                    <Badge variant={data.activo ? "default" : "destructive"}>{data.activo ? "Activo" : "Inactivo"}</Badge>
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      <Icon icon="ph:chalkboard" className="size-4" aria-hidden="true" />
                      Cursos y Cátedras Asignadas ({data.inscripciones.length})
                    </h3>
                  </div>

                  {data.inscripciones.length === 0 ? (
                    <div className="p-4 border border-dashed rounded-xl text-center space-y-2">
                      <p className="text-xs text-muted-foreground">Este estudiante aún no está matriculado en ningún curso.</p>
                      <Button size="sm" variant="outline" onClick={() => setAsigOpen(true)} className="gap-1.5 text-xs">
                        <Icon icon="ph:plus" width={14} height={14} />
                        Asignar primer curso
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-2.5">
                      {data.inscripciones.map((inscripcion) => (
                        <li
                          key={inscripcion.id}
                          className="flex items-start justify-between gap-2 rounded-xl border border-border/60 bg-background/50 p-3.5"
                        >
                          <div className="flex min-w-0 flex-col space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-primary">{inscripcion.catedra}</span>
                              <span className="font-semibold text-sm text-foreground">{inscripcion.curso}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Icon icon="ph:chalkboard-teacher" width={14} height={14} className="text-primary/70 shrink-0" />
                              <span>
                                Docente: <strong className="text-foreground">{inscripcion.docenteNombre ?? "Por asignar"}</strong>
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                            <Badge variant={INSCRIPCION_ESTADO_BADGE[inscripcion.estado].variant}>
                              {INSCRIPCION_ESTADO_BADGE[inscripcion.estado].label}
                            </Badge>
                            {inscripcion.estado === "activa" || inscripcion.estado === "pendiente" ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon-sm" aria-label="Gestionar inscripción">
                                    <Icon icon="ph:dots-three-vertical" aria-hidden="true" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {inscripcion.estado === "activa" ? (
                                    <DropdownMenuItem
                                      onSelect={() =>
                                        mutation.mutate({ inscripcionId: inscripcion.id, estado: "retirada" })
                                      }
                                    >
                                      <Icon icon="ph:arrow-u-left" aria-hidden="true" />
                                      Retirar
                                    </DropdownMenuItem>
                                  ) : null}
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      mutation.mutate({ inscripcionId: inscripcion.id, estado: "cancelada" })
                                    }
                                  >
                                    <Icon icon="ph:x" aria-hidden="true" />
                                    Cancelar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <Icon icon="ph:receipt" className="size-4" aria-hidden="true" />
                    Estado de cuenta (cuotas)
                  </h3>
                  {data.cuotas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin cuotas generadas para este estudiante.</p>
                  ) : (
                    <ul className="space-y-2">
                      {data.cuotas.map((cuota) => (
                        <li
                          key={cuota.id}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-3 py-2.5"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{formatMonthPeriod(cuota.periodo)}</span>
                            <span className="text-xs text-muted-foreground">
                              {cuota.fechaVencimiento ? `Vence: ${formatDate(cuota.fechaVencimiento)}` : "Sin vencimiento"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="font-semibold">{formatCurrency(cuota.monto)}</span>
                              {cuota.saldo > 0 && cuota.montoPagado > 0 ? (
                                <span className="block text-xs text-destructive">
                                  Resta: {formatCurrency(cuota.saldo)}
                                </span>
                              ) : null}
                            </div>
                            <Badge variant={CUOTA_ESTADO_BADGE[cuota.estado].variant}>
                              {CUOTA_ESTADO_BADGE[cuota.estado].label}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AsignarCursoEstudianteDialog
        key={estudianteId}
        estudianteId={estudianteId}
        estudianteNombre={estudianteNombre}
        open={asigOpen}
        onOpenChange={setAsigOpen}
      />
    </>
  );
}