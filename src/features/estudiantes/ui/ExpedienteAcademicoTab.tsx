"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

import { useEliminarInscripcion } from "../hooks/useEliminarInscripcion";
import { useUpdateInscripcionEstado } from "../hooks/useUpdateInscripcionEstado";
import { INSCRIPCION_ESTADO_BADGE } from "../model/estudiante-detalle.types";
import AsignarCursoEstudianteDialog from "./AsignarCursoEstudianteDialog";
import type { IExpedienteTabProps } from "./EstudianteExpediente.types";

export default function ExpedienteAcademicoTab({ estudianteId, detalle }: IExpedienteTabProps) {
  const [asigOpen, setAsigOpen] = useState(false);
  const updateMutation = useUpdateInscripcionEstado(estudianteId);
  const eliminarMutation = useEliminarInscripcion(estudianteId);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-bold text-foreground">Inscripciones</span>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/admin/evaluaciones">
                Ver evaluaciones
                <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
              </Link>
            </Button>
            <Button size="sm" onClick={() => setAsigOpen(true)}>
              <Icon icon="ph:plus" width={14} height={14} aria-hidden="true" />
              Asignar cátedra
            </Button>
          </div>
        </div>

        {detalle.inscripciones.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">Sin inscripciones registradas.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {detalle.inscripciones.map((inscripcion) => (
              <li
                key={inscripcion.id}
                className="flex items-center gap-4 rounded-lg bg-foreground/[0.03] px-4 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-foreground">{inscripcion.curso}</div>
                  <div className="text-[12px] text-muted-foreground">
                    {inscripcion.catedra}
                    {inscripcion.docenteNombre ? ` · Prof. ${inscripcion.docenteNombre}` : ""}
                  </div>
                </div>
                <Badge variant={INSCRIPCION_ESTADO_BADGE[inscripcion.estado].variant}>
                  {INSCRIPCION_ESTADO_BADGE[inscripcion.estado].label}
                </Badge>
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
                          updateMutation.mutate({ inscripcionId: inscripcion.id, estado: "retirada" })
                        }
                      >
                        <Icon icon="ph:arrow-u-left" aria-hidden="true" />
                        Retirar
                      </DropdownMenuItem>
                    ) : null}
                    {inscripcion.estado === "activa" || inscripcion.estado === "pendiente" ? (
                      <DropdownMenuItem
                        onSelect={() =>
                          updateMutation.mutate({ inscripcionId: inscripcion.id, estado: "cancelada" })
                        }
                      >
                        <Icon icon="ph:x" aria-hidden="true" />
                        Cancelar
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => eliminarMutation.mutate(inscripcion.id)}
                    >
                      <Icon icon="ph:trash" aria-hidden="true" />
                      Eliminar inscripción
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AsignarCursoEstudianteDialog
        key={estudianteId}
        estudianteId={estudianteId}
        estudianteNombre={detalle.nombre}
        open={asigOpen}
        onOpenChange={setAsigOpen}
      />
    </div>
  );
}
