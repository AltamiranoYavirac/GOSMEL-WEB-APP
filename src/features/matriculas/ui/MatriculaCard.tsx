"use client";

import { Icon } from "@iconify/react";

import { Badge, Button, DataLabel } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { formatDate, formatTimeAgo, initialsOf } from "@/shared/lib/formatters";

import { matriculaCardVariants } from "./MatriculaCard.variants";
import type { IMatriculaCardProps } from "./MatriculaCard.types";

export default function MatriculaCard({
  inscripcion,
  expanded,
  onToggle,
  onAprobar,
  onRechazar,
}: IMatriculaCardProps) {
  const { base, tile, typeLabel, decorativeIcon } = matriculaCardVariants({ expanded });

  return (
    <article className={base()}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="relative flex w-full items-start gap-3 overflow-hidden p-4 text-left outline-none transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 sm:gap-4 sm:p-5"
      >
        <Icon icon="ph:student" className={decorativeIcon()} aria-hidden="true" />

        <span className={tile()}>
          <span className="text-sm font-extrabold sm:text-base">{initialsOf(inscripcion.estudiante)}</span>
        </span>

        <span className="relative z-10 min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className={typeLabel()}>Matrícula</span>
            <span className="text-xs text-muted-foreground">
              · {formatTimeAgo(inscripcion.fechaInscripcion)}
            </span>
          </span>

          <span className="mt-1 flex flex-wrap items-center gap-2.5">
            <span className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
              {inscripcion.estudiante}
            </span>
            <Badge variant="warning" className="h-6 px-3 text-xs">
              Pendiente
            </Badge>
            {inscripcion.desdeSolicitud ? (
              <Badge variant="ghost" className="h-6 px-3 text-xs">
                Desde admisión
              </Badge>
            ) : null}
          </span>

          <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Icon icon="ph:music-notes" className="size-4 text-muted-foreground" aria-hidden="true" />
            {inscripcion.cursoNombre ?? "Cátedra"}
            {inscripcion.catedraCodigo ? ` · ${inscripcion.catedraCodigo}` : ""}
          </span>
        </span>

        <span className="relative z-10 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors group-hover:text-foreground">
          <Icon
            icon="ph:caret-down"
            className={cn("size-4 transition-transform", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </span>
      </button>

      {expanded ? (
        <div className="border-t border-border bg-background/35 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3.5 sm:p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Icon icon="ph:music-notes" className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <DataLabel>Cátedra asignada</DataLabel>
              <p className="mt-0.5 truncate text-sm font-bold text-foreground sm:text-base">
                {inscripcion.cursoNombre ?? "Cátedra"}
                {inscripcion.catedraCodigo ? ` · ${inscripcion.catedraCodigo}` : ""}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon icon="ph:calendar-blank" className="size-4 text-primary" aria-hidden="true" />
                <DataLabel>Fechas</DataLabel>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Icon
                    icon="ph:calendar-plus"
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    Inscripción ·{" "}
                    <span className="font-semibold">{formatDate(inscripcion.fechaInscripcion)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-foreground">
                  <Icon
                    icon="ph:calendar-check"
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    Inicio de clases ·{" "}
                    <span className="font-semibold">{formatDate(inscripcion.fechaInicio)}</span>
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon icon="ph:arrow-square-in" className="size-4 text-primary" aria-hidden="true" />
                <DataLabel>Origen</DataLabel>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {inscripcion.desdeSolicitud ? "Solicitud de admisión" : "Matrícula directa"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {inscripcion.desdeSolicitud
                  ? "Generada al convertir una solicitud del sitio público."
                  : "Registrada directamente por administración."}
              </p>
            </section>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-border pt-5 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:w-auto"
              onClick={onRechazar}
            >
              <Icon icon="ph:x" className="size-4" aria-hidden="true" />
              Rechazar
            </Button>
            <div className="flex flex-col gap-2.5 sm:ml-auto sm:flex-row">
              <Button size="lg" className="w-full px-4 sm:w-auto" onClick={onAprobar}>
                Aprobar matrícula
                <Icon icon="ph:arrow-right" className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
