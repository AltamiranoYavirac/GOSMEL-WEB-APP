"use client";

import { Icon } from "@iconify/react";

import {
  AdminDataTable,
  AdminPageHeader,
  Badge,
  Button,
  type IAdminColumn,
} from "@/shared/ui";
import { formatDate } from "@/shared/lib/formatters";

import { useCertificados, useEliminarCertificado } from "../hooks/useCertificados";
import type { ICertificadoRow } from "../model/certificado.types";
import EmitirCertificadoDialog from "./EmitirCertificadoDialog";

export default function CertificadosList() {
  const { data, isPending } = useCertificados();
  const eliminar = useEliminarCertificado();
  const rows = data ?? [];

  const columns: IAdminColumn<ICertificadoRow>[] = [
    {
      key: "codigo",
      label: "Código",
      render: (row) => (
        <span className="font-mono text-xs font-bold text-primary">{row.codigoVerificacion}</span>
      ),
    },
    {
      key: "estudiante",
      label: "Estudiante",
      render: (row) => <span className="font-medium">{row.estudiante}</span>,
    },
    {
      key: "curso",
      label: "Curso / Cátedra",
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.curso}</span>
          <span className="font-mono text-xs text-muted-foreground">{row.catedra}</span>
        </div>
      ),
    },
    {
      key: "fecha",
      label: "Emisión",
      render: (row) => <span className="text-muted-foreground">{formatDate(row.fechaEmision)}</span>,
    },
    {
      key: "progreso",
      label: "Progreso",
      render: (row) => (
        <Badge variant={row.progresoPct >= 100 ? "default" : "outline"}>
          {row.progresoPct}%
        </Badge>
      ),
    },
    {
      key: "documento",
      label: "Documento",
      render: (row) =>
        row.storagePath ? (
          <Button size="xs" variant="ghost" asChild>
            <a
              href={row.storagePath.startsWith("http") ? row.storagePath : `/api/storage?path=${encodeURIComponent(row.storagePath)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Icon icon="ph:file-pdf" className="size-3.5" aria-hidden="true" />
              PDF
            </a>
          </Button>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminPageHeader
          eyebrow="Académico · GOSMEL"
          title="Certificados"
          description="Emisión y registro de certificados de aprobación con verificación digital."
          icon="ph:certificate"
        />
        <EmitirCertificadoDialog />
      </div>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.codigoVerificacion, (row) => row.estudiante, (row) => row.curso]}
        emptyTitle="Sin certificados"
        emptyDescription="Cuando se emitan certificados oficiales aparecerán aquí."
        countLabel="certificados"
        rowActions={(row) => (
          <div className="flex items-center justify-end">
            <Button
              size="icon-xs"
              variant="ghost"
              disabled={eliminar.isPending}
              onClick={() => eliminar.mutate(row.id)}
              aria-label={`Eliminar certificado ${row.codigoVerificacion}`}
            >
              <Icon icon="ph:trash" className="size-4 text-muted-foreground hover:text-destructive" aria-hidden="true" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
