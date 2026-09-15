"use client";

import type { ReactNode } from "react";
import { Icon } from "@iconify/react";

import type { IInscripcionPendiente } from "@/entities/matricula";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { formatCurrency, formatDate, formatTimeAgo, initialsOf } from "@/shared/lib/formatters";

import type { IMatriculaReviewSheetProps } from "./MatriculaReviewSheet.types";
import CupoBar from "./CupoBar";
import EsperaBadge from "./EsperaBadge";

function DetailItem({ icon, label, value }: { icon: string; label: string; value: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
        <Icon icon={icon} className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{value}</div>
      </div>
    </div>
  );
}

function getModalidadLabel(inscripcion: IInscripcionPendiente): string | null {
  if (!inscripcion.modalidad) return null;
  return { presencial: "Presencial", virtual: "Virtual", hibrido: "Híbrido" }[inscripcion.modalidad];
}

function getNivelLabel(inscripcion: IInscripcionPendiente): string | null {
  const nivel = inscripcion.estudianteNivelMusical ?? inscripcion.cursoNivel;
  if (!nivel) return null;
  return {
    iniciacion: "Iniciación",
    basico: "Básico",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
    maestria: "Maestría",
  }[nivel];
}

export default function MatriculaReviewSheet({ inscripcion, onClose, onAprobar, onRechazar }: IMatriculaReviewSheetProps) {
  const open = inscripcion !== null;
  const avatarUrl = inscripcion
    ? buildCloudinaryImageUrl(inscripcion.estudianteAvatarPublicId, "q_auto,f_auto,w_240,h_240,c_fill,g_face")
    : null;
  const modalidad = inscripcion ? getModalidadLabel(inscripcion) : null;
  const nivel = inscripcion ? getNivelLabel(inscripcion) : null;
  const urgente = (inscripcion?.diasEspera ?? 0) >= 7;
  const cupoLleno =
    inscripcion?.cupoMaximo !== null &&
    inscripcion?.cupoMaximo !== undefined &&
    inscripcion.cuposOcupados >= (inscripcion.cupoMaximo ?? 0);
  const cursoDetalles = inscripcion
    ? [
        inscripcion.duracionSemanas ? `${inscripcion.duracionSemanas} semanas` : null,
        inscripcion.horasTotales ? `${inscripcion.horasTotales} h totales` : null,
      ].filter(Boolean).join(" · ")
    : "";

  return (
    <Sheet open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl" aria-describedby="matricula-review-description">
        {inscripcion ? (
          <>
            <SheetHeader className="border-b border-border px-5 py-5 pr-12 sm:px-6">
              <div className="flex items-center gap-3.5">
                <Avatar size="lg" className="size-12 bg-muted">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                  <AvatarFallback className="bg-primary-tint text-base font-extrabold text-primary-800">
                    {initialsOf(inscripcion.estudiante)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="font-heading text-lg font-extrabold tracking-tight">
                      {inscripcion.estudiante}
                    </SheetTitle>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <EsperaBadge diasEspera={inscripcion.diasEspera} />
                    <span className="text-xs text-muted-foreground">
                      {inscripcion.desdeSolicitud ? "Desde el portal" : "Registro directo"}
                    </span>
                  </div>
                  <SheetDescription id="matricula-review-description" className="mt-1.5">
                    Solicitada {formatTimeAgo(inscripcion.fechaInscripcion)}
                    {inscripcion.solicitadaPorNombre ? ` por ${inscripcion.solicitadaPorNombre}` : ""}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
              {urgente || cupoLleno ? (
                <div
                  className={
                    cupoLleno
                      ? "flex gap-3 border-l-2 border-danger py-1 pl-3"
                      : "flex gap-3 border-l-2 border-warning py-1 pl-3"
                  }
                  role="alert"
                >
                  <Icon
                    icon={cupoLleno ? "ph:users-three" : "ph:alarm"}
                    className={cupoLleno ? "mt-0.5 size-5 shrink-0 text-danger-fg" : "mt-0.5 size-5 shrink-0 text-warning-fg"}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className={cupoLleno ? "text-sm font-bold text-danger-fg" : "text-sm font-bold text-warning-fg"}>
                      {cupoLleno ? "Cupo lleno — revisa antes de aprobar" : "Lleva 7 días o más esperando"}
                    </p>
                    <p className={cupoLleno ? "mt-0.5 text-xs leading-relaxed text-danger-fg/90" : "mt-0.5 text-xs leading-relaxed text-warning-fg/90"}>
                      {cupoLleno
                        ? "Aprobar esta matrícula supera el cupo. Verifica con el docente o amplía el cupo primero."
                        : "Dale prioridad: el estudiante lleva varios días sin respuesta."}
                    </p>
                  </div>
                </div>
              ) : null}

              <section className="space-y-4" aria-labelledby="matricula-detail-title">
                <h2 id="matricula-detail-title" className="font-heading text-sm font-extrabold tracking-tight text-foreground">
                  Curso y cátedra
                </h2>
                <div className="border-y border-border py-4 sm:py-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary-800">
                      <Icon
                        icon={
                          inscripcion.instrumentoIcono && inscripcion.instrumentoIcono.includes(":")
                            ? inscripcion.instrumentoIcono
                            : "ph:music-notes"
                        }
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-base font-extrabold tracking-tight text-foreground">
                        {inscripcion.cursoNombre ?? "Cátedra sin curso"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {inscripcion.instrumentoNombre ? `${inscripcion.instrumentoNombre} · ` : ""}
                        Cátedra {inscripcion.catedraCodigo ?? "—"}
                      </p>
                      {modalidad || inscripcion.formatoClase ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {[modalidad, inscripcion.formatoClase].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
                    {inscripcion.docenteNombre ? (
                      <DetailItem icon="ph:chalkboard-teacher" label="Docente" value={inscripcion.docenteNombre} />
                    ) : null}
                    <DetailItem
                      icon="ph:calendar-check"
                      label="Inicio de clases"
                      value={
                        inscripcion.fechaFin
                          ? `${formatDate(inscripcion.fechaInicio)} → ${formatDate(inscripcion.fechaFin)}`
                          : formatDate(inscripcion.fechaInicio)
                      }
                    />
                    {inscripcion.aula ? <DetailItem icon="ph:door-open" label="Aula" value={inscripcion.aula} /> : null}
                    {cursoDetalles ? <DetailItem icon="ph:timer" label="Duración" value={cursoDetalles} /> : null}
                    {inscripcion.horarioResumen ? (
                      <DetailItem icon="ph:clock" label="Horario" value={inscripcion.horarioResumen} />
                    ) : null}
                    {inscripcion.precioReferencial !== null ? (
                      <DetailItem
                        icon="ph:currency-dollar"
                        label="Precio referencial"
                        value={`${formatCurrency(inscripcion.precioReferencial)}/mes`}
                      />
                    ) : null}
                  </div>
                  {inscripcion.cupoMaximo !== null ? (
                    <div className="mt-4 border-t border-border/60 pt-4">
                      <p className="text-xs font-medium text-muted-foreground">Cupo de la cátedra</p>
                      <CupoBar ocupados={inscripcion.cuposOcupados} maximo={inscripcion.cupoMaximo} className="mt-2 max-w-sm" />
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="space-y-4 border-t border-border pt-5" aria-labelledby="student-detail-title">
                <h2 id="student-detail-title" className="font-heading text-sm font-extrabold tracking-tight text-foreground">
                  Estudiante
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {inscripcion.estudianteEdad !== null ? (
                    <DetailItem
                      icon="ph:cake"
                      label="Edad"
                      value={`${inscripcion.estudianteEdad} años${inscripcion.esMenor ? " · menor de edad" : ""}`}
                    />
                  ) : null}
                  {nivel ? <DetailItem icon="ph:music-note" label="Nivel musical" value={nivel} /> : null}
                  {inscripcion.estudianteCelular ? (
                    <DetailItem
                      icon="ph:phone"
                      label="Celular"
                      value={
                        <a className="font-mono hover:underline" href={`tel:${inscripcion.estudianteCelular}`}>
                          {inscripcion.estudianteCelular}
                        </a>
                      }
                    />
                  ) : null}
                  {inscripcion.estudianteEmail ? (
                    <DetailItem
                      icon="ph:envelope"
                      label="Correo"
                      value={
                        <a className="break-all hover:underline" href={`mailto:${inscripcion.estudianteEmail}`}>
                          {inscripcion.estudianteEmail}
                        </a>
                      }
                    />
                  ) : null}
                </div>
                {inscripcion.esMenor && inscripcion.representante ? (
                  <div className="flex gap-3 border-l-2 border-warning py-1 pl-3">
                    <Icon icon="ph:user-focus" className="mt-0.5 size-5 shrink-0 text-warning-fg" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-warning-fg">
                        Representante · {inscripcion.representante.parentesco}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-warning-fg/90">
                        {inscripcion.representante.nombre || "Representante registrado"}
                      </p>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>

            <SheetFooter className="grid grid-cols-2 gap-3 border-t border-border bg-background px-5 py-4 sm:px-6">
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-lg border-danger-border font-extrabold text-danger-fg shadow-xs hover:bg-danger-tint"
                onClick={() => onRechazar(inscripcion)}
              >
                <Icon icon="ph:x-circle" aria-hidden="true" />
                Rechazar
              </Button>
              <Button size="lg" className="h-12 w-full rounded-lg font-extrabold text-white shadow-xs" onClick={() => onAprobar(inscripcion)}>
                <Icon icon="ph:seal-check" aria-hidden="true" />
                Aprobar
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
