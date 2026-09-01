"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { AdminDataTable, AdminPageHeader, Avatar, AvatarFallback, Badge, Button, type IAdminColumn, type IAdminDataTableFilter } from "@/shared/ui";
import { initialsOf } from "@/shared/lib/formatters";

import { useEstudiantes } from "../hooks/useEstudiantes";
import { ESTUDIANTE_ACTIVO_BADGE, NIVEL_BADGE } from "../model/estudiantes.constants";
import type { IEstudianteRow } from "../model/estudiante.types";
import AsignarCursoEstudianteDialog from "./AsignarCursoEstudianteDialog";
import CrearEstudianteDialog from "./CrearEstudianteDialog";
import EditarEstudianteDialog from "./EditarEstudianteDialog";
import EliminarEstudianteDialog from "./EliminarEstudianteDialog";
import EstudianteDetalleSheet from "./EstudianteDetalleSheet";

export default function EstudiantesList() {
  const { data, isPending } = useEstudiantes();
  const rows = data ?? [];

  const [asigTarget, setAsigTarget] = useState<IEstudianteRow | null>(null);
  const [asigOpen, setAsigOpen] = useState(false);

  const handleOpenAsignar = (estudiante: IEstudianteRow) => {
    setAsigTarget(estudiante);
    setAsigOpen(true);
  };

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
      key: "catedras",
      label: "Curso / Docente",
      render: (row) => {
        if (!row.catedrasActivas || row.catedrasActivas.length === 0) {
          return <span className="text-xs text-muted-foreground">Sin cátedra</span>;
        }

        return (
          <div className="flex flex-col gap-1">
            {row.catedrasActivas.map((c) => (
              <div key={c.id} className="text-xs">
                <span className="font-semibold text-foreground">{c.cursoNombre}</span>
                {c.docenteNombre && (
                  <span className="block text-[11px] text-muted-foreground">
                    Prof. {c.docenteNombre}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      },
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
    {
      value: "con_catedra",
      label: "Con cátedra activa",
      match: (row) => (row.catedrasActivas?.length ?? 0) > 0,
    },
    {
      value: "sin_catedra",
      label: "Sin cátedra",
      match: (row) => (row.catedrasActivas?.length ?? 0) === 0,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comunidad · GOSMEL"
        title="Estudiantes"
        description="Datos personales, nivel musical, cursos inscritos y docentes a cargo."
        icon="ph:student"
      >
        <AsignarCursoEstudianteDialog />
        <CrearEstudianteDialog />
      </AdminPageHeader>

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
          (row) => row.representante ?? "",
        ]}
        filters={filters}
        emptyTitle="Sin estudiantes"
        emptyDescription="Cuando se registren estudiantes aparecerán aquí."
        countLabel="estudiantes"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenAsignar(row)}
              title="Asignar a un curso o cátedra"
              className="size-8 p-0 text-primary"
            >
              <Icon icon="ph:chalkboard-teacher" width={16} height={16} aria-hidden="true" />
            </Button>
            <EstudianteDetalleSheet estudianteId={row.id} estudianteNombre={row.nombreCompleto} />
            <EditarEstudianteDialog estudiante={row} />
            <EliminarEstudianteDialog estudiante={row} />
          </div>
        )}
      />

      <AsignarCursoEstudianteDialog
        key={asigTarget?.id ?? "none"}
        estudianteId={asigTarget?.id}
        estudianteNombre={asigTarget?.nombreCompleto}
        open={asigOpen}
        onOpenChange={setAsigOpen}
      />
    </div>
  );
}