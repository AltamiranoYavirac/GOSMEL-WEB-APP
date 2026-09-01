"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import {
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

import { useDocenteDetalle } from "../hooks/useDocenteDetalle";
import {
  CATEDRA_ESTADO_BADGE,
  MODALIDAD_BADGE,
  PORTAFOLIO_TIPO_LABEL,
} from "../model/docente-detalle.types";

interface IDocenteDetalleSheetProps {
  docenteId: string;
  docenteNombre: string;
}

export default function DocenteDetalleSheet({ docenteId, docenteNombre }: IDocenteDetalleSheetProps) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useDocenteDetalle(docenteId, open);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon icon="ph:eye" aria-hidden="true" />
          Detalle
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Detalle · {docenteNombre}</SheetTitle>
          <SheetDescription>Formación, reconocimientos, portafolio y cátedras asignadas.</SheetDescription>
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
              No se pudo cargar el detalle de este docente.
            </p>
          ) : (
            <div className="space-y-6">
              <section>
                <div className="flex flex-wrap items-center gap-2">
                  {data.titulo ? <Badge variant="outline">{data.titulo}</Badge> : null}
                  {data.aniosExperiencia != null ? (
                    <span className="text-xs text-muted-foreground">{data.aniosExperiencia} años de experiencia</span>
                  ) : null}
                  <Badge variant={data.publicado ? "default" : "ghost"}>
                    {data.publicado ? "En línea" : "Oculto"}
                  </Badge>
                </div>
                {data.email ? <p className="mt-2 text-sm text-muted-foreground">{data.email}</p> : null}
                {data.instrumentos.length > 0 ? (
                  <p className="mt-1 text-sm">
                    Instrumentos: <span className="text-muted-foreground">{data.instrumentos.join(", ")}</span>
                  </p>
                ) : null}
                {data.biografia ? <p className="mt-3 text-sm leading-relaxed text-foreground">{data.biografia}</p> : null}
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Icon icon="ph:graduation-cap" className="size-4" aria-hidden="true" />
                  Formación
                </h3>
                {data.formacion.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin formación registrada.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {data.formacion.map((item) => (
                      <li key={item.id} className="rounded-md bg-muted/50 px-3 py-2">
                        <p className="text-sm font-medium">
                          {item.titulo}
                          {item.anioInicio ? ` · ${item.anioInicio}${item.anioFin ? `–${item.anioFin}` : ""}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.institucion}</p>
                        {item.descripcion ? <p className="text-xs text-muted-foreground">{item.descripcion}</p> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Icon icon="ph:award" className="size-4" aria-hidden="true" />
                  Reconocimientos
                </h3>
                {data.reconocimientos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin reconocimientos registrados.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {data.reconocimientos.map((item) => (
                      <li key={item.id} className="rounded-md bg-muted/50 px-3 py-2">
                        <p className="text-sm font-medium">
                          {item.titulo}
                          {item.anio ? ` · ${item.anio}` : ""}
                        </p>
                        {item.entidadOtorgante ? (
                          <p className="text-xs text-muted-foreground">{item.entidadOtorgante}</p>
                        ) : null}
                        {item.descripcion ? <p className="text-xs text-muted-foreground">{item.descripcion}</p> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Icon icon="ph:folder" className="size-4" aria-hidden="true" />
                  Portafolio
                </h3>
                {data.portafolio.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin portafolio registrado.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {data.portafolio.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
                        <span className="truncate text-sm">
                          {PORTAFOLIO_TIPO_LABEL[item.tipo]} · {item.titulo ?? "Sin título"}
                        </span>
                        {item.urlExterna ? (
                          <a
                            href={item.urlExterna}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 text-xs font-medium text-primary underline-offset-3 hover:underline"
                          >
                            Ver
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Icon icon="ph:chalkboard" className="size-4" aria-hidden="true" />
                  Cátedras asignadas
                </h3>
                {data.catedras.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Este docente no tiene cátedras asignadas.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {data.catedras.map((catedra) => (
                      <li
                        key={catedra.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-background px-3 py-2.5"
                      >
                        <div className="flex min-w-0 flex-col">
                          <span className="font-mono text-xs font-semibold text-primary">{catedra.codigo}</span>
                          <span className="truncate text-sm">{catedra.curso}</span>
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
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}