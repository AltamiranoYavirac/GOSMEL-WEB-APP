"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AdminDataTable, AdminPageHeader, Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";

import { useSolicitudes } from "../hooks/useSolicitudes";
import { useUpdateSolicitudEstado } from "../hooks/useUpdateSolicitudEstado";
import {
  SOLICITUD_ESTADO_BADGE,
  SOLICITUD_ESTADO_SIGUIENTE,
  SOLICITUD_TIPO_BADGE,
} from "../model/solicitudes.constants";
import type { ISolicitudRow } from "../model/solicitud.types";
import CrearMatriculaDialog from "./CrearMatriculaDialog";

export default function SolicitudesList() {
  const { data, isPending } = useSolicitudes();
  const mutation = useUpdateSolicitudEstado();
  const [solicitudMatricula, setSolicitudMatricula] = useState<ISolicitudRow | null>(null);
  const rows = data ?? [];

  const getWhatsAppUrl = (row: ISolicitudRow) => {
    if (!row.telefono) return null;
    const clean = row.telefono.replace(/\D/g, "");
    const num = clean.startsWith("0") ? `593${clean.slice(1)}` : clean;
    const msg = `Hola ${row.nombre}, le saludamos de GOSMEL Music Academy respecto a su solicitud de información para ${row.interes ?? "nuestros cursos"}.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  const columns: IAdminColumn<ISolicitudRow>[] = [
    {
      key: "fecha",
      label: "Fecha",
      render: (row) => <span className="text-muted-foreground">{formatDateTime(row.fecha)}</span>,
    },
    {
      key: "nombre",
      label: "Solicitante",
      render: (row) => <span className="font-medium">{row.nombre}</span>,
    },
    {
      key: "tipo",
      label: "Tipo",
      render: (row) => (
        <Badge variant={SOLICITUD_TIPO_BADGE[row.tipo].variant}>{SOLICITUD_TIPO_BADGE[row.tipo].label}</Badge>
      ),
    },
    {
      key: "interes",
      label: "Interés",
      render: (row) => row.interes ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "contacto",
      label: "Contacto",
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.email}</span>
          {row.telefono ? <span className="text-xs text-muted-foreground">{row.telefono}</span> : null}
        </div>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={SOLICITUD_ESTADO_BADGE[row.estado].variant}>{SOLICITUD_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ISolicitudRow>[] = [
    { value: "nueva", label: "Nuevas", match: (row) => row.estado === "nueva" },
    { value: "contactada", label: "Contactadas", match: (row) => row.estado === "contactada" },
    { value: "convertida", label: "Convertidas", match: (row) => row.estado === "convertida" },
    { value: "descartada", label: "Descartadas", match: (row) => row.estado === "descartada" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="General · GOSMEL"
        title="Solicitudes"
        description="Bandeja de solicitudes de admisión, clases de prueba, masterclasses y contacto general."
        icon="ph:tray"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.nombre, (row) => row.email, (row) => row.telefono ?? "", (row) => row.interes ?? ""]}
        filters={filters}
        emptyTitle="Sin solicitudes"
        emptyDescription="Cuando lleguen solicitudes aparecerán aquí."
        countLabel="solicitudes"
        rowActions={(row) => {
          const waUrl = getWhatsAppUrl(row);
          const esDescartada = row.estado === "descartada";
          const gestionable = row.estado === "nueva" || row.estado === "contactada";
          const siguiente = SOLICITUD_ESTADO_SIGUIENTE[row.estado];

          return (
            <div className="flex items-center justify-end gap-1.5">
              {waUrl && (
                <Button asChild variant="ghost" size="sm" className="size-8 p-0 text-emerald-600 dark:text-emerald-400">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" title="Contactar por WhatsApp">
                    <Icon icon="ph:whatsapp-logo" width={16} height={16} aria-hidden="true" />
                  </a>
                </Button>
              )}

              {!esDescartada && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Gestionar solicitud">
                      <Icon icon="ph:dots-three-vertical" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setSolicitudMatricula(row)}>
                      <Icon icon="ph:user-plus" aria-hidden="true" />
                      Convertir a Matrícula
                    </DropdownMenuItem>
                    {siguiente ? (
                      <DropdownMenuItem onSelect={() => mutation.mutate({ id: row.id, estado: siguiente })}>
                        <Icon icon="ph:arrow-right" aria-hidden="true" />
                        Marcar como {SOLICITUD_ESTADO_BADGE[siguiente].label}
                      </DropdownMenuItem>
                    ) : null}
                    {gestionable ? (
                      <DropdownMenuItem onSelect={() => mutation.mutate({ id: row.id, estado: "descartada" })}>
                        <Icon icon="ph:x" aria-hidden="true" />
                        Descartar
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        }}
      />

      <CrearMatriculaDialog
        solicitud={solicitudMatricula}
        onClose={() => setSolicitudMatricula(null)}
      />
    </div>
  );
}