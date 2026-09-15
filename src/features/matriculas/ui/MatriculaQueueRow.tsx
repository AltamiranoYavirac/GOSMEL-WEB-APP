"use client";

import { Icon } from "@iconify/react";

import { Avatar, AvatarFallback, AvatarImage, Badge } from "@/shared/ui";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { formatCurrency, formatDate, formatTimeAgo, initialsOf } from "@/shared/lib/formatters";

import type { IMatriculaQueueRowProps } from "./MatriculaQueueRow.types";
import CupoBar from "./CupoBar";
import EsperaBadge, { esperaTexto } from "./EsperaBadge";

const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrido: "Híbrido",
};

export default function MatriculaQueueRow({ inscripcion, onSelect }: IMatriculaQueueRowProps) {
  const avatarUrl = buildCloudinaryImageUrl(inscripcion.estudianteAvatarPublicId, "q_auto,f_auto,w_192,h_192,c_fill,g_face");
  const urgente = inscripcion.diasEspera >= 7;
  const instrumentoIcon =
    inscripcion.instrumentoIcono && inscripcion.instrumentoIcono.includes(":")
      ? inscripcion.instrumentoIcono
      : "ph:music-notes";
  const modalidadLabel = inscripcion.modalidad ? (MODALIDAD_LABEL[inscripcion.modalidad] ?? inscripcion.modalidad) : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
      aria-label={`Revisar matrícula de ${inscripcion.estudiante}, pendiente ${esperaTexto(inscripcion.diasEspera)}, ${inscripcion.cursoNombre ?? "cátedra sin curso"}`}
    >
      <span className="flex items-center gap-3.5">
        <span className="relative shrink-0">
          <Avatar size="lg" className="size-14 bg-muted ring-2 ring-primary-tint">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary-tint text-base font-extrabold text-primary-800">
              {initialsOf(inscripcion.estudiante)}
            </AvatarFallback>
          </Avatar>
          {urgente ? (
            <span
              className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-destructive ring-2 ring-card"
              title="Lleva 7 días o más esperando"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="block truncate font-heading text-base font-extrabold tracking-tight text-foreground">
            {inscripcion.estudiante}
          </span>
          <EsperaBadge diasEspera={inscripcion.diasEspera} />
        </span>
      </span>

      <span className="mt-4 flex min-w-0 items-center gap-2 rounded-xl bg-muted/50 px-3.5 py-3">
        <Icon icon={instrumentoIcon} className="size-5 shrink-0 text-primary-700" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-foreground">
            {inscripcion.cursoNombre ?? "Cátedra sin curso"}
          </span>
          <span className="mt-0.5 block truncate font-mono text-[11px] font-semibold text-muted-foreground">
            {inscripcion.instrumentoNombre ? `${inscripcion.instrumentoNombre} · ` : ""}
            Cátedra {inscripcion.catedraCodigo ?? "—"}
          </span>
        </span>
      </span>

      <span className="mt-4 space-y-2 text-[13px] text-muted-foreground">
        {inscripcion.docenteNombre ? (
          <span className="flex min-w-0 items-center gap-2">
            <Icon icon="ph:chalkboard-teacher" className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate font-medium text-foreground">{inscripcion.docenteNombre}</span>
          </span>
        ) : null}
        <span className="flex items-center gap-2">
          <Icon icon="ph:calendar-check" className="size-4 shrink-0" aria-hidden="true" />
          Inicia {formatDate(inscripcion.fechaInicio)}
        </span>
        <span className="flex items-center gap-2">
          <Icon icon="ph:paper-plane-tilt" className="size-4 shrink-0" aria-hidden="true" />
          Solicitada {formatTimeAgo(inscripcion.fechaInscripcion)}
        </span>
        {inscripcion.precioReferencial !== null ? (
          <span className="flex items-center gap-2 font-mono font-bold text-foreground">
            <Icon icon="ph:currency-dollar" className="size-4 shrink-0" aria-hidden="true" />
            {formatCurrency(inscripcion.precioReferencial)}/mes
          </span>
        ) : null}
      </span>

      <span className="mt-3 flex flex-wrap items-center gap-1.5">
        {modalidadLabel ? <Badge variant="outline">{modalidadLabel}</Badge> : null}
        {inscripcion.aula ? (
          <Badge variant="ghost" className="gap-1">
            <Icon icon="ph:door-open" className="size-3" aria-hidden="true" />
            {inscripcion.aula}
          </Badge>
        ) : null}
        {inscripcion.desdeSolicitud ? (
          <Badge variant="ghost">Desde el portal</Badge>
        ) : (
          <Badge variant="ghost">Registro directo</Badge>
        )}
      </span>

      <CupoBar ocupados={inscripcion.cuposOcupados} maximo={inscripcion.cupoMaximo} className="mt-4" />

      <span className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-sm font-extrabold text-primary-800 transition-colors group-hover:text-primary">
          Revisar solicitud
        </span>
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary-tint text-primary-800 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon icon="ph:arrow-right" className="size-4" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
