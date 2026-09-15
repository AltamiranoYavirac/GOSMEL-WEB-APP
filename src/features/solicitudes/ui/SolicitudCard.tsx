"use client";

import { Icon } from "@iconify/react";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, DataLabel } from "@/shared/ui";
import { Form, TextareaField, useAppForm } from "@/shared/form";
import { cn } from "@/shared/lib/utils";
import { formatDateTimeShort, formatTimeAgo, initialsOf } from "@/shared/lib/formatters";

import {
  SOLICITUD_ESTADO_BADGE,
  SOLICITUD_ESTADO_REABRIR,
  SOLICITUD_ESTADO_SIGUIENTE,
  SOLICITUD_TIPO_BADGE,
} from "../model/solicitudes.constants";
import {
  mapSolicitudToNotasFormValues,
  solicitudNotasFormSchema,
  type ISolicitudNotasFormValues,
} from "../model/SolicitudNotasForm.config";
import { useUpdateSolicitudNotas } from "../hooks/useUpdateSolicitudNotas";
import { solicitudCardVariants } from "./SolicitudCard.variants";
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
  onReopen,
  onRequestDiscard,
  waUrl,
  busy,
}: ISolicitudCardProps) {
  const estado = SOLICITUD_ESTADO_BADGE[solicitud.estado];
  const tipo = SOLICITUD_TIPO_BADGE[solicitud.tipo];
  const siguiente = SOLICITUD_ESTADO_SIGUIENTE[solicitud.estado];
  const reabrirA = SOLICITUD_ESTADO_REABRIR[solicitud.estado];
  const cerrada = solicitud.estado === "convertida" || solicitud.estado === "descartada";
  const origenPath = getOrigenPath(solicitud.origenUrl);
  const puedeDescartar = solicitud.estado === "nueva" || solicitud.estado === "contactada";
  const responsableAvatarUrl = solicitud.responsableAvatarPublicId
    ? solicitud.responsableAvatarPublicId.startsWith("http")
      ? solicitud.responsableAvatarPublicId
      : `https://res.cloudinary.com/dv9lm0fnm/image/upload/q_auto,f_auto,w_200/${solicitud.responsableAvatarPublicId}`
    : null;
  const { base, typeTile, typeLabel, decorativeIcon } = solicitudCardVariants({
    expanded,
    closed: cerrada,
    tone: tipo.tone,
  });

  const notasMutation = useUpdateSolicitudNotas();
  const notasForm = useAppForm<ISolicitudNotasFormValues>({
    schema: solicitudNotasFormSchema,
    values: mapSolicitudToNotasFormValues(solicitud),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmitNotas = (values: ISolicitudNotasFormValues) => {
    notasMutation.mutate({ id: solicitud.id, notasInternas: values.notasInternas.trim() });
  };

  return (
    <article className={base()}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="relative flex w-full items-start gap-3 overflow-hidden p-4 text-left outline-none transition-colors hover:bg-muted/30 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 sm:gap-4 sm:p-5"
      >
        <Icon icon={tipo.icon} className={decorativeIcon()} aria-hidden="true" />

        <span className={typeTile()}>
          <Icon icon={tipo.icon} className="size-6" aria-hidden="true" />
        </span>

        <span className="relative z-10 min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className={typeLabel()}>{tipo.label}</span>
            <span className="text-xs text-muted-foreground">· {formatTimeAgo(solicitud.fecha)}</span>
          </span>

          <span className="mt-1 flex flex-wrap items-center gap-2.5">
            <span className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
              {solicitud.nombre}
            </span>
            <Badge variant={estado.variant} className="h-6 px-3 text-xs">
              {estado.label}
            </Badge>
            <Badge variant={solicitud.creadaPor ? "info" : "ghost"} className="h-6 px-3 text-xs">
              {solicitud.creadaPor ? "Usuario registrado" : "Visitante anónimo"}
            </Badge>
          </span>

          {solicitud.interes ? (
            <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-foreground">
              <Icon icon="ph:music-notes" className="size-4 text-muted-foreground" aria-hidden="true" />
              {solicitud.interes}
            </span>
          ) : null}

          {solicitud.mensaje ? (
            <span className="mt-2.5 block whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {solicitud.mensaje}
            </span>
          ) : null}

          {origenPath ? (
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Icon icon="ph:link" className="size-3.5" aria-hidden="true" />
              Formulario / {origenPath}
            </span>
          ) : null}
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
          {solicitud.interes ? (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 p-3.5 sm:p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon icon="ph:music-notes" className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <DataLabel>Interés de la solicitud</DataLabel>
                <p className="mt-0.5 truncate text-sm font-bold text-foreground sm:text-base">
                  {solicitud.interes}
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon icon="ph:address-book" className="size-4 text-primary" aria-hidden="true" />
                <DataLabel>Datos de contacto</DataLabel>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex min-w-0 items-center gap-2.5 text-sm text-foreground">
                  <Icon icon="ph:envelope-simple" className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate">{solicitud.email}</span>
                </div>
                {solicitud.telefono ? (
                  <div className="flex items-center gap-2.5 text-sm text-foreground">
                    <Icon icon="ph:phone" className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span>{solicitud.telefono}</span>
                  </div>
                ) : null}
                {waUrl ? (
                  <Button asChild variant="outline" size="lg" className="mt-3 w-full border-success/30 text-success-fg hover:bg-success/10">
                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                      <Icon icon="ph:whatsapp-logo" className="size-5" aria-hidden="true" />
                      Contactar por WhatsApp
                    </a>
                  </Button>
                ) : null}
              </div>
            </section>

            <section className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon icon="ph:user-circle-check" className="size-4 text-primary" aria-hidden="true" />
                <DataLabel>Responsable de seguimiento</DataLabel>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Avatar size="lg">
                  {responsableAvatarUrl ? (
                    <AvatarImage src={responsableAvatarUrl} alt={solicitud.responsableNombre ?? "Responsable"} />
                  ) : null}
                  <AvatarFallback className="bg-muted font-bold text-foreground">
                    {solicitud.responsableNombre ? initialsOf(solicitud.responsableNombre) : "—"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {solicitud.responsableNombre ?? "Sin asignar"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {solicitud.responsableNombre ? "Admisiones" : "Pendiente de asignación"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon icon="ph:shield-check" className="size-4 text-primary" aria-hidden="true" />
                <DataLabel>Consentimiento de datos</DataLabel>
              </div>
              {solicitud.consentimientoDatos ? (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-fg">
                    <Icon icon="ph:check-circle" className="size-4" aria-hidden="true" />
                    Otorgado por {solicitud.consentimientoOtorgadoPor}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatDateTimeShort(solicitud.consentimientoEn)}
                  </span>
                </div>
              ) : (
                <span className="mt-3 block text-sm text-muted-foreground">No otorgado</span>
              )}
            </section>
          </div>

          <section className="mt-3 rounded-xl border border-border/70 bg-muted/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="ph:notepad" className="size-4 text-primary" aria-hidden="true" />
                <DataLabel>Notas internas</DataLabel>
              </div>
              <Button
                form={`solicitud-notas-${solicitud.id}`}
                type="submit"
                size="sm"
                variant="ghost"
                disabled={notasMutation.isPending}
              >
                <Icon icon="ph:floppy-disk" className="size-4" aria-hidden="true" />
                Guardar
              </Button>
            </div>
            <Form
              form={notasForm}
              onSubmit={onSubmitNotas}
              id={`solicitud-notas-${solicitud.id}`}
              className="mt-2"
            >
              <TextareaField
                name="notasInternas"
                placeholder="Sin notas aún — se le asignará seguimiento."
                rows={3}
              />
            </Form>
          </section>

          <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-border pt-5 sm:flex-row sm:flex-wrap sm:items-center">
            {puedeDescartar ? (
              <Button
                variant="ghost"
                size="lg"
                disabled={busy}
                className="w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                onClick={onRequestDiscard}
              >
                <Icon icon="ph:trash" className="size-4" aria-hidden="true" />
                Descartar
              </Button>
            ) : null}
            <div className="flex flex-col gap-2.5 sm:ml-auto sm:flex-row">
              {reabrirA ? (
                <Button variant="outline" size="lg" disabled={busy} className="w-full sm:w-auto" onClick={onReopen}>
                  <Icon icon="ph:arrow-counter-clockwise" className="size-4" aria-hidden="true" />
                  Reabrir
                </Button>
              ) : null}
              {siguiente ? (
                <Button
                  size="lg"
                  disabled={busy}
                  className="w-full px-4 sm:w-auto"
                  onClick={onMarkNext}
                >
                  <Icon icon="ph:check-circle" className="size-4" aria-hidden="true" />
                  Marcar {SOLICITUD_ESTADO_BADGE[siguiente].label}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
