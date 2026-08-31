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

interface IEstudianteDetalleSheetProps {
  estudianteId: string;
  estudianteNombre: string;
}

export default function EstudianteDetalleSheet({ estudianteId, estudianteNombre }: IEstudianteDetalleSheetProps) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useEstudianteDetalle(estudianteId, open);
  const mutation = useUpdateInscripcionEstado(estudianteId);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:eye" aria-hidden="true" />
          Detalle
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Detalle · {estudianteNombre}</SheetTitle>
          <SheetDescription>Inscripciones, estado de cuenta e información del estudiante.</SheetDescription>
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
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Icon icon="ph:chalkboard" className="size-4" aria-hidden="true" />
                  Inscripciones
                </h3>
                {data.inscripciones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Este estudiante no tiene inscripciones.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.inscripciones.map((inscripcion) => (
                      <li
                        key={inscripcion.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-3 py-2.5"
                      >
                        <div className="flex min-w-0 flex-col">
                          <span className="font-mono text-xs font-semibold text-primary">{inscripcion.catedra}</span>
                          <span className="truncate text-sm">{inscripcion.curso}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
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
                  Estado de cuenta
                </h3>
                {data.cuotas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Este estudiante no tiene cuotas.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {data.cuotas.map((cuota) => (
                      <li
                        key={cuota.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2"
                      >
                        <div className="flex min-w-0 flex-col">
                          <span className="text-sm font-medium">{formatMonthPeriod(cuota.periodo)}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(cuota.monto)} · pagado {formatCurrency(cuota.montoPagado)}
                            {cuota.fechaVencimiento ? ` · vence ${formatDate(cuota.fechaVencimiento)}` : ""}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {cuota.saldo > 0 ? (
                            <span className="text-sm font-semibold text-destructive">{formatCurrency(cuota.saldo)}</span>
                          ) : null}
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
  );
}