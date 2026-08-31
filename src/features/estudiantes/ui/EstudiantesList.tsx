"use client";

import { AdminDataTable, AdminPageHeader, Avatar, AvatarFallback, Badge, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useEstudiantes } from "../hooks/useEstudiantes";
import { ESTUDIANTE_ACTIVO_BADGE, NIVEL_BADGE } from "../model/estudiantes.constants";
import type { IEstudianteRow } from "../model/estudiante.types";
import EditarEstudianteDialog from "./EditarEstudianteDialog";
import EliminarEstudianteDialog from "./EliminarEstudianteDialog";
import EstudianteDetalleSheet from "./EstudianteDetalleSheet";

export default function EstudiantesList() {
  const { data, isPending } = useEstudiantes();
  const rows = data ?? [];

  const columns: IAdminColumn<IEstudianteRow>[] = [
    {
      key: "estudiante",
      label: "Estudiante",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initialsOf(row.nombreCompleto)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{row.nombreCompleto}</span>
            {row.email ? <span className="truncate text-xs text-muted-foreground">{row.email}</span> : null}
          </div>
        </div>
      ),
    },
    {
      key: "cedula",
      label: "Cédula",
      render: (row) => row.cedula ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "edad",
      label: "Edad",
      render: (row) => (row.edad != null ? `${row.edad} años` : <span className="text-muted-foreground">—</span>),
    },
    {
      key: "nivel",
      label: "Nivel",
      render: (row) =>
        row.nivel ? (
          <Badge variant={NIVEL_BADGE[row.nivel].variant}>{NIVEL_BADGE[row.nivel].label}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "instrumentos",
      label: "Instrumentos",
      render: (row) =>
        row.instrumentos.length > 0 ? (
          <span className="text-muted-foreground">{row.instrumentos.join(", ")}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "representante",
      label: "Representante",
      render: (row) => row.representante ?? <span className="text-muted-foreground">—</span>,
    },
    {
      key: "activo",
      label: "Estado",
      render: (row) => (
        <Badge variant={ESTUDIANTE_ACTIVO_BADGE[String(row.activo) as "true" | "false"].variant}>
          {ESTUDIANTE_ACTIVO_BADGE[String(row.activo) as "true" | "false"].label}
        </Badge>
      ),
    },
  ];

  const filters: IAdminDataTableFilter<IEstudianteRow>[] = [
    { value: "activos", label: "Activos", match: (row) => row.activo },
    { value: "inactivos", label: "Inactivos", match: (row) => !row.activo },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comunidad · GOSMEL"
        title="Estudiantes"
        description="Datos personales, nivel musical e instrumentos que estudian."
        icon="ph:student"
      />

      <AdminDataTable
        data={rows}
        columns={columns}
        loading={isPending}
        keyId={(row) => row.id}
        searchKeys={[
          (row) => row.nombreCompleto,
          (row) => row.cedula ?? "",
          (row) => row.email ?? "",
          (row) => row.celular ?? "",
          (row) => row.instrumentos.join(" "),
          (row) => row.representante ?? "",
        ]}
        filters={filters}
        emptyTitle="Sin estudiantes"
        emptyDescription="Cuando se registren estudiantes aparecerán aquí."
        countLabel="estudiantes"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <EditarEstudianteDialog estudiante={row} />
            <EstudianteDetalleSheet estudianteId={row.id} estudianteNombre={row.nombreCompleto} />
            <EliminarEstudianteDialog estudiante={row} />
          </div>
        )}
      />
    </div>
  );
}