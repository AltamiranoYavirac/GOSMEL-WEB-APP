"use client";

import { Icon } from "@iconify/react";

import { Badge, Button, DataLabel } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import {
  calculateAge,
  formatDate,
  formatDateTimeShort,
  formatTimeAgo,
  initialsOf,
} from "@/shared/lib/formatters";

import {
  SOLICITUD_ESTADO_BADGE,
  SOLICITUD_ESTADO_SIGUIENTE,
  SOLICITUD_TIPO_BADGE,
} from "../model/solicitudes.constants";
import type { ISolicitudCardProps } from "./SolicitudCard.types";

function getOrigenPath(url: string | null): string | null {
  if (!url) return null;
  try {
    const { pathname } = new URL(url, "http://localhost");
    const clean = pathname.replace(/^\/+/, "").replace(/\//g, " / ");
    return clean || null;
  } catch {
    return url;
  }
}

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
  const origenPath = getOrigenPath(solicitud.origenUrl);
  const edad =
    solicitud.paraMenor && solicitud.estudianteFechaNacimiento
      ? calculateAge(solicitud.estudianteFechaNacimiento)
      : null;
  const puedeDescartar = solicitud.estado === "nueva" || solicitud.estado === "contactada";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card text-card-foreground transition-colors",
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
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-bold text-foreground">
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
              {formatTimeAgo(solicitud.fecha)}
            </span>
          </span>

          {solicitud.mensaje ? (
            <p className="mt-2 whitespace-pre-line text-[13px] text-foreground">
              {solicitud.mensaje}
            </p>
          ) : null}

          {solicitud.paraMenor || origenPath ? (
            <span className="mt-2 flex flex-wrap items-center gap-2">
              {solicitud.paraMenor ? (
                <Badge variant="warning">Solicitud para menor</Badge>
              ) : null}
              {origenPath ? (
                <span className="text-[11.5px] text-muted-foreground">
                  vía formulario / {origenPath}
                </span>
              ) : null}
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
        <div className="border-t border-border px-5 py-5">
          <div
            className={cn(
              "grid gap-6",
              solicitud.paraMenor ? "sm:grid-cols-3" : "sm:grid-cols-2"
            )}
          >
            <div>
              <DataLabel>Contacto</DataLabel>
              <div className="mt-1.5 flex flex-col gap-0.5 text-[13px] text-foreground">
                <span>{solicitud.email}</span>
                {solicitud.telefono ? <span>{solicitud.telefono}</span> : null}
                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-success-fg transition-colors hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Icon icon="ph:whatsapp-logo" width={14} height={14} aria-hidden="true" />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>

            {solicitud.paraMenor ? (
              <div>
                <DataLabel>Estudiante (menor)</DataLabel>
                <div className="mt-1.5 text-[13px] text-foreground">
                  {solicitud.estudianteNombre ?? "—"}
                  {edad !== null ? ` · ${edad} años` : null}
                </div>
                {solicitud.parentesco ? (
                  <div className="text-[13px] text-muted-foreground">
                    Solicitante: {solicitud.parentesco}
                  </div>
                ) : null}
                {solicitud.estudianteFechaNacimiento ? (
                  <div className="text-[12px] text-muted-foreground">
                    Nac. {formatDate(solicitud.estudianteFechaNacimiento)}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div>
              <DataLabel>Consentimiento de datos</DataLabel>
              {solicitud.consentimientoDatos ? (
                <div className="mt-1.5 space-y-0.5">
                  <span className="flex items-center gap-1.5 text-[13px] text-success-fg">
                    <Icon icon="ph:check" width={14} height={14} aria-hidden="true" />
                    Otorgado por {solicitud.consentimientoOtorgadoPor}
                  </span>
                  <span className="block text-[12px] text-muted-foreground">
                    {formatDateTimeShort(solicitud.consentimientoEn)}
                  </span>
                </div>
              ) : (
                <span className="mt-1.5 block text-[13px] text-muted-foreground">
                  No otorgado
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border/40 bg-muted p-3">
            <DataLabel className="text-[10px]">Notas internas</DataLabel>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {solicitud.notasInternas ?? "Sin notas aún — se le asignará seguimiento."}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {siguiente ? (
              <Button
                variant="secondary"
                size="sm"
                disabled={busy}
                onClick={onMarkNext}
              >
                Marcar {SOLICITUD_ESTADO_BADGE[siguiente].label}
              </Button>
            ) : null}
            {!cerrada ? (
              <Button
                size="sm"
                className="bg-card-foreground text-card hover:bg-card-foreground/90"
                onClick={onConvert}
              >
                Convertir a matrícula
                <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
              </Button>
            ) : null}
            {puedeDescartar ? (
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
