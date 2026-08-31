"use client";

import { AdminDataTable, AdminPageHeader, Badge, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";

import { useCatedras } from "../hooks/useCatedras";
import { CATEDRA_ESTADO_BADGE, MODALIDAD_BADGE, type ICatedraRow } from "../model/catedra.types";
import CatedraMatriculasDialog from "./CatedraMatriculasDialog";
import CrearCatedraDialog from "./CrearCatedraDialog";

export default function CatedrasList() {
  const { data, isPending } = useCatedras();
  const rows = data ?? [];

  const columns: IAdminColumn<ICatedraRow>[] = [
    {
      key: "codigo",
      label: "Código",
      render: (row) => <span className="font-mono text-xs font-semibold text-primary">{row.codigo}</span>,
    },
    {
      key: "curso",
      label: "Curso",
      render: (row) => <span className="font-medium">{row.curso}</span>,
    },
    {
      key: "docente",
      label: "Docente",
      render: (row) => row.docente ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "modalidad",
      label: "Modalidad",
      render: (row) => (
        <Badge variant={MODALIDAD_BADGE[row.modalidad].variant}>{MODALIDAD_BADGE[row.modalidad].label}</Badge>
      ),
    },
    {
      key: "aula",
      label: "Aula",
      render: (row) => row.aula ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "cupo",
      label: "Cupo",
      render: (row) => (
        <span className="text-muted-foreground">
          {row.activos} / {row.cupoMaximo}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <Badge variant={CATEDRA_ESTADO_BADGE[row.estado].variant}>{CATEDRA_ESTADO_BADGE[row.estado].label}</Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<ICatedraRow>[] = [
    { value: "en_curso", label: "En curso", match: (row) => row.estado === "en_curso" },
    { value: "planificada", label: "Planificadas", match: (row) => row.estado === "planificada" },
    { value: "finalizada", label: "Finalizadas", match: (row) => row.estado === "finalizada" },
    { value: "pendientes", label: "Con matrículas pendientes", match: (row) => row.pendientes > 0 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Académico · GOSMEL"
        title="Cátedras"
        description="Secciones de curso: docente asignado, cupo, modalidad e inscripciones."
        icon="ph:chalkboard"
      >
        <CrearCatedraDialog />
      </AdminPageHeader>

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[(row) => row.codigo, (row) => row.curso, (row) => row.docente ?? "", (row) => row.aula ?? ""]}
        filters={filters}
        emptyTitle="Sin cátedras"
        emptyDescription="Cuando se creen cátedras aparecerán aquí."
        countLabel="cátedras"
        rowActions={(row) =>
          row.pendientes > 0 ? (
            <CatedraMatriculasDialog catedraId={row.id} codigo={row.codigo} curso={row.curso} />
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )
        }
      />
    </div>
  );
}