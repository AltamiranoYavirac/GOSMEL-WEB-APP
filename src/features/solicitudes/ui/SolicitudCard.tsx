"use client";

import { Icon } from "@iconify/react";

import { Badge, Button, DataLabel } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { formatDate, formatDateTime, initialsOf } from "@/shared/lib/formatters";

import {
  SOLICITUD_ESTADO_BADGE,
  SOLICITUD_ESTADO_SIGUIENTE,
  SOLICITUD_TIPO_BADGE,
} from "../model/solicitudes.constants";
import type { ISolicitudCardProps } from "./SolicitudCard.types";

const ESTADO_AVATAR: Record<string, string> = {
  nueva: "bg-info-tint text-info-fg",
  contactada: "bg-warning-tint text-warning-fg",
  convertida: "bg-success-tint text-success-fg",
  descartada: "bg-foreground/8 text-muted-foreground",
};

export default function SolicitudCard({
  solicitud,
  expanded,
  onToggle,
  onMarkNext,
  onConvert,
  onDiscard,
  waUrl,
  busy,
}: ISolicitudCardProps) {
  const estado = SOLICITUD_ESTADO_BADGE[solicitud.estado];
  const tipo = SOLICITUD_TIPO_BADGE[solicitud.tipo];
  const siguiente = SOLICITUD_ESTADO_SIGUIENTE[solicitud.estado];
  const cerrada = solicitud.estado === "convertida" || solicitud.estado === "descartada";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card transition-colors",
        expanded ? "border-info-border" : "border-border",
        cerrada && "opacity-70"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            ESTADO_AVATAR[solicitud.estado]
          )}
        >
          {initialsOf(solicitud.nombre)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-bold text-foreground">{solicitud.nombre}</span>
            <Badge variant={estado.variant}>{estado.label}</Badge>
            <Badge variant="ghost">
              {tipo.label}
              {solicitud.interes ? ` · ${solicitud.interes}` : ""}
            </Badge>
            <span className="ml-auto text-[11.5px] text-muted-foreground">
              {formatDateTime(solicitud.fecha)}
            </span>
          </span>
          {solicitud.paraMenor ? (
            <span className="mt-2 inline-flex">
              <Badge variant="warning">Solicitud para menor</Badge>
            </span>
          ) : null}
        </span>

        <Icon
          icon="ph:caret-down"
          width={14}
          height={14}
          aria-hidden="true"
          className={cn("mt-1 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")}
        />
      </button>

      {expanded ? (
        <div className="border-t border-border bg-foreground/[0.015] px-5 py-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <DataLabel>Contacto</DataLabel>
              <div className="mt-1.5 text-[13px] text-foreground">{solicitud.email}</div>
              {solicitud.telefono ? (
                <div className="text-[13px] text-foreground">{solicitud.telefono}</div>
              ) : null}
            </div>
            {solicitud.paraMenor ? (
              <div>
                <DataLabel>Estudiante (menor)</DataLabel>
                <div className="mt-1.5 text-[13px] text-foreground">
                  {solicitud.estudianteNombre ?? "—"}
                </div>
                <div className="text-[13px] text-muted-foreground">
                  {solicitud.estudianteFechaNacimiento
                    ? `Nac. ${formatDate(solicitud.estudianteFechaNacimiento)}`
                    : ""}
                  {solicitud.parentesco ? ` · Solicitante: ${solicitud.parentesco}` : ""}
                </div>
              </div>
            ) : null}
          </div>

          {solicitud.mensaje ? (
            <div className="mt-4">
              <DataLabel>Mensaje</DataLabel>
              <p className="mt-1.5 whitespace-pre-line text-[13px] text-foreground">
                {solicitud.mensaje}
              </p>
            </div>
          ) : null}
          {solicitud.origenUrl ? (
            <div className="mt-3">
              <a
                href={solicitud.origenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:underline"
              >
                Origen
                <Icon icon="ph:arrow-square-out" width={12} height={12} aria-hidden="true" />
              </a>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2.5">
            {siguiente ? (
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                className="border-info-border text-info-fg hover:bg-info-tint"
                onClick={onMarkNext}
              >
                Marcar {SOLICITUD_ESTADO_BADGE[siguiente].label}
              </Button>
            ) : null}
            {!cerrada ? (
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90"
                onClick={onConvert}
              >
                Convertir a matrícula
                <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
              </Button>
            ) : null}
            {waUrl ? (
              <Button asChild variant="ghost" size="sm" className="text-success-fg">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <Icon icon="ph:whatsapp-logo" width={16} height={16} aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            ) : null}
            {(solicitud.estado === "nueva" || solicitud.estado === "contactada") ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                className="text-muted-foreground"
                onClick={onDiscard}
              >
                Descartar
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
